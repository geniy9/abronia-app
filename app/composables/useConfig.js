export default () => {
  const config = useRuntimeConfig()
  const imageUrl = config.public.STRAPI_URL
  const toast = useToast()
  return {
    imageUrl,
    productUnits: [
      { name: 'Литры', value: 'liter' },
      { name: 'Кг', value: 'kg' }
    ],
    orderStatusList: [
      { name: 'в ожидании', value: 'pending' },
      { name: 'отправлен', value: 'shipped' },
      { name: 'завершён', value: 'completed' },
      { name: 'отменён', value: 'cancelled' },
    ],
    invoiceStatusList: [
      { name: 'черновик', value: 'draft' },
      { name: 'отправлен', value: 'sent' },
      { name: 'оплачен частично', value: 'partially_paid' },
      { name: 'оплачен', value: 'paid' },
    ],
    unitMeasurement: (data, n) => {
      switch (data) {
        case 'liter':
          if (typeof n === 'number') {
            let lastDigit = n % 10;
            let lastTwoDigits = n % 100;
            if (lastTwoDigits >= 11 && lastTwoDigits <= 14) { return ' литров' }
            if (lastDigit === 1) { return ' литр' }
            if (lastDigit >= 2 && lastDigit <= 4) { return ' литра' }
            return ' литров';
          }
          return ' литры';
        case 'kg': return ' кг';
        default: return '';
      }
    },
    statusOrder: (data) => {
      switch (data) {
        case 'pending': return { name: 'в ожидании', color: 'info' }
        case 'shipped': return { name: 'отправлен', color: 'warning' }
        case 'completed': return { name: 'завершён', color: 'success' }
        case 'cancelled': return { name: 'отменён', color: 'error' }
        default: return ''
      }
    },
    statusInvoice: (data) => {
      switch (data) {
        case 'draft': return { name: 'черновик', color: 'info' }
        case 'sent': return { name: 'отправлен', color: 'error' }
        case 'partially_paid': return { name: 'оплачен частично', color: 'warning' }
        case 'paid': return { name: 'оплачен', color: 'success' }
        default: return ''
      }
    },
    invoiceYear: (data) => { return new Date(data).getFullYear() },
    copyBoofer: (str) => {
      if (import.meta.client) {
        navigator.clipboard.writeText(str)
        toast.add({ title: 'Скопировано', description: str, color: 'primary' })
      } else {
        console.warn("do SSR false")
      }
    },
    humanDate: (str, m = 'numeric', y = 'numeric') => {
      if (str === null || str === undefined) return ''
      let date = new Date(str)
      return date.toLocaleString('ru-RU', { day: 'numeric', month: m, year: y })
    },
    humanDateTime: (str, m = 'numeric', y = 'numeric') => {
      if (str === null || str === undefined) return ''
      let date = new Date(str)
      return date.toLocaleString('ru-RU', { 
        day: 'numeric', month: m, year: y, hour: y, minute: y
      })
    },
    truncate: (str, value = 100, ends = '...') => { 
      return `${(str || '').substring(0, value)}${str?.length > value ? ends : ''}`
    },
    thumbImg: (img) => {
      return `${imageUrl}${img?.formats.thumbnail ? img.formats.thumbnail.url : img.url}`
    },
    smallImg: (img) => {
      return `${imageUrl}${img?.formats.small ? img.formats.small.url : img.url}`
    },
    mediumImg: (img) => {
      if (img?.formats.medium) {
        return `${imageUrl}${img.formats.medium.url}`
      } else if (img?.formats.small) {
        return `${imageUrl}${img.formats.small.url}`
      } else {
        return `${imageUrl}${img.url}`
      }
    },
    largeImg: (img) => {
      if (img?.formats) {
        if (img.formats?.large) {
          return `${imageUrl}${img.formats.large.url}`
        } else if (img.formats?.medium) {
          return `${imageUrl}${img.formats.medium.url}`
        } else if (img.formats?.small) {
          return `${imageUrl}${img.formats.small.url}`
        }
      } else {
        return `${imageUrl}${img.url}`
      }
    }
  }
}