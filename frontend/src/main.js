import { createApp } from 'vue';
import App from './App.vue';
import VueYtframe from 'vue3-ytframe';
import router from './router';

import './assets/css/main.scss';

import 'context-filter-polyfill';

createApp(App)
  .use(router)
  .use(VueYtframe)
  .mount('#app');
