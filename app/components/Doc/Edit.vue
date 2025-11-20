<script setup>
import { useApiStore } from '~/store/api'
import { z } from 'zod'

const apiStore = useApiStore()
const { update, findOne } = useStrapi()
const { strapiUrl } = useConfig()
const toast = useToast()
const router = useRouter()
const route = useRoute()

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  docData: {
    type: Object,
    default: null
  },
})

// Схема валидации
const schema = z.object({
  productId: z.string().min(1, 'Выберите продукт'),
  document: z.array(z.object({
    name: z.string().min(1, 'Укажите название документа'),
    expireDate: z.union([z.date(), z.string(), z.null()]).optional()
  })).min(1, 'Должен быть хотя бы один документ')
});

const state = reactive({
  productId: props.docData?.product?.documentId || '',
  document: props.docData?.document 
    ? props.docData.document.map(doc => ({
        id: doc.id,
        name: doc.name,
        expireDate: doc.expireDate ? new Date(doc.expireDate) : null,
        existingFiles: doc.attachments ? doc.attachments.map(f => ({
          id: f.id,
          name: f.name,
          ext: f.ext,
          url: f.url
        })) : []
      }))
    : [{ id: null, name: '', expireDate: null, existingFiles: [] }]
})

const data = reactive({
  products: [],
  loading: false,
  loadingFields: false
})
const uploadersRefs = ref([])

onMounted(async () => {
  data.loadingFields = true;
  try {
    if (apiStore.products.length === 0) {
      await apiStore.getProducts();
    }
    data.products = apiStore.products.map(item => ({ 
      label: item.name, 
      value: item.documentId
    }));
  } catch (error) {
    toast.add({
      title: 'Ошибка',
      description: 'Не удалось загрузить список продуктов.',
      color: 'error',
      icon: 'hugeicons:cancel-circle',
    });
  } finally {
    data.loadingFields = false;
  }
});

function addDocument() {
  state.document.push({ 
    id: null,
    name: '', 
    expireDate: null, 
    existingFiles: [] 
  });
}

function removeDocument(index) {
  state.document.splice(index, 1);
}
function removeExistingFile(docIndex, fileIndex) {
  state.document[docIndex].existingFiles.splice(fileIndex, 1);
}

async function onSubmit() {
  data.loading = true;
  try {
    await schema.parseAsync(state);

    const documentPayload = await Promise.all(state.document.map(async (docItem, index) => {
      
      const keptFileIds = docItem.existingFiles.map(f => f.id);

      let newFileIds = [];
      const uploader = uploadersRefs.value[index];
      if (uploader && uploader.uploadFiles) {
        newFileIds = await uploader.uploadFiles();
      }
      const finalAttachments = [...keptFileIds, ...newFileIds];

      return {
        name: docItem.name,
        expireDate: docItem.expireDate ? new Date(docItem.expireDate).toISOString() : null,
        attachments: finalAttachments
      };
    }));

    const finalPayload = {
      product: { connect: [state.productId] },
      document: documentPayload
    };

    const res = await update('docs', props.id, finalPayload);

    if (res?.data) {
      const updatedData = await findOne('docs', props.id, {
        populate: {
          product: true,
          document: {
            populate: { attachments: true }
          }
        }
      });
      toast.add({
        title: 'Документация обновлена',
        color: 'success',
        icon: 'hugeicons:checkmark-circle-02',
      });
      router.push(route.path); 
    }

  } catch (e) {
    console.error('Error updating docs:', e);
    const msg = e instanceof z.ZodError ?
      e.errors.map(err => err.message).join('; ') :
      e.message || 'Ошибка сохранения';

    toast.add({
      title: 'Ошибка',
      description: msg,
      color: 'error',
      icon: 'hugeicons:cancel-circle',
    });
  } finally {
    data.loading = false;
  }
}

function onRemoved() { router.push('/docs') }

const isDisabled = computed(() => !state.productId || data.loading)
</script>
<template>
  <UCard>
    <template #header>
      <h2 class="main_title">Редактирование документов</h2>
    </template>

    <UForm :schema="schema" :state="state" class="space-y-5" @submit.prevent="onSubmit">
      
      <UFormField label="Продукт" name="productId" required>
        <USelect
          v-model="state.productId"
          :items="data.products"
          placeholder="Выберите товар"
          :loading="data.loadingFields"
          class="w-full md:w-1/2" 
          trailing-icon="hugeicons:arrow-down-01"
        />
      </UFormField>
      
      <USeparator label="Список документов" class="my-6" />

      <div v-for="(d, i) in state.document" :key="i" class="p-4 border border-gray-200 dark:border-gray-700 rounded-lg space-y-4 bg-gray-50 dark:bg-gray-800/50 relative">
        
        <div class="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-2">
          <h3 class="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <UIcon name="hugeicons:file-01" /> 
            Документ #{{ i + 1 }}
          </h3>
          <UButton v-if="state.document.length > 1"
            icon="hugeicons:delete-02" 
            size="xs" 
            color="error" 
            variant="ghost"
            @click="removeDocument(i)"
            tooltip="Удалить этот документ" />
        </div>

        <UFormField label="Название" :name="`document.${i}.name`" required>
          <UInput v-model="d.name" placeholder="Наименование документа" class="w-full" />
        </UFormField>

        <UFormField label="Срок действия" :name="`document.${i}.expireDate`">
          <DateModify v-model:inputDate="d.expireDate" />
        </UFormField>

        <div class="space-y-2">
          <span class="text-sm font-medium text-gray-700 dark:text-gray-200">Файлы</span>
          
          <div v-if="d.existingFiles.length > 0" class="grid gap-2 mb-3">
            <div v-for="(file, fileIdx) in d.existingFiles" :key="file.id" 
              class="flex items-center justify-between p-2 bg-white dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
              <div class="flex items-center gap-2 truncate">
                <UIcon name="hugeicons:file-view" class="text-gray-400" />
                <a :href="strapiUrl + file.url" target="_blank" class="text-sm hover:underline truncate max-w-60">
                  {{ file.name }}
                </a>
              </div>
              <UButton 
                icon="hugeicons:cancel-01" 
                size="2xs" 
                color="gray" 
                variant="ghost" 
                @click="removeExistingFile(i, fileIdx)" />
            </div>
          </div>

          <UploaderFiles ref="uploadersRefs" />
        </div>
      </div>

      <UButton 
        label="Добавить документ" 
        icon="hugeicons:plus-sign-circle" 
        variant="soft"
        block
        class="mt-2 border border-dashed border-primary-500/50"
        @click="addDocument" />
      
      <div class="flex items-center justify-between pt-6 mt-4 border-t border-gray-200 dark:border-gray-700">
        <RemoveEntry 
          :id="id" api="docs" 
          entry-name="документацию" 
          @on-removed="onRemoved" />

        <UFieldGroup>
          <UButton :to="route.path" color="neutral" variant="soft" size="sm">
            Отмена
          </UButton>
          <UButton 
            type="submit" 
            size="sm"
            :disabled="isDisabled" 
            :loading="data.loading"
            icon="hugeicons:floppy-disk">
            Сохранить изменения
          </UButton>
        </UFieldGroup>
      </div>
    </UForm>
  </UCard>
</template>