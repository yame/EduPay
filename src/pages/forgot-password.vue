<script setup lang="ts">
import { useAuthStore } from '@/store/useAuthStore'
import { useGenerateImageVariant } from '@core/composable/useGenerateImageVariant'
import authV2ForgotPasswordIllustrationDark from '@images/pages/auth-v2-forgot-password-illustration-dark.png'
import authV2ForgotPasswordIllustrationLight from '@images/pages/auth-v2-forgot-password-illustration-light.png'
import authV2MaskDark from '@images/pages/misc-mask-dark.png'
import authV2MaskLight from '@images/pages/misc-mask-light.png'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'
import { VForm } from 'vuetify/components'

const authStore = useAuthStore()
const { resetPasswordToDefault } = authStore
const email = ref('john@doe.com')
const isReset = ref(false)
const refVForm = ref<VForm>()


const authThemeImg = useGenerateImageVariant(authV2ForgotPasswordIllustrationLight, authV2ForgotPasswordIllustrationDark)

const authThemeMask = useGenerateImageVariant(authV2MaskLight, authV2MaskDark)

definePage({
  meta: {
    layout: 'blank',
    unauthenticatedOnly: true,
  },
})


//👉 - Reset Password
const resetPassword = () => {
  refVForm.value?.validate().then(({ valid }) => {
    if (valid) {
      resetPasswordToDefault(email.value).then((res) => {
        isReset.value = true
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
            Forgot Password? 🔒
          </h4>
          <p class="mb-0">
            Enter your email and we'll reset your password to default .
          </p>
        </VCardText>

        <VCardText>
          <VForm v-if="!isReset" ref="refVForm" @submit.prevent="resetPassword">
            <VRow>
              <!-- email -->
              <VCol cols="12">
                <AppTextField v-model="email" :rules="[requiredValidator,emailValidator]" autofocus label="Email" type="email" placeholder="Email" />
              </VCol>

              <!-- Reset link -->
              <VCol cols="12">
                <VBtn block type="submit">
                  Send Reset Link
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
          <div v-else>
            <VCol cols="12">
              <Alert title="Password Reset Confirmation" text="Your password has been successfully reset." type="success" />
            </VCol>
            <VCol cols="12">
              <VBtn block color="primary" @click="router.push('/login')">
                You Can Login from here
              </VBtn>
            </VCol>
          </div>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
</style>
