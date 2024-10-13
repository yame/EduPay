<script setup lang="ts">
import { useAuthStore } from "@/store/useAuthStore";
import { useNotificationStore } from "@/store/useNotificationStore";
import { useStatisticsStore } from "@/store/useStatisticsStore";
import { useAbility } from '@casl/vue';
import { getCurrentInstance, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { PerfectScrollbar } from "vue3-perfect-scrollbar";

const router = useRouter();
const route = useRoute();
const ability = useAbility();
const authStore = useAuthStore();
const notificationStore = useNotificationStore();
const statisticsStore = useStatisticsStore();

const { setCurrentUser, setToken, setUserAbilityRules, logout } = authStore;
const { currentUser } = storeToRefs(authStore);
const loading = ref(false);
const instance = getCurrentInstance();


const userData = useCookie<any>('userData')
console.table(userData);

// watch(() => currentUser.value, (newUser) => {
//   console.log("Current User: ", newUser);
// });

const resetCookies = async () => {
  useCookie('accessToken').value = null;
  useCookie('userData').value = null;
  setCurrentUser(undefined);
  setToken(null);
  authStore.ws_state = null;

  await instance?.appContext.config.globalProperties.$disconnectWebSocket();
  statisticsStore.isDataFetched = true;
  statisticsStore.statisticsBarCharData = undefined
  statisticsStore.statisticsPolarAreaCharData = undefined
  notificationStore.notificationsList = [];
};

const disconnectUser = async () => {
  loading.value = true;
  try {
    await logout();
    await resetCookies();
    await router.push('/login')
    setUserAbilityRules(null)
    useCookie('userAbilityRules').value = null;
    ability.update([]);
    // authStore.$reset()
  } catch (error) {
    console.error("Logout Error: ", error);
  } finally {
    loading.value = false;
  }
};

const resolveUserRoleVariant = (role: string) => {
  const roleVariants: Record<string, { color: string; icon: string }> = {
    ADMIN: { color: 'info', icon: 'tabler-crown' },
    STUDENT: { color: 'warning', icon: 'tabler-school' },
  };
  return roleVariants[role] || { color: 'primary', icon: 'tabler-user' };
};

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
    <VAvatar :color="(userData) ? resolveUserRoleVariant(userData?.role)?.color : 'undefined'">
      <VIcon :icon="(userData) ? resolveUserRoleVariant(userData?.role)?.icon : 'undefined'" />

      <VMenu activator="parent" width="240" location="bottom end" offset="12px">
        <VList class="pa-0">
          <VListItem>
            <div class="d-flex gap-1 align-center">
              <div>
                <VListItemAction>
                  <VBadge dot location="bottom right" offset-x="3" offset-y="3" color="success" bordered>
                    <VAvatar :icon="(userData) ? resolveUserRoleVariant(userData?.role)?.icon : 'undefined'" :color="(userData) ? resolveUserRoleVariant(userData?.role)?.color : 'undefined'" />
                  </VBadge>
                </VListItemAction>
                <VListItemSubtitle class="text-capitalize text-disabled">
                  {{ userData?.role }}
                </VListItemSubtitle>
              </div>
              <div class="pa-4">
                <h6 class="text-h6 font-weight-medium">
                  {{ userData?.lastName }} {{ userData?.firstName }}
                </h6>
                <VChip v-show="userData?.role === 'ADMIN'" class="text-small" color="info" size="x-small">
                  <VIcon start size="12" icon="tabler-building-skyscraper" />
                  {{ userData?.departmentName }}
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
              <VBtn block size="small" color="error" append-icon="tabler-logout" :loading="loading" @click="disconnectUser">
                Logout
              </VBtn>
            </div>
          </PerfectScrollbar>
        </VList>
      </VMenu>
    </VAvatar>
  </VBadge>
</template>

<style scoped>
/* Add any component-specific styles here */
</style>
