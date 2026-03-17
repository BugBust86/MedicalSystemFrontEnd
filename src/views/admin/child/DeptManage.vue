<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  getDeptSortListService,
  getDeptListService,
  addDeptService,
  deleteDeptService,
  type DeptSort,
  type Department,
  type AddDeptData,
} from '@/api/admin/deptManage.ts'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const deptSortList = ref<DeptSort[]>([])
const deptList = ref<Department[]>([])
const selectedSort = ref<string>('')

// 新增科室对话框
const dialogVisible = ref(false)
const deptForm = ref<AddDeptData>({
  deptName: '',
  deptSortName: '',
  introduction: '',
})
const formLoading = ref(false)

// 获取科室分类列表
const fetchDeptSortList = async () => {
  try {
    const result = await getDeptSortListService()
    if (result.code === 0 && result.data) {
      deptSortList.value = result.data
      const firstSort = result.data[0]
      if (firstSort && !selectedSort.value) {
        selectedSort.value = firstSort.deptSortName
      }
    }
  } catch (error) {
    ElMessage.error('获取科室分类失败')
    console.error(error)
  }
}

// 获取科室列表
const fetchDeptList = async () => {
  if (!selectedSort.value) {
    deptList.value = []
    return
  }
  loading.value = true
  try {
    const result = await getDeptListService(selectedSort.value)
    if (result.code === 0 && result.data) {
      deptList.value = result.data
    }
  } catch (error) {
    ElMessage.error('获取科室列表失败')
    console.error(error)
  } finally {
    loading.value = false
  }
}

// 切换分类时重新加载科室
const handleSortChange = () => {
  fetchDeptList()
}

// 重置表单
const resetForm = () => {
  deptForm.value = {
    deptName: '',
    deptSortName: selectedSort.value,
    introduction: '',
  }
}

// 打开新增对话框
const openDialog = () => {
  resetForm()
  deptForm.value.deptSortName = selectedSort.value
  dialogVisible.value = true
}

// 验证表单
const validateForm = (): boolean => {
  if (!deptForm.value.deptName.trim()) {
    ElMessage.warning('请输入科室名称')
    return false
  }
  if (!deptForm.value.deptSortName) {
    ElMessage.warning('请选择科室分类')
    return false
  }
  return true
}

// 提交新增
const submitForm = async () => {
  if (!validateForm()) return

  formLoading.value = true
  try {
    const result = await addDeptService(deptForm.value)
    if (result.code === 0) {
      ElMessage.success('科室添加成功')
      dialogVisible.value = false
      await fetchDeptList()
    } else {
      ElMessage.error(result.message || '科室添加失败')
    }
  } catch (error) {
    ElMessage.error('科室添加失败')
    console.error(error)
  } finally {
    formLoading.value = false
  }
}

// 删除科室
const handleDelete = async (deptName: string) => {
  try {
    await ElMessageBox.confirm('确定要删除该科室吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    const result = await deleteDeptService(deptName)
    if (result.code === 0) {
      ElMessage.success('科室删除成功')
      await fetchDeptList()
    } else {
      ElMessage.error(result.message || '科室删除失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('科室删除失败')
      console.error(error)
    }
  }
}

onMounted(async () => {
  await fetchDeptSortList()
  if (selectedSort.value) {
    await fetchDeptList()
  }
})
</script>

<template>
  <div class="dept-manage">
    <div class="header-row">
      <h2>科室管理</h2>
      <el-button type="primary" :disabled="!selectedSort" @click="openDialog">
        新增科室
      </el-button>
    </div>

    <div class="content-wrapper">
      <!-- 左侧分类列表 -->
      <div class="sort-panel">
        <div class="panel-title">科室分类</div>
        <el-radio-group v-model="selectedSort" @change="handleSortChange" class="sort-list">
          <el-radio v-for="sort in deptSortList" :key="sort.id" :value="sort.deptSortName">
            {{ sort.deptSortName }}
          </el-radio>
        </el-radio-group>
      </div>

      <!-- 右侧科室列表 -->
      <div class="dept-panel">
        <div class="panel-title">{{ selectedSort || '请选择分类' }}</div>
        <el-table v-loading="loading" :data="deptList" stripe style="width: 100%">
          <el-table-column prop="deptName" label="科室名称" />
          <el-table-column prop="introduction" label="简介" show-overflow-tooltip />
          <el-table-column label="操作" width="100">
            <template #default="{ row }">
              <el-button type="danger" size="small" @click="handleDelete(row.deptName)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-empty v-if="!loading && deptList.length === 0" description="暂无科室" />
      </div>
    </div>

    <!-- 新增科室对话框 -->
    <el-dialog
      v-model="dialogVisible"
      title="新增科室"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form :model="deptForm" label-width="80px">
        <el-form-item label="科室名称" required>
          <el-input v-model="deptForm.deptName" placeholder="请输入科室名称" />
        </el-form-item>
        <el-form-item label="所属分类" required>
          <el-select v-model="deptForm.deptSortName" placeholder="请选择科室分类" style="width: 100%">
            <el-option v-for="sort in deptSortList" :key="sort.id" :label="sort.deptSortName" :value="sort.deptSortName" />
          </el-select>
        </el-form-item>
        <el-form-item label="简介">
          <el-input v-model="deptForm.introduction" type="textarea" :rows="3" placeholder="请输入科室简介" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="formLoading" @click="submitForm">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.dept-manage {
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

.content-wrapper {
  display: flex;
  gap: 20px;
}

.sort-panel {
  width: 200px;
  background: #fff;
  border-radius: 4px;
  padding: 15px;
  flex-shrink: 0;
}

.dept-panel {
  flex: 1;
  background: #fff;
  border-radius: 4px;
  padding: 15px;
  min-width: 0;
}

.panel-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ebeef5;
}

.sort-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.sort-list :deep(.el-radio) {
  margin-right: 0;
  height: 36px;
  line-height: 36px;
}
</style>
