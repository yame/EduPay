import { createPinia } from 'pinia';
import piniaPersist from 'pinia-plugin-persistedstate';
import type { App } from 'vue';

export const store = createPinia()
//PersistState
store.use(piniaPersist);
export default function (app: App) {
  app.use(store)
}
