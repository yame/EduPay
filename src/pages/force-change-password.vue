<script setup lang="ts">
import { useGenerateImageVariant } from '@core/composable/useGenerateImageVariant'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'

import { ChangePWDTO } from "@/@core/types"
import { useAuthStore } from "@/store/useAuthStore"
import authV2ForgotPasswordIllustrationDark from '@images/pages/auth-v2-forgot-password-illustration-dark.png'
import authV2ForgotPasswordIllustrationLight from '@images/pages/auth-v2-forgot-password-illustration-light.png'
import authV2MaskDark from '@images/pages/misc-mask-dark.png'
import authV2MaskLight from '@images/pages/misc-mask-light.png'
import { toast } from 'vue3-toastify'
import { VForm } from "vuetify/components/VForm"

const authThemeImg = useGenerateImageVariant(authV2ForgotPasswordIllustrationLight, authV2ForgotPasswordIllustrationDark)

const authThemeMask = useGenerateImageVariant(authV2MaskLight, authV2MaskDark)

definePage({
  meta: {
    layout: "blank",
    unauthenticatedOnly: true
  },
});


const refVForm = ref<VForm>()


const isCurrentPasswordVisible = ref(false)
const isNewPasswordVisible = ref(false)
const isConfirmPasswordVisible = ref(false)


const confirmPassword = ref('')
const changePWDTO = ref<ChangePWDTO>({
  oldPassword: "",
  newPassword: ""
})

const router = useRouter()
const route = useRoute()
const ability = useAbility();

const errors = ref<Record<string, string | undefined>>({
  email: undefined,
  password: undefined,
});
const credentials = ref({
  email: "",
  password: "",
});
const authStore = useAuthStore();
const { login, changePassword } = authStore;
const { error, currentUser, userAbilityRules, accessToken } = storeToRefs(authStore);

const loader = ref(false)

const LogIn = async () => {
  try {
    loader.value = true
    //👉 -  Fetch user data
    console.table(credentials.value);

    await login(credentials.value);

    //👉 -  Update Cookies for each User
    useCookie('accessToken').value = accessToken.value;
    useCookie('userData').value = currentUser.value ? JSON.stringify(currentUser.value) : null;
    useCookie('userAbilityRules').value = userAbilityRules.value ? JSON.stringify(userAbilityRules.value) : null;
    ability.update(userAbilityRules.value || []);

    //👉 -  Redirect  
    await nextTick(() => {
      router.push(route.query.to ? String(route.query.to) : "/").then(() => {
        toast.success('Login successful ✅⚡', {
          theme: useCookie('EduPayment-theme').value || 'auto'
        })
      })
    })
  } catch (err) {
    console.error(err);
  }
  finally {
    loader.value = false
  }
}


//👉 - Change Password
const updatePassword = () => {
  refVForm.value?.validate().then(({ valid }) => {
    if (valid) {

      if (confirmPassword.value == changePWDTO.value.newPassword)
        changePassword(changePWDTO.value).then(() => {
          credentials.value.email = currentUser.value?.email
          credentials.value.password = changePWDTO.value.newPassword
          LogIn()
        })
    }
  })
}

</script>

<template>
  <RouterLink to="/">
    <div class="auth-logo d-flex align-center gap-x-3">
      <VNodeRenderer :nodes="themeConfig.app.logo" />
      <h1 class="auth-title">
        {{ themeConfig.app.title }}
      </h1>
    </div>
  </RouterLink>

  <VRow class="auth-wrapper bg-surface" no-gutters>
    <VCol md="8" class="d-none d-md-flex">
      <div class="position-relative bg-background w-100 me-0">
        <div class="d-flex align-center justify-center w-100 h-100" style="padding-inline: 150px;">
          <VImg max-width="468" :src="authThemeImg" class="auth-illustration mt-16 mb-2" />
        </div>

        <img class="auth-footer-mask" :src="authThemeMask" alt="auth-footer-mask" height="280" width="100">
      </div>
    </VCol>

    <VCol cols="12" md="4" class="d-flex align-center justify-center">
      <VCard flat :max-width="500" class="mt-12 mt-sm-0 pa-4">
        <VCardText>
          <h4 class="text-h4 mb-1">
            Change Password first to enter our app? 🔒
          </h4>
          <p class="mb-0">
            Change It!!!
          </p>
        </VCardText>

        <VCardText>
          <VForm ref="refVForm" @submit.prevent="updatePassword">
            <VRow>
              <!-- email -->
              <VCol cols="12">
                <!-- 👉 current password -->
                {{ changePWDTO.oldPassword }}
                <AppTextField v-model="changePWDTO.oldPassword" :type="isCurrentPasswordVisible ? 'text' : 'password'" :append-inner-icon="isCurrentPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'" label="Current Password" autocomplete="on" placeholder="Current Password" @click:append-inner="isCurrentPasswordVisible = !isCurrentPasswordVisible" :rules="[requiredValidator]" />
              </VCol>

              <VCol cols="12">
                <!-- 👉 new password -->
                {{changePWDTO.newPassword}}
                <AppTextField v-model="changePWDTO.newPassword" :type="isNewPasswordVisible ? 'text' : 'password'" :append-inner-icon="isNewPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'" label="New Password" autocomplete="on" placeholder="New Password" @click:append-inner="isNewPasswordVisible = !isNewPasswordVisible" :rules="[requiredValidator]" />
              </VCol>

              <VCol cols="12">
                <!-- 👉 confirm password -->
                <AppTextField v-model="confirmPassword" :type="isConfirmPasswordVisible ? 'text' : 'password'" :append-inner-icon="isConfirmPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'" label="Confirm New Password" autocomplete="on" placeholder="Confirm New Password" @click:append-inner="isConfirmPasswordVisible = !isConfirmPasswordVisible" :rules="[requiredValidator]" />
              </VCol>
              <!-- Reset link -->
              <VCol cols="12">
                <VBtn block type="submit" :loading="loader">
                  Enter to our App
                </VBtn>
              </VCol>

              <!-- back to login -->
              <VCol cols="12">
                <RouterLink class="d-flex align-center justify-center" :to="{ name: 'login' }">
                  <VIcon icon="tabler-chevron-left" size="20" class="me-1 flip-in-rtl" />
                  <span>Back to login</span>
                </RouterLink>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
</style>
