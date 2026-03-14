// src/utils/request.ts
import axios, { type InternalAxiosRequestConfig } from 'axios'
import { ElMessage } from 'element-plus' // 如果你用的是 Vue2 + ElementUI，替换为 import { Message } from 'element-ui'

// // 定义后端返回的通用结构
// interface ApiResponse<T = unknown> {
//   code: number
//   data: T
//   message: string
// }

// 1. 创建 axios 实例，统一配置基础参数
const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // 从环境变量读取接口前缀（适配 Vite）
  // 如果是 Vue CLI 项目，替换为：process.env.VUE_APP_API_BASE_URL
  timeout: 10000, // 请求超时时间（10秒）
  headers: {
    'Content-Type': 'application/json;charset=utf-8', // 默认请求头
  },
})

// 2. 请求拦截器：请求发送前的处理（如添加 Token）
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // const fullUrl = config.baseURL + config.url;
    // console.log(fullUrl)
    // 从本地存储获取 Token，添加到请求头（适配 JWT 认证）
    const token = localStorage.getItem('token')
    if (token) {
      // 将 token添加到请求头的 Authorization 字段，格式为 Bearer token
      config.headers!.Authorization = `Bearer ${token}` // 此处的!为非空断言操作符，显式告诉ts编译器config.headers一定存在，不为null或undefined
    }
    return config
  },
  (error) => {
    // 请求错误的前置处理
    console.error('请求拦截器错误：', error)
    return Promise.reject(error)
  }
)

// 3. 响应拦截器：响应返回后的统一处理
service.interceptors.response.use(
  (response) => {
    // 解构响应数据（适配后端常见的 { code, data, msg } 格式）
    const { code, data, message } = response.data // response是响应体，response.data才是响应体的数据部分
    console.log(code, data, message, code === 0)

    // 业务成功（假设后端约定 code=0 为成功）
    if (code === 0) {
      return response.data // 返回响应体的数据部分，简化业务层调用
    }
    // 业务失败：统一提示错误信息
    ElMessage.error(message || '返回代码不为0,请求结果被响应拦截器拦截')
    return Promise.reject(new Error(message || '请求失败'))
  },
  (error) => {
    // HTTP 状态码错误（如 401/403/500）
    console.error('响应拦截器错误：', error)
    const { response } = error

    // 按状态码分类处理
    if (response) {
      switch (response.status) {
        case 401: // 未授权/Token过期
          ElMessage.error('登录状态已过期，请重新登录')
          // 清除所有认证相关的 localStorage 数据
          localStorage.removeItem('token')
          localStorage.removeItem('role')
          localStorage.removeItem('name')
          // 使用 Vue Router 跳转（保持 SPA 导航），跳转到登录页
          window.location.href = '/' // 登录页路径是 /
          break
        case 403: // 权限不足
          ElMessage.error('暂无权限访问该资源')
          break
        case 404: // 接口不存在
          ElMessage.error('请求的接口不存在')
          break
        case 500: // 服务器错误
          ElMessage.error('服务器内部错误，请稍后重试')
          break
        default:
          ElMessage.error(`请求失败：${response.data?.msg || '未知错误'}`)
      }
    } else {
      // 无响应（如网络断开、超时）
      ElMessage.error('网络异常，请检查网络连接')
    }

    return Promise.reject(error)
  }
)

// 4. 封装对外暴露的请求方法（简化业务层调用）
const request = {
  // GET 请求：参数拼在 URL 上
  get<T = unknown>(url: string, params = {}): Promise<T> {
    return service.get(url, { params })
  },

  // POST 请求：参数放在请求体（JSON 格式）
  post<T = unknown>(url: string, data = {}): Promise<T> {
    return service.post(url, data)
  },

  // PUT 请求：通常用于全量更新资源
  put<T = unknown>(url: string, data = {}): Promise<T> {
    return service.put(url, data)
  },

  // PATCH 请求：通常用于增量更新资源
  patch<T = unknown>(url: string, data = {}): Promise<T> {
    return service.patch(url, data)
  },

  // DELETE 请求：支持参数拼 URL 或放请求体
  delete<T = unknown>(url: string, params = {}): Promise<T> {
    return service.delete(url, { params })
  },

  // 扩展：支持 form-data 格式的 POST（如文件上传）
  postForm<T = unknown>(url: string, data: Record<string, string | Blob> = {}): Promise<T> {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value)
    })
    return service.post(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  }
}

// 导出封装后的 request 实例
export default request
