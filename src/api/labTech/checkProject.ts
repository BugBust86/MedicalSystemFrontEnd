import request from '../../utils/request'
import type { ApiResponse } from '../staff'

// 检查化验项目类型
export interface CheckProject {
  itemId: number
  itemName: string
  startTime: string
  endTime: string
}

// 获取所有检查化验项目
export const queryAllProjectService = (): Promise<ApiResponse<CheckProject[]>> => {
  return request.get('/labTech/queryAll')
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