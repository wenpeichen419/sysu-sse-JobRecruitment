/**
 * API配置文件
 * 用于配置axios实例、请求拦截器、响应拦截器等
 */

import axios from 'axios'
import { ElMessage } from 'element-plus'

// 创建axios实例
const request = axios.create({
  // 后端API的基础地址
  baseURL: 'http://localhost:8080',
  
  // 请求超时时间(10秒)
  timeout: 10000,
  
  // 请求头配置
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  }
})

// 请求拦截器
// 在每次发送请求之前执行
request.interceptors.request.use(
  config => {
    // 从localStorage获取token(如果有登录功能)
    // const token = localStorage.getItem('token')
    const token = "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoic3R1ZGVudCIsImlkIjoxLCJzdWIiOiJjaGVueHk5NzlAbWFpbDIuc3lzdS5lZHUuY24iLCJpYXQiOjE3NjM3MDMxMzMsImV4cCI6MTc2Mzc4OTUzM30.6QJgxpy1Qd5lRhCO813oNeOHkwBQPr013oVWjY2gfLY"
    if (token) {
      // 在请求头中添加Authorization，使用Bearer格式
      // 如果token已经包含Bearer前缀，就直接使用；否则添加Bearer前缀
      config.headers.Authorization = token.startsWith('Bearer ') ? token : `Bearer ${token}`
    }
    
    // 可以在这里打印请求信息,方便调试
    console.log('【API请求】', config.method.toUpperCase(), config.url, config.params || config.data)
    
    return config
  },
  error => {
    // 请求错误时的处理
    console.error('【请求错误】', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
// 在收到响应之后执行
request.interceptors.response.use(
  response => {
    // 打印响应信息,方便调试
    console.log('【API响应】', response.config.url, response.data)
    
    // 获取响应数据
    const res = response.data
    
    // 根据后端返回的code判断请求是否成功
    // 通常200表示成功,其他表示失败
    if (res.code === 200) {
      return res.data // 直接返回data部分,使用更方便
    } else {
      // 请求失败,显示错误提示
      ElMessage.error(res.message || '请求失败')
      return Promise.reject(new Error(res.message || '请求失败'))
    }
  },
  error => {
    // HTTP错误处理
    console.error('【响应错误】', error)
    
    // 根据不同的错误状态码显示不同的提示
    if (error.response) {
      switch (error.response.status) {
        case 401:
          ElMessage.error('未授权,请先登录')
          // 可以在这里跳转到登录页
          // router.push('/login')
          break
        case 403:
          ElMessage.error('没有权限访问')
          break
        case 404:
          ElMessage.error('请求的资源不存在')
          break
        case 500:
          ElMessage.error('服务器错误')
          break
        default:
          ElMessage.error(error.response.data.message || '网络错误')
      }
    } else if (error.request) {
      // 请求已发出但没有收到响应
      ElMessage.error('网络连接失败,请检查后端服务是否启动')
    } else {
      // 其他错误
      ElMessage.error(error.message || '请求失败')
    }
    
    return Promise.reject(error)
  }
)

export default request

