<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  getPrescriptionService,
  addPrescriptionService,
  updatePrescriptionService,
  deletePrescriptionService,
  type PrescriptionItem,
  type PrescriptionData,
  type PrescriptionDetailDTO
} from '@/api/doctor.ts'
import { ElMessage, ElMessageBox } from 'element-plus'

const prescriptionList = ref<PrescriptionItem[]>([])
const loading = ref(false)
const dialogVisible = ref(false)
const isEdit = ref(false)
const currentId = ref<string>('')

// 表单数据
const form = ref<PrescriptionData>({
  prescriptionName: '',
  disease: '',
  prescriptionDesc: '',
  prescriptionDetails: []
})

// 获取处方列表
const fetchPrescriptions = async () => {
  loading.value = true
  try {
    const result = await getPrescriptionService()
    if (result.code === 0 && result.data) {
      prescriptionList.value = result.data
    }
  } catch (error) {
    ElMessage.error('获取处方列表失败')
    console.error(error)
  } finally {
    loading.value = false
  }
}

// 新增处方
const handleAdd = () => {
  isEdit.value = false
  currentId.value = ''
  form.value = {
    prescriptionName: '',
    disease: '',
    prescriptionDesc: '',
    prescriptionDetails: []
  }
  dialogVisible.value = true
}

// 编辑处方
const handleEdit = (row: PrescriptionItem) => {
  isEdit.value = true
  currentId.value = row.id
  form.value = {
    prescriptionName: row.prescriptionName,
    disease: row.disease,
    prescriptionDesc: row.prescriptionDesc,
    prescriptionDetails: [...row.prescriptionDetails]
  }
  dialogVisible.value = true
}

// 删除处方
const handleDelete = async (row: PrescriptionItem) => {
  try {
    await ElMessageBox.confirm('确定要删除该处方吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    const result = await deletePrescriptionService(row.id)
    if (result.code === 0) {
      ElMessage.success('删除成功')
      fetchPrescriptions()
    } else {
      ElMessage.error(result.message || '删除失败')
    }
  } catch (error) {
    console.log('取消删除')
  }
}

// 提交表单
const handleSubmit = async () => {
  try {
    if (isEdit.value) {
      const updateData: PrescriptionItem = {
        id: currentId.value,
        doctorId: '', // 这里可能需要从用户信息中获取
        ...form.value
      }
      const result = await updatePrescriptionService(updateData)
      if (result.code === 0) {
        ElMessage.success('更新成功')
        dialogVisible.value = false
        fetchPrescriptions()
      } else {
        ElMessage.error(result.message || '更新失败')
      }
    } else {
      const result = await addPrescriptionService(form.value)
      if (result.code === 0) {
        ElMessage.success('新增成功')
        dialogVisible.value = false
        fetchPrescriptions()
      } else {
        ElMessage.error(result.message || '新增失败')
      }
    }
  } catch (error) {
    console.error(error)
  }
}

// 增加处方明细
const addDetail = () => {
  form.value.prescriptionDetails.push({
    drugName: '',
    dosage: '',
    frequency: '',
    usage: '',
    drugRemark: ''
  })
}

// 删除处方明细
const removeDetail = (index: number) => {
  form.value.prescriptionDetails.splice(index, 1)
}

onMounted(() => {
  fetchPrescriptions()
})
</script>

<template>
  <div class="prescription">
    <h2>处方管理</h2>
    <el-card>
      <div class="toolbar">
        <el-button type="primary" @click="handleAdd"> 新增处方 </el-button>
      </div>
      <el-table :data="prescriptionList" v-loading="loading" stripe border>
        <el-table-column prop="prescriptionName" label="处方名" align="center" />
        <el-table-column prop="disease" label="适用疾病" align="center" />
        <el-table-column prop="prescriptionDesc" label="处方描述" align="center" />
        <el-table-column prop="prescriptionDetails" label="药品数量" align="center">
          <template #default="{ row }">
            {{ row.prescriptionDetails?.length || 0 }} 种
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center" />
        <el-table-column label="操作" align="center" width="180">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleEdit(row)"> 编辑 </el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)"> 删除 </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 新增/编辑处方对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑处方' : '新增处方'"
      width="800px"
      :close-on-click-modal="false"
    >
      <el-form :model="form" label-width="100px">
        <el-form-item label="处方名" required>
          <el-input v-model="form.prescriptionName" placeholder="请输入处方名" />
        </el-form-item>
        <el-form-item label="适用疾病" required>
          <el-input v-model="form.disease" placeholder="请输入适用疾病" />
        </el-form-item>
        <el-form-item label="处方描述">
          <el-input v-model="form.prescriptionDesc" type="textarea" :rows="2" placeholder="请输入处方描述" />
        </el-form-item>

        <!-- 处方明细列表 -->
        <el-divider>处方药品明细</el-divider>
        <div v-for="(detail, index) in form.prescriptionDetails" :key="index" class="detail-item">
          <el-row :gutter="10">
            <el-col :span="5">
              <el-input v-model="detail.drugName" placeholder="药品名称" />
            </el-col>
            <el-col :span="4">
              <el-input v-model="detail.dosage" placeholder="单次用量" />
            </el-col>
            <el-col :span="4">
              <el-input v-model="detail.frequency" placeholder="每日次数" />
            </el-col>
            <el-col :span="4">
              <el-input v-model="detail.usage" placeholder="用药方式" />
            </el-col>
            <el-col :span="5">
              <el-input v-model="detail.drugRemark" placeholder="药品备注" />
            </el-col>
            <el-col :span="2">
              <el-button type="danger" size="small" @click="removeDetail(index)"> 删除 </el-button>
            </el-col>
          </el-row>
        </div>
        <el-button type="primary" plain @click="addDetail" class="add-detail-btn"> 增加药品明细 </el-button>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit"> 确定 </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.prescription {
  padding: 20px;
}

h2 {
  margin-bottom: 20px;
  font-size: 20px;
  font-weight: 600;
  color: #303133;
}

.toolbar {
  margin-bottom: 15px;
}

.detail-item {
  margin-bottom: 10px;
}

.add-detail-btn {
  width: 100%;
  margin-top: 10px;
}
</style>