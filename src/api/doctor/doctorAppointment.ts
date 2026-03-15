import request from '../../utils/request'
import type { ApiResponse } from '../staff'

// 患者预约信息数据部分接口类型
export interface ReservedPatientInfo {
  reserveDate: string
  reserveTime: string
  patientName: string
  gender: string
  contactPhone: string
  age: number
  deptName: string
  doctorName: string
}
// 导出查询预约某个医生的患者信息表函数
export const getReservedPatientsService = (): Promise<ApiResponse<ReservedPatientInfo[]>> => {
  return request.get(`/doctor/patientReserve`)
}
