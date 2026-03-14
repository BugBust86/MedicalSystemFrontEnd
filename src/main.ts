// vue项目的逻辑入口，
import { createApp } from 'vue'
import App from '@/App.vue' // 导入根组件
import router from '@/router' // 导入路由配置

// 1. 引入 Element Plus 核心库
import ElementPlus from 'element-plus'
// 2. 引入 Element Plus 样式文件
import 'element-plus/dist/index.css'

const app = createApp(App) // 将根组件传入，同时创建应用示例

// 先注册路由插件
app.use(router)
// 再注册 Element Plus插件
app.use(ElementPlus)

app.mount('#app') // 挂载到页面上，#app 是 index.html 中的一个 div 元素的 id，Vue 应用将被渲染到这个元素内
