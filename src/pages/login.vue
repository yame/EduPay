<script setup lang="ts">
import { useAuthStore } from "@/store/useAuthStore";
import { useStatisticsStore } from "@/store/useStatisticsStore";
import { useGenerateImageVariant } from "@core/composable/useGenerateImageVariant";
import authV2LoginIllustrationBorderedDark from "@images/pages/auth-v2-login-illustration-bordered-dark.png";
import authV2LoginIllustrationBorderedLight from "@images/pages/auth-v2-login-illustration-bordered-light.png";
import authV2LoginIllustrationDark from "@images/pages/auth-v2-login-illustration-dark.png";
import authV2LoginIllustrationLight from "@images/pages/auth-v2-login-illustration-light.png";
import authV2MaskDark from "@images/pages/misc-mask-dark.png";
import authV2MaskLight from "@images/pages/misc-mask-light.png";
import { VNodeRenderer } from "@layouts/components/VNodeRenderer";
import { themeConfig } from "@themeConfig";
import { jwtDecode } from "jwt-decode";
import { toast } from "vue3-toastify";
// import { toast } from 'vue3-toastify';
import { VForm } from "vuetify/components/VForm";


const themeName = ref(useCookie('EduPayment-theme'))
watch(themeName, (newThemeName) => {
  console.log(newThemeName)
  themeName.value = newThemeName
}
)

definePage({
  meta: {
    layout: "blank",
    unauthenticatedOnly: true
  }
});

const credentials = ref({
  email: "hamza@damiri.com",
  password: "123321",
});


const isPasswordVisible = ref(false);
const authThemeImg = useGenerateImageVariant(
  authV2LoginIllustrationLight,
  authV2LoginIllustrationDark,
  authV2LoginIllustrationBorderedLight,
  authV2LoginIllustrationBorderedDark,
  true
);
const authThemeMask = useGenerateImageVariant(authV2MaskLight, authV2MaskDark);
const route = useRoute();
const router = useRouter();
const ability = useAbility();
const refVForm = ref<VForm>();
const authStore = useAuthStore();
const { login } = authStore;
const { error, currentUser, userAbilityRules, accessToken } = storeToRefs(authStore);
const statisticsStore = useStatisticsStore();
const { onLoginFetchData } = statisticsStore
const { isDataFetched } = storeToRefs(statisticsStore)
const loader = ref(false)
const instance = getCurrentInstance()


//👉 - Set  Cookies for the Authenticated User
const setAuthenticatedUserCookies = () => {
  useCookie('accessToken').value = accessToken.value;
  useCookie('userData').value = currentUser.value ? JSON.stringify(currentUser.value) : null;
  useCookie('userAbilityRules').value = userAbilityRules.value ? JSON.stringify(userAbilityRules.value) : null;
  ability.update(userAbilityRules.value || []);
}

//👉 -  Check if the user has already changed their password.
const handleWebSocketConnection = async (email?: string) => {
  await instance?.appContext.config.globalProperties.$initWebSocketConnection(authStore.accessToken, email)
  await onLoginFetchData('app/on-login-data')
  isDataFetched.value = true
}

//👉 - Handle User Role Redirect
const handleUserRoleRedirect = async (role: string) => {
  const email = role === 'STUDENT' ? currentUser.value?.email : 'undefined'
  await handleWebSocketConnection(email);
  await nextTick(() => {
    router.push('/').then(() => {
      toast.success('Login successful ✅⚡', {
        theme: themeName.value || 'auto'
      })
      loader.value = false
    })
  })
}



const LogIn = async () => {
  try {
    loader.value = true
    await login(credentials.value);

    if (!accessToken) {
      toast.error('You are Not Authorized 💔', {
        theme: themeName.value || 'auto'
      });
      return;
    }
    //👉 -  Update Cookies for each User
    setAuthenticatedUserCookies()

    //👉 -  Check if the user has already changed their password.
    const userData = jwtDecode(accessToken.value!);
    if (userData?.isPasswordChanged) {
      await handleUserRoleRedirect(currentUser.value?.role)
    }
    else {
      router.push(route.query.to ? String(route.query.to) : "/force-change-password").then(() => {
        loader.value = false;
      })

    }
  } catch (err) {
    toast.error(error.value + ' 🧨❌' || 'An error occurred 🧨❌', {
      theme: themeName.value || 'auto'
    });
    //👉 - Turn off loading for the button login
    loader.value = false;
  }

};

const onLoginSubmit = () => {
  refVForm.value
    ?.validate()
    .then(({ valid }) => {
      if (valid) {
        LogIn()
      }
    })
    .catch((err) => console.log(err));
};



</script>

<template>
  <a href="javascript:void(0)">
    <div class="auth-logo d-flex align-center gap-x-3">
      <VNodeRenderer :nodes="themeConfig.app.logo" />
      <h1 class="auth-title">
        {{ themeConfig.app.title }}
      </h1>
    </div>
  </a>

  <VRow no-gutters class="auth-wrapper bg-surface">
    <VCol md="8" class="d-none d-md-flex">
      <div class="position-relative bg-background w-100 me-0">
        <div class="d-flex align-center justify-center w-100 h-100" style="padding-inline: 6.25rem">
          <VImg max-width="613" :src="authThemeImg" class="auth-illustration mt-16 mb-2" />
        </div>

        <img class="auth-footer-mask flip-in-rtl" :src="authThemeMask" alt="auth-footer-mask" height="280" width="100" />
      </div>
    </VCol>

    <VCol cols="12" md="4" class="auth-card-v2 d-flex align-center justify-center">
      <VCard flat :max-width="500" class="mt-12 mt-sm-0 pa-6">
        <VCardText>
          <h4 class="text-h4 mb-1">
            Welcome to
            <span class="text-capitalize">{{ themeConfig.app.title }}</span>! 👋🏻
          </h4>
          <p class="mb-0">
            Please log in to access your account and explore our services.
          </p>
        </VCardText>
        <VCardText>
          <VForm ref="refVForm" @submit.prevent="onLoginSubmit">
            <VRow>
              <!-- email -->
              <VCol cols="12">
                <AppTextField v-model="credentials.email" autofocus label="Email or Username" type="email" placeholder="Email address or username" :rules="[requiredValidator, emailValidator]" />
              </VCol>

              <!-- password -->
              <VCol cols="12">
                <AppTextField v-model="credentials.password" label="Password" placeholder="Password" :type="isPasswordVisible ? 'text' : 'password'" :append-inner-icon="
                    isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'
                  " @click:append-inner="isPasswordVisible = !isPasswordVisible" :rules="[requiredValidator]" />
                <div class="d-flex align-center flex-wrap justify-space-between mt-3">
                  <RouterLink class="text-secondary ms-2 mb-1" :to="{ name: 'forgot-password' }">
                    Forgot Password?
                  </RouterLink>
                </div>
                <VBtn class="mt-5" block type="submit" :loading="loader">
                  Login
                </VBtn>
              </VCol>

              <!-- create account -->
              <VCol cols="12" class="text-body-1 text-center">
                <VDivider class="mb-5" />
                <span>New on our platform?</span>

                <RouterLink class="font-weight-bold text-secondary" :to="{ name: 'register' }">
                  <li>Create an account</li>
                </RouterLink>
              </VCol>
            </VRow>
          </VForm>
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
