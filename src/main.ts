// vue项目的逻辑入口，
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// 1. 引入 Element Plus 核心库
import ElementPlus from 'element-plus'
// 2. 引入 Element Plus 样式文件
import 'element-plus/dist/index.css'

const app = createApp(App)

// 先注册路由
app.use(router)
// 再注册 Element Plus
app.use(ElementPlus)

app.mount('#app')
