<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  searchWorkListService,
  updateWorkListService,
  deleteWorkListService,
  insertWorkListService,
  getDoctorListService,
  type WorkInfo,
  type SearchWorkData,
} from '@/api/admin/workTableManage.ts'
import { getDeptSortListService, getDeptListService, type DeptSort, type Department } from '@/api/admin/deptManage.ts'
import { ElMessage, ElMessageBox } from 'element-plus'
import request from '@/utils/request'

const loading = ref(false)

// 搜索表单
const searchForm = ref({
  doctorName: '',
  deptName: '',
})

// 值班列表数据
const workList = ref<WorkInfo[]>([])
const total = ref(0)
const pageNum = ref(1)
const pageSize = ref(10)

// 编辑对话框
const editDialogVisible = ref(false)
const editForm = ref({
  id: 0,
  doctorNo: '',
  doctorName: '',
  deptName: '',
  workDate: '',
  workTime: '',
  reserveMax: '',
})

// 新增对话框
const addDialogVisible = ref(false)
const addForm = ref({
  deptSortName: '',
  deptName: '',
  doctorName: '',
  workDate: '',
  workTime: '',
  reserveMax: '',
})

// 科室分类列表
const deptSortList = ref<DeptSort[]>([])
const deptList = ref<Department[]>([])
const doctorList = ref<string[]>([])

// 获取科室分类列表
const fetchDeptSortList = async () => {
  try {
    const result = await getDeptSortListService()
    if (result.code === 0 && result.data) {
      deptSortList.value = result.data
    }
  } catch (error) {
    ElMessage.error('获取科室分类失败')
    console.error(error)
  }
}

// 科室分类变更时获取科室列表
const handleDeptSortChange = async () => {
  addForm.value.deptName = ''
  addForm.value.doctorName = ''
  doctorList.value = []
  if (addForm.value.deptSortName) {
    try {
      const result = await getDeptListService(addForm.value.deptSortName)
      if (result.code === 0 && result.data) {
        deptList.value = result.data
      }
    } catch (error) {
      ElMessage.error('获取科室列表失败')
      console.error(error)
    }
  } else {
    deptList.value = []
  }
}

// 科室变更时获取医生列表
const handleDeptChange = async () => {
  addForm.value.doctorName = ''
  if (addForm.value.deptName) {
    try {
      const result = await getDoctorListService(addForm.value.deptName)
      if (result.code === 0 && result.data) {
        doctorList.value = result.data
      }
    } catch (error) {
      ElMessage.error('获取医生列表失败')
      console.error(error)
    }
  } else {
    doctorList.value = []
  }
}

// 打开新增对话框
const handleAdd = () => {
  addForm.value = {
    deptSortName: '',
    deptName: '',
    doctorName: '',
    workDate: '',
    workTime: '',
    reserveMax: '',
  }
  deptList.value = []
  doctorList.value = []
  addDialogVisible.value = true
}

// 保存新增
const handleAddSave = async () => {
  if (!addForm.value.deptSortName || !addForm.value.deptName || !addForm.value.doctorName || !addForm.value.workDate || !addForm.value.workTime || !addForm.value.reserveMax) {
    ElMessage.warning('请填写完整信息')
    return
  }
  try {
    // 需要获取医生工号
    const doctorResult = await getDoctorListService(addForm.value.deptName)
    // 这里 doctorResult.data 返回的是医生名列表，需要找到对应的工号
    // 后端接口 /admin/findNoAndDept 可以根据医生名查工号
    const noResult = await request.get(`/admin/findNoAndDept?docName=${encodeURIComponent(addForm.value.doctorName)}`)
    if (noResult.code === 0 && noResult.data) {
      const result = await insertWorkListService({
        workDate: addForm.value.workDate,
        workTime: addForm.value.workTime,
        doctorNo: noResult.data.doctorNo,
        reserveMax: String(addForm.value.reserveMax),
      })
      if (result.code === 0) {
        ElMessage.success('添加成功')
        addDialogVisible.value = false
        fetchWorkList()
      } else {
        ElMessage.error(result.message || '添加失败')
      }
    }
  } catch (error) {
    ElMessage.error('添加失败')
    console.error(error)
  }
}

// 搜索
const handleSearch = () => {
  pageNum.value = 1
  fetchWorkList()
}

// 重置
const handleReset = () => {
  searchForm.value.doctorName = ''
  searchForm.value.deptName = ''
  handleSearch()
}

// 获取值班列表
const fetchWorkList = async () => {
  loading.value = true
  try {
    const data: SearchWorkData = {
      page: pageNum.value,
      pageSize: pageSize.value,
      doctorName: searchForm.value.doctorName || undefined,
      deptName: searchForm.value.deptName || undefined,
    }
    const result = await searchWorkListService(data)
    if (result.code === 0 && result.data) {
      workList.value = result.data.data || result.data.rows || []
      total.value = result.data.total || 0
    }
  } catch (error) {
    ElMessage.error('获取值班列表失败')
    console.error(error)
  } finally {
    loading.value = false
  }
}

// 分页变化
const handlePageChange = (page: number) => {
  pageNum.value = page
  fetchWorkList()
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  pageNum.value = 1
  fetchWorkList()
}

// 编辑
const handleEdit = (row: WorkInfo) => {
  editForm.value = {
    id: row.tableId,
    doctorNo: row.doctorNo,
    doctorName: row.doctorName,
    deptName: row.deptName,
    workDate: row.workDate,
    workTime: row.workTime,
    reserveMax: String(row.reserveMax),
  }
  editDialogVisible.value = true
}

