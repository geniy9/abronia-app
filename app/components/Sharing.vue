<script setup>
const { strapiUrl } = useConfig()
const toast = useToast()

const props = defineProps({
  file: {
    type: Object,
    required: true
  },
  iconColor: {
    type: String,
    default: 'neutral'
  }
})

const loading = reactive({
  share: false,
  download: false
})

async function getFileBlob(url) {
  const fullUrl = url.startsWith('http') ? url : `${strapiUrl}${url}`
  
  try {
    const response = await fetch(fullUrl)
    if (!response.ok) throw new Error('Ошибка загрузки файла')
    return await response.blob()
  } catch (e) {
    console.error(e)
    toast.add({ title: 'Не удалось загрузить файл', color: 'red' })
    return null
  }
}

async function downloadFile() {
  if (loading.download) return
  loading.download = true

  const blob = await getFileBlob(props.file.url)
  
  if (blob) {
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = props.file.name || `document.${props.file.ext.replace('.', '')}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }
  loading.download = false
}

async function shareFile() {
  if (loading.share) return
  loading.share = true
  if (!navigator.share) {
    toast.add({ title: 'Ваше устройство не поддерживает функцию поделиться', color: 'warning' })
    loading.share = false
    return
  }

  const blob = await getFileBlob(props.file.url)

  if (blob) {
    const fileObj = new File([blob], props.file.name, { type: props.file.mime })
    const shareData = {
      files: [fileObj],
      title: props.file.name,
      text: 'Отправлено из Abronia Global'
    }

    try {
      // Проверяем, можем ли мы пошарить именно файл
      if (navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData)
      } else {
        await navigator.share({
          title: props.file.name,
          url: props.file.url.startsWith('http') ? props.file.url : `${strapiUrl}${props.file.url}`
        })
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Error sharing:', err)
        toast.add({ title: 'Ошибка при отправке', color: 'error' })
      }
    }
  }
  loading.share = false
}
</script>
<template>
  <div>
    <UButton
      variant="ghost"
      :loading="loading.download"
      @click.stop="downloadFile"
      :class="[iconColor === 'neutral' ? 'text-white hover:bg-white/20' : 'text-gray-700 dark:text-gray-200']"
    >
      <UIcon name="hugeicons:file-download" class="w-6 h-6" />
    </UButton>
    <UButton
      variant="ghost"
      :loading="loading.share"
      @click.stop="shareFile"
      :class="[iconColor === 'neutral' ? 'text-white hover:bg-white/20' : 'text-gray-700 dark:text-gray-200']"
    >
      <UIcon name="hugeicons:share-08" class="w-6 h-6" />
    </UButton>
  </div>
</template>