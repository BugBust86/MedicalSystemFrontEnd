import request from '../../utils/request'
import type { ApiResponse } from '../staff'

// 值班表数据部分接口类型
export interface DutyInfo {
  workDate: string
  workTime: string
  deptName: string
  doctorNo: string
  doctorName: string
  reserveMax: number
  reserved: number
}
// 导出查询值班表函数
export const getDutyInfoService = (): Promise<ApiResponse<DutyInfo[]>> => {
  return request.get('/doctor/workTable')
}
