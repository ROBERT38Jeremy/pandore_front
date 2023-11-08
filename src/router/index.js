import { createRouter, createWebHistory } from 'vue-router'
import ConnectionView from '../views/Connection.vue'
import { checkDBConnection } from './DBConnect'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: ConnectionView
    },
    {
      path: '/about',
      name: 'about',
      meta: { allowVisitor: false },
      beforeEnter: [checkDBConnection],
      component: () => import('../views/AboutView.vue')
    }
  ]
})

export default router
