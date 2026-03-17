import request from '../../utils/request'
import type { ApiResponse } from '../staff'

// 员工信息类型
export interface StaffInfo {
  staffId: string
  name: string
  phone: string
  email?: string
  role: string
  deptName?: string
  title?: string
  specialty?: string
  pic?: string
}

// 管理员获取员工列表
export const getStaffListService = (role: string): Promise<ApiResponse<StaffInfo[]>> => {
  return request.get(`/admin/selectList/${role === '医生' ? 'doctor' : 'labTech'}`, {
    params: { role },
  })
}

// 管理员注册医生
export interface RegisterDoctorData {
  staffId: string
  name: string
  phone: string
  password: string
  deptName: string
  title?: string
  specialty?: string
}
export const registerDoctorService = (data: RegisterDoctorData): Promise<ApiResponse<null>> => {
  return request.post('/admin/registerByAdmin/doctor', data)
}

// 管理员注册化验员
export interface RegisterLabTechData {
  staffId: string
  name: string
  phone: string
  password: string
}
export const registerLabTechService = (data: RegisterLabTechData): Promise<ApiResponse<null>> => {
  return request.post('/admin/registerByAdmin/labTech', data)
}
