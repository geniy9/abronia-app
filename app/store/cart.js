import { defineStore } from 'pinia'
import { useToast } from '#imports'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [], 
  }),

  getters: {

    totalItems: (state) => {
      return state.items.reduce((total, item) => total + item.quantity, 0)
    },

    totalPrice: (state) => {
      return state.items.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)
    },

    isInCart: (state) => (productId) => {
      return state.items.some(item => item.id === productId)
    }
  },

  actions: {

    addItem(product, quantity = 1) {
      const toast = useToast()
      const existingItem = this.items.find(item => item.id === product.id)

      if (existingItem) {
        existingItem.quantity += quantity
      } else {
        this.items.push({
          id: product.id,
          name: product.name,
          price: product.price,
          sku: product.sku,
          quantity: quantity,
        })
      }
      toast.add({ title: 'Товар добавлен в заказ', color: 'success', icon: 'i-heroicons-check-circle' })
    },

    updateQuantity(productId, quantity) {
      const item = this.items.find(item => item.id === productId)
      if (item) {
        if (quantity > 0) {
          item.quantity = quantity
        } else {
          this.removeItem(productId)
        }
      }
    },

    removeItem(productId) {
      const toast = useToast()
      this.items = this.items.filter(item => item.id !== productId)
      toast.add({ 
        title: 'Товар удален из заказа', 
        color: 'error', 
        icon: 'i-heroicons-x-circle'
      })
    },

    clearCart() {
      this.items = []
    },
  },

  persist: true,
})