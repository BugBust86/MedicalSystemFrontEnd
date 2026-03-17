<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  getDoctorListByDeptSortService,
  getDoctorListByDeptService,
  findDocNoAndDeptService,
  searchWorkListService,
  addWorkService,
  updateWorkService,
  deleteWorkService,
  type DoctorInfo,
  type WorkInfo,
  type SearchWorkData,
  type AddWorkData,
  type UpdateWorkData,
} from '@/api/admin/workTableManage.ts'
import { getDeptSortListService, type DeptSort } from '@/api/admin/deptManage.ts'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)

// 搜索表单
const searchForm = ref<{
  docName: string
  deptName: string
  workDate: string
}>({
  docName: '',
  deptName: '',
  workDate: '',
})

// 科室分类和科室
const deptSortList = ref<DeptSort[]>([])
const deptList = ref<{ deptName: string }[]>([])
const selectedDeptSort = ref<string>('')
const selectedDept = ref<string>('')

// 值班列表数据
const workList = ref<WorkInfo[]>([])
const total = ref(0)
const pageNum = ref(1)
const pageSize = ref(10)

// 新增值班对话框
const dialogVisible = ref(false)
const workForm = ref<{
  docId: string
  docName: string
  deptName: string
  workDate: string
  workTime: string
}>({
  docId: '',
  docName: '',
  deptName: '',
  workDate: '',
  workTime: '',
})
const formLoading = ref(false)

// 编辑值班对话框
const editDialogVisible = ref(false)
const editForm = ref<{
  id: number
  workDate: string
  workTime: string
  workStatus: string
}>({
  id: 0,
  workDate: '',
  workTime: '',
  workStatus: '',
})
const editLoading = ref(false)

// 医生列表
const doctorList = ref<DoctorInfo[]>([])

// 值班时间段选项
const workTimeOptions = [
  { label: '上午', value: '上午' },
  { label: '下午', value: '下午' },
  { label: '夜班', value: '夜班' },
]

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

// 根据科室分类获取科室列表
const fetchDeptList = async () => {
  if (!selectedDeptSort.value) {
    deptList.value = []
    return
  }
  // 这里使用模拟数据，因为后端没有直接的接口
  // 实际应该调用后端接口获取科室列表
  const deptMap: Record<string, string[]> = {
    '内科': ['内科', '心血管内科', '消化内科', '呼吸内科'],
    '外科': ['外科', '普外科', '骨科', '神经外科'],
    '儿科': ['儿科', '新生儿科'],
    '妇科': ['妇科', '产科'],
  }
  deptList.value = (deptMap[selectedDeptSort.value] || []).map(d => ({ deptName: d }))
}

// 根据科室获取医生列表
const fetchDoctorList = async () => {
  if (!selectedDept.value) {
    doctorList.value = []
    return
  }
  try {
    const result = await getDoctorListByDeptService(selectedDept.value)
    if (result.code === 0 && result.data) {
      doctorList.value = result.data
    } else {
      // 如果没有数据，使用空数组
      doctorList.value = []
    }
  } catch (error) {
    doctorList.value = []
  }
}

// 搜索值班列表
const handleSearch = async () => {
  pageNum.value = 1
  await fetchWorkList()
}

