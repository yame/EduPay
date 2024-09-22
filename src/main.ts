// import { createApp } from 'vue';
// import 'vue3-toastify/dist/index.css';

// import App from '@/App.vue';
// import WebSocketService from '@/services/websocketService';
// import { useAuthStore } from '@/store/useAuthStore'; // Adjust path for auth store
// import { useCounterStore } from '@/store/useCounterStore';
// import { registerPlugins } from '@core/utils/plugins';
// import Vue3Toastify, { type ToastContainerOptions } from 'vue3-toastify';
// // Styles
// import { useNotificationStore } from '@/store/useNotificationStore';
// import '@core/scss/template/index.scss';
// import '@styles/styles.scss';


// // Create vue app
// const app = createApp(App);
// // Register plugins
// registerPlugins(app);
// const notificationStore = useNotificationStore()
// const { pushNotification } = notificationStore
// const { notificationsList } = storeToRefs(notificationStore)
// app.use(Vue3Toastify, {
//   autoClose: 1000,
// } as ToastContainerOptions);

// const counterStore = useCounterStore();
// app.provide('counterStore', counterStore);

// // Check for existing token and initialize WebSocket connection
// const authStore = useAuthStore();
// const token = useCookie('accessToken').value;
// const userData = useCookie('userData').value;
// //👉 -  Function to check if the notification is unseen
// function isNotificationUnseen(jsonString: string) {
//   const notification = JSON.parse(jsonString);
//   return !notification.seen;
// }
// if (token) {
//   // if (userData?.scope?.includes('ROLE_ADMIN'))
//   initWebSocketConnection();

// }

// // Function to initialize WebSocket connection
// async function initWebSocketConnection() {
//   try {
//     await WebSocketService.connect(token);

//     // Subscribe to notifications
//     WebSocketService.client?.subscribe('/notifications/pending-registration', (message) => {
//       pushNotification(message.body);
//       if (isNotificationUnseen(message.body)) {
//         counterStore.increment();
//       }
//     });

//     WebSocketService.client?.subscribe('/notifications/new-payment', (message) => {
//       pushNotification(message.body);
//       if (isNotificationUnseen(message.body)) {
//         counterStore.increment();
//       }

//     });
//   } catch (error) {
//     console.error('WebSocket connection error:', error);
//   }
// }

// // Mount vue app
// app.mount('#app');








import { createApp } from 'vue';
import 'vue3-toastify/dist/index.css';

import App from '@/App.vue';
import Vue3Toastify, { type ToastContainerOptions } from 'vue3-toastify';
// Styles
import '@core/scss/template/index.scss';
import '@styles/styles.scss';
import webSocketPlugin from './plugins/webSocketPlugin';
import { useCounterStore } from './store/useCounterStore';

// Create Vue app
const app = createApp(App);
// Register plugins
registerPlugins(app);

const counterStore = useCounterStore();
app.provide('counterStore', counterStore);

app.use(Vue3Toastify, {
  autoClose: 1000,
} as ToastContainerOptions);

// Check for existing token and initialize WebSocket connection
const token = useCookie('accessToken').value;

if (token) {
  app.use(webSocketPlugin);
  // app.config.globalProperties.$initWebSocketConnection(token);
}

// Mount Vue app
app.mount('#app');
