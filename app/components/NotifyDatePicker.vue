<script setup>
import { CalendarDate, DateFormatter, getLocalTimeZone } from '@internationalized/date'

const props = defineProps({
  notified: {
    type: Date,
    default: null
  }
})
const df = new DateFormatter('ru-RU', {
  dateStyle: 'medium'
})

const modelValue = shallowRef(
  props.notified 
    ? new CalendarDate(
        props.notified.getFullYear(),
        props.notified.getMonth() + 1,
        props.notified.getDate()
      )
    : null
)
</script>
<template>
  <UPopover>
    <UFormField :label="notified ? 'Напоминание включено' : 'Напомнить об оплате'">
      <UButton color="neutral" variant="subtle" block icon="hugeicons:calendar-03">
        {{ modelValue ? df.format(modelValue.toDate(getLocalTimeZone())) : 'Выберите дату' }}
      </UButton>
    </UFormField>
    <template #content>
      <UCalendar v-model="modelValue" class="p-2" />
    </template>
  </UPopover>
</template>

