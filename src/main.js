import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import vant from 'vant'
import 'vant/lib/index.css'

import App from './App.vue'
import router from './router'

// 导入request/index.js文件，并挂载到Vue实例上
import request from './request'

const app = createApp(App)

app.config.globalProperties.$API = request;

app.use(createPinia())
app.use(router)
app.use(vant)

app.mount('#app')
