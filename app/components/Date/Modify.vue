<script setup>
import { CalendarDate, DateFormatter, getLocalTimeZone } from '@internationalized/date'
const emit = defineEmits(['update:inputDate'])

const props = defineProps({
  inputDate: {
    type: [String, Date],
    default: null
  },
  title: {
    type: String,
    default: ''
  }
})
const df = new DateFormatter('ru-RU', { dateStyle: 'medium' })

const internalCalendarDate = ref(
  props.inputDate
    ? new CalendarDate(
        new Date(props.inputDate).getFullYear(),
        new Date(props.inputDate).getMonth() + 1,
        new Date(props.inputDate).getDate()
      )
    : new CalendarDate(
        new Date().getFullYear(),
        new Date().getMonth() + 1,
        new Date().getDate()
      )
)

watch(() => props.inputDate, (newVal) => {
  if (newVal) {
    const date = new Date(newVal);
    internalCalendarDate.value = new CalendarDate(
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate()
    );
  } else {
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
  emit('update:inputDate', newCalendarDate.toDate(getLocalTimeZone()));
}

const displayDate = computed(() => {
  if (internalCalendarDate.value) {
    return df.format(internalCalendarDate.value.toDate(getLocalTimeZone()));
  }
  return 'Выберите дату';
});
</script>
<template>
  <UPopover>
    <UFormField :label="title">
      <UButton color="neutral" variant="subtle" block icon="hugeicons:calendar-03">
        {{ displayDate }}
      </UButton>
    </UFormField>
    <template #content>
      <UCalendar :model-value="internalCalendarDate" @update:model-value="handleDateChange" class="p-2" />
    </template>
  </UPopover>
</template>