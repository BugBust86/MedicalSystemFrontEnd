<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getDoctorInfoService, type DoctorInfo } from '@/api/doctor.ts'
import { ElMessage } from 'element-plus'

const userInfo = ref<DoctorInfo | null>(null)
const loading = ref(false)

// 获取个人中心信息
const fetchUserInfo = async () => {
  loading.value = true
  try {
    const result = await getDoctorInfoService()
    if (result.code === 0 && result.data) {
      userInfo.value = result.data
    }
  } catch (error) {
    ElMessage.error('获取个人信息失败')
    console.error(error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchUserInfo()
})
</script>

<template>
  <div class="profile">
    <h2>个人中心</h2>
    <el-card v-loading="loading">
      <el-descriptions :column="1" border>
        <el-descriptions-item label="头像">
          <img
            v-if="userInfo?.pic"
            :src="userInfo.pic"
            alt="头像"
            style="width: 80px; height: 80px; border-radius: 50%"
          />
          <span v-else>无头像</span>
        </el-descriptions-item>
        <el-descriptions-item label="姓名">{{ userInfo?.name }}</el-descriptions-item>
        <el-descriptions-item label="工号">{{ userInfo?.staffId }}</el-descriptions-item>
        <el-descriptions-item label="电话">{{ userInfo?.phone }}</el-descriptions-item>
        <el-descriptions-item label="科室">{{ userInfo?.deptName }}</el-descriptions-item>
        <el-descriptions-item label="专业">{{ userInfo?.specialty }}</el-descriptions-item>
        <el-descriptions-item label="职称">{{ userInfo?.title }}</el-descriptions-item>
      </el-descriptions>
    </el-card>
  </div>
</template>

<style scoped>
.profile {
  padding: 20px;
}

h2 {
  margin-bottom: 20px;
  font-size: 20px;
  font-weight: 600;
  color: #303133;
}
</style>
