<script setup>
import { CalendarDate, DateFormatter, getLocalTimeZone } from '@internationalized/date'
import { vMaska } from 'maska/vue'

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
const inputString = ref('')
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
},{ immediate: true });

watch(internalCalendarDate, (val) => {
  if (!val) {
    inputString.value = ''
    return
  }
  // inputString.value = df.format(val.toDate(getLocalTimeZone()))
  const d = val.toDate(getLocalTimeZone())
  inputString.value =
    String(d.getDate()).padStart(2, '0') + '.' +
    String(d.getMonth() + 1).padStart(2, '0') + '.' +
    d.getFullYear()
},{ immediate: true })

function parseInputDate(value) {
  if (!value) return
  // 01.01.2026 или 01/01/2026
  const match = value.match(/^(\d{2})[./](\d{2})[./](\d{4})$/)
  if (!match) return

  const day = Number(match[1])
  const month = Number(match[2])
  const year = Number(match[3])

  if (month < 1 || month > 12 || day < 1 || day > 31) return
  const calendarDate = new CalendarDate(year, month, day)
  internalCalendarDate.value = calendarDate
  emit('update:inputDate', calendarDate.toDate(getLocalTimeZone()))
}

function handleDateChange(newCalendarDate) {
  internalCalendarDate.value = newCalendarDate;
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
  <!-- <UPopover>
    <UFormField :label="title">
      <UButton color="neutral" variant="subtle" block icon="hugeicons:calendar-03">
        {{ displayDate }}
      </UButton>
    </UFormField>
    <template #content>
      <UCalendar :model-value="internalCalendarDate" @update:model-value="handleDateChange" class="p-2" />
    </template>
  </UPopover> -->
  <UPopover>
    <UFormField :label="title">
      <UInput
        v-model="inputString"
        v-maska="'##.##.####'"
        placeholder="ДД.ММ.ГГГГ"
        icon="hugeicons:calendar-03"
        @blur="parseInputDate(inputString)"
      />
    </UFormField>

    <template #content>
      <UCalendar
        :model-value="internalCalendarDate"
        @update:model-value="handleDateChange"
        class="p-2"
      />
    </template>
  </UPopover>
</template>