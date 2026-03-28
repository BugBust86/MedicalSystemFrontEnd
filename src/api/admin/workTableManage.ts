import request from '../../utils/request'
import type { ApiResponse } from '../staff'

// 值班信息类型
export interface WorkInfo {
  tableId: number
  doctorNo: string
  doctorName: string
  deptName: string
  workDate: string
  workTime: string
  reserveMax: number
  reserved: number
}

// 搜索参数
export interface SearchWorkData {
  page: number
  pageSize: number
  doctorName?: string
  deptName?: string
}

// 响应结果
export interface WorkListResult {
  data: WorkInfo[]
  total: number
  hasNext: boolean
}

// 搜索值班列表（分页）
export const searchWorkListService = (
  data: SearchWorkData
): Promise<ApiResponse<WorkListResult>> => {
  // 直接构建 URL 查询字符串
  let url = `/admin/workList/search?page=${data.page}&pageSize=${data.pageSize}`
  if (data.doctorName) {
    url += `&doctorName=${encodeURIComponent(data.doctorName)}`
  }
  if (data.deptName) {
    url += `&deptName=${encodeURIComponent(data.deptName)}`
  }
  console.log('[DEBUG] 发送请求URL:', url)
  return request.get(url)
}

// 更新值班信息
export interface UpdateWorkData {
  id: number
  workDate: string
  workTime: string
  doctorNo: string
  reserveMax: string
}

export const updateWorkListService = (
  data: UpdateWorkData
): Promise<ApiResponse<void>> => {
  return request.patch('/admin/workList/update', data)
}

// 删除值班信息
export const deleteWorkListService = (id: number): Promise<ApiResponse<void>> => {
  return request.delete(`/admin/workList/delete?id=${id}`)
}

// 新增值班信息
export interface InsertWorkData {
  workDate: string
  workTime: string
  doctorNo: string
  reserveMax: string
}

export const insertWorkListService = (data: InsertWorkData): Promise<ApiResponse<void>> => {
  return request.post('/admin/workList/insert', data)
}

// 获取医生列表（根据科室）
export const getDoctorListService = (deptName: string): Promise<ApiResponse<string[]>> => {
  return request.get(`/admin/docList/dept?deptName=${encodeURIComponent(deptName)}`)
}
