import { Client } from '@stomp/stompjs';

class WebSocketService {
  client: Client | null = null;

  connect(token: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.client && this.client.connected) {
        console.warn('WebSocket is already connected');
        resolve();
        return;
      }

      // const socket = new WebSocket('ws://192.168.1.111:9099/ws');
      const socket = new WebSocket('ws://localhost:9099/ws');

      this.client = new Client({
        webSocketFactory: () => socket,
        reconnectDelay: 5000,
        connectHeaders: {
          Authorization: `Bearer ${token}`,
        },
        onConnect: (frame) => {
          console.warn('Connected to WebSocket Server ✅⚡', frame);
          resolve();
        },
        onStompError: (frame) => {
          console.error('STOMP Error:', frame.headers['message']);
          reject(new Error(frame.headers['message']));
        },
        onWebSocketError: (event) => {
          console.error('WebSocket Error:', event);
          reject(new Error('WebSocket connection failed'));
        },
      });

      this.client.activate();
    });
  }

  disconnect(): void {
    if (this.client) {
      this.client.deactivate();
      console.warn('Disconnected from the WebSocket ❌⛔');
      this.client = null; // Reset client to null after disconnection
    }
  }
}

export default new WebSocketService();
