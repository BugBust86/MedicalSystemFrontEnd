<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  getReservedPatientsService,
  addMedicalHistoryService,
  getMedicalHistoryService,
  updateMedicalHistoryService,
  type ReservedPatientInfo,
  type MedicalHistoryDetail,
} from '@/api/doctor/doctorAppointment.ts'
import { ElMessage } from 'element-plus'

const patientList = ref<ReservedPatientInfo[]>([])
const loading = ref(false)
const dialogVisible = ref(false)
const currentPatient = ref<ReservedPatientInfo | null>(null)

// 病历本表单数据
const historyForm = ref({
  medical_history: '',
  patientDescription: '',
  doctorAdvice: '',
  doctorName: '',
})
const submitting = ref(false)

// 查看病历本相关
const viewDialogVisible = ref(false)
const viewLoading = ref(false)
const historyDetail = ref<MedicalHistoryDetail | null>(null)
const isEditMode = ref(false)
const updateLoading = ref(false)

// 格式化是否接诊状态
const formatReceiveStatus = (isReceive: number) => {
  return isReceive === 1 ? '已接诊' : '未接诊'
}

// 获取预约患者列表
const fetchPatients = async () => {
  loading.value = true
  try {
    const result = await getReservedPatientsService()
    if (result.code === 0 && result.data) {
      patientList.value = result.data
    }
  } catch (error) {
    ElMessage.error('获取预约患者列表失败')
    console.error(error)
  } finally {
    loading.value = false
  }
}

// 点击接诊，查看患者详情
const handleView = (patient: ReservedPatientInfo) => {
  currentPatient.value = patient // 值绑定
  // 重置表单
  historyForm.value = {
    medical_history: '',
    patientDescription: '',
    doctorAdvice: '',
    doctorName: '',
  }
  dialogVisible.value = true // 使对话框可见
}

// 提交病历本
const handleSubmit = async () => {
  if (!currentPatient.value) return

  // 校验必填字段
  if (!historyForm.value.patientDescription.trim()) {
    ElMessage.warning('请输入患者描述')
    return
  }
  if (!historyForm.value.doctorName.trim()) {
    ElMessage.warning('请输入医生签名')
    return
  }

  submitting.value = true
  try {
    const result = await addMedicalHistoryService({
      reservationId: currentPatient.value.reservationId,
      cardId: currentPatient.value.cardId,
      medical_history: historyForm.value.medical_history,
      patientDescription: historyForm.value.patientDescription,
      doctorAdvice: historyForm.value.doctorAdvice,
      doctorName: historyForm.value.doctorName,
    })
    if (result.code === 0) {
      ElMessage.success('病历本填写成功')
      dialogVisible.value = false
      // 刷新患者列表
      fetchPatients()
    } else {
      ElMessage.error(result.message || '填写失败')
    }
  } catch (error) {
    ElMessage.error('填写病历本失败')
    console.error(error)
  } finally {
    submitting.value = false
  }
}

// 点击查看病历本
const handleViewHistory = async (patient: ReservedPatientInfo) => {
  currentPatient.value = patient
  viewDialogVisible.value = true
  viewLoading.value = true
  isEditMode.value = false

  try {
    const result = await getMedicalHistoryService(patient.reservationId)
    if (result.code === 0 && result.data) {
      historyDetail.value = result.data
    }
  } catch (error) {
    ElMessage.error('获取病历本失败')
    console.error(error)
  } finally {
    viewLoading.value = false
  }
}

// 点击修改按钮，进入编辑模式
const handleEdit = () => {
  isEditMode.value = true
}

// 提交更新病历本
const handleUpdate = async () => {
  if (!historyDetail.value) return

  updateLoading.value = true
  try {
    const result = await updateMedicalHistoryService({
      reservationId: currentPatient.value!.reservationId,
      medicalHistory: historyDetail.value.medicalHistory || '',
      patientDescription: historyDetail.value.patientDescription,
      doctorAdvice: historyDetail.value.doctorAdvice || '',
    })
    if (result.code === 0) {
      ElMessage.success('修改成功')
      isEditMode.value = false
      fetchPatients()
    } else {
      ElMessage.error(result.message || '修改失败')
    }
  } catch (error) {
    ElMessage.error('修改病历本失败')
    console.error(error)
  } finally {
    updateLoading.value = false
  }
}

onMounted(() => {
  fetchPatients()
})
</script>

