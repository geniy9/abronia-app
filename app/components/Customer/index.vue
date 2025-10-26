<script setup>
const props = defineProps({
  item: {
    type: Object,
    default: null
  }
})

const commentPrompt = ref(null)
const currentComment = ref({
  message: props.item?.comment?.message,
  documentId: props.item?.comment?.documentId
})
function openCommentPrompt() {
  commentPrompt.value?.openCommentPrompt()
}
function handleComment(data) {
  currentComment.value.message = data.message
  currentComment.value.documentId = data.documentId
}
</script>
<template>
  <div class="flex flex-col w-full gap-2">

    <div class="bg-primary text-white text-center rounded-lg w-full p-2">
      <p class="text-xs">Клиент</p>
      <h2 class="text-lg font-bold cursor-pointer">
        {{ item.name }}
      </h2>
    </div>

    <div class="flex flex-col gap-2 pb-2">

      <div v-if="item.description" class="flex items-center justify-center">
        <span class="text-center text-gray-900 dark:text-white text-sm">
          {{ item.description }}
        </span>
      </div>
      <div v-if="item.contactName" class="flex flex-col gap-1 w-full bg-gray-200 dark:bg-gray-900 rounded-lg p-2 text-gray-900 dark:text-white">
        <span class="text-sm opacity-70">Контактное лицо</span>
        <span class="font-bold">{{ item.contactName }}</span>
      </div>
      <div v-if="item.contacts" class="flex flex-col gap-4 w-full bg-gray-200 dark:bg-gray-900 rounded-lg p-2">
        <div v-if="item.contacts.phone" class="flex flex-col gap-1 text-gray-900 dark:text-white">
          <span class="text-sm opacity-70">Телефон</span>
          <span class="font-bold">{{ item.contacts.phone }}</span>
        </div>
        <div v-if="item.contacts.email" class="flex flex-col gap-1 text-gray-900 dark:text-white">
          <span class="text-sm opacity-70">Электронный адрес</span>
          <span class="font-bold">{{ item.contacts.email }}</span>
        </div>
        <div v-if="item.contacts.phone" class="flex flex-col gap-1 text-gray-900 dark:text-white">
          <span class="text-sm opacity-70">Сайт</span>
          <span class="font-bold">{{ item.contacts.website }}</span>
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