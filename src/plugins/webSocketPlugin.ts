import WebSocketService from '@/services/websocketService';
import { useCounterStore } from '@/store/useCounterStore';
import { useNotificationStore } from '@/store/useNotificationStore';
import { App } from 'vue';

function isNotificationUnseen(jsonString: string): boolean {
  const notification = JSON.parse(jsonString);
  return !notification.seen;
}

export default function (app: App) {

  const counterStore = useCounterStore();
  const notificationStore = useNotificationStore();

  // Method to initialize the WebSocket connection
  app.config.globalProperties.$initWebSocketConnection = async (token: string) => {
    try {
      await WebSocketService.connect(token);

      // Subscribe to the pending registration notifications
      WebSocketService.client?.subscribe('/notifications/pending-registration', (message) => {
        console.log(message.body);
        notificationStore.pushNotification(message.body);
        if (isNotificationUnseen(message.body)) {
          counterStore.increment();
          console.warn("counter ==== ", counterStore.counter);

        }
      });
      // Subscribe to the new payment notifications
      WebSocketService.client?.subscribe('/notifications/new-payment', (message) => {
        console.log(message.body);
        notificationStore.pushNotification(message.body);
        if (isNotificationUnseen(message.body)) {
          counterStore.increment();
          console.warn("counter ==== ", counterStore.counter);

        }
      });

    } catch (error) {
      console.error('WebSocket connection error:', error);
    }
  };

  // Method to disconnect the WebSocket
  app.config.globalProperties.$disconnectWebSocket = () => {
    WebSocketService.disconnect();
  };
}

