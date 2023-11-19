import { createRouter, createWebHistory } from 'vue-router'
import { checkDBConnection } from './DBConnect'
import HomeView from '../views/Home.vue'
import DatabaseStructure from '../views/DatabaseStructure.vue'
import TableStructure from '../views/TableStructure.vue'
import TableDatas from '../views/TableDatas.vue'
import DatabaseQuery from '../views/DatabaseQuery.vue'
import Options from '../views/Options.vue'

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
        },
        {
            path: '/database/:databaseName/:tableName/datas',
            name: 'TableDatas',
            component: TableDatas,
            beforeEnter: [checkDBConnection],
            props: true
        },
        {
            path: '/database/:databaseName/sql',
            name: 'DatabaseQuery',
            component: DatabaseQuery,
            beforeEnter: [checkDBConnection],
            props: true
        },
        {
            path: '/options',
            name: 'Options',
            component: Options,
            beforeEnter: [checkDBConnection],
            props: true
        }
    ]
})

export default router
