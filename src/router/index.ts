import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import v1 from '../views/v1.vue'
import v2 from '../views/v2.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: v2,
    },
    {
      path: '/form-v1',
      name: 'form',
      component: v1,
      props: true,
    },
  ],
})

export default router
