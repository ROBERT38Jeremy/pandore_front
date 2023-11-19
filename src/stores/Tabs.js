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
            // DATABASE structure
            {
                title: 'Structure',
                path: `/database/${database.value}/structure`,
                conditions: {
                    display: table.value === null,
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
                    display: true,
                    click: database.value !== null
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
