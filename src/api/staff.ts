// 导出(提供)员工公共部分(注册登录)调用接口的函数

// 导入request.js中的request实例(包含封装好的get/post/patch/put/delete方法，内部调用service实例的方法实现全局请求响应拦截器)
import request from '../utils/request'

// 定义并导出统一响应结构
export interface ApiResponse<T> {
  code: number
  message?: string
  data?: T
}

// 定义注册接口的入参类型
export interface StaffRegisterData {
  staffId: string
  name: string
  phone: string
  password: string
  pswConfirm: string
  role: '医生' | '化验员' | '管理员'
}
// 导出注册函数
export const staffRegisterService = (
  registerData: StaffRegisterData
): Promise<ApiResponse<null>> => {
  // 异步函数，返回Promise对象，所以调用时需await+async
  return request.post('/staff/registerBySelf', registerData)
}

export interface StaffLoginData {
  staffId: string
  password: string
  role: '医生' | '化验员' | '管理员'
}
interface LoginResult {
  token: string
  name: string
}
// 导出登录函数
export const staffLoginService = (loginData: StaffLoginData): Promise<ApiResponse<LoginResult>> => {
  return request.post('/staff/staffLogin', loginData)
}
