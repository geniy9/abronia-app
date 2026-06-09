<script setup>
const { getRoleLabel, getRoleColor } = useConfig()
const client = useStrapiClient()
const currentUser = useStrapiUser()

const users = ref([])
const roles = ref([])
const loading = ref(true)
const error = ref('')
const updatingUserId = ref(null)

const columns = [
  { accessorKey: 'username', header: 'Пользователь' },
  { accessorKey: 'actions', header: 'Доступ', meta: { 
    class: { th: 'text-right', td: 'text-right justify-end' }} 
  }
]
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
    error.value = 'Не удалось загрузить данные. Убедитесь, что Администратора настроены разрешения.'
  } finally {
    loading.value = false
  }
}

const toggleAccess = async (user) => {
  updatingUserId.value = user.id
  try {
    const targetRoleType = isManager(user) ? 'authenticated' : 'manager'
    const targetRole = roles.value.find(r => r.type === targetRoleType)
    if (!targetRole) {
      throw new Error(`Роль ${targetRoleType} не найдена в системе Strapi`)
    }
    await client(`/users/${user.id}`, {
      method: 'PUT',
      body: { role: targetRole.id }
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
onMounted(() => { loadData() })
</script>
<template>
  <div>
    <USeparator label="Управление доступом" class="mb-2" />
    <UCard>
      <div v-if="loading" class="flex justify-center py-4">
        <UIcon name="svg-spinners:180-ring" class="text-2xl text-primary" />
      </div>
      <div v-else-if="error" class="text-red-500 text-sm">
        {{ error }}
      </div>
      <div v-else class="overflow-x-auto">
        <UTable :data="users" :columns="columns">
          <template #username-cell="{ row }">
            <div class="flex flex-col items-start gap-1">
              <span class="text-sm font-bold text-gray-700 dark:text-gray-300">
                {{ row.original.username }}
              </span>
              <span class="text-sm text-gray-600 dark:text-gray-400">
                {{ row.original.email }}
              </span>
              <UBadge variant="soft" size="sm" :color="getRoleColor(row.original.role?.type)">
                {{ getRoleLabel(row.original.role?.type) }}
              </UBadge>
            </div>
          </template>
          <template #actions-cell="{ row }">
            <div v-if="row.original.id !== currentUser?.id && row.original.role?.type !== 'admin'" class="flex justify-end">
              <USwitch
                :model-value="isManager(row.original)"
                @update:model-value="toggleAccess(row.original)"
                :loading="updatingUserId === row.original.id" 
                :label="isManager(row.original) ? 'Разрешен' : 'Закрыт'" 
                :ui="{ root: 'items-end flex-col gap-1' }"/>
            </div>
            <span v-else class="text-xs text-gray-500 dark:text-gray-500 italic">
              {{ row.original.role?.type === 'admin' ? 'Администратор' : '' }}
            </span>
          </template>
        </UTable>
      </div>
    </UCard>
  </div>
</template>