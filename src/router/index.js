import { createRouter, createWebHistory } from 'vue-router'
import ConnectionView from '../views/Connection.vue'
import HomeView from '../views/Home.vue'
import { checkDBConnection } from './DBConnect'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'connection',
            component: ConnectionView
        },
        {
            path: '/home',
            name: 'home',
            component: HomeView,
            beforeEnter: [checkDBConnection],
        }
    ]
})

export default router