<template>
  <div class="appointment">
    <h2>患者预约</h2>
    <el-card>
      <el-table :data="patientList" v-loading="loading" stripe border>
        <el-table-column prop="reserveDate" label="预约日期" align="center" />
        <el-table-column prop="reserveTime" label="预约时间" align="center" />
        <el-table-column prop="patientName" label="患者姓名" align="center" />
        <el-table-column prop="gender" label="性别" align="center" />
        <el-table-column prop="age" label="年龄" align="center" />
        <el-table-column prop="contactPhone" label="联系电话" align="center" />
        <el-table-column prop="deptName" label="科室" align="center" />
        <el-table-column prop="doctorName" label="医生姓名" align="center" />
        <el-table-column label="是否接诊" align="center">
          <template #default="{ row }">
            <el-tag :type="row.isReceive === 1 ? 'success' : 'info'">
              {{ formatReceiveStatus(row.isReceive) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="100">
          <template #default="{ row }">
            <el-button
              :type="row.isReceive === 1 ? 'success' : 'primary'"
              size="small"
              @click="row.isReceive === 1 ? handleViewHistory(row) : handleView(row)"
            >
              {{ row.isReceive === 1 ? '查看' : '接诊' }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 填写病历本对话框 -->
    <el-dialog
      v-model="dialogVisible"
      title="填写病历本"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-descriptions :column="1" border v-if="currentPatient">
        <el-descriptions-item label="预约日期">{{
          currentPatient.reserveDate
        }}</el-descriptions-item>
        <el-descriptions-item label="预约时间">{{
          currentPatient.reserveTime
        }}</el-descriptions-item>
        <el-descriptions-item label="患者姓名">{{
          currentPatient.patientName
        }}</el-descriptions-item>
        <el-descriptions-item label="性别">{{ currentPatient.gender }}</el-descriptions-item>
        <el-descriptions-item label="年龄">{{ currentPatient.age }}</el-descriptions-item>
        <el-descriptions-item label="联系电话">{{
          currentPatient.contactPhone
        }}</el-descriptions-item>
        <el-descriptions-item label="科室">{{ currentPatient.deptName }}</el-descriptions-item>
        <el-descriptions-item label="医生姓名">{{
          currentPatient.doctorName
        }}</el-descriptions-item>
      </el-descriptions>

      <el-form label-width="100px" class="history-form">
        <el-form-item label="过往病史">
          <el-input
            v-model="historyForm.medical_history"
            type="textarea"
            :rows="3"
            placeholder="请输入过往病史"
          />
        </el-form-item>
        <el-form-item label="患者描述" required>
          <el-input
            v-model="historyForm.patientDescription"
            type="textarea"
            :rows="3"
            placeholder="请输入患者描述"
          />
        </el-form-item>
        <el-form-item label="医生建议">
          <el-input
            v-model="historyForm.doctorAdvice"
            type="textarea"
            :rows="3"
            placeholder="请输入医生建议"
          />
        </el-form-item>
        <el-form-item label="医生签名" required>
          <el-input v-model="historyForm.doctorName" placeholder="请输入医生签名" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">关闭</el-button>
        <el-button type="primary" :loading="submitting" @click="handleSubmit"> 确定 </el-button>
      </template>
    </el-dialog>

    <!-- 查看病历本对话框 -->
    <el-dialog v-model="viewDialogVisible" title="查看病历本" width="500px" v-loading="viewLoading">
      <el-descriptions :column="1" border v-if="historyDetail">
        <el-descriptions-item label="预约日期">{{
          historyDetail.reserveDate
        }}</el-descriptions-item>
        <el-descriptions-item label="预约时间">{{
          historyDetail.reserveTime
        }}</el-descriptions-item>
        <el-descriptions-item label="患者姓名">{{
          historyDetail.patientName
        }}</el-descriptions-item>
        <el-descriptions-item label="性别">{{ historyDetail.gender }}</el-descriptions-item>
        <el-descriptions-item label="年龄">{{ historyDetail.age }}</el-descriptions-item>
        <el-descriptions-item label="联系电话">{{
          historyDetail.contactPhone
        }}</el-descriptions-item>
        <el-descriptions-item label="科室">{{ historyDetail.deptName }}</el-descriptions-item>
      </el-descriptions>

      <!-- 非编辑模式：只读显示 -->
      <template v-if="!isEditMode">
        <el-descriptions :column="1" border class="history-detail" v-if="historyDetail">
          <el-descriptions-item label="过往病史">{{
            historyDetail.medicalHistory || '无'
          }}</el-descriptions-item>
          <el-descriptions-item label="患者描述">{{
            historyDetail.patientDescription
          }}</el-descriptions-item>
          <el-descriptions-item label="医生建议">{{
            historyDetail.doctorAdvice || '无'
          }}</el-descriptions-item>
          <el-descriptions-item label="医生姓名">{{ historyDetail.doctorName }}</el-descriptions-item>
        </el-descriptions>
      </template>

      <!-- 编辑模式：可编辑输入框 -->
      <el-form v-else label-width="100px" class="history-form">
        <el-form-item label="过往病史">
          <el-input
            v-model="historyDetail!.medicalHistory"
            type="textarea"
            :rows="3"
            placeholder="请输入过往病史"
          />
        </el-form-item>
        <el-form-item label="患者描述">
          <el-input
            v-model="historyDetail!.patientDescription"
            type="textarea"
            :rows="3"
            placeholder="请输入患者描述"
          />
        </el-form-item>
        <el-form-item label="医生建议">
          <el-input
            v-model="historyDetail!.doctorAdvice"
            type="textarea"
            :rows="3"
            placeholder="请输入医生建议"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button v-if="!isEditMode" @click="viewDialogVisible = false">关闭</el-button>
        <el-button v-if="!isEditMode" type="primary" @click="handleEdit">修改</el-button>

        <template v-else>
          <el-button @click="isEditMode = false">取消</el-button>
          <el-button type="primary" :loading="updateLoading" @click="handleUpdate">确定</el-button>
        </template>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.appointment {
  padding: 20px;
}

h2 {
  margin-bottom: 20px;
  font-size: 20px;
  font-weight: 600;
  color: #303133;
}

.history-form {
  margin-top: 20px;
}
</style>
