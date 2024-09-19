<script setup lang="ts">
// import WebSocketService from '@/services/websocketService'
import WebSocketService from '@/services/websocketService'
import ScrollToTop from '@core/components/ScrollToTop.vue'
import initCore from '@core/initCore'
import { initConfigStore, useConfigStore } from '@core/stores/config'
import { hexToRgb } from '@core/utils/colorConverter'
import { useTheme } from 'vuetify'
import { useNotificationStore } from './store/useNotificationStore'
const notificationStore = useNotificationStore()
const { pushNotification } = notificationStore
const { notificationsList } = storeToRefs(notificationStore)
const { global } = useTheme()

// ℹ️ Sync current theme with initial loader theme
initCore()
initConfigStore()

const configStore = useConfigStore()

// function sendMessage() {
//   WebSocketService.send('/app/myEndpoint', { content: 'Hello, WebSocket!' });


async function initWebSocketConnection() {
  try {
    await WebSocketService.connect(useCookie('accessToken').value);

    WebSocketService.client?.subscribe('/notifications/pending-registration', (message) => {
      {
        console.log(message.body);

        pushNotification(message.body);
      }
    });

    WebSocketService.client?.subscribe('/notifications/new-payment', (message) => {
      if (useCookie('userData').value?.scope.includes('ROLE_ADMIN')) {
        console.log(message.body);

        pushNotification(message.body);
      }
    });
  } catch (error) {
    console.error('WebSocket connection error:', error);
  }
}

initWebSocketConnection();

onBeforeUnmount(() => {
  WebSocketService.disconnect();
  notificationsList.value = []
})


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
