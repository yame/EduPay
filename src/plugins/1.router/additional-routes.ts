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
      const userData = useCookie('userData').value
      const userRole = userData?.role
      console.log("🚩THE ADDITIONAL ROUTES got a userRole 😍 🚩 => ", userRole);

      if (userRole === "ADMIN")
        return { name: 'root' }
      if (userRole === "STUDENT")
        return { name: 'student-payments-student' }
      return { name: 'login', query: to.query }
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

