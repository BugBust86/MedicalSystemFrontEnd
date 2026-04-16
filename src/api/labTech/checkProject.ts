import request from '../../utils/request'
import type { ApiResponse } from '../staff'

// 检查化验项目类型（列表用）
export interface CheckProject {
  itemId: number
  itemName: string
  startTime: string
  endTime: string
}

// 检查化验项目详情类型
export interface CheckProjectDetail {
  itemId: number
  itemName: string
  itemDesc: string
  itemPlace: string
  startTime: string
  endTime: string
  isActive: number
  labNo: string
  reserveMax: number
  reserved: number
  reserveEmpty: number
}

// 获取所有检查化验项目
export const queryAllProjectService = (): Promise<ApiResponse<CheckProject[]>> => {
  return request.get('/labTech/queryAll')
}

// 获取检查化验项目详情
export const queryOneProjectService = (
  itemId: number
): Promise<ApiResponse<CheckProjectDetail>> => {
  return request.get('/labTech/queryOne', { itemId })
}

// 发布检查化验项目
export const publishProjectService = (itemId: number): Promise<ApiResponse<void>> => {
  return request.patch('/labTech/publish', { itemId })
}

// 删除检查化验项目
export const deleteProjectService = (itemId: number): Promise<ApiResponse<void>> => {
  return request.delete('/labTech/delete', { itemId })
}

// 新增检查化验项目请求体
export interface AddProjectData {
  itemName: string
  itemDesc: string
  itemPlace: string
  startTime: string
  endTime: string
  reserveMax: number
}

// 新增检查化验项目
export const addProjectService = (data: AddProjectData): Promise<ApiResponse<void>> => {
  return request.post('/labTech/add', data)
}

// 更新检查化验项目请求体
export interface UpdateProjectData {
  itemId: number
  itemName: string
  itemDesc: string
  itemPlace: string
  startTime: string
  endTime: string
  reserveMax: number
}

// 更新检查化验项目
export const updateProjectService = (data: UpdateProjectData): Promise<ApiResponse<void>> => {
  return request.post('/labTech/update', data)
}
