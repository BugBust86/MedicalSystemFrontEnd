<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Plus, View, Promotion, Delete, Edit } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import {
  queryAllProjectService,
  queryOneProjectService,
  publishProjectService,
  deleteProjectService,
  addProjectService,
  updateProjectService,
  type CheckProject,
  type CheckProjectDetail,
} from '@/api/labTech/checkProject'

const projectList = ref<CheckProject[]>([])
const loading = ref(false)

// 获取检验项目列表
const fetchProjects = async () => {
  loading.value = true
  try {
    const result = await queryAllProjectService()
    if (result.code === 0 && result.data) {
      projectList.value = result.data
    } else {
      ElMessage.error(result.message || '获取检验项目失败')
    }
  } catch (error) {
    ElMessage.error('获取检验项目失败')
    console.error(error)
  } finally {
    loading.value = false
  }
}

// 新增项目对话框
const dialogVisible = ref(false)
const dialogLoading = ref(false)
const form = ref({
  itemName: '',
  itemDesc: '',
  itemPlace: '',
  startTime: '',
  endTime: '',
  reserveMax: '',
})
const formRef = ref()

// 查看详情对话框
const detailVisible = ref(false)
const detailLoading = ref(false)
const detailData = ref<CheckProjectDetail | null>(null)

// 编辑对话框
const editVisible = ref(false)
const editLoading = ref(false)
const editForm = ref({
  itemId: 0,
  itemName: '',
  itemDesc: '',
  itemPlace: '',
  startTime: '',
  endTime: '',
  reserveMax: '',
})

// 打开编辑对话框
const openEdit = () => {
  if (detailData.value && detailData.value.isActive === 1) {
    ElMessage.warning('已发布项目不可修改')
    return
  }
  if (detailData.value) {
    editForm.value = {
      itemId: detailData.value.itemId,
      itemName: detailData.value.itemName || '',
      itemDesc: detailData.value.itemDesc || '',
      itemPlace: detailData.value.itemPlace || '',
      startTime: detailData.value.startTime || '',
      endTime: detailData.value.endTime || '',
      reserveMax: detailData.value.reserveMax || '',
    }
  }
  editVisible.value = true
}

// 提交编辑
const submitEdit = async () => {
  if (!editForm.value.itemName) {
    ElMessage.warning('请输入项目名称')
    return
  }
  if (!editForm.value.itemPlace) {
    ElMessage.warning('请输入项目地点')
    return
  }
  if (!editForm.value.startTime) {
    ElMessage.warning('请选择开始时间')
    return
  }
  if (!editForm.value.endTime) {
    ElMessage.warning('请选择结束时间')
    return
  }
  if (!editForm.value.reserveMax) {
    ElMessage.warning('请输入最大预约数')
    return
  }

  editLoading.value = true
  try {
    const result = await updateProjectService({
      itemId: editForm.value.itemId,
      itemName: editForm.value.itemName,
      itemDesc: editForm.value.itemDesc,
      itemPlace: editForm.value.itemPlace,
      startTime: editForm.value.startTime,
      endTime: editForm.value.endTime,
      reserveMax: Number(editForm.value.reserveMax),
    })
    if (result.code === 0) {
      ElMessage.success('修改成功')
      editVisible.value = false
      detailVisible.value = false
      fetchProjects()
    } else {
      ElMessage.error(result.message || '修改失败')
    }
  } catch (error) {
    ElMessage.error('修改失败')
    console.error(error)
  } finally {
    editLoading.value = false
  }
}

// 查看项目详情
const viewProject = async (row: CheckProject) => {
  detailVisible.value = true
  detailLoading.value = true
  try {
    const result = await queryOneProjectService(row.itemId)
    if (result.code === 0 && result.data) {
      detailData.value = result.data
      console.log('查看详情返回数据:', result.data)
    } else {
      ElMessage.error(result.message || '获取项目详情失败')
      detailVisible.value = false
    }
  } catch (error) {
    ElMessage.error('获取项目详情失败')
    console.error(error)
    detailVisible.value = false
  } finally {
    detailLoading.value = false
  }
}

