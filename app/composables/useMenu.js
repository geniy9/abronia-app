export default () => {
  return {
    menuMain: [{
      name: 'Склад',
      to: '/stock',
      img: '/img/stock.png'
    },{
      name: 'Инвойсы',
      to: '/invoices',
      img: '/img/invoice.png'
    },{
      name: 'Заказы',
      to: '/orders',
      img: '/img/order.png'
    },{
      name: 'Клиенты',
      to: '/customers',
      img: '/img/customer.png'
    },{
      name: 'Заметки',
      to: '/comments',
      img: null
    }]
  }
}