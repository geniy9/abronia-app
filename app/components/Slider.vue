<script setup>
const { strapiUrl, smallImg, largeImg } = useConfig()
const props = defineProps({
  items: {
    type: Array,
    default: []
  }
})

const carousel = useTemplateRef('carousel')
const activeImage = ref(null)
const activeIndex = ref(0)
const isOpen = ref(false)

function onClickPrev() { activeIndex.value-- }
function onClickNext() { activeIndex.value++ }
function onSelect(index) { activeIndex.value = index }

function popupImage(data) {
  isOpen.value = true
  activeImage.value = data
}
</script>
<template>
  <div class="flex-1 w-full">
    <UCarousel
      ref="carousel" 
      v-slot="{ item }"
      :items="items"
      :arrows="(items.length >= 3)"
      :prev="{ onClick: onClickPrev }"
      :next="{ onClick: onClickNext }"
      prev-icon="hugeicons:arrow-left-02"
      next-icon="hugeicons:arrow-right-02"
      class="max-h-50 mx-auto"
      @select="onSelect" 
      :ui="{ 
        item: 'basis-1/3',
        prev: 'start-0 sm:start-0 sm:flex', 
        next: 'end-0 sm:end-0 sm:flex'
        }">
      <div class="flex justify-start items-center gap-2">
        <div v-if="(item.mime === 'image/jpeg' || item.mime === 'image/png')">
          <img @click="popupImage(item)" :src="smallImg(item)" class="rounded-lg w-36 h-36 object-cover cursor-pointer" />
        </div>
        <a v-else-if="(item.mime === 'application/pdf')" :href="strapiUrl + item.url" target="_blank" 
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

    <UModal v-model:open="isOpen" close-icon="hugeicons:cancel-01" fullscreen>
      <template #content>
        <UButton 
          @click="isOpen = false"
          icon="hugeicons:cancel-01" 
          color="neutral" 
          variant="outline" 
          class="absolute top-2 right-2" />
        <div class="flex items-center justify-center w-screen h-screen">
          <img :src="largeImg(activeImage)" class="max-w-full" />
        </div>
      </template>
    </UModal>
  </div>
</template>