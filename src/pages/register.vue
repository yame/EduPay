<script setup lang="ts">
import { VForm } from 'vuetify/components/VForm'

import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'

import { DtoNewStudent, PROGRAM, PROGRAM_ITEMS } from '@/@core/types'
import { useAuthStore } from '@/store/useAuthStore'
import authV2RegisterIllustrationBorderedDark from '@images/pages/auth-v2-register-illustration-bordered-dark.png'
import authV2RegisterIllustrationBorderedLight from '@images/pages/auth-v2-register-illustration-bordered-light.png'
import authV2RegisterIllustrationDark from '@images/pages/auth-v2-register-illustration-dark.png'
import authV2RegisterIllustrationLight from '@images/pages/auth-v2-register-illustration-light.png'
import authV2MaskDark from '@images/pages/misc-mask-dark.png'
import authV2MaskLight from '@images/pages/misc-mask-light.png'

const imageVariant = useGenerateImageVariant(authV2RegisterIllustrationLight,
  authV2RegisterIllustrationDark,
  authV2RegisterIllustrationBorderedLight,
  authV2RegisterIllustrationBorderedDark, true)
const authThemeMask = useGenerateImageVariant(authV2MaskLight, authV2MaskDark)

definePage({
  meta: {
    layout: 'blank',
    unauthenticatedOnly: true,
  },
})

const authStore = useAuthStore()
const { register } = authStore

const form = ref<DtoNewStudent>({
  code: '',
  email: '',
  firstName: '',
  lastName: '',
  programID: PROGRAM.SMI
})

const refVForm = ref<VForm>()
const router = useRouter()
const loading = ref(false);
const isRegistred = ref(false)
const msgRegistration = ref(null)

const onSubmit = () => {
  refVForm.value?.validate().then(({ valid }) => {
    if (valid) {
      loading.value = true
      try {
        console.table(form.value)
        register(form.value).then((res) => {
          msgRegistration.value = res.data.value
          console.log(msgRegistration.value);
          loading.value = false
          isRegistred.value = true
          // router.push('/login')
        })
      } catch (error) {
        console.log(error);

      }

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

  <VRow no-gutters class="auth-wrapper bg-surface">
    <VCol md="8" class="d-none d-md-flex">
      <div class="position-relative bg-background w-100 me-0">
        <div class="d-flex align-center justify-center w-100 h-100" style="padding-inline: 100px;">
          <VImg max-width="500" :src="imageVariant" class="auth-illustration mt-16 mb-2" />
        </div>

        <img class="auth-footer-mask" :src="authThemeMask" alt="auth-footer-mask" height="280" width="100">
      </div>
    </VCol>

    <VCol cols="12" md="4" class="auth-card-v2 d-flex align-center justify-center" style="background-color: rgb(var(--v-theme-surface));">
      <VCard flat :max-width="500" class="mt-12 mt-sm-0 pa-4">
        <VCardText>
          <h4 class="text-h4 mb-1">
            Create an Account ✍️
          </h4>
          <p class="mb-0">
            Register to simplify your app management.
          </p>
        </VCardText>

        <VCardText>
          <VForm v-if="!isRegistred" ref="refVForm" @submit.prevent="onSubmit">
            <VRow>
              <!-- email -->
              <VCol cols="12">
                <AppTextField v-model="form.email" :rules="[requiredValidator, emailValidator]" label="Email" type="email" placeholder="Email" />
              </VCol>
              <!-- FirstName -->
              <VCol cols="12">
                <AppTextField v-model="form.code" :rules="[requiredValidator,studentCodeValidator]" label="Student Code" placeholder="Student Code" />
              </VCol>
              <!-- LastName -->
              <VCol cols="12">
                <AppTextField v-model="form.lastName" :rules="[requiredValidator]" label="LastName" placeholder="LastName" />
              </VCol>

              <!-- LastName -->
              <VCol cols="12">
                <AppTextField v-model="form.firstName" :rules="[requiredValidator]" label="FirstName" placeholder="FirstName" />

              </VCol>

              <VCol cols="12">
                <AppAutocomplete v-model="form.programID" label="States" :items="PROGRAM_ITEMS" :rules="[requiredValidator]" placeholder="Your program" chips closable-chips />

              </VCol>
              <VCol cols="12">

                <VBtn block type="submit" :loading="loading">
                  Register
                </VBtn>
              </VCol>
              <VDivider class="my-3" />

              <!-- create account -->
              <VCol cols="12" class="text-center text-base">
                <span>Already have an account?</span>
                <RouterLink class="text-secondary ms-1  font-weight-bold" :to="{ name: 'login' }">
                  <li>Sign in instead</li>
                </RouterLink>
              </VCol>

            </VRow>
          </VForm>
          <div v-else>
            <VCol cols="12">
              <Alert :title="msgRegistration" text="Registration successful! Your account is under review. You'll receive an email once it's approved and ready for login." type="success" />
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

<style lang="scss" scoped>
@use "@core/scss/template/pages/page-auth.scss";
::v-deep(.text-secondary:hover) {
  color: rgb(var(--v-theme-primary)) !important;
}
</style>
