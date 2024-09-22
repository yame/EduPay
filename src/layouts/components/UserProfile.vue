<script setup lang="ts">
import websocketService from "@/services/websocketService";
import { useAuthStore } from "@/store/useAuthStore";
import { useStudentStore } from "@/store/useStudentStore";
import { PerfectScrollbar } from "vue3-perfect-scrollbar";

const router = useRouter();
const ability = useAbility();

// TODO: Get type from backend
const authStore = useAuthStore();
const { accessToken } = storeToRefs(authStore);
const { setCurrentUser, setToken, getUserData, logout } = authStore;
getUserData()
const currentUser = ref(useCookie('userData').value)
const route = useRoute();

const toCamelCase = (part: string) => {
  return part.charAt(0).toUpperCase() + part.slice(1);
}


//  "departmentName": "PHYSICS",
//     "firstName": "Hamza",
//     "lastName": "Damiri",
//     "roles": "ROLE_ADMIN ROLE_STUDENT",
//     "email": "hamza@damiri.com"
const transformObject = (original) => {
  // Split the email to get the name part
  const emailParts = original.sub.split('@');

  // Capitalize the first letter of each part of the name
  const firstNamePart = toCamelCase(emailParts[0]);
  const lastNamePart = toCamelCase(emailParts[1].split('.')[0]);
  const nameParts = firstNamePart + ' ' + lastNamePart
  return {
    fullName: nameParts,
    email: original.sub,
    role: original.scope.includes('ROLE_ADMIN') ? "ADMIN" : "STUDENT"
  };
}

const userData = transformObject(currentUser.value)
useStudentStore().currentEmail = userData.email

const loading = ref(false)
const deconnecter = async () => {

  loading.value = true

  logout().then(() =>
    loading.value = false
  ).then(() => {
    router.push('/login').then(() => {
      setCurrentUser(null);
      useCookie("userData").value = null;
      // ℹ️ We had to remove abilities in then block because if we don't nav menu items mutation is visible while redirecting user to login page
      // Remove "userAbilities" from cookie
      useCookie("userAbilityRules").value = null;

      // Reset ability to initial ability
      ability.update([]);
      setToken(null);
      useCookie('accessToken').value = null;
      websocketService.disconnect()
    })
  })
};



const resolveUserRoleVariant = (role: string) => {
  if (role === 'ADMIN')
    return { color: 'info', icon: 'tabler-crown' }
  if (role === 'STUDENT')
    return { color: 'warning', icon: 'tabler-school' }
  return { color: 'primary', icon: 'tabler-user' }
}


const userProfileList = [
  { type: "divider" },
  {
    type: "navItem",
    icon: "tabler-user",
    title: "Profile",
    to: { name: "profile" },
  },
  {
    type: "navItem",
    icon: "tabler-settings",
    title: "Change Password",
    to: { name: "change-password" },
  },
];



</script>

<template>
  <VBadge v-if="userData" dot bordered location="bottom right" offset-x="1" offset-y="2" color="success">
    <VAvatar :color=" (userData)  ? resolveUserRoleVariant(userData?.role)?.color : undefined">
      <VIcon :icon=" (userData)  ? resolveUserRoleVariant(userData?.role)?.icon : undefined" />

      <!-- SECTION Menu -->
      <VMenu activator="parent" width="240" location="bottom end" offset="12px">
        <VList>
          <VListItem>
            <div class="d-flex gap-2 align-center">
              <VListItemAction>
                <VBadge dot location="bottom right" offset-x="3" offset-y="3" color="success" bordered>
                  <VAvatar :icon="resolveUserRoleVariant(userData?.role)?.icon" :color="resolveUserRoleVariant(userData?.role)?.color" />
                </VBadge>
              </VListItemAction>

              <div>
                <h6 class="text-h6 font-weight-medium">
                  {{ userData?.fullName }}
                </h6>
                <VListItemSubtitle class="text-capitalize text-disabled">
                  {{ userData?.role }}
                </VListItemSubtitle>
              </div>
            </div>
          </VListItem>

          <PerfectScrollbar :options="{ wheelPropagation: false }">
            <template v-for="item in userProfileList" :key="item.title">
              <VListItem v-if="item.type === 'navItem'" :to="item.to">
                <template #prepend>
                  <VIcon :icon="item.icon" size="22" />
                </template>

                <VListItemTitle>{{ item.title }}</VListItemTitle>
              </VListItem>

              <VDivider v-else class="my-2" />
            </template>

            <div class="px-4 py-2">
              <VBtn block size="small" color="error" append-icon="tabler-logout" :loading="loading" @click="deconnecter">
                Logout
              </VBtn>
            </div>
          </PerfectScrollbar>
        </VList>
      </VMenu>
      <!-- !SECTION -->
    </VAvatar>
  </VBadge>
</template>
