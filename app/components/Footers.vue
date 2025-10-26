<script setup>
const { menuAdding } = useMenu()

const router = useRouter()
const route = useRoute()
const hideFooter = computed(() => {
  const routeMeta = route.meta
  return routeMeta.hideFooter || false
})

function backStep() {
  if (route.path === '/home') {
    return 
  } else {
    router.go(-1)
  }
}
</script>
<template>
  <footer class="fixed bottom-0 w-full bg-primary rounded-t-2xl p-3 transition-all duration-300" 
    :class="[hideFooter ? 'rounded-t-none translate-y-full' : 'rounded-t-2xl translate-y-0']">
    <div class="section grid grid-cols-3 items-center text-white gap-4">

      <UIcon name="hugeicons:link-backward" 
        @click="backStep" 
        class="text-3xl cursor-pointer" />

      <NuxtLink to="/home" class="flex items-center justify-center">
        <UIcon name="hugeicons:dashboard-square-01" class="text-3xl cursor-pointer" />
      </NuxtLink>

      <div class="flex justify-end">
        <UDropdownMenu :items="menuAdding" arrow>
          <UIcon name="hugeicons:add-01" class="text-3xl cursor-pointer" />
        </UDropdownMenu>
      </div>

    </div>
  </footer>
</template>