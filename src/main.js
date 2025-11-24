import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(ElementPlus)

// 添加简单的消息提示功能
app.config.globalProperties.$message = {
  success: (message) => {
    alert('成功: ' + message)
  },
  error: (message) => {
    alert('错误: ' + message)
  },
  info: (message) => {
    alert('信息: ' + message)
  }
}

app.use(router)

app.mount('#app')