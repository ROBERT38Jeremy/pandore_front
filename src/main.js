import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import { plugin, defaultConfig } from '@formkit/vue'
import config from '../formkit.config.js'
import '@formkit/themes/genesis'

const app = createApp(App)

app.use(plugin, defaultConfig(config))
app.use(createPinia())
app.use(router)

app.mount('#app')
