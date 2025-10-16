<script setup>
const props = defineProps({
  value: {
    type: Number,
    default: 0
  }
})
</script>
<template>
  <div class="font-bold">
    <span v-if="props.value !== ''">$</span>
    <span>{{ props.value.toFixed(2) }}</span>
  </div>
</template>
