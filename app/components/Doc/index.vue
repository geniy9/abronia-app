<script setup>
const { humanDate, expireDateStatus } = useConfig()
const route = useRoute()

const props = defineProps({
  item: {
    type: Object,
    default: null
  }
})
const isEdit = computed(() => route.hash === '#edit')
</script>
<template>
  <div class="flex flex-col w-full gap-4">

    <div class="grid w-full grid-cols-[auto_1fr_auto] items-center bg-primary text-white rounded-lg p-2">
      <NuxtLink to="/docs" class="text-2xl leading-0 p-2">
        <UIcon name="hugeicons:link-backward" />
      </NuxtLink>
      <div class="text-center">
        <p class="text-xs">Документы по продукту</p>
        <h2 class="text-lg font-bold">
          {{ item.product?.name }}
        </h2>
      </div>
      <NuxtLink :to="isEdit ? route.path : `${route.path}#edit`" class="text-2xl leading-0 p-2">
        <UIcon :name="isEdit ? 'hugeicons:cancel-square' : 'hugeicons:settings-01'" class="text-2xl" />
      </NuxtLink>
    </div>

    <DocEdit v-if="isEdit" :id="item.documentId" :docData="item" />
    <div v-else class="flex flex-col gap-4 px-2 pb-2">
      
      <div v-if="item.document && item.document.length" class="flex flex-col gap-2">

        <p class="text-sm opacity-70 px-1">Документы товара</p>

        <div v-for="(d, i) in item.document" :key="i" class="grid gap-3 bg-gray-200 dark:bg-gray-900 rounded-lg p-3">
          <div v-if="d.name" class="flex flex-col gap-1 text-gray-900 dark:text-white">
            <span class="font-bold text-lg">{{ d.name }}</span>
          </div>
          <div v-if="d.expireDate" class="flex items-center justify-between gap-1 text-gray-900 dark:text-white">
            <span class="text-sm opacity-70">Дата экспирации</span>
            <UBadge v-if="d.expireDate" :color="expireDateStatus(d.expireDate)" class="rounded-full">
              {{ humanDate(d.expireDate) }}
            </UBadge>
          </div>
          <div v-if="d.attachments" class="flex flex-col gap-1 text-gray-900 dark:text-white">
            <span class="text-sm opacity-70">Приложенные файлы</span>
            <Slider :items="d.attachments" />
          </div>
        </div>
      </div>
    </div>

  </div>
</template>