<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import {
  queryAllProjectService,
  addProjectService,
  type CheckProject,
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
      <el-table :data="projectList" stripe border>
        <el-table-column prop="itemId" label="项目ID" width="100" />
        <el-table-column prop="itemName" label="项目名称" />
        <el-table-column prop="startTime" label="开始时间" width="180" />
        <el-table-column prop="endTime" label="结束时间" width="180" />
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
