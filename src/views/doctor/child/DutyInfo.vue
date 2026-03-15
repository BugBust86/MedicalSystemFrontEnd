<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getDutyInfoService, type DutyInfo } from '@/api/doctor/doctorDutyInfo'
import { ElMessage } from 'element-plus'

const dutyInfoList = ref<DutyInfo[]>([])
const loading = ref(false)

// 获取值班信息
const fetchDutyInfo = async () => {
  loading.value = true
  try {
    const result = await getDutyInfoService()
    if (result.code === 0 && result.data) {
      dutyInfoList.value = result.data
    }
  } catch (error) {
    ElMessage.error('获取值班信息失败')
    console.error(error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchDutyInfo()
})
</script>

<template>
  <div class="duty-info">
    <h2>值班信息</h2>
    <el-card>
      <el-table :data="dutyInfoList" v-loading="loading" stripe border>
        <el-table-column prop="workDate" label="预约日期" align="center" />
        <el-table-column prop="workTime" label="预约时间" align="center" />
        <el-table-column prop="deptName" label="科室" align="center" />
        <el-table-column prop="doctorNo" label="工号" align="center" />
        <el-table-column prop="doctorName" label="姓名" align="center" />
        <el-table-column prop="reserveMax" label="最大可预约人数" align="center" />
        <el-table-column prop="reserved" label="已预约人数" align="center" />
      </el-table>
    </el-card>
  </div>
</template>

<style scoped>
.duty-info {
  padding: 20px;
}

h2 {
  margin-bottom: 20px;
  font-size: 20px;
  font-weight: 600;
  color: #303133;
}
</style>
