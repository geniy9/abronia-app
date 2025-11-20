<script setup>
import { useApiStore } from '~/store/api'
import { z } from 'zod'

const client = useStrapiClient()
const toast = useToast()
const router = useRouter()
const route = useRoute()
const apiStore = useApiStore()

const schema = z.object({
  productId: z.string().min(1, 'Выберите продукт'),
  document: z.array(z.object({
    name: z.string().min(1, 'Укажите название документа'),
    expireDate: z.union([z.date(), z.string(), z.null()]).optional()
  })).min(1, 'Добавьте хотя бы один документ')
});

const data = reactive({
  productId: route.query?.productId || '',
  products: [],
  document: [{ 
    name: '', 
    expireDate: null
  }],
  loading: false,
  loadingProducts: false
})

const uploadersRefs = ref([])

onMounted(async () => {
  data.loadingProducts = true
  try {
    await apiStore.getProducts()
    data.products = apiStore.products.map(item => ({ 
      label: item.name, 
      value: item.documentId 
    }))
  } catch (error) {
    console.error(error)
    toast.add({
      title: 'Ошибка загрузки товаров',
      description: 'Не удалось загрузить список товаров.',
      color: 'error',
      icon: 'hugeicons:cancel-circle',
    });
  } finally {
    data.loadingProducts = false
  }
});

// Управление динамическими полями
function addDocument() {
  data.document.push({ name: '', expireDate: null });
}
function removeDocument(index) { 
  data.document.splice(index, 1) 
}

async function onSubmit() {
  data.loading = true;

  try {
    await schema.parseAsync(data);

    const documentPayload = await Promise.all(data.document.map(async (docItem, index) => {
      const uploaderComponent = uploadersRefs.value[index];
      let attachmentIds = [];

      // Если компонент существует и у него есть метод uploadFiles
      if (uploaderComponent && uploaderComponent.uploadFiles) {
        attachmentIds = await uploaderComponent.uploadFiles();
      }

      return {
        name: docItem.name,
        expireDate: docItem.expireDate ? new Date(docItem.expireDate).toISOString() : null,
        attachments: attachmentIds // Strapi ожидает массив ID для поля Media
      };
    }));

    const finalPayload = {
      product: { connect: [data.productId] },
      document: documentPayload // Массив компонентов
    };

    // 4. Отправка создания записи Doc
    const res = await client('/docs', {
      method: 'POST',
      body: { data: finalPayload }
    });

    if (res?.data) {
      const newDocId = res.data.documentId;
      toast.add({ 
        title: 'Документация создана', 
        color: 'success', 
        icon: 'hugeicons:checkmark-circle-02'
      });
      router.push(`/docs/${newDocId}`)
    }

  } catch (e) {
    console.error(e)
    // Обработка ошибок Zod или API
    const msg = e instanceof z.ZodError 
      ? e.errors.map(err => err.message).join(', ')
      : e.message || 'Ошибка при сохранении';
      
    toast.add({ 
      title: 'Ошибка', 
      description: msg, 
      color: 'error', 
      icon: 'hugeicons:cancel-circle'
    })
  } finally {
    data.loading = false;
  }
}

function clearData() {
  data.document = [{ name: '', expireDate: null }]
  data.productId = ''
}

const isDisabled = computed(() => !data.productId || data.loading)
</script>

<template>
  <UCard>
    <template #header>
      <h2 class="main_title">Добавить документы к товару</h2>
    </template>

    <UForm :schema="schema" :state="data" class="space-y-4" @submit.prevent="onSubmit">
      
      <UFormField label="Продукт" name="productId" required>
        <USelect
          v-model="data.productId"
          :items="data.products"
          placeholder="Выберите товар"
          :loading="data.loadingProducts"
          class="w-full md:w-1/2" 
          trailing-icon="hugeicons:arrow-down-01"
        />
      </UFormField>
      
      <USeparator label="Список документов" class="my-6" />

      <div v-for="(d, i) in data.document" :key="i" class="p-4 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg space-y-4 relative transition-all bg-gray-50 dark:bg-gray-900/50">
        <div class="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-2 mb-2">
          <h3 class="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <UIcon name="hugeicons:file-01" /> 
            Документ #{{ i + 1 }}
          </h3>
          <UButton v-if="data.document.length > 1"
            icon="hugeicons:delete-02" 
            size="xs" 
            color="error" 
            variant="ghost"
            @click="removeDocument(i)"
            tooltip="Удалить блок" />
        </div>

        <div class="grid gap-4">
          <UFormField label="Название" :name="`document.${i}.name`" required>
            <UInput v-model="d.name" placeholder="Например: Сертификат качества" class="w-full" />
          </UFormField>

          <UFormField label="Срок действия" :name="`document.${i}.expireDate`">
            <DateModify v-model:inputDate="d.expireDate" />
          </UFormField>
        </div>

        <UFormField label="Вложения">
          <UploaderFiles ref="uploadersRefs" :doc-index="i" />
        </UFormField>

      </div>

      <UButton 
        label="Добавить еще документ" 
        icon="hugeicons:plus-sign-circle" 
        variant="soft"
        block
        class="mt-2"
        @click="addDocument" />
      
      <div class="flex items-center justify-between pt-6 mt-4 border-t border-gray-200 dark:border-gray-700">
        <UButton to="/docs" color="gray" variant="ghost">
          Отмена
        </UButton>
        <UButton 
          type="submit" 
          :disabled="isDisabled" 
          :loading="data.loading"
          icon="hugeicons:floppy-disk"
          color="primary">
          Создать запись
        </UButton>
      </div>
    </UForm>
  </UCard>
</template>