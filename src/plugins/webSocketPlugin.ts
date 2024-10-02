import WebSocketService from '@/services/websocketService';
import { useAuthStore } from '@/store/useAuthStore';
import { useNotificationStore } from '@/store/useNotificationStore';
import { App } from 'vue';

// function isNotificationUnseen(jsonString: string): boolean {
//   const notification = JSON.parse(jsonString);
//   return !notification.seen;
// }

export default function (app: App) {

  const notificationStore = useNotificationStore();
  const authStore = useAuthStore();


  // Method to initialize the WebSocket connection
  app.config.globalProperties.$initWebSocketConnection = async (token: string, email?: string) => {
    try {
      //SECTION - Admin Section
      await WebSocketService.connect(token);
      if (authStore.currentUser?.role === 'ADMIN') {
        // Subscribe to the pending registration notifications
        WebSocketService.client?.subscribe('/notifications/pending-registration', (message) => {
          console.log(message.body);
          notificationStore.pushNotification(message.body);
        });
        // Subscribe to the new payment notifications
        WebSocketService.client?.subscribe('/notifications/new-payment', (message) => {
          console.log(message.body);
          notificationStore.pushNotification(message.body);
        });
      }
      //!SECTION
      //SECTION - Student Section
      if (authStore.currentUser?.role === 'STUDENT')
        WebSocketService.client?.subscribe('/notifications/' + email + '/payment-status-changed', (message) => {
          console.log(message.body);
          notificationStore.pushNotificationStudent(message.body);
        });
      //!SECTION
    } catch (error) {
      console.error('WebSocket connection error:', error);
    }
  };

  // Method to disconnect the WebSocket
  app.config.globalProperties.$disconnectWebSocket = () => {
    WebSocketService.disconnect();
  };
}

