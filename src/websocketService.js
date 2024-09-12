// src/websocketService.js

import { useAuthStore } from './store/useAuthStore'; // Import the Vuex store


console.log(useAuthStore().accessToken);

let socket = null;
const callbacks = [];

export async function connectWebSocket() {
  if (socket) return;

  const token = store.state.authToken; // Get token from Vuex store
  if (!token) {
    console.error('No authentication token available');
    return;
  }

  const urlWithToken = `${WS_URL}?token=${encodeURIComponent(token)}`;
  socket = new WebSocket(urlWithToken);

  socket.onopen = () => {
    console.log('WebSocket connection opened');
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    callbacks.forEach(callback => callback(data));
  };

  socket.onclose = () => {
    console.log('WebSocket connection closed');
    socket = null;
  };

  socket.onerror = (error) => {
    console.error('WebSocket error:', error);
  };
}

export function onWebSocketMessage(callback) {
  callbacks.push(callback);
}

export function closeWebSocket() {
  if (socket) {
    socket.close();
    socket = null;
  }
}




/*!SECTION<template>
  <div>
    <h1>Notifications</h1>
    <ul>
      <li v-for="(notification, index) in notifications" :key="index">
        {{ notification }}
      </li>
    </ul>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
import { connectWebSocket, onWebSocketMessage, closeWebSocket } from '../websocketService';

export default {
  name: 'Notification',
  setup() {
    const notifications = ref([]);

    const handleNewMessage = (data) => {
      // Assuming data is a string. Adjust this part as per the actual data format.
      notifications.value.push(data);
    };

    onMounted(() => {
      connectWebSocket();
      onWebSocketMessage(handleNewMessage);
    });

    onUnmounted(() => {
      closeWebSocket();
    });

    return { notifications };
  },
};
</script>
*/
