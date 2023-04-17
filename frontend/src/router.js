import { createWebHistory, createRouter } from 'vue-router';

import SearchPage from './components/SearchPage.vue';
import AboutPage from './components/AboutPage.vue';

const routes = [
  {
    path: '/',
    component: SearchPage,
    props: true
  },
  {
    path: '/:shareId/',
    component: SearchPage,
    props: true
  },
  {
    path: '/about/',
    component: AboutPage
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    // always scroll to top
    return { top: 0 }
  }
});

export default router;
