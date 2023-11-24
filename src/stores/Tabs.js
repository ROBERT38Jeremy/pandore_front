import { ref } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { useDBConnectStore } from './DBConnect'

export const useTabStore = defineStore('Tab', () => {
    const { database, table } = storeToRefs(useDBConnectStore())
    const currentTab = ref('Structure');
    const tabs = ref([]);

    const selectTab = (tabName) => {
        currentTab.value = tabName
    }

    const getTabs = (isFuzzy = false) => {
        currentTab.value = 'Structure'
        const tabList = [
            // PRIVILEGES
            {
                title: 'Privileges',
                name: 'Manage privileges',
                path: `/privileges`,
                conditions: {
                    display: database.value === null && table.value === null,
                    click: database.value === null && table.value === null,
                    fuzzy: true,
                }
            },
            // PROCESS LIST
            {
                title: 'Process List',
                name: 'See process list',
                path: `/process-list`,
                conditions: {
                    display: database.value === null && table.value === null,
                    click: database.value === null && table.value === null,
                    fuzzy: true,
                }
            },
            // CREATE DATABASE
            {
                title: 'Create Database',
                name: 'Create new database',
                path: `/database/create`,
                conditions: {
                    display: database.value === null && table.value === null,
                    click: database.value === null && table.value === null,
                    fuzzy: true,
                }
            },
            // DATABASE structure
            {
                title: 'Structure',
                name: `See ${database.value} structure`,
                path: `/database/${database.value}/structure`,
                conditions: {
                    display: database.value !== null && table.value === null,
                    click: database.value !== null && table.value === null,
                    fuzzy: database.value !== null && table.value === null,
                }
            },
            // TABLE structure
            {
                title: 'Structure',
                name: `See ${database.value}.${table.value} structure`,
                path: `/database/${database.value}/${table.value}/structure`,
                conditions: {
                    display: table.value !== null,
                    click: table.value !== null,
                    fuzzy: table.value !== null,
                }
            },
            // TABLE datas
            {
                title: 'Datas',
                name: `See ${database.value}.${table.value} datas`,
                path: `/database/${database.value}/${table.value}/datas`,
                conditions: {
                    display: table.value !== null,
                    click: table.value !== null,
                    fuzzy: table.value !== null,
                }
            },
            // DATABASE SQL
            {
                title: 'SQL',
                name: `Process SQL request on ${database.value}`,
                path: `/database/${database.value}/sql`,
                conditions: {
                    display: database.value !== null,
                    click: database.value !== null,
                    fuzzy: database.value !== null,
                }
            },
            // TABLE export
            {
                title: 'Export',
                name: `Export datas from ${database.value}.${table.value}`,
                path: `/database/${database.value}/${table.value}/export`,
                conditions: {
                    display: table.value !== null,
                    click: false && table.value !== null,
                    fuzzy: false && table.value !== null,
                }
            },
            // TABLE import
            {
                title: 'Import',
                name: `Import datas to ${database.value}.${table.value}`,
                path: `/database/${database.value}/${table.value}/import`,
                conditions: {
                    display: table.value !== null,
                    click: false && table.value !== null,
                    fuzzy: table.value !== null,
                }
            },
            // TABLE operations
            {
                title: 'Operations',
                name: `Manage ${database.value}.${table.value}`,
                path: `/database/${database.value}/${table.value}/operation`,
                conditions: {
                    display: table.value !== null,
                    click: false && table.value !== null,
                    fuzzy: table.value !== null,
                }
            },
            // TABLE triggers
            {
                title: 'Triggers',
                name: `Manage ${database.value}.${table.value} triggers`,
                path: `/database/${database.value}/${table.value}/triggers`,
                conditions: {
                    display: table.value !== null,
                    click: false && table.value !== null,
                    fuzzy: table.value !== null,
                }
            },
        ]
        if (isFuzzy === true) {
            tabs.value = tabList.filter((tab) => {
                return tab.conditions.fuzzy === true
            })
            return
        }
        tabs.value = tabList.filter((tab) => {
            return tab.conditions.display === true
        })
    }

    return {
        currentTab,
        tabs,
        selectTab,
        getTabs
    }
})
