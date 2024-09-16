import { Client } from '@stomp/stompjs';
// import SockJS from 'sockjs-client';
import { useNotificationStore } from '@/store/useNotificationStore';
import { storeToRefs } from 'pinia';

const notificationStore = useNotificationStore()
const { pushNotification } = notificationStore
const { notificationsList } = storeToRefs(notificationStore)

class WebSocketService {
  constructor() {
    this.client = null;
    this.connected = false;
  }

  connect(token) {
    this.client = new Client({
      brokerURL: 'ws://localhost:9099/ws',
      connectHeaders: {
        Authorization: `Bearer ${token}`, 
      },
      onConnect: () => {
        console.warn('Connected to WebSocket server ✅');
        this.connected = true;
        this.client.subscribe('/notifications/pending-registration', message => {     
          console.log(`Received: ${message.body}`);
          pushNotification(message.body)     
        });
      },
      onStompError: (frame) => {
        console.error('Broker reported error ⛔: ', frame);
      },
      onWebSocketError: (error) => {
        console.error('WebSocket error ❌: ', error);
      },
    });

    this.client.activate();
  }

  publish(destination, body) {
    if (this.connected) {
      this.client.publish({ destination, body });
    } else {
      console.error('WebSocket client is not connected');
    }
  }

  disconnect() {
    if (this.client) {
      this.client.deactivate();
      this.connected = false;
      notificationsList.value = []

      console.warn('Disconnected from the WEBSOCKET');
    }
  }
}

export default new WebSocketService();




// import { useNotificationStore } from '@/store/useNotificationStore';
// import { Client as StompClient } from '@stomp/stompjs';

// const notificationStore = useNotificationStore();
// const { pushNotification } = notificationStore;

// class WebSocketService {
//   constructor() {
//     this.client = null;
//     this.connected = false;
//   }

//   connect(token) {
//     this.client = new StompClient({
//       brokerURL: 'ws://localhost:9099/ws',
//       connectHeaders: {
//         Authorization: `Bearer ${token}`,
//       },
//       debug: (str) => console.log(str), // Optional: for debugging STOMP frames
//       onConnect: () => {
//         console.warn('Connected to WebSocket server ✅');
//         this.connected = true;
//         this.client.subscribe('/notifications/pending-registration', (message) => {
//           pushNotification(message.body);
//           console.log(`Received: ${message.body}`);
//         });
//       },
//       onStompError: (frame) => {
//         console.error('Broker reported error ⛔: ', frame);
//       },
//       onWebSocketError: (error) => {
//         console.error('WebSocket error ❌: ', error);
//       },
//     });

//     this.client.activate();
//   }

//   publish(destination, body) {
//     if (this.connected) {
//       this.client.publish({ destination, body });
//     } else {
//       console.error('WebSocket client is not connected');
//     }
//   }

//   disconnect() {
//     if (this.client) {
//       this.client.deactivate();
//       this.connected = false;
//       console.warn('Disconnected from the WEBSOCKET');
//     }
//   }
// }

// export default new WebSocketService();
