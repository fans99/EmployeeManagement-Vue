import { createApp } from 'vue'
import App from './App.vue'
import router from '/@/router/index'
import { ElEmpty, ElMessage, ElMessageBox, ElMenu, ElSubmenu, ElMenuItem, ElTabs, ElTabPane, ElIcon, ElTable, ElTableColumn, ElLoading, ElDialog, ElSelect, ElOption } from 'element-plus'
import 'element-plus/packages/theme-chalk/src/base.scss'
import './assets/css/index.css'

const app = createApp(App)
app.use(router)
app.use(ElEmpty)
app.use(ElMessage)
app.use(ElMessageBox)
app.use(ElMenu)
app.use(ElSubmenu)
app.use(ElMenuItem)
app.use(ElTabs)
app.use(ElTabPane)
app.use(ElIcon)
app.use(ElTable)
app.use(ElTableColumn)
app.use(ElLoading)
app.use(ElDialog)
app.use(ElSelect)
app.use(ElOption)
app.mount('#app')