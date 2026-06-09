export default defineNuxtRouteMiddleware((to) => {
  const user = useStrapiUser()

  // Страницы, которые полностью открыты для неавторизованных пользователей
  const publicPaths = ['/', '/auth/login', '/auth/register', '/auth/forgot-password', '/auth/reset-password']
  const targetPath = to.path.replace(/\/$/, '') || '/'

  const isPublic = publicPaths.includes(targetPath)

  // 1. Если пользователь НЕ авторизован и пытается зайти на закрытую страницу
  if (!user.value && !isPublic) {
    return navigateTo('/auth/login')
  }

  // 2. Если пользователь авторизован
  if (user.value) {
    // Гостям (Authenticated) разрешены только главная, хаб и страницы авторизации
    const allowedForGuests = ['/', '/home']
    const isAllowedForGuest = allowedForGuests.includes(targetPath) || targetPath.startsWith('/auth')

    if (!isAllowedForGuest) {
      const userRole = (user.value as any)?.role?.type // 'authenticated', 'manager', 'admin'
      const hasFullAccess = ['manager', 'admin'].includes(userRole)

      if (!hasFullAccess) {
        // Если роль authenticated, отправляем на /home
        return navigateTo('/home')
      }
    }
  }
})