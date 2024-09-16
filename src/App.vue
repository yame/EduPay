<script setup lang="ts">
// import WebSocketService from '@/services/websocketService'
import ScrollToTop from '@core/components/ScrollToTop.vue'
import initCore from '@core/initCore'
import { initConfigStore, useConfigStore } from '@core/stores/config'
import { hexToRgb } from '@core/utils/colorConverter'
import { useTheme } from 'vuetify'

const { global } = useTheme()

// ℹ️ Sync current theme with initial loader theme
initCore()
initConfigStore()

const configStore = useConfigStore()

// function sendMessage() {
//   WebSocketService.send('/app/myEndpoint', { content: 'Hello, WebSocket!' });
// }
// onMounted(() => {
//   WebSocketService.connect();

//   WebSocketService.subscribe('/notifications/myTopic', (message) => {
//     console.log('Received message:', message);
//   });
// })

// onBeforeUnmount(() => {
//   WebSocketService.disconnect();
// })
</script>

<template>
  <VLocaleProvider :rtl="configStore.isAppRTL">
    <!-- ℹ️ This is required to set the background color of active nav link based on currently active global theme's primary -->
    <VApp :style="`--v-global-theme-primary: ${hexToRgb(global.current.value.colors.primary)}`">
      <RouterView />

      <ScrollToTop />
    </VApp>
  </VLocaleProvider>
</template>
