export default () => {
  const runtimeConfig = useRuntimeConfig()
  const baseURL = runtimeConfig.app.baseURL
  return {
    menuMain: [{
      name: 'Склад',
      to: '/stock',
      img: `${baseURL}/img/stock.png`
    },{
      name: 'Инвойсы',
      to: '/invoices',
      img: `${baseURL}/img/invoice.png`
    },{
      name: 'Заказы',
      to: '/orders',
      img: `${baseURL}/img/order.png`
    },{
      name: 'Клиенты',
      to: '/customers',
      img: `${baseURL}/img/customer.png`
    },{
      name: 'Заметки',
      to: '/comments',
      img: null
    }],
    menuAdding: [
      [{
        label: 'Новый Товар',
        icon: 'hugeicons:package-add',
        to: '/stock#add'
      },{
        label: 'Создать Заказ',
        icon: 'hugeicons:shopping-basket-add-03',
        to: '/orders#add'
      },{
        label: 'Создать Инвойс',
        icon: 'hugeicons:add-invoice',
        to: '/invoices#add'
      }],
      [{
        label: 'Добавить Клиента',
        icon: 'hugeicons:user-add-02',
        to: '/customers#add'
      }],
      [{
        label: 'Добавить Заметку',
        icon: 'hugeicons:message-add-01',
        to: '/comments#add'
      }]
    ]
  }
}