// 保存编辑
const handleSave = async () => {
  try {
    const result = await updateWorkListService({
      id: editForm.value.id,
      workDate: editForm.value.workDate,
      workTime: editForm.value.workTime,
      doctorNo: editForm.value.doctorNo,
      reserveMax: editForm.value.reserveMax,
    })
    if (result.code === 0) {
      ElMessage.success('修改成功')
      editDialogVisible.value = false
      fetchWorkList()
    } else {
      ElMessage.error(result.message || '修改失败')
    }
  } catch (error) {
    ElMessage.error('修改失败')
    console.error(error)
  }
}

// 删除
const handleDelete = async (row: WorkInfo) => {
  try {
    await ElMessageBox.confirm('确定要删除该值班信息吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    const result = await deleteWorkListService(row.tableId)
    if (result.code === 0) {
      ElMessage.success('删除成功')
      fetchWorkList()
    } else {
      ElMessage.error(result.message || '删除失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
      console.error(error)
    }
  }
}

onMounted(() => {
  fetchWorkList()
  fetchDeptSortList()
})
</script>

<template>
  <div class="work-table-manage">
    <div class="header-row">
      <h2>排班管理</h2>
      <el-button type="primary" @click="handleAdd">添加值班</el-button>
    </div>

    <!-- 搜索区域 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="医生">
          <el-input v-model="searchForm.doctorName" placeholder="请输入医生姓名" clearable />
        </el-form-item>
        <el-form-item label="科室">
          <el-input v-model="searchForm.deptName" placeholder="请输入科室" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 值班列表 -->
    <el-card class="table-card">
      <el-table v-loading="loading" :data="workList" stripe>
        <el-table-column label="序号" min-width="60" align="center">
          <template #default="{ $index }">
            {{ (pageNum - 1) * pageSize + $index + 1 }}
          </template>
        </el-table-column>
        <el-table-column prop="doctorNo" label="医生工号" min-width="120" align="center" />
        <el-table-column prop="doctorName" label="医生" min-width="120" align="center" />
        <el-table-column prop="deptName" label="科室" min-width="120" align="center" />
        <el-table-column prop="workDate" label="值班日期" min-width="140" align="center" />
        <el-table-column prop="workTime" label="值班时间" min-width="100" align="center" />
        <el-table-column label="已预约/最大预约" min-width="150" align="center">
          <template #default="{ row }">
            {{ row.reserved || 0 }} / {{ row.reserveMax || 0 }}
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="150" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="pageNum"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>

    <!-- 编辑对话框 -->
    <el-dialog v-model="editDialogVisible" title="编辑值班信息" width="500px">
      <el-form :model="editForm" label-width="100px">
        <el-form-item label="医生">
          <el-input v-model="editForm.doctorName" disabled />
        </el-form-item>
        <el-form-item label="科室">
          <el-input v-model="editForm.deptName" disabled />
        </el-form-item>
        <el-form-item label="值班日期">
          <el-date-picker
            v-model="editForm.workDate"
            type="date"
            placeholder="选择日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="值班时间">
          <el-select v-model="editForm.workTime" placeholder="请选择时间段" style="width: 100%">
            <el-option label="上午" value="上午" />
            <el-option label="下午" value="下午" />
            <el-option label="晚上" value="晚上" />
          </el-select>
        </el-form-item>
        <el-form-item label="最大预约人数">
          <el-input-number v-model="editForm.reserveMax" :min="1" :max="100" style="width: 100%" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </template>
    </el-dialog>

    <!-- 新增对话框 -->
    <el-dialog v-model="addDialogVisible" title="添加值班" width="500px">
      <el-form :model="addForm" label-width="100px">
        <el-form-item label="科室分类">
          <el-select v-model="addForm.deptSortName" placeholder="请选择科室分类" style="width: 100%" @change="handleDeptSortChange">
            <el-option v-for="item in deptSortList" :key="item.deptSortId" :label="item.deptSortName" :value="item.deptSortName" />
          </el-select>
        </el-form-item>
        <el-form-item label="科室">
          <el-select v-model="addForm.deptName" placeholder="请先选择科室分类" style="width: 100%" :disabled="!addForm.deptSortName" @change="handleDeptChange">
            <el-option v-for="item in deptList" :key="item.deptId" :label="item.deptName" :value="item.deptName" />
          </el-select>
        </el-form-item>
        <el-form-item label="医生姓名">
          <el-select v-model="addForm.doctorName" placeholder="请先选择科室" style="width: 100%" :disabled="!addForm.deptName">
            <el-option v-for="item in doctorList" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="值班日期">
          <el-date-picker
            v-model="addForm.workDate"
            type="date"
            placeholder="选择日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="值班时间段">
          <el-select v-model="addForm.workTime" placeholder="请选择时间段" style="width: 100%">
            <el-option label="上午" value="上午" />
            <el-option label="下午" value="下午" />
            <el-option label="晚上" value="晚上" />
          </el-select>
        </el-form-item>
        <el-form-item label="最大预约人数">
          <el-input-number v-model="addForm.reserveMax" :min="1" :max="100" style="width: 100%" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleAddSave">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.work-table-manage {
  padding: 20px;
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

h2 {
  font-size: 20px;
  font-weight: 600;
  color: #303133;
  margin: 0;
}

.search-card {
  margin-bottom: 20px;
}

.search-form {
  margin-bottom: 0;
}

.table-card {
  background: #fff;
  border-radius: 4px;
}

.pagination-wrapper {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