// 发布项目
const publishProject = async (row: CheckProject) => {
  try {
    const result = await publishProjectService(row.itemId)
    if (result.code === 0) {
      ElMessage.success('发布成功')
      fetchProjects()
    } else {
      ElMessage.error(result.message || '发布失败')
    }
  } catch (error) {
    ElMessage.error('发布失败')
    console.error(error)
  }
}

// 删除项目
const deleteProject = async (row: CheckProject) => {
  try {
    const result = await deleteProjectService(row.itemId)
    if (result.code === 0) {
      ElMessage.success('删除成功')
      fetchProjects()
    } else {
      ElMessage.error(result.message || '删除失败')
    }
  } catch (error) {
    ElMessage.error('删除失败')
    console.error(error)
  }
}

// 打开对话框
const openDialog = () => {
  form.value = {
    itemName: '',
    itemDesc: '',
    itemPlace: '',
    startTime: '',
    endTime: '',
    reserveMax: '',
  }
  dialogVisible.value = true
}

// 提交新增
const submitForm = async () => {
  if (!form.value.itemName) {
    ElMessage.warning('请输入项目名称')
    return
  }
  if (!form.value.itemPlace) {
    ElMessage.warning('请输入项目地点')
    return
  }
  if (!form.value.startTime) {
    ElMessage.warning('请选择开始时间')
    return
  }
  if (!form.value.endTime) {
    ElMessage.warning('请选择结束时间')
    return
  }
  if (!form.value.reserveMax) {
    ElMessage.warning('请输入最大预约数')
    return
  }

  dialogLoading.value = true
  try {
    const result = await addProjectService({
      itemName: form.value.itemName,
      itemDesc: form.value.itemDesc,
      itemPlace: form.value.itemPlace,
      startTime: form.value.startTime,
      endTime: form.value.endTime,
      reserveMax: Number(form.value.reserveMax),
    })
    if (result.code === 0) {
      ElMessage.success('新增成功')
      dialogVisible.value = false
      fetchProjects()
    } else {
      ElMessage.error(result.message || '新增失败')
    }
  } catch (error) {
    ElMessage.error('新增失败')
    console.error(error)
  } finally {
    dialogLoading.value = false
  }
}

onMounted(() => {
  fetchProjects()
})
</script>

