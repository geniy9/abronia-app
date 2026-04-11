<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  loading: {
    type: Boolean,
    default: false
  },
  placeholder: {
    type: String,
    default: 'Поиск'
  },
})
const emit = defineEmits(['update:modelValue'])
const searchQuery = ref('')
let searchTimeout = null

function handleSearch(val) {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    if (val.length === 0 || val.length >= 2) {
      emit('update:modelValue', val);
    }
  }, 300);
}
</script>
<template>
  <UInput 
    v-model.trim="searchQuery" 
    :placeholder="placeholder" 
    icon="hugeicons:search-01" 
    @update:model-value="handleSearch" 
    :loading="loading" 
    class="w-full" />
</template>