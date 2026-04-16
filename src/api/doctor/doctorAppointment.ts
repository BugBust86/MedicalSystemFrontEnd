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
  reservationId: number
  // 是否已接诊，0前端显示未接诊，1前端显示已接诊
  isReceive: 0 | 1
}
// 医生填写病历本数据结构
export interface HistoryAddParams {
  reservationId: number // 预约ID，从患者列表获取
  cardId: string // 就诊卡ID
  medical_history?: string // 过往病史
  patientDescription: string // 患者描述（必填）
  doctorAdvice?: string // 医生建议
  doctorName: string // 医生签名（必填）
}

// 病历本详情接口类型
export interface MedicalHistoryDetail {
  reserveDate: string
  reserveTime: string
  patientName: string
  gender: string
  age: number
  contactPhone: string
  deptName: string
  doctorName: string
  medicalHistory: string
  patientDescription: string
  doctorAdvice: string
}

// 导出查询预约某个医生的患者信息表函数
export const getReservedPatientsService = (): Promise<ApiResponse<ReservedPatientInfo[]>> => {
  return request.get(`/doctor/patientReserve`)
}

// 导出医生提交病历本函数
export const addMedicalHistoryService = (data: HistoryAddParams): Promise<ApiResponse<void>> => {
  return request.post(`/doctor/addMedicalHistory`, data)
}

// 导出查看病历本函数
export const getMedicalHistoryService = (reservationId: number): Promise<ApiResponse<MedicalHistoryDetail>> => {
  return request.get(`/doctor/medicalHistory/${reservationId}`)
}

// 更新病历本参数类型
export interface HistoryUpdateParams {
  reservationId: number
  medicalHistory: string
  patientDescription: string
  doctorAdvice: string
}

// 导出更新病历本函数
export const updateMedicalHistoryService = (data: HistoryUpdateParams): Promise<ApiResponse<void>> => {
  return request.put(`/doctor/medicalHistory`, data)
}
