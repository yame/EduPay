import type { RouteRecordRaw } from 'vue-router/auto';


// 👉 Redirects
export const redirects: RouteRecordRaw[] = [
  // ℹ️ We are redirecting to different pages based on role.
  // NOTE: Role is just for UI purposes. ACL is based on abilities.
  {
    path: '/',
    name: 'index',
    redirect: to => {
      // TODO: Get type from backend
      const userData = (useCookie('userData').value)
      const userRole = userData?.role
      console.log("🚩THE ADDITIONAL ROUTES got a userRole 😍 🚩 => ", userRole);

      watch(() => userRole, (role) => {
        console.error(role);

      })

      if (userRole === "ADMIN")
        return { name: 'root' }
      else if (userRole === "STUDENT")
        return { name: 'student-payments-student' }
      else
        return { name: 'login' }
    },
  },
  {
    path: '/profile',
    name: 'profile',
    redirect: () => ({ name: 'profile' }),
  },
  {
    path: '/change-password',
    name: 'change-password',
    redirect: () => ({ name: 'change-password' }),
  },


]

