<script setup>
const props = defineProps({
  legend: {
    type: Boolean,
    default: false
  }
})
const colorMode = useColorMode()
const isDark = ref(colorMode.preference === 'dark')

watch(isDark, (newValue) => {
  colorMode.preference = newValue ? 'dark' : 'light'
})
watch(() => colorMode.preference, (newPreference) => {
  isDark.value = newPreference === 'dark'
})
</script>
<template>
  <USwitch 
    v-model="isDark" 
    unchecked-icon="hugeicons:sun-03"
    checked-icon="hugeicons:moon-02" 
    :label="legend ? isDark ? 'Тёмная' : 'Светлая' : ''" />
</template>