// 获取值班列表
const fetchWorkList = async () => {
  loading.value = true
  try {
    const data: SearchWorkData = {
      docName: searchForm.value.docName || undefined,
      deptName: searchForm.value.deptName || undefined,
      workDate: searchForm.value.workDate || undefined,
      pageNum: pageNum.value,
      pageSize: pageSize.value,
    }
    const result = await searchWorkListService(data)
    if (result.code === 0 && result.data) {
      workList.value = result.data.rows
      total.value = result.data.total
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

// 科室分类变化
const handleDeptSortChange = () => {
  selectedDept.value = ''
  doctorList.value = []
  fetchDeptList()
}

// 科室变化
const handleDeptChange = () => {
  fetchDoctorList()
}

// 医生选择变化时自动填充信息
const handleDoctorChange = async (docName: string) => {
  if (!docName) {
    workForm.value.docId = ''
    workForm.value.deptName = ''
    return
  }
  try {
    const result = await findDocNoAndDeptService(docName)
    if (result.code === 0 && result.data) {
      workForm.value.docId = result.data.docId
      workForm.value.deptName = result.data.deptName
    }
  } catch (error) {
    console.error(error)
  }
}

// 打开新增对话框
const openAddDialog = () => {
  workForm.value = {
    docId: '',
    docName: '',
    deptName: '',
    workDate: '',
    workTime: '',
  }
  dialogVisible.value = true
}

// 提交新增
const submitAdd = async () => {
  if (!workForm.value.docName) {
    ElMessage.warning('请选择医生')
    return
  }
  if (!workForm.value.workDate) {
    ElMessage.warning('请选择日期')
    return
  }
  if (!workForm.value.workTime) {
    ElMessage.warning('请选择时间段')
    return
  }

  formLoading.value = true
  try {
    const data: AddWorkData = {
      docId: workForm.value.docId,
      docName: workForm.value.docName,
      deptName: workForm.value.deptName,
      workDate: workForm.value.workDate,
      workTime: workForm.value.workTime,
    }
    const result = await addWorkService(data)
    if (result.code === 0) {
      ElMessage.success('值班添加成功')
      dialogVisible.value = false
      await fetchWorkList()
    } else {
      ElMessage.error(result.message || '值班添加失败')
    }
  } catch (error) {
    ElMessage.error('值班添加失败')
    console.error(error)
  } finally {
    formLoading.value = false
  }
}

// 打开编辑对话框
const openEditDialog = (row: WorkInfo) => {
  editForm.value = {
    id: row.id,
    workDate: row.workDate,
    workTime: row.workTime,
    workStatus: row.workStatus,
  }
  editDialogVisible.value = true
}

// 提交编辑
const submitEdit = async () => {
  if (!editForm.value.workDate) {
    ElMessage.warning('请选择日期')
    return
  }
  if (!editForm.value.workTime) {
    ElMessage.warning('请选择时间段')
    return
  }

  editLoading.value = true
  try {
    const data: UpdateWorkData = {
      id: editForm.value.id,
      workDate: editForm.value.workDate,
      workTime: editForm.value.workTime,
      workStatus: editForm.value.workStatus,
    }
    const result = await updateWorkService(data)
    if (result.code === 0) {
      ElMessage.success('值班修改成功')
      editDialogVisible.value = false
      await fetchWorkList()
    } else {
      ElMessage.error(result.message || '值班修改失败')
    }
  } catch (error) {
    ElMessage.error('值班修改失败')
    console.error(error)
  } finally {
    editLoading.value = false
  }
}

// 删除值班
const handleDelete = async (row: WorkInfo) => {
  try {
    await ElMessageBox.confirm('确定要删除该值班记录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    const result = await deleteWorkService(row.id)
    if (result.code === 0) {
      ElMessage.success('值班删除成功')
      await fetchWorkList()
    } else {
      ElMessage.error(result.message || '值班删除失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('值班删除失败')
      console.error(error)
    }
  }
}

onMounted(async () => {
  await fetchDeptSortList()
  await fetchWorkList()
})
</script>

<template>
  <div class="work-table-manage">
    <div class="header-row">
      <h2>排班管理</h2>
      <el-button type="primary" @click="openAddDialog">
        新增值班
      </el-button>
    </div>

    <!-- 搜索区域 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="医生姓名">
          <el-input v-model="searchForm.docName" placeholder="请输入医生姓名" clearable />
        </el-form-item>
        <el-form-item label="科室">
          <el-input v-model="searchForm.deptName" placeholder="请输入科室" clearable />
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker
            v-model="searchForm.workDate"
            type="date"
            placeholder="选择日期"
            value-format="YYYY-MM-DD"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="searchForm = { docName: '', deptName: '', workDate: '' }">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 值班列表 -->
    <el-card class="table-card">
      <el-table v-loading="loading" :data="workList" stripe style="width: 100%">
        <el-table-column prop="docName" label="医生姓名" width="120" />
        <el-table-column prop="docId" label="工号" width="120" />
        <el-table-column prop="deptName" label="科室" width="120" />
        <el-table-column prop="workDate" label="日期" width="120" />
        <el-table-column prop="workTime" label="时间段" width="100" />
        <el-table-column prop="workStatus" label="状态" width="100">
          <template #default="{ row }">
            <el-tag v-if="row.workStatus === '已安排'" type="success">已安排</el-tag>
            <el-tag v-else-if="row.workStatus === '已取消'" type="danger">已取消</el-tag>
            <el-tag v-else type="info">{{ row.workStatus }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="openEditDialog(row)">
              编辑
            </el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)">
              删除
            </el-button>
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

    <!-- 新增值班对话框 -->
    <el-dialog
      v-model="dialogVisible"
      title="新增值班"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form :model="workForm" label-width="80px">
        <el-form-item label="科室分类">
          <el-select v-model="selectedDeptSort" placeholder="请选择科室分类" style="width: 100%" @change="handleDeptSortChange">
            <el-option v-for="sort in deptSortList" :key="sort.id" :label="sort.deptSortName" :value="sort.deptSortName" />
          </el-select>
        </el-form-item>
        <el-form-item label="科室">
          <el-select v-model="selectedDept" placeholder="请选择科室" style="width: 100%" @change="handleDeptChange" :disabled="!selectedDeptSort">
            <el-option v-for="dept in deptList" :key="dept.deptName" :label="dept.deptName" :value="dept.deptName" />
          </el-select>
        </el-form-item>
        <el-form-item label="医生">
          <el-select
            v-model="workForm.docName"
            placeholder="请选择医生"
            style="width: 100%"
            filterable
            @change="handleDoctorChange"
            :disabled="!selectedDept"
          >
            <el-option v-for="doc in doctorList" :key="doc.staffId" :label="doc.name" :value="doc.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker
            v-model="workForm.workDate"
            type="date"
            placeholder="选择日期"
            value-format="YYYY-MM-DD"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="时间段">
          <el-select v-model="workForm.workTime" placeholder="请选择时间段" style="width: 100%">
            <el-option v-for="time in workTimeOptions" :key="time.value" :label="time.label" :value="time.value" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="formLoading" @click="submitAdd">确认</el-button>
      </template>
    </el-dialog>

    <!-- 编辑值班对话框 -->
    <el-dialog
      v-model="editDialogVisible"
      title="编辑值班"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form :model="editForm" label-width="80px">
        <el-form-item label="日期">
          <el-date-picker
            v-model="editForm.workDate"
            type="date"
            placeholder="选择日期"
            value-format="YYYY-MM-DD"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="时间段">
          <el-select v-model="editForm.workTime" placeholder="请选择时间段" style="width: 100%">
            <el-option v-for="time in workTimeOptions" :key="time.value" :label="time.label" :value="time.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="editForm.workStatus" placeholder="请选择状态" style="width: 100%">
            <el-option label="已安排" value="已安排" />
            <el-option label="已取消" value="已取消" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="editLoading" @click="submitEdit">确认</el-button>
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
