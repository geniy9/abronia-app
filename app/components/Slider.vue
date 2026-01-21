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
      <div class="flex justify-start items-center gap-2 relative group">
        <div v-if="(item.mime === 'image/jpeg' || item.mime === 'image/png')">
          <img @click="popupImage(item)" :src="smallImg(item)" class="rounded-lg w-36 h-36 object-cover cursor-pointer" />
        </div>
        <!-- <a v-else-if="(item.mime === 'application/pdf')" :href="strapiUrl + item.url" target="_blank" 
          class="grid place-items-center rounded-lg w-36 h-36 bg-black/20">
          <UIcon name="hugeicons:pdf-02" class="w-8 h-8 text-gray-500" />
        </a> -->
        <div v-else-if="(item.mime === 'application/pdf')" 
          class="relative grid place-items-center rounded-lg w-36 h-36 bg-black/10 dark:bg-white/10 border border-gray-200 dark:border-gray-800">
          <a :href="strapiUrl + item.url" target="_blank" class="flex flex-col items-center">
            <UIcon name="hugeicons:pdf-02" class="w-10 h-10 text-red-500 mb-2" />
            <span class="text-[10px] text-gray-500 px-2 text-center line-clamp-2 leading-tight">{{ item.name }}</span>
          </a>
          <div class="absolute bottom-0 w-full flex justify-center pb-1">
            <Sharing :file="item" icon-color="gray" class="flex gap-1" />
          </div>
        </div>

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
        <!-- <div class="flex items-center justify-center w-screen h-screen bg-black">
          <img :src="largeImg(activeImage)" class="max-w-full max-h-full" />
        </div> -->
        <div class="relative flex items-center justify-center w-screen h-screen bg-black">
          <img :src="largeImg(activeImage)" class="max-w-full max-h-full object-contain" />
          <div class="absolute bottom-10 left-0 w-full flex justify-center z-50">
            <div class="bg-gray-900/60 backdrop-blur-md rounded-full px-6 py-2 border border-white/10">
              <Sharing v-if="activeImage" :file="activeImage" icon-color="neutral" class="flex gap-8" />
            </div>
          </div>
        </div>

      </template>
    </UModal>
  </div>
</template>