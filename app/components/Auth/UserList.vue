<script setup>
const client = useStrapiClient()
const currentUser = useStrapiUser()

const users = ref([])
const roles = ref([])
const loading = ref(true)
const error = ref('')
const updatingUserId = ref(null)

const columns = [
  { accessorKey: 'username', header: 'Пользователь' },
  { accessorKey: 'email', header: 'Email', meta: { class: { th: 'text-center', td: 'text-center' }} },
  // { accessorKey: 'role', header: 'Роль', meta: { class: { th: 'text-center', td: 'text-center' }} },
  { accessorKey: 'actions', header: 'Доступ', meta: { class: { th: 'text-right', td: 'text-right' }} }
]

const getRoleLabel = (type) => {
  if (type === 'admin') return 'Администратор'
  if (type === 'manager') return 'Менеджер'
  if (type === 'authenticated') return 'Гость'
  if (type === 'public') return 'Гость'
  return 'Гость'
}

const isManager = (user) => {
  return user.role?.type === 'manager'
}

const loadData = async () => {
  loading.value = true
  error.value = ''
  try {
    users.value = await client('/users?populate=role')
    const rolesRes = await client('/users-permissions/roles')
    roles.value = rolesRes.roles || []
  } catch (e) {
    console.error(e)
    error.value = 'Не удалось загрузить данные. Убедитесь, что у роли Admin в Strapi настроены разрешения.'
  } finally {
    loading.value = false
  }
}

const toggleAccess = async (user) => {
  updatingUserId.value = user.id
  try {
    // Опеределяем целевую роль: если был менеджером — делаем гостем ('authenticated'), и наоборот
    const targetRoleType = isManager(user) ? 'authenticated' : 'manager'
    const targetRole = roles.value.find(r => r.type === targetRoleType)

    if (!targetRole) {
      throw new Error(`Роль ${targetRoleType} не найдена в системе Strapi`)
    }

    await client(`/users/${user.id}`, {
      method: 'PUT',
      body: {
        role: targetRole.id
      }
    })

    user.role = {
      id: targetRole.id,
      name: targetRole.name,
      type: targetRole.type
    }
  } catch (e) {
    console.error(e)
    alert('Не удалось изменить роль пользователя')
  } finally {
    updatingUserId.value = null
  }
}

onMounted(() => {
  loadData()
})
</script>
<template>
  <UCard>
    <div class="space-y-4">
      <USeparator label="Управление доступом" />

      <div v-if="loading" class="flex justify-center py-4">
        <UIcon name="svg-spinners:180-ring" class="text-2xl text-primary" />
      </div>
      <div v-else-if="error" class="text-red-500 text-sm">
        {{ error }}
      </div>
      <div v-else class="overflow-x-auto">
        <UTable :data="users" :columns="columns">
          <template #email-cell="{ row }">
            <div class="flex flex-col text-gray-500 dark:text-gray-400">
              <span class="text-sm">
                {{ row.original.email }}
              </span>
              <span class="text-xs italic">
                {{ getRoleLabel(row.original.role?.type) }}
              </span>
            </div>
          </template>

          <template #actions-cell="{ row }">
            <div v-if="row.original.id !== currentUser?.id && row.original.role?.type !== 'admin'">
              <USwitch
                :model-value="isManager(row.original)"
                @update:model-value="toggleAccess(row.original)"
                :loading="updatingUserId === row.original.id" 
                :label="isManager(row.original) ? 'Разрешен' : 'Закрыт'" />
            </div>
            <span v-else class="text-xs text-gray-400 dark:text-gray-500 italic">
              {{ row.original.role?.type === 'admin' ? 'Администратор' : '' }}
            </span>
          </template>
        </UTable>
      </div>
    </div>
  </UCard>
</template>