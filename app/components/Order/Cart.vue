<script setup>
import { z } from 'zod';
const { unitMeasurement } = useConfig()
const props = defineProps({
  products: {
    type: Array,
    required: true,
  },
  initialSelected: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['update:modelValue', 'add-to-order']);

const productItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  quantity: z.number().min(1, 'Количество должно быть не менее 1'),
});

const isOpen = ref(false);
const localSelectedProducts = ref([]);

watchEffect(() => {
  if (props.initialSelected) {
    localSelectedProducts.value = props.initialSelected.map(item => ({
      id: item.product.documentId,
      name: item.product.name,
      quantity: item.quantity,
      unit: item.unit,
    }));
  }
});

function toggleProductSelection(product) {
  const index = localSelectedProducts.value.findIndex(item => item.id === product.documentId);
  if (index !== -1) {
    localSelectedProducts.value.splice(index, 1);
  } else {
    localSelectedProducts.value.push({
      id: product.documentId,
      name: product.name,
      quantity: 1,
      unit: product.unit,
    });
  }
}

function isProductSelected(product) {
  return localSelectedProducts.value.some(item => item.id === product.documentId);
}
function updateQuantity(productId, quantity) {
  const item = localSelectedProducts.value.find(p => p.id === productId);
  if (item) { item.quantity = quantity }
}
function confirmSelection() {
  for (const item of localSelectedProducts.value) {
    try {
      productItemSchema.parse(item);
    } catch (error) {
      useToast().add({
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
      <div class="flex-1 overflow-y-auto">
        <div v-if="products.length === 0" class="flex flex-col items-center justify-center h-full text-center">
          <p class="font-medium">Товары не подгружены</p>
        </div>

        <div role="list" class="flex flex-col gap-1">
          <div v-for="product in products" :key="product.documentId" 
            class="flex gap-2 items-center px-2 py-1 rounded-md" 
            :class="isProductSelected(product) ? 'bg-gray-200 dark:bg-gray-800' : ''">
            <div class="flex flex-1 justify-between items-center">
              <UCheckbox 
                icon="hugeicons:add-01"
                :label="product.name"
                :description="product.category"
                :model-value="isProductSelected(product)"
                @update:model-value="toggleProductSelection(product)" 
                variant="card"
                class="py-2" 
                size="lg" />
              <div v-if="isProductSelected(product)" class="flex items-center gap-2">
                <span class="text-gray-600 dark:text-gray-400 text-xs uppercase w-12 text-right">
                  {{ unitMeasurement(product.unit) }}
                </span>
                <UInputNumber 
                  :model-value="localSelectedProducts.find(item => item.id === product.documentId)?.quantity"
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