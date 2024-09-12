import { createApp } from 'vue';
import 'vue3-toastify/dist/index.css';

import App from '@/App.vue';
import { registerPlugins } from '@core/utils/plugins';
import Vue3Toastify, { type ToastContainerOptions } from 'vue3-toastify';

// Styles
import '@core/scss/template/index.scss';
import '@styles/styles.scss';

// Create vue app
const app = createApp(App)

// Register plugins
app.use(Vue3Toastify, {
  autoClose: 1000,
} as ToastContainerOptions);
registerPlugins(app)

// Mount vue app
app.mount('#app')
