import { createWebHistory, createRouter } from 'vue-router';

import SearchPage from './components/SearchPage.vue';
import MainPage from './components/MainPage.vue';
import AboutPage from './components/AboutPage.vue';

const routes = [
  {
    path: '/',
    component: MainPage,
    name: 'libraryPage',
    props: true
  },
  {
    path: '/:section/',
    component: SearchPage,
    name: 'documentPage',
    props: true
  },
  {
    path: '/:section/:shareId/',
    component: SearchPage,
    name: 'documentSharePage',
    props: true
  },
  {
    path: '/about/',
    component: AboutPage,
    name: 'aboutPage'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    // always scroll to top
    return { top: 0 };
  }
});

export default router;
