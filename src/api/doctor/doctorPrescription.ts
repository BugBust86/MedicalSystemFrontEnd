import request from '../../utils/request'
import type { ApiResponse } from '../staff'

// 处方明细类型
export interface PrescriptionDetailDTO {
  drugName: string
  dosage: string
  frequency: string
  usage: string
  drugRemark: string
}

// 处方完整信息类型
export interface PrescriptionItem {
  id: string
  prescriptionName: string
  doctorId: string
  disease: string
  prescriptionDesc: string
  prescriptionDetails: PrescriptionDetailDTO[]
  createTime?: string
}

// 处方基本信息类型（用于列表显示）
export interface PrescriptionInfo {
  prescriptionId: number
  prescriptionName: string
}

// 新增处方的数据类型
export interface PrescriptionData {
  prescriptionName: string
  disease: string
  prescriptionDesc: string
  prescriptionDetails: PrescriptionDetailDTO[]
}

// 导出医生根据 token查询处方的函数
export const getPrescriptionService = (): Promise<ApiResponse<PrescriptionItem[]>> => {
  return request.get(`/doctor/prescription/query/all`)
}

// 导出医生新增处方的函数
export const addPrescriptionService = (data: PrescriptionData): Promise<ApiResponse<string>> => {
  return request.post(`/doctor/prescription/add`, data)
}

// 导出医生更新处方的函数
export const updatePrescriptionService = (data: PrescriptionItem): Promise<ApiResponse<string>> => {
  return request.put(`/doctor/prescription/update`, data)
}

// 导出医生删除处方的函数
export const deletePrescriptionService = (id: string): Promise<ApiResponse<string>> => {
  return request.delete(`/doctor/prescription/delete/${id}`)
}
