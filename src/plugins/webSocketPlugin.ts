
import WebSocketService from '@/services/websocketService';
import { useAuthStore } from '@/store/useAuthStore';
import { useCounterStore } from '@/store/useCounterStore';
import { useNotificationStore } from '@/store/useNotificationStore';
import { App } from 'vue';


function isNotificationUnseen(jsonString) {
  const notification = JSON.parse(jsonString);
  return !notification.seen;
}

export default function (app: App) {
  const authStore = useAuthStore();
  const counterStore = useCounterStore();
  const notificationStore = useNotificationStore();

  app.config.globalProperties.$initWebSocketConnection = async (token: string) => {
    try {
      await WebSocketService.connect(token);

      WebSocketService.client.subscribe('/notifications/pending-registration', (message) => {
        notificationStore.pushNotification(message.body);
        if (isNotificationUnseen(message.body)) {
          counterStore.increment();
        }
      })

      WebSocketService.client.subscribe('/notifications/new-payment', (message) => {
        notificationStore.pushNotification(message.body);
        if (isNotificationUnseen(message.body)) {
          counterStore.increment();
        }
      });

    } catch (error) {
      console.error('WebSocket connection error:', error);
    }
  };

  app.config.globalProperties.$disconnectWebSocket = () => {
    WebSocketService.disconnect();
  };


}

