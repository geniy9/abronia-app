<script setup>
import { useApiStore } from '~/store/api'
import { z } from 'zod';

const { unitMeasurement } = useConfig()
const apiStore = useApiStore()
const toast = useToast()

const props = defineProps({
  initialSelected: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['update:modelValue', 'add-to-order']);

const productItemSchema = z.object({
  documentId: z.string(),
  name: z.string(),
  quantity: z.number().min(1, 'Количество должно быть не менее 1'),
});

const isOpen = ref(false);
const localSelectedProducts = ref([]);

const remoteProducts = ref([]);
const loading = ref(false);
const page = ref(1);
const total = ref(0);
const pageSize = 24;
const searchQuery = ref('');
let searchTimeout = null;

watchEffect(() => {
  if (props.initialSelected) {
    localSelectedProducts.value = props.initialSelected.map(item => ({
      documentId: item.product.documentId,
      name: item.product.name,
      quantity: item.quantity,
      unit: item.unit,
    }));
  }
});

const displayedProducts = computed(() => {
  const selectedIds = new Set(localSelectedProducts.value.map(p => p.documentId));
  
  const normalizedRemote = remoteProducts.value.map(p => ({
    documentId: p.documentId,
    name: p.name,
    category: p.category?.name,
    unit: p.unit,
    quantity: localSelectedProducts.value.find(s => s.documentId === p.documentId)?.quantity || 0 
  }));
  
  const selectedNotInRemote = localSelectedProducts.value.filter(s => 
    !remoteProducts.value.find(r => r.documentId === s.documentId)
  ).map(s => ({...s, category: 'Выбрано ранее'})); 

  return [...selectedNotInRemote, ...normalizedRemote];
});

async function loadProducts() {
  loading.value = true;
  
  const filters = {};
  if (searchQuery.value.length >= 2) {
    filters.name = { $containsi: searchQuery.value };
  }

  const res = await apiStore.getItems('products', {
    page: page.value,
    pageSize: pageSize,
    filters: filters,
    populate: { category: true },
    sort: ["name:asc"]
  });

  remoteProducts.value = res.data;
  total.value = res.meta.total;
  loading.value = false;
}

watch(() => isOpen.value, (val) => {
  if (val && remoteProducts.value.length === 0) { loadProducts() }
});
watch(() => page.value, () => { loadProducts() });

function handleSearch(val) {
  searchQuery.value = val;
  if (searchTimeout) clearTimeout(searchTimeout);
  
  searchTimeout = setTimeout(() => {
    if (val.length === 0 || val.length >= 2) {
      page.value = 1; 
      loadProducts();
    }
  }, 300);
}

function toggleProductSelection(product) {
  const index = localSelectedProducts.value.findIndex(item => item.documentId === product.documentId);
  if (index !== -1) {
    localSelectedProducts.value.splice(index, 1);
  } else {
    localSelectedProducts.value.push({
      documentId: product.documentId,
      name: product.name,
      quantity: 1,
      unit: product.unit,
    });
  }
}

function isProductSelected(product) {
  return localSelectedProducts.value.some(item => item.documentId === product.documentId);
}
function updateQuantity(docId, quantity) {
  const item = localSelectedProducts.value.find(p => p.documentId === docId);
  if (item) { item.quantity = quantity }
}
function confirmSelection() {
  for (const item of localSelectedProducts.value) {
    try {
      productItemSchema.parse(item);
    } catch (error) {
      toast.add({
        title: 'Ошибка валидации товара',
        description: `Ошибка в товаре "${item.name}": ${error.errors[0].message}`,
        color: 'error',
        icon: 'hugeicons:cancel-circle',
      });
      return;
    }
  }
  emit('add-to-order', localSelectedProducts.value);
  isOpen.value = false;
}

function openCart() { isOpen.value = true }
defineExpose({ openCart });
</script>
<template>
  <UModal v-model:open="isOpen">

    <template #header>
      <div class="flex items-center justify-between w-full">
        <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
          Выбор товаров
        </h3>
        <UButton
          color="gray"
          variant="ghost"
          icon="hugeicons:cancel-01"
          class="-my-1"
          @click="isOpen = false"
        />
      </div>
    </template>

    <template #body>
      <div class="grid gap-2">
        <div class="mb-4">
          <UInput 
            :model-value="searchQuery"
            @update:model-value="handleSearch"
            icon="hugeicons:search-02"
            placeholder="Поиск товара..."
            :loading="loading"
            autofocus />
        </div>
      
        <div class="flex-1 overflow-y-auto">
          <div v-if="loading && displayedProducts.length === 0" class="flex justify-center min-h-40 max-h-60">
            <UIcon name="svg-spinners:90-ring" class="w-8 h-8" />
          </div>
          <div v-else-if="displayedProducts.length === 0" class="flex flex-col items-center justify-center h-full text-center">
            <p class="font-medium">Товары не найдены</p>
          </div>
          <div v-else role="list" class="flex flex-col gap-2">
            <div v-for="product in displayedProducts" :key="product.documentId" 
              class="flex gap-2 items-center rounded-md" 
              :class="isProductSelected(product) ? 'bg-primary/20 dark:bg-primary/20 p-2' : ''">
              <div class="grid gap-2 w-full">
                <UCheckbox 
                  icon="hugeicons:add-01"
                  :label="product.name"
                  :description="product.category"
                  :model-value="isProductSelected(product)"
                  @update:model-value="toggleProductSelection(product)" 
                  variant="card"
                  class="py-2 px-2" 
                  size="lg" />
                <div v-if="isProductSelected(product)" class="flex items-center gap-2 self-end place-content-end">
                  <span class="text-gray-600 dark:text-gray-400 text-xs uppercase w-12 text-right">
                    {{ unitMeasurement(product.unit) }}
                  </span>
                  <UInputNumber 
                    :model-value="localSelectedProducts.find(item => item.documentId === product.documentId)?.quantity"
                    @update:model-value="val => updateQuantity(product.documentId, Number(val))"
                    :min="0" 
                    :step="0.01"
                    :ui="{ base: 'bg-white dark:bg-gray-950 text-black dark:text-white text-sm leading-3 font-bold' }"
                    :increment="{ icon: 'hugeicons:plus-sign-circle', size: 'md', class: 'p-0' }"
                    :decrement="{ icon: 'hugeicons:minus-sign-circle', size: 'md', class: 'p-0' }" 
                    variant="none" 
                    class="w-28" 
                    size="sm" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-center mt-4 border-t pt-2 border-gray-100 dark:border-gray-800" v-if="total > pageSize">
          <UPagination 
            v-model:page="page" 
            :items-per-page="pageSize" 
            :total="total" 
            color="neutral" 
            variant="ghost"
            active-color="primary" 
            activeVariant="solid"
            size="sm" />
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex items-center justify-between w-full">
        <UButton @click="isOpen = false" color="primary" variant="ghost">
          Отмена
        </UButton>
        <UButton
          label="Добавить товары в заказ"
          @click="confirmSelection"
          color="primary"
          size="lg"
          :disabled="localSelectedProducts.length === 0" />
      </div>
    </template>
  </UModal>
</template>