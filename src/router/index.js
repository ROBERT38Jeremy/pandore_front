import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Home.vue'
import DatabaseStructure from '../views/DatabaseStructure.vue'
import TableStructure from '../views/TableStructure.vue'
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
            path: '/database/:databaseName/structure',
            name: 'DatabaseStructure',
            component: DatabaseStructure,
            beforeEnter: [checkDBConnection],
            props: true
        },
        {
            path: '/database/:databaseName/:tableName/structure',
            name: 'TableStructure',
            component: TableStructure,
            beforeEnter: [checkDBConnection],
            props: true
        }
    ]
})

export default router
