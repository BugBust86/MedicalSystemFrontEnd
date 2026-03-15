<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  getReservedPatientsService,
  type ReservedPatientInfo,
} from '@/api/doctor/doctorAppointment.ts'
import { ElMessage } from 'element-plus'

const patientList = ref<ReservedPatientInfo[]>([])
const loading = ref(false)
const dialogVisible = ref(false)
const currentPatient = ref<ReservedPatientInfo | null>(null)

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

// 查看患者详情
const handleView = (patient: ReservedPatientInfo) => {
  currentPatient.value = patient // 值绑定
  dialogVisible.value = true // 使对话框可见
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
        <el-table-column label="操作" align="center" width="100">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleView(row)"> 查看 </el-button>
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
      <template #footer>
        <el-button @click="dialogVisible = false">关闭</el-button>
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
</style>
