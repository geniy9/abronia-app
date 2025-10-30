<script setup>
const route = useRoute()
const props = defineProps({
  customer: {
    type: Object,
    default: null
  }
})

const item = ref(props.customer)

const commentPrompt = ref(null)
const currentComment = ref({
  message: props.customer?.comment?.message,
  documentId: props.customer?.comment?.documentId
})
function openCommentPrompt() {
  commentPrompt.value?.openCommentPrompt()
}
function handleComment(data) {
  currentComment.value.message = data.message
  currentComment.value.documentId = data.documentId
}

function onEdited(obj) { item.value = obj }
const isEdit = computed(() => route.hash === '#edit')
</script>
<template>
  <div class="flex flex-col w-full gap-2">

    <div class="grid grid-cols-[auto_1fr_auto] items-center bg-primary text-white rounded-lg p-2">
      <NuxtLink to="/customers" class="text-2xl leading-0 p-2">
        <UIcon name="hugeicons:link-backward" />
      </NuxtLink>
      <div class="text-center">
        <p class="text-xs">Клиент</p>
        <h2 class="text-lg font-bold">{{ item.name }}</h2>
      </div>
      <NuxtLink :to="isEdit ? route.path : `${route.path}#edit`" class="text-2xl leading-0 py-2">
        <UIcon :name="isEdit ? 'hugeicons:cancel-square' : 'hugeicons:settings-01'" class="text-2xl" />
      </NuxtLink>
    </div>

    <CustomerEdit 
      v-if="isEdit" 
      :id="item.documentId" 
      :customerData="item" 
      @onEdited="onEdited" />
    <div v-else class="flex flex-col gap-2 pb-2">
      <div v-if="item.description" class="flex items-center justify-center">
        <span class="text-center text-gray-900 dark:text-white text-sm">
          {{ item.description }}
        </span>
      </div>
      <div v-if="item.contactName" class="grid gap-1 bg-gray-200 dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg p-3">
        <span class="text-sm opacity-70">Контактное лицо</span>
        <span class="font-bold">{{ item.contactName }}</span>
      </div>
      <div v-if="item.phone || item.email || item.website" class="grid gap-4 bg-gray-200 dark:bg-gray-900 rounded-lg p-3">
        <div v-if="item.phone" class="flex flex-col gap-1 text-gray-900 dark:text-white">
          <span class="text-sm opacity-70">Телефон</span>
          <span class="font-bold">{{ item.phone }}</span>
        </div>
        <div v-if="item.email" class="flex flex-col gap-1 text-gray-900 dark:text-white">
          <span class="text-sm opacity-70">Электронный адрес</span>
          <span class="font-bold">{{ item.email }}</span>
        </div>
        <div v-if="item.website" class="flex flex-col gap-1 text-gray-900 dark:text-white">
          <span class="text-sm opacity-70">Сайт</span>
          <span class="font-bold">{{ item.website }}</span>
        </div>
      </div>
      <UAccordion :items="[{
          label: 'Комментарий',
          icon: 'hugeicons:message-01',
          trailingIcon: 'hugeicons:arrow-down-01',
          slot: 'comment',
        }]">
        <template #comment>
          <div v-if="currentComment.documentId" class="flex flex-col items-stretch gap-2 bg-gray-200 dark:bg-gray-800 rounded-md p-2">
            <div v-html="currentComment.message" class="text-sm text-gray-700 dark:text-gray-400"></div>
            <UButton :to="`/comments/${currentComment.documentId}`" 
              color="neutral" variant="soft" 
              icon="hugeicons:link-square-02" 
              trailing size="sm" 
              class="self-end" />
          </div>
          <div v-else class="grid items-center justify-center bg-gray-200 dark:bg-gray-800 rounded-md p-4">
            <UButton
              icon="hugeicons:plus-sign-circle"
              label="Добавить комментарий" 
              color="primary"
              size="sm"
              @click="openCommentPrompt" />
          </div>
        </template>
      </UAccordion>
    </div>

    <CommentAddEntry
      ref="commentPrompt"
      :entry-id="item.documentId"
      entry-name="customer"
      @handle-comment="handleComment" />

  </div>
</template>