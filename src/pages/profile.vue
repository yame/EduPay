<script setup lang="ts">
import { useAuthStore } from "@/store/useAuthStore";
import { useCounterStore } from "@/store/useCounterStore";
import { useNotificationStore } from "@/store/useNotificationStore";
import { useProfileImgStore } from "@/store/useProfileImgStore";
import { useStatisticsStore } from "@/store/useStatisticsStore";



// 👉 Role variant resolver
const resolveUserRoleVariant = (role: string) => {
  if (role === 'ADMIN')
    return { color: 'info', icon: 'tabler-crown' }
  if (role === 'STUDENT')
    return { color: 'warning', icon: 'tabler-school' }
  return { color: 'primary', icon: 'tabler-user' }
}


const toCamelCase = (part: string) => {
  return part.charAt(0).toUpperCase() + part.slice(1);
}

definePage({
  meta: {
    action: 'manage',
    subject: 'STUDENT'
  }
})



const authStore = useAuthStore();
const { logout, setToken, setCurrentUser, setUserAbilityRules } = authStore
const { loading } = storeToRefs(authStore);
const instance = getCurrentInstance()
const ability = useAbility();
const router = useRouter();
const route = useRoute();
const userData = useCookie<any>('userData')

//👉 - Log Out 
const resetCookies = async () => {
  // Reset states, cookies, and tokens
  setCurrentUser(undefined);
  setToken(null);
  useCookie('accessToken').value = null;
  userData.value = null;
  authStore.ws_state = null;

  // Disconnect WebSocket if applicable
  instance?.appContext.config.globalProperties.$disconnectWebSocket();

  // Clear counter store (ensure this happens before redirect)
  useCounterStore().clear();
  useAuthStore().$reset();
  // Reset abilities and clean up user ability rules
  setUserAbilityRules([]);
  useCookie('userAbilityRules').value = null;
  ability.update([]);
  profileImgUrl.value = null;
  // Finally, redirect to the login page
  await nextTick(() => {
    router.replace({ name: 'login' })
  })
};


const deconnect = async () => {
  loading.value = true
  logout().then(() => setTimeout(() => {
    loading.value = false
  }, 1000))

  await resetCookies();
  useStatisticsStore().isDataFetched = false
  useNotificationStore().notificationsList = []

}

//👉 - Profile Picture Implementation
const profileImgStore = useProfileImgStore()
const { getProfilePicture, updateProfilePicture } = profileImgStore
const { profileImgUrl } = storeToRefs(profileImgStore)





const imageUrl = ref(null);
const isHovered = ref(false);
const fileInput = ref(null);

const triggerFileInput = () => {
  fileInput.value?.click();
};


const loadProfilePicture = async () => {
  await getProfilePicture(userData.value.email)
  imageUrl.value = profileImgUrl.value!

}

const handleFileChange = (event) => {
  const file = event.target.files[0];
  updateProfilePicture(userData.value?.email, file).then(response => {
    const url = URL.createObjectURL(new Blob([response?.data]));
    imageUrl.value = (url);

  }).then(() => {
    loadProfilePicture()
  })
  // if (file) {
  //   imageUrl.value = URL.createObjectURL(file);
  // }
};


onMounted(() => {
  if (userData.value?.role === 'STUDENT')
    loadProfilePicture()
})



</script>

