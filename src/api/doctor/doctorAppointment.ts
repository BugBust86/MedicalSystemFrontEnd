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
  cardId: string
  // 是否已接诊，0前端显示未接诊，1前端显示已接诊
  isReceive: 0 | 1
}
// 导出查询预约某个医生的患者信息表函数
export const getReservedPatientsService = (): Promise<ApiResponse<ReservedPatientInfo[]>> => {
  return request.get(`/doctor/patientReserve`)
}

// 医生填写病历本需要传入的数据接口类型
