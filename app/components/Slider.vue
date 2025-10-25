<script setup>
const { imageUrl, smallImg, largeImg } = useConfig()
const props = defineProps({
  items: {
    type: Array,
    default: []
  }
})

const carousel = useTemplateRef('carousel')
const activeIndex = ref(0)
const isOpen = ref(false)

function onClickPrev() {
  activeIndex.value--
}
function onClickNext() {
  activeIndex.value++
}
function onSelect(index) {
  activeIndex.value = index
}
</script>
<template>
  <div class="flex-1 w-full">
    <UCarousel
      ref="carousel" 
      v-slot="{ item }"
      :items="items"
      :prev="{ onClick: onClickPrev }"
      :next="{ onClick: onClickNext }"
      prev-icon="hugeicons:arrow-left-02"
      next-icon="hugeicons:arrow-right-02"
      class="max-h-50 mx-auto"
      @select="onSelect" 
      :ui="{ 
        item: 'basis-1/2',
        prev: 'start-0 sm:start-0 hidden sm:flex', 
        next: 'end-0 sm:end-0 hidden sm:flex'
        }">
      <div class="flex justify-center items-center">
        <UModal v-model:open="isOpen" v-if="(item.mime === 'image/jpeg' || item.mime === 'image/png')" fullscreen>
          <img :src="smallImg(item)" class="rounded-lg w-36 h-36 object-cover cursor-pointer" />
          <template #content>
            <UButton 
              @click="isOpen = false"
              icon="hugeicons:cancel-01" 
              color="neutral" 
              variant="outline" 
              class="absolute top-2 right-2" />
            <div class="flex items-center justify-center w-full h-screen">
              <img :src="largeImg(items[activeIndex])" class="w-full h-auto" />
            </div>
          </template>
        </UModal>
        <a v-else-if="(item.mime === 'application/pdf')" :href="imageUrl + item.url" target="_blank" 
          class="grid place-items-center rounded-lg w-36 h-36 bg-black/20">
          <UIcon name="hugeicons:pdf-02" class="w-8 h-8 text-gray-500" />
        </a>
        <div v-else class="grid place-items-center rounded-lg w-36 h-36 dark:bg-black/20 bg-black/10">
          <div class="flex flex-col items-center gap-2 text-center text-gray-500">
            <UIcon name="hugeicons:image-delete-02" class="w-8 h-8" />
            <span class="text-xs w-24">неизвестный формат</span>
          </div>
        </div>
      </div>
    </UCarousel>
  </div>
</template>