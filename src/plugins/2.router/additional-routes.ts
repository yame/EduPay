import { useStudentStore } from '@/store/useStudentStore';
import { jwtDecode } from 'jwt-decode';
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

      // console.log(jwtDecode((useCookie('accessToken').value)?.toString()));

      const accessToken = ref<string>(useCookie('accessToken').value)
      const userData = jwtDecode(accessToken.value)
      const roles = ref(userData?.scope.split(' '));
      console.log("😍 user role", roles.value);

      const userRole = ref((roles.value?.includes('ROLE_ADMIN')) ? 'admin' : 'student')
      console.log("😍 user role", userRole.value);
      const studentStore = useStudentStore();
      studentStore.setCurrentStudentEmail(userData?.sub);
      if (userRole.value === 'admin')
        return { name: 'root' }
      if (userRole.value === 'student')
        return { name: 'student-payments-student' }
      if (to.meta.public)
        return
    },
  },

]

export const routes: RouteRecordRaw[] = [
]
