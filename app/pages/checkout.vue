<script setup>
import { useCartStore } from '@/store/cart'

definePageMeta({
  middleware: 'auth'
})

const cartStore = useCartStore()
// const router = useRouter()

// onMounted(() => {
//   if (cartStore.items.length === 0) {
//     router.replace('/home');
//   }
// });
</script>
<template>
  <div class="body_layout">
    <div v-if="cartStore.items.length > 0" class="max-w-md mx-auto">
      <ClientOnly>
        <CartCheckout />
      </ClientOnly>
    </div>
  </div>
</template>