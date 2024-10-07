<script setup lang="ts">
import { useAuthStore } from "@/store/useAuthStore";
import { useNotificationStore } from "@/store/useNotificationStore";
import { useStatisticsStore } from "@/store/useStatisticsStore";
import { PerfectScrollbar } from "vue3-perfect-scrollbar";

const router = useRouter();
const route = useRoute();
const ability = useAbility();

// TODO: Get DATA from backend
const authStore = useAuthStore();

const { setCurrentUser, setToken, setUserAbilityRules, logout } = authStore;
const { currentUser } = storeToRefs(authStore);

// const userData = useCookie<any>('userData')

const loading = ref(false)

const instance = getCurrentInstance()
const resetCookies = async () => {

  useCookie('accessToken').value = null;
  useCookie('userData').value = null;
  setCurrentUser(undefined)
  setToken(null)
  authStore.ws_state = null
  instance?.appContext.config.globalProperties.$disconnectWebSocket()

  //👉 - Redirect to login Page
  await router.push('/login')

  // ℹ️ We had to remove abilities in then block because if we don't nav menu items mutation is visible while redirecting user to login page
  // Remove "userAbilities" from cookie
  setUserAbilityRules(null)
  useCookie('userAbilityRules').value = null
  // Reset ability to initial ability
  ability.update([])
  // getCurrentInstance()?.appContext.config.globalProperties.$disconnectWebSocket()
}

const deconnecter = async () => {
  loading.value = true
  logout().then(() => {
    resetCookies()
    useStatisticsStore().isDataFetched = false
    useNotificationStore().notificationsList = []
  }
  ).finally(() => loading.value = false)
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
  <VBadge v-if="currentUser" dot bordered location="bottom right" offset-x="1" offset-y="2" color="success">
    <VAvatar :color=" (currentUser)  ? resolveUserRoleVariant(currentUser?.role)?.color : undefined">
      <VIcon :icon=" (currentUser)  ? resolveUserRoleVariant(currentUser?.role)?.icon : undefined" />

      <!-- SECTION Menu -->
      <VMenu activator="parent" width="240" location="bottom end" offset="12px">
        <VList class="pa-0">
          <VListItem>
            <div class="d-flex  gap-1 align-center">
              <div>
                <VListItemAction>
                  <VBadge dot location="bottom right" offset-x="3" offset-y="3" color="success" bordered>
                    <VAvatar :icon="resolveUserRoleVariant(currentUser?.role)?.icon" :color="resolveUserRoleVariant(currentUser?.role)?.color" />
                  </VBadge>
                </VListItemAction>
                <VListItemSubtitle class="text-capitalize text-disabled">
                  {{ currentUser?.role }}

                </VListItemSubtitle>
              </div>
              <div class="pa-4">
                <h6 class="text-h6 font-weight-medium">
                  {{ currentUser?.lastName }} {{ currentUser?.firstName }}
                </h6>
                <VChip v-show="currentUser?.role =='ADMIN'" class="text-small" color="info" size="x-small">
                  <VIcon start size="12" icon="tabler-building-skyscraper" />
                  {{ currentUser?.departmentName }}
                </VChip>

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
