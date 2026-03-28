import request from '../../utils/request'
import type { ApiResponse } from '../staff'

// 医生列表VO（与后端一致）
export interface DoctorInfo {
  doctorNo: string
  doctorName: string
  deptName: string
  title: string
  phone: string
  email?: string
  specialty?: string
}
// 管理员获取医生列表
export const getDoctorListService = (): Promise<ApiResponse<DoctorInfo[]>> => {
  return request.get('/admin/selectList/doctor')
}

// 化验员列表VO（与后端一致）
export interface LabTechInfo {
  labNo: string
  labName: string
  phone: string
  email?: string
}
// 管理员获取化验员列表
export const getLabTechListService = (): Promise<ApiResponse<LabTechInfo[]>> => {
  return request.get('/admin/selectList/labTech')
}

// 管理员注册医生
export interface RegisterDoctorData {
  doctorNo: string
  doctorName: string
  phone: string
  deptName: string
  title: string
  specialty?: string
  role: string
}
export const registerDoctorService = (data: RegisterDoctorData): Promise<ApiResponse<null>> => {
  return request.post('/admin/registerByAdmin/doctor', data)
}

// 管理员注册化验员
export interface RegisterLabTechData {
  labNo: string
  labName: string
  phone: string
  role: string
}
export const registerLabTechService = (data: RegisterLabTechData): Promise<ApiResponse<null>> => {
  return request.post('/admin/registerByAdmin/labTech', data)
}

// 管理员删除医生
export const deleteDoctorService = (doctorNo: string): Promise<ApiResponse<null>> => {
  return request.delete(`/admin/delete/doctor/${doctorNo}`)
}

// 管理员删除化验员
export const deleteLabTechService = (labNo: string): Promise<ApiResponse<null>> => {
  return request.delete(`/admin/delete/labTech/${labNo}`)
}

// 管理员修改医生职称
export const updateDoctorService = (
  doctorNo: string,
  title: string
): Promise<ApiResponse<null>> => {
  return request.put(
    `/admin/update/doctorTitle?doctorNo=${encodeURIComponent(doctorNo)}&title=${encodeURIComponent(title)}`
  )
}

// 管理员获取科室列表（不分科室分类）
export interface DeptInfo {
  deptId: number
  deptName: string
}
export const getDeptListService = (): Promise<ApiResponse<DeptInfo[]>> => {
  return request.get('/admin/findAllDeptNoSort')
}
