<script setup>
const props = defineProps({
  item: {
    type: Object,
    default: null
  }
})

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
      <div v-if="item.comment" class="flex flex-col justify-between gap-1">
        <UFormField label="Комментарий">
          <UTextarea v-model="item.comment.message" disabled 
            placeholder="Оставить комментарий..." 
            class="w-full" />
        </UFormField>
      </div>
    </div>

  </div>
</template>