<template>
  <div class="publish-project">
    <h2>发布检验项目</h2>
    <el-card v-loading="loading">
      <div class="table-header">
        <el-button type="primary" :icon="Plus" @click="openDialog">新增检查化验项目</el-button>
      </div>
      <el-table :data="projectList" stripe border :min-height="200">
        <el-table-column prop="itemName" label="项目名称" width="150" />
        <el-table-column prop="startTime" label="开始时间" />
        <el-table-column prop="endTime" label="结束时间" />
        <el-table-column label="操作" width="400" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" :icon="View" size="small" @click="viewProject(row)"
              >查看</el-button
            >
            <el-button type="success" :icon="Promotion" size="small" @click="publishProject(row)"
              >发布</el-button
            >
            <el-button type="danger" :icon="Delete" size="small" @click="deleteProject(row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-empty v-if="!loading && projectList.length === 0" description="暂无检验项目" />
    </el-card>

    <!-- 新增对话框 -->
    <el-dialog v-model="dialogVisible" title="新增检查化验项目" width="500px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="项目名称" required>
          <el-input v-model="form.itemName" placeholder="请输入项目名称" />
        </el-form-item>
        <el-form-item label="项目描述">
          <el-input
            v-model="form.itemDesc"
            type="textarea"
            :rows="3"
            placeholder="请输入项目描述"
          />
        </el-form-item>
        <el-form-item label="项目地点" required>
          <el-input v-model="form.itemPlace" placeholder="请输入项目地点" />
        </el-form-item>
        <el-form-item label="开始时间" required>
          <el-date-picker
            v-model="form.startTime"
            type="datetime"
            placeholder="选择开始时间"
            format="YYYY-MM-DD HH:mm"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="结束时间" required>
          <el-date-picker
            v-model="form.endTime"
            type="datetime"
            placeholder="选择结束时间"
            format="YYYY-MM-DD HH:mm"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="最大预约" required>
          <el-input-number
            v-model="form.reserveMax"
            :min="1"
            :max="9999"
            placeholder="请输入最大预约数"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="dialogLoading" @click="submitForm">确定</el-button>
      </template>
    </el-dialog>

    <!-- 查看详情对话框 -->
    <el-dialog
      v-model="detailVisible"
      title="检查化验项目详情"
      width="500px"
      v-loading="detailLoading"
    >
      <el-descriptions :column="1" border v-if="detailData">
        <el-descriptions-item label="项目ID">{{ detailData.itemId }}</el-descriptions-item>
        <el-descriptions-item label="项目名称">{{ detailData.itemName }}</el-descriptions-item>
        <el-descriptions-item label="项目描述">{{
          detailData.itemDesc || '-'
        }}</el-descriptions-item>
        <el-descriptions-item label="项目地点">{{ detailData.itemPlace }}</el-descriptions-item>
        <el-descriptions-item label="开始时间">{{ detailData.startTime }}</el-descriptions-item>
        <el-descriptions-item label="结束时间">{{ detailData.endTime }}</el-descriptions-item>
        <el-descriptions-item label="最大预约数">{{ detailData.reserveMax }}</el-descriptions-item>
        <el-descriptions-item label="已预约数">{{ detailData.reserved }}</el-descriptions-item>
        <el-descriptions-item label="剩余可预约">{{
          detailData.reserveEmpty
        }}</el-descriptions-item>
        <el-descriptions-item label="发布状态">
          <span style="display: none">{{
            console.log('isActive值:', detailData.isActive, '类型:', typeof detailData.isActive)
          }}</span>
          <el-tag :type="detailData.isActive === 1 ? 'success' : 'info'">
            {{ detailData.isActive === 1 ? '已发布' : '未发布' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="化验员工号">{{ detailData.labNo }}</el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button type="primary" :icon="Edit" @click="openEdit">修改</el-button>
        <el-button @click="detailVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 编辑对话框 -->
    <el-dialog v-model="editVisible" title="修改检查化验项目" width="500px">
      <el-form :model="editForm" label-width="100px">
        <el-form-item label="项目名称" required>
          <el-input v-model="editForm.itemName" placeholder="请输入项目名称" />
        </el-form-item>
        <el-form-item label="项目描述">
          <el-input
            v-model="editForm.itemDesc"
            type="textarea"
            :rows="3"
            placeholder="请输入项目描述"
          />
        </el-form-item>
        <el-form-item label="项目地点" required>
          <el-input v-model="editForm.itemPlace" placeholder="请输入项目地点" />
        </el-form-item>
        <el-form-item label="开始时间" required>
          <el-date-picker
            v-model="editForm.startTime"
            type="datetime"
            placeholder="选择开始时间"
            format="YYYY-MM-DD HH:mm"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="结束时间" required>
          <el-date-picker
            v-model="editForm.endTime"
            type="datetime"
            placeholder="选择结束时间"
            format="YYYY-MM-DD HH:mm"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="最大预约" required>
          <el-input-number
            v-model="editForm.reserveMax"
            :min="1"
            :max="9999"
            placeholder="请输入最大预约数"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editVisible = false">取消</el-button>
        <el-button type="primary" :loading="editLoading" @click="submitEdit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.publish-project {
  padding: 20px;
}

h2 {
  margin-bottom: 20px;
  font-size: 20px;
  font-weight: 600;
  color: #303133;
}
</style>
