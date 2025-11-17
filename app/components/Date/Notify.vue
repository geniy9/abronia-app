<script setup>
import { CalendarDate, DateFormatter, getLocalTimeZone } from '@internationalized/date'

const emit = defineEmits(['on-set-date'])

const props = defineProps({
  dateOfRemind: {
    type: [String, Date],
    default: null
  }
})
const isOpen = ref(false)
const df = new DateFormatter('ru-RU', { dateStyle: 'medium', timeStyle: 'short' })

const notifiedDate = computed(() => {
  if (props.dateOfRemind instanceof Date) {
    return props.dateOfRemind;
  }
  if (typeof props.dateOfRemind === 'string') {
    return new Date(props.dateOfRemind);
  }
  return null;
});

const currentDateTime = notifiedDate.value || new Date();
const modelValue = shallowRef(
  new CalendarDate(
    currentDateTime.getFullYear(),
    currentDateTime.getMonth() + 1,
    currentDateTime.getDate()
  )
)
const selectedTime = ref(currentDateTime); 

watch([modelValue, selectedTime], ([newCalendarDate, newSelectedTime]) => {
  if (newCalendarDate) {
    const combinedDate = new Date(
      newCalendarDate.year,
      newCalendarDate.month - 1,
      newCalendarDate.day,
      newSelectedTime.getHours(),
      newSelectedTime.getMinutes(),
      newSelectedTime.getSeconds()
    );
    emit('on-set-date', combinedDate);
  }
});
</script>
<template>
  <UPopover v-model:open="isOpen" arrow>
    <UFormField :label="dateOfRemind ? 'Напоминание включено' : 'Включить напоминание'">
      <UButton
        color="neutral"
        variant="subtle"
        block icon="hugeicons:calendar-03">
        {{ modelValue && selectedTime
          ? df.format(new Date(
              modelValue.year,
              modelValue.month - 1,
              modelValue.day,
              selectedTime.getHours(),
              selectedTime.getMinutes()
            ))
          : 'Выбрать дату и время'
        }}
      </UButton>
    </UFormField>
    <template #content>
      <div class="p-2">
        <UCalendar v-model="modelValue" />
        <TimePicker v-model="selectedTime" />
        <UButton @click="isOpen = false" block class="mt-2">Готово</UButton>
      </div>
    </template>
  </UPopover>
</template>
