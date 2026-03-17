import request from '../../utils/request'
import type { ApiResponse } from '../staff'

// 医生信息类型
export interface DoctorInfo {
  staffId: string
  name: string
  deptName?: string
}

// 值班信息类型
export interface WorkInfo {
  id: number
  docName: string
  docId: string
  deptName: string
  workDate: string
  workTime: string
  workStatus: string
}

// 获取科室分类下的医生列表
export const getDoctorListByDeptSortService = (
  deptSortName: string
): Promise<ApiResponse<DoctorInfo[]>> => {
  return request.get('/admin/docList/deptSort', {
    params: { deptSortName },
  })
}

// 获取科室下的医生列表
export const getDoctorListByDeptService = (
  deptName: string
): Promise<ApiResponse<DoctorInfo[]>> => {
  return request.get('/admin/docList/dept', {
    params: { deptName },
  })
}

// 根据医生名查工号、科室
export const findDocNoAndDeptService = (
  docName: string
): Promise<ApiResponse<{ docId: string; deptName: string }>> => {
  return request.get('/admin/findNoAndDept', {
    params: { docName },
  })
}

// 搜索值班列表（分页）
export interface SearchWorkData {
  docName?: string
  deptName?: string
  workDate?: string
  pageNum: number
  pageSize: number
}
export interface WorkListResult {
  total: number
  rows: WorkInfo[]
}
export const searchWorkListService = (
  data: SearchWorkData
): Promise<ApiResponse<WorkListResult>> => {
  return request.post('/admin/workList/search', data)
}

// 新增值班
export interface AddWorkData {
  docId: string
  docName: string
  deptName: string
  workDate: string
  workTime: string
}
export const addWorkService = (data: AddWorkData): Promise<ApiResponse<null>> => {
  return request.post('/admin/workList/insert', data)
}

// 修改值班
export interface UpdateWorkData {
  id: number
  workDate: string
  workTime: string
  workStatus?: string
}
export const updateWorkService = (data: UpdateWorkData): Promise<ApiResponse<null>> => {
  return request.patch('/admin/workList/update', data)
}

// 删除值班
export const deleteWorkService = (id: number): Promise<ApiResponse<null>> => {
  return request.delete('/admin/workList/delete', {
    params: { id },
  })
}
