export default () => {
  return {
    menuMain: [{
      name: 'Склад',
      to: '/app/stock',
      img: '/img/stock.png'
    },{
      name: 'Инвойсы',
      to: '/app/invoices',
      img: '/img/invoice.png'
    },{
      name: 'Заказы',
      to: '/app/orders',
      img: '/img/order.png'
    },{
      name: 'Клиенты',
      to: '/app/customers',
      img: '/img/customer.png'
    },{
      name: 'Заметки',
      to: '/app/comments',
      img: null
    }]
  }
}