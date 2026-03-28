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
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue'

const loading = ref(false)
const deptSortList = ref<DeptSort[]>([])
const deptList = ref<Department[]>([])
const selectedSort = ref<DeptSort | null>(null)
const showDeptList = ref(false)

// 新增科室对话框
const dialogVisible = ref(false)
const deptForm = ref<AddDeptData>({
  deptName: '',
  deptSortId: 0,
})
const formLoading = ref(false)

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

// 获取科室列表
const fetchDeptList = async (deptSortName: string) => {
  loading.value = true
  try {
    const result = await getDeptListService(deptSortName)
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

// 点击分类名查询该分类下的所有科室
const handleDeptSortClick = (sort: DeptSort) => {
  selectedSort.value = sort
  showDeptList.value = true
  fetchDeptList(sort.deptSortName)
}

// 返回分类列表
const backToSortList = () => {
  showDeptList.value = false
  selectedSort.value = null
  deptList.value = []
}

// 打开新增对话框
const openDialog = () => {
  deptForm.value = {
    deptName: '',
    deptSortId: selectedSort.value?.deptSortId || 0,
  }
  dialogVisible.value = true
}

// 验证表单
const validateForm = (): boolean => {
  if (!deptForm.value.deptName.trim()) {
    ElMessage.warning('请输入科室名称')
    return false
  }
  if (!deptForm.value.deptSortId) {
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
      await fetchDeptList(selectedSort.value!.deptSortName)
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
const handleDelete = async (dept: Department) => {
  try {
    await ElMessageBox.confirm(`确定要删除科室 "${dept.deptName}" 吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    const result = await deleteDeptService(dept.deptId)
    if (result.code === 0) {
      ElMessage.success('科室删除成功')
      await fetchDeptList(selectedSort.value!.deptSortName)
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
})
</script>

<template>
  <div class="dept-manage">
    <div class="header-row">
      <div class="title-wrapper">
        <el-button v-if="showDeptList" text @click="backToSortList" class="back-btn">
          <el-icon><ArrowLeft /></el-icon>
        </el-button>
        <h2>{{ showDeptList ? selectedSort?.deptSortName : '科室管理' }}</h2>
      </div>
      <el-button v-if="showDeptList" type="primary" @click="openDialog">
        新增科室
      </el-button>
    </div>

    <div class="content-wrapper">
      <!-- 科室分类列表 -->
      <div v-if="!showDeptList" class="sort-list-container">
        <div class="list-title">请选择科室分类</div>
        <div class="sort-grid">
          <div
            v-for="sort in deptSortList"
            :key="sort.deptSortId"
            class="sort-card"
            @click="handleDeptSortClick(sort)"
          >
            <div class="sort-name">{{ sort.deptSortName }}</div>
            <el-icon class="arrow-icon"><ArrowRight /></el-icon>
          </div>
        </div>
      </div>

      <!-- 科室列表 -->
      <div v-else class="dept-panel">
        <el-table v-loading="loading" :data="deptList" stripe style="width: 100%">
          <el-table-column prop="deptId" label="科室ID" width="100" />
          <el-table-column prop="deptName" label="科室名称" />
          <el-table-column label="操作" width="100">
            <template #default="{ row }">
              <el-button type="danger" size="small" @click="handleDelete(row)">
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
          <el-select v-model="deptForm.deptSortId" placeholder="请选择科室分类" style="width: 100%">
            <el-option
              v-for="sort in deptSortList"
              :key="sort.deptSortId"
              :label="sort.deptSortName"
              :value="sort.deptSortId"
            />
          </el-select>
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

.title-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
}

.back-btn {
  padding: 0;
  font-size: 18px;
}

h2 {
  font-size: 20px;
  font-weight: 600;
  color: #303133;
  margin: 0;
}

.content-wrapper {
  background: #fff;
  border-radius: 4px;
  padding: 20px;
  min-height: 500px;
}

.sort-list-container {
  padding: 10px;
}

.list-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 20px;
}

.sort-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
}

.sort-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.sort-card:hover {
  border-color: #409eff;
  box-shadow: 0 2px 12px rgba(64, 158, 255, 0.2);
}

.sort-name {
  font-size: 16px;
  color: #303133;
  font-weight: 500;
}

.arrow-icon {
  color: #909399;
  font-size: 16px;
}

.dept-panel {
  padding: 10px;
}
</style>
