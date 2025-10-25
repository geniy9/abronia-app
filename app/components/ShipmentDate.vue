<script setup>
import { CalendarDate, DateFormatter, getLocalTimeZone } from '@internationalized/date'
const emit = defineEmits(['update:shipment'])

const props = defineProps({
  shipment: {
    type: [String, Date],
    default: null
  }
})
const df = new DateFormatter('ru-RU', { dateStyle: 'medium' })

const internalCalendarDate = ref(
  props.shipment
    ? new CalendarDate(
        new Date(props.shipment).getFullYear(),
        new Date(props.shipment).getMonth() + 1,
        new Date(props.shipment).getDate()
      )
    : new CalendarDate(
        new Date().getFullYear(),
        new Date().getMonth() + 1,
        new Date().getDate()
      )
)

watch(() => props.shipment, (newVal) => {
  if (newVal) {
    const date = new Date(newVal);
    internalCalendarDate.value = new CalendarDate(
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate()
    );
  } else {
    // Если shipment обнуляется, сбрасываем на текущую дату
    internalCalendarDate.value = new CalendarDate(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      new Date().getDate()
    );
  }
}, { immediate: true });

function handleDateChange(newCalendarDate) {
  internalCalendarDate.value = newCalendarDate;
  // Эмитируем событие с новой датой в формате Date
  emit('update:shipment', newCalendarDate.toDate(getLocalTimeZone()));
}

// Вычисляемое свойство для отображения текста кнопки
const displayDate = computed(() => {
  if (internalCalendarDate.value) {
    return df.format(internalCalendarDate.value.toDate(getLocalTimeZone()));
  }
  return 'Выберите дату';
});

// const shipDate = computed(() => {
//   if (props.shipment instanceof Date) {
//     return props.shipment;
//   }
//   if (typeof props.shipment === 'string') {
//     return new Date(props.shipment);
//   }
//   return null;
// });
// const modelValue = shallowRef(
//   shipDate.value ? new CalendarDate(
//     shipDate.value.getFullYear(),
//     shipDate.value.getMonth() + 1,
//     shipDate.value.getDate()
//   ) : null
// )
</script>
<template>
  <UPopover>
    <UFormField label="Дата отгрузки">
      <UButton color="neutral" variant="subtle" block icon="hugeicons:calendar-03">
        <!-- {{ modelValue ? df.format(modelValue.toDate(getLocalTimeZone())) : 'Выберите дату' }} -->
          {{ displayDate }}
      </UButton>
    </UFormField>
    <template #content>
      <!-- <UCalendar v-model="modelValue" class="p-2" /> -->
      <UCalendar :model-value="internalCalendarDate" @update:model-value="handleDateChange" class="p-2" />
    </template>
  </UPopover>
</template>

