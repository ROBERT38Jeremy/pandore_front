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

    const getTabs = () => {
        currentTab.value = 'Structure'
        const tabList = [
            // PRIVILEGES
            {
                title: 'Privileges',
                path: `/privileges`,
                conditions: {
                    display: database.value === null && table.value === null,
                    click: database.value === null && table.value === null
                }
            },
            // PROCESS LIST
            {
                title: 'Process List',
                path: `/process-list`,
                conditions: {
                    display: database.value === null && table.value === null,
                    click: database.value === null && table.value === null
                }
            },
            // CREATE DATABASE
            {
                title: 'Create Database',
                path: `/database/create`,
                conditions: {
                    display: database.value === null && table.value === null,
                    click: database.value === null && table.value === null
                }
            },
            // DATABASE structure
            {
                title: 'Structure',
                path: `/database/${database.value}/structure`,
                conditions: {
                    display: database.value !== null && table.value === null,
                    click: database.value !== null && table.value === null
                }
            },
            // TABLE structure
            {
                title: 'Structure',
                path: `/database/${database.value}/${table.value}/structure`,
                conditions: {
                    display: table.value !== null,
                    click: table.value !== null
                }
            },
            // TABLE datas
            {
                title: 'Datas',
                path: `/database/${database.value}/${table.value}/datas`,
                conditions: {
                    display: table.value !== null,
                    click: table.value !== null
                }
            },
            // DATABASE SQL
            {
                title: 'SQL',
                path: `/database/${database.value}/sql`,
                conditions: {
                    display: database.value !== null,
                    click: database.value !== null
                }
            },
            // TABLE export
            {
                title: 'Export',
                path: `/database/${database.value}/${table.value}/export`,
                conditions: {
                    display: table.value !== null,
                    click: false && table.value !== null
                }
            },
            // TABLE triggers
            {
                title: 'Import',
                path: `/database/${database.value}/${table.value}/import`,
                conditions: {
                    display: table.value !== null,
                    click: false && table.value !== null
                }
            },
            // TABLE operations
            {
                title: 'Operations',
                path: `/database/${database.value}/${table.value}/operation`,
                conditions: {
                    display: table.value !== null,
                    click: false && table.value !== null
                }
            },
            // TABLE triggers
            {
                title: 'Triggers',
                path: `/database/${database.value}/${table.value}/triggers`,
                conditions: {
                    display: table.value !== null,
                    click: false && table.value !== null
                }
            },
        ]
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
