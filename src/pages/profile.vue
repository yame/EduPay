<script setup lang="ts">
import { useAuthStore } from "@/store/useAuthStore";



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


// const transformObject = (original) => {
//   // Split the email to get the name part
//   const emailParts = original.sub.split('@');

//   // Capitalize the first letter of each part of the name
//   const firstNamePart = toCamelCase(emailParts[0]);
//   const lastNamePart = toCamelCase(emailParts[1].split('.')[0]);
//   const nameParts = firstNamePart + ' ' + lastNamePart
//   return {
//     fullName: nameParts,
//     email: original.sub,
//     role: original.scope.includes('ROLE_ADMIN') ? "ADMIN" : "STUDENT" // Remove 'ROLE_' prefix and capitalize
//   };
// }

// const userData = transformObject(useCookie('userData').value)


const authStore = useAuthStore();
const { logout, setToken, setCurrentUser, setUserAbilityRules } = authStore
const { loading } = storeToRefs(authStore);
const instance = getCurrentInstance()
const ability = useAbility();
const router = useRouter();
const userData = useCookie('userData').value

//👉 - Log Out 
const resetCookies = async () => {
  setCurrentUser(null)
  setToken(null)
  setUserAbilityRules(null)
  useCookie('accessToken').value = null;
  useCookie("userData").value = null;
  await router.push('/login')
  // ℹ️ We had to remove abilities in then block because if we don't nav menu items mutation is visible while redirecting user to login page  
  useCookie("userAbilityRules").value = null;
  ability.update([]);
  instance?.appContext.config.globalProperties.$disconnectWebSocket();
  authStore.ws_state = null

  // getCurrentInstance()?.appContext.config.globalProperties.$disconnectWebSocket()
}

const deconnect = async () => {
  loading.value = true

  logout().then(() => setTimeout(() => {
    loading.value = false
  }, 1000)).then(() => {
    resetCookies();
  })
}


</script>

<template>
  <VRow>
    <!-- SECTION User Details -->
    <VCol cols="12">
      <VCard v-if="userData">
        <div>
          <VCardText class="text-center pt-12">
            <!-- 👉 Avatar -->
            <VAvatar rounded :size="100" variant="outlined" :color="(userData) ? resolveUserRoleVariant(userData?.role)?.color : undefined" :icon="(userData) ? resolveUserRoleVariant(userData?.role)?.icon : undefined" />

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
                  <h6 class="text-h6">
                    Username:
                    <div class="d-inline-block text-body-1">
                      {{ userData?.fullName }}
                    </div>
                  </h6>
                </VListItemTitle>
              </VListItem>

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
                  <h6 class="text-h6">
                    Role:
                    <div class="d-inline-block text-capitalize text-body-1">
                      {{ userData?.role }}
                    </div>
                  </h6>
                </VListItemTitle>
              </VListItem>

              <VListItem>
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
          <VBtn variant="elevated">
            Edit
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