<template>
  <VRow>
    <!-- SECTION User Details -->
    <VCol cols="12">
      <VCard v-if="userData">
        <div>
          <VCardText class="text-center pt-12">
            <!-- 👉 Avatar -->

            <VAvatar v-if=" userData.role === 'ADMIN'" rounded :size="100" variant="outlined" :color="(userData) ? resolveUserRoleVariant(userData?.role)?.color : undefined" :icon="(userData) ? resolveUserRoleVariant(userData?.role)?.icon : undefined" />

            <div v-if="userData.role === 'STUDENT'" class="profile-pic">
              <v-avatar v-if="profileImgUrl" @mouseenter="isHovered = true" @mouseleave="isHovered = false" :size="'165px'" class="avatar" @click="triggerFileInput">
                <VAvatar :image="profileImgUrl" :size="165" />

                <!-- <img v-if="imageUrl" :src="profileImgUrl" alt="Profile Picture" /> -->
                <input ref="fileInput" type="file" @change="handleFileChange" accept="image/*" style="display: none;" />

                <!-- Custom Icon overlay -->
                <div v-if="isHovered" class="change-icon-overlay">
                  <VIcon class="icon">tabler-camera </VIcon> <b class="text-body">change picture</b> <!-- Use any custom icon -->
                </div>
              </v-avatar>
              <VAvatar v-else rounded variant="outlined" :color="(userData) ? resolveUserRoleVariant(userData?.role)?.color : undefined" :icon="(userData) ? resolveUserRoleVariant(userData?.role)?.icon : undefined" />

            </div>
            <!-- 👉 User fullName -->
            <h5 class="text-h5 mt-4">
              {{ userData?.lastName }} {{ userData?.firstName }}
            </h5>

            <!-- 👉 Role chip -->
            <VChip label :color="(userData) ? resolveUserRoleVariant(userData?.role)?.color : undefined" class="text-capitalize mt-4">
              <VIcon start :icon="(userData) ? resolveUserRoleVariant(userData?.role)?.icon : undefined" :color="(userData) ? resolveUserRoleVariant(userData?.role)?.color : undefined" />
              {{ userData?.role }}
            </VChip>
          </VCardText>

          <VCardText>
            <!-- 👉 Details -->
            <h5 class="text-h5">
              Details
            </h5>

            <VDivider class="my-4" />

            <!-- 👉 User Details list -->
            <VList class="card-list mt-2">

              <VListItem>
                <VListItemTitle>
                  <span class="text-h6">
                    Email:
                  </span>
                  <span class="text-body-1">
                    {{ userData?.email }}
                  </span>
                </VListItemTitle>
              </VListItem>

              <VListItem>
                <VListItemTitle>
                  <span class="text-h6">
                    Filière:
                  </span>
                  <span class="text-body-1">
                    {{ userData?.programId }}
                  </span>
                </VListItemTitle>
              </VListItem>

              <VListItem>
                <VListItemTitle>
                  <h6 class="text-h6">
                    Role:
                    <div class="d-inline-block text-capitalize text-body-1">
                      {{ userData?.role }}
                    </div>
                  </h6>
                </VListItemTitle>
              </VListItem>

              <VListItem v-if="Object.hasOwn(userData,'departmentName')">
                <VListItemTitle>
                  <h6 class="text-h6">
                    Department Name:
                    <div class="d-inline-block text-capitalize text-body-1">
                      <VChip class="ml-2 text-small" color="info" size="x-small">
                        <VIcon start size="12" icon="tabler-building-skyscraper" />
                        {{ userData?.departmentName }}
                      </VChip>
                    </div>
                  </h6>
                </VListItemTitle>
              </VListItem>

            </VList>
          </VCardText>
        </div>

        <!-- 👉 Edit and Suspend button -->
        <VCardText class="d-flex justify-center gap-x-4">
          <VBtn variant="elevated" color="warning">
            Export Profile

          </VBtn>

          <VBtn variant="tonal" color="error" :loading="loading" @click="deconnect">
            Logout
          </VBtn>
        </VCardText>
      </VCard>
    </VCol>
    <!-- !SECTION -->
  </VRow>
</template>

<style scoped lang="scss">
.profile-pic {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  cursor: pointer;
  color: white;
}

.avatar {
  position: relative;
  color: white;
}

.change-icon-overlay {
  position: absolute;
  bottom: 0px;
  right: 10px;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 40%;
  padding: 11px;
  color: white;
}

.icon {
  font-size: 24px;
  color: white;
}

// ::v-deep(.v-img__img--cover:hover) {
//   transform: translateX(30px);
// }
</style>
