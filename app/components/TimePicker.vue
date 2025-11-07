<script setup>
import { ref, watch } from 'vue';

const emit = defineEmits(['update:modelValue']);
const props = defineProps({
  modelValue: {
    type: Date,
    default: () => new Date()
  }
});

const hours = ref(props.modelValue.getHours());
const minutes = ref(props.modelValue.getMinutes());

watch([hours, minutes], ([newHours, newMinutes]) => {
  const newDate = new Date(props.modelValue);
  newDate.setHours(newHours);
  newDate.setMinutes(newMinutes);
  emit('update:modelValue', newDate);
});

watch(() => props.modelValue, (newDate) => {
  hours.value = newDate.getHours();
  minutes.value = newDate.getMinutes();
});
</script>
<template>
  <div class="flex items-center space-x-2 p-2">
    <UInput type="number" v-model.number="hours" min="0" max="23" placeholder="HH" class="w-16 text-center" />
    <span>:</span>
    <UInput type="number" v-model.number="minutes" min="0" max="59" placeholder="MM" class="w-16 text-center" />
  </div>
</template>