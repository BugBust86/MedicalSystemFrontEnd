import request from '../../utils/request'
import type { ApiResponse } from '../staff'

// 管理员信息类型
export interface AdminInfo {
  staffId: string
  name: string
  phone: string
  email?: string
  role: string
}

// 获取个人信息
export const getAdminInfoService = (): Promise<ApiResponse<AdminInfo>> => {
  return request.get('/staff/staffInfo')
}

// 修改密码
export interface UpdatePswData {
  oldPassword: string
  newPassword: string
}
export const updatePswService = (data: UpdatePswData): Promise<ApiResponse<string>> => {
  return request.post('/staff/updatePsw', data)
}
