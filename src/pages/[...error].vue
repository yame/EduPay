<script setup lang="ts">
import { useGenerateImageVariant } from '@core/composable/useGenerateImageVariant';
import misc404 from '@images/pages/404.png';
import miscMaskDark from '@images/pages/misc-mask-dark.png';
import miscMaskLight from '@images/pages/misc-mask-light.png';

const authThemeMask = useGenerateImageVariant(miscMaskLight, miscMaskDark)
const userData = useCookie('userData').value
const currentUser = userData?.role
console.log("👀 ->", currentUser)
definePage({
  alias: '/pages/misc/not-found/:error(.*)',
  meta: {
    layout: 'blank',
    unauthenticatedOnly: true
  },
})
</script>

<template>
  <div class="misc-wrapper">
    <ErrorHeader status-code="404" title="Page Not Found ⚠️" description="We couldn't find the page you are looking for." />

    <VBtn class="mb-11" :to="currentUser==='ADMIN' ?   {name:'root'} : currentUser==='ADMIN'? {name:'student-payments-student'}:{name:'login'}">
      {{  currentUser === "ADMIN" ?  'Back To Home' : currentUser === "STUDENT" ?  'Back To Student History' : 'Back To Login' }}
    </VBtn>

    <!-- 👉 Image -->
    <div class="misc-avatar w-100 text-center">
      <VImg :src="misc404" alt="error 404" :max-height="$vuetify.display.smAndDown ? 350 : 500" class="mx-auto" />
    </div>

    <img class="misc-footer-img d-none d-md-block" :src="authThemeMask" alt="misc-footer-img" height="320">
  </div>
</template>

<style lang="scss">
@use "@core/scss/template/pages/misc.scss";
</style>
