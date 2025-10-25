<script setup>
import { CalendarDate, DateFormatter, getLocalTimeZone } from '@internationalized/date'

const props = defineProps({
  notified: {
    type: [String, Date],
    default: null
  }
})
const df = new DateFormatter('ru-RU', { dateStyle: 'medium' })

const notifiedDate = computed(() => {
  if (props.notified instanceof Date) {
    return props.notified;
  }
  if (typeof props.notified === 'string') {
    return new Date(props.notified);
  }
  return null;
});
const modelValue = shallowRef(
  notifiedDate.value ? new CalendarDate(
    notifiedDate.value.getFullYear(),
    notifiedDate.value.getMonth() + 1,
    notifiedDate.value.getDate()
  ) : null
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

