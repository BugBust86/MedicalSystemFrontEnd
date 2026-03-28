import request from '../../utils/request'
import type { ApiResponse } from '../staff'

// 科室分类类型
export interface DeptSort {
  deptSortId: number
  deptSortName: string
}

// 科室类型
export interface Department {
  deptId: number
  deptName: string
}

// 获取所有科室分类
export const getDeptSortListService = (): Promise<ApiResponse<DeptSort[]>> => {
  return request.get('/admin/findAllDeptSort')
}

// 获取某个分类下的所有科室
export const getDeptListService = (deptSortName: string): Promise<ApiResponse<Department[]>> => {
  return request.get('/admin/findAllDept', { deptSortName })
}

// 新增科室
export interface AddDeptData {
  deptName: string
  deptSortId: number
}
export const addDeptService = (data: AddDeptData): Promise<ApiResponse<null>> => {
  return request.post('/admin/addDept', data)
}

// 删除科室
export const deleteDeptService = (deptId: number): Promise<ApiResponse<null>> => {
  return request.delete('/admin/deleteDept', { deptId })
}
