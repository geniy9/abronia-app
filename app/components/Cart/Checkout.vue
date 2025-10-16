<script setup>
import { z } from 'zod'
import { useCartStore } from '@/store/cart'

const cartStore = useCartStore()
const user = useStrapiUser()
const client = useStrapiClient()
const router = useRouter()
const toast = useToast()

const deliveryMethods = ['delivery']; // 'pickup'

const schema = z.object({
  customer_name: z.string().min(3, 'Must be at least 3 characters'),
  customer_phone: z.string().min(10, 'Must be at least 10 characters'),
  customer_email: z.email('Invalid email'),
  delivery_method: z.enum(deliveryMethods),
  shipping_address: z.string().optional(),
}).refine(data => {
  if (data.delivery_method === 'delivery') {
    return data.shipping_address && data.shipping_address.length > 5;
  }
  return true;
}, {
  message: 'Shipping address is required for delivery',
  path: ['shipping_address'],
});

const state = reactive({
  customer_name: undefined,
  customer_phone: undefined,
  customer_email: undefined,
  delivery_method: 'delivery',
  shipping_address: undefined,
})
const loading = ref(false);

onMounted(() => {
  if (user.value) {
    state.customer_name = user.value.username;
    state.customer_phone = user.value.phone; 
    state.customer_email = user.value.email;
    state.shipping_address = user.value.address;
  }
});

async function onSubmit(event) {
  loading.value = true;
  try {
    const { ...formData } = event.data
    const orderPayload = {
      ...formData,
      total_amount: parseFloat(cartStore.totalPrice),
      order_items: cartStore.items.map(item => ({
        productId: item.id,
        productName: item.name,
        quantity: item.quantity,
        price: item.price,
        package: item.package,
        sku: item.sku,
      })),
      order_status: 'new',
    };
    if (user.value) {
      orderPayload.user = {
        connect: [user.value.documentId]
      }
    }
    await client('/orders', {
      method: 'POST',
      body: { data: orderPayload }
    })

    toast.add({ 
      title: 'order_placed_success', 
      color: 'success', 
      icon: 'i-heroicons-check-circle'
    });
    cartStore.clearCart()
    router.push(user.value ? '/auth/profile' : '/')

  } catch (e) {
    toast.add({ 
      title: 'order_placed_error', 
      description: 'Please try again.', 
      color: 'error', 
      icon: 'i-heroicons-x-circle'
    })
  } finally {
    loading.value = false;
  }
}

const isDisabled = computed(() => {
  return !state.customer_name || 
    !state.customer_phone || 
    !state.customer_email 
})
</script>
<template>
  <UCard>
    <template #header>
      <h2 class="text-2xl text-white font-bold">
        Оформление заказа
      </h2>
    </template>

    <UForm :schema="schema" :state="state" class="space-y-3" @submit.prevent="onSubmit">
      <UFormField label="Клиент" name="customer_name" required>
        <UInput v-model="state.customer_name" class="w-xs" />
      </UFormField>
      <UFormField label="Телефон клиента" name="customer_phone" required>
        <UInput v-model="state.customer_phone" type="tel" class="w-xs" />
      </UFormField>
      <UFormField label="Email" name="customer_email" required>
        <UInput v-model="state.customer_email" class="w-xs" />
      </UFormField>

      <UFormField :label="'text.delivery_method'" name="delivery_method" required>
        <URadioGroup 
          v-model="state.delivery_method" 
          :items="deliveryMethods.map(m => ({ value: m, label: m }))" />
      </UFormField>

      <UFormField 
        v-if="state.delivery_method === 'delivery'"
        :label="'text.shipping_address'" 
        name="shipping_address" 
        required>
        <UTextarea v-model="state.shipping_address" autoresize class="w-full" />
      </UFormField>

      <div v-else class="text-sm p-3 bg-gray-50 rounded-md">
        <p>{{ 'text.pickup_info' }}: </p>
        <p class="font-medium">{{ 'text.full_address' }}</p>
      </div>

      <UButton 
        type="submit" 
        block size="lg" 
        :disabled="isDisabled" 
        :color="isDisabled ? 'neutral' : 'secondary'"
        :loading="loading" 
        class="cursor-pointer">
        Создать заказ
        <!-- - ${{ cartStore.totalPrice }} -->
      </UButton>
      
    </UForm>
  </UCard>
</template>