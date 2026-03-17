import request from '../../utils/request'
import type { ApiResponse } from '../staff'

// 个人中心数据部分接口类型
export interface DoctorInfo {
  email: string
  pic: string // 医生头像URL
  staffId: string
  name: string
  phone: string
  deptName: string
  specialty: string // 擅长
  title: string // 职称
}
// 导出查询个人中心信息函数
export const getDoctorInfoService = (): Promise<ApiResponse<DoctorInfo>> => {
  return request.get('/staff/staffInfo')
}

// 更新医生信息参数类型
interface UpdateDoctorInfoData {
  phone: string
  email: string
  specialty: string
}
// 导出更新医生信息函数
export const updateDoctorInfoService = (
  data: UpdateDoctorInfoData
): Promise<ApiResponse<string>> => {
  return request.patch('/doctor/updateInfo', data)
}

// 医生上传头像
export const uploadAvatarService = (file: FormData): Promise<ApiResponse<{ url: string }>> => {
  return request.post('/doctor/upload', file, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}
