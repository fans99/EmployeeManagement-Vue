import { createApp } from 'vue'
import App from './App.vue'
import { ElMessage, ElLoading } from 'element-plus'
import 'element-plus/packages/theme-chalk/src/base.scss'
import '/@/assets/css/index.css'


const app = createApp(App)
app.use(ElMessage)
app.use(ElLoading)
app.mount('#app')