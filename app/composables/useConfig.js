export default () => {
  const config = useRuntimeConfig()
  const imageUrl = config.public.STRAPI_URL
  const toast = useToast()
  return {
    imageUrl,
    productUnits: [{
      name: 'Литры',
      value: 'liter',
    },{
      name: 'Кг',
      value: 'kg',
    }],
    unitMeasurement: (data) => {
      switch (data) {
        case 'liter': return ' Литры'
        case 'kg': return ' Кг'
        default: return ''
      }
    },
    statusOrder: (data) => {
      switch (data) {
        case 'pending': return 'в ожидании'
        case 'shipped': return 'отправлен'
        case 'completed': return 'доставлен'
        case 'cancelled': return 'отменён'
        default: return ''
      }
    },
    colorStatusOrder: (data) => {
      switch (data) {
        case 'pending': return 'info'
        case 'shipped': return 'warning'
        case 'completed': return 'success'
        case 'cancelled': return 'error'
        default: return 'info'
      }
    },
    statusInvoice: (data) => {
      switch (data) {
        case 'draft': return 'черновик'
        case 'sent': return 'отправлен'
        case 'partially_paid': return 'оплачен частично'
        case 'paid': return 'оплачен'
        default: return ''
      }
    },
    colorStatusInvoice: (data) => {
      switch (data) {
        case 'draft': return 'info'
        case 'sent': return 'error'
        case 'partially_paid': return 'warning'
        case 'paid': return 'success'
        default: return 'info'
      }
    },
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
      if (img?.formats.large) {
        return `${imageUrl}${img.formats.large.url}`
      } else if (img?.formats.medium) {
        return `${imageUrl}${img.formats.medium.url}`
      } else if (img?.formats.small) {
        return `${imageUrl}${img.formats.small.url}`
      } else {
        return `${imageUrl}${img.url}`
      }
    }
  }
}