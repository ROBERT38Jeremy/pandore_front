import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Home.vue'
import databaseViewer from '../views/DatabaseViewer.vue'
import { checkDBConnection } from './DBConnect'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView
        },
        {
            path: '/database/:databaseName',
            name: 'databaseViewer',
            component: databaseViewer,
            beforeEnter: [checkDBConnection],
            props: true
        }
    ]
})

export default router
