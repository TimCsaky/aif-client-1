import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import FormView from '../views/FormView.vue'
import StaticView from '../views/staticView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/form/:formId',
      name: 'form',
      component: FormView,
      props: true,
    },
    {
      path: '/static-form',
      name: 'static-form',
      component: StaticView,
      props: true,
    },
  ],
})

export default router
