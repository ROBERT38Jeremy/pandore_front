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
        }
    ]
})

export default router
