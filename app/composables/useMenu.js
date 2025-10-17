export default () => {
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
    }]
  }
}