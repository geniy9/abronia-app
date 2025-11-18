export default () => {
  const config = useRuntimeConfig()
  const strapiUrl = config.public.STRAPI_URL
  const toast = useToast()
  return {
    strapiUrl,
    productUnits: [
      { name: 'Литры', value: 'liter' },
      { name: 'Кг', value: 'kg' }
    ],
    stockStatusList: [
      { name: 'приход', value: 'stock_in' },
      { name: 'возврат', value: 'return' },
      { name: 'списание на образец', value: 'write_off_sample' },
      { name: 'списание брак', value: 'write_off_defect' },
      { name: 'отмена заказа', value: 'cancelled' },
      { name: 'продажа', value: 'sale' },
    ],
    orderStatusList: [
      { name: 'в ожидании', value: 'pending' },
      { name: 'отправлен', value: 'shipped' },
      { name: 'завершён', value: 'completed' },
      { name: 'отменён', value: 'cancelled' },
    ],
    invoiceStatusList: [
      { name: 'новый', value: 'new' },
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
        case 'pending': return { name: 'в ожидании', color: 'warning' }
        case 'shipped': return { name: 'отправлен', color: 'info' }
        case 'completed': return { name: 'завершён', color: 'success' }
        case 'cancelled': return { name: 'отменён', color: 'error' }
        default: return ''
      }
    },
    statusInvoice: (data) => {
      switch (data) {
        case 'new': return { name: 'новый', color: 'warning' }
        case 'sent': return { name: 'отправлен', color: 'error' }
        case 'partially_paid': return { name: 'оплачен частично', color: 'info' }
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
    expireDateStatus: (targetDate) => {
      const now = new Date();
      const target = new Date(targetDate);
    
      if (isNaN(target.getTime())) { return "neutral" }
    
      const diffTime = target.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const diffMonths = diffDays / 30.44;
    
      if (diffMonths <= 1 && diffMonths > 0) { return "error" } 
      else if (diffMonths <= 2 && diffMonths > 1) { return "warning" } 
      else if (diffMonths > 2) { return "info" } 
      else { return "error" }
    },
    truncate: (str, value = 100, ends = '...') => { 
      return `${(str || '').substring(0, value)}${str?.length > value ? ends : ''}`
    },
    thumbImg: (img) => {
      return `${strapiUrl}${img?.formats.thumbnail ? img.formats.thumbnail.url : img.url}`
    },
    smallImg: (img) => {
      return `${strapiUrl}${img?.formats.small ? img.formats.small.url : img.url}`
    },
    mediumImg: (img) => {
      if (img?.formats.medium) {
        return `${strapiUrl}${img.formats.medium.url}`
      } else if (img?.formats.small) {
        return `${strapiUrl}${img.formats.small.url}`
      } else {
        return `${strapiUrl}${img.url}`
      }
    },
    largeImg: (img) => {
      if (img?.formats) {
        if (img.formats?.large) {
          return `${strapiUrl}${img.formats.large.url}`
        } else if (img.formats?.medium) {
          return `${strapiUrl}${img.formats.medium.url}`
        } else if (img.formats?.small) {
          return `${strapiUrl}${img.formats.small.url}`
        }
      } else {
        return `${strapiUrl}${img.url}`
      }
    }
  }
}