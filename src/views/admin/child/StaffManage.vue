<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  getStaffListService,
  registerDoctorService,
  registerLabTechService,
  type StaffInfo,
  type RegisterDoctorData,
  type RegisterLabTechData,
} from '@/api/admin/staffManage.ts'
import { ElMessage, ElMessageBox } from 'element-plus'

const activeTab = ref('doctor')
const loading = ref(false)
const doctorList = ref<StaffInfo[]>([])
const labTechList = ref<StaffInfo[]>([])

// 新增医生对话框
const doctorDialogVisible = ref(false)
const doctorForm = ref<RegisterDoctorData>({
  staffId: '',
  name: '',
  phone: '',
  password: '',
  deptName: '',
  title: '',
  specialty: '',
})
const doctorFormLoading = ref(false)

// 新增化验员对话框
const labTechDialogVisible = ref(false)
const labTechForm = ref<RegisterLabTechData>({
  staffId: '',
  name: '',
  phone: '',
  password: '',
})
const labTechFormLoading = ref(false)

// 科室列表（模拟）
const deptList = ref([
  '内科',
  '外科',
  '儿科',
  '妇科',
  '骨科',
  '眼科',
  '耳鼻喉科',
  '皮肤科',
  '口腔科',
  '中医科',
])

// 获取医生列表
const fetchDoctorList = async () => {
  loading.value = true
  try {
    const result = await getStaffListService('医生')
    if (result.code === 0 && result.data) {
      doctorList.value = result.data
    }
  } catch (error) {
    ElMessage.error('获取医生列表失败')
    console.error(error)
  } finally {
    loading.value = false
  }
}

// 获取化验员列表
const fetchLabTechList = async () => {
  loading.value = true
  try {
    const result = await getStaffListService('化验员')
    if (result.code === 0 && result.data) {
      labTechList.value = result.data
    }
  } catch (error) {
    ElMessage.error('获取化验员列表失败')
    console.error(error)
  } finally {
    loading.value = false
  }
}

// 加载数据
const loadData = async () => {
  if (activeTab.value === 'doctor') {
    await fetchDoctorList()
  } else {
    await fetchLabTechList()
  }
}

// 标签切换时重新加载数据
const handleTabChange = () => {
  loadData()
}

// 重置医生表单
const resetDoctorForm = () => {
  doctorForm.value = {
    staffId: '',
    name: '',
    phone: '',
    password: '',
    deptName: '',
    title: '',
    specialty: '',
  }
}

// 重置化验员表单
const resetLabTechForm = () => {
  labTechForm.value = {
    staffId: '',
    name: '',
    phone: '',
    password: '',
  }
}

// 打开新增医生对话框
const openDoctorDialog = () => {
  resetDoctorForm()
  doctorDialogVisible.value = true
}

// 打开新增化验员对话框
const openLabTechDialog = () => {
  resetLabTechForm()
  labTechDialogVisible.value = true
}

// 验证医生表单
const validateDoctorForm = (): boolean => {
  if (!doctorForm.value.staffId.trim()) {
    ElMessage.warning('请输入工号')
    return false
  }
  if (!doctorForm.value.name.trim()) {
    ElMessage.warning('请输入姓名')
    return false
  }
  if (!doctorForm.value.phone.trim()) {
    ElMessage.warning('请输入电话')
    return false
  }
  if (!doctorForm.value.password.trim()) {
    ElMessage.warning('请输入密码')
    return false
  }
  if (!doctorForm.value.deptName) {
    ElMessage.warning('请选择科室')
    return false
  }
  return true
}

// 验证化验员表单
const validateLabTechForm = (): boolean => {
  if (!labTechForm.value.staffId.trim()) {
    ElMessage.warning('请输入工号')
    return false
  }
  if (!labTechForm.value.name.trim()) {
    ElMessage.warning('请输入姓名')
    return false
  }
  if (!labTechForm.value.phone.trim()) {
    ElMessage.warning('请输入电话')
    return false
  }
  if (!labTechForm.value.password.trim()) {
    ElMessage.warning('请输入密码')
    return false
  }
  return true
}

// 提交新增医生
const submitDoctor = async () => {
  if (!validateDoctorForm()) return

  doctorFormLoading.value = true
  try {
    const result = await registerDoctorService(doctorForm.value)
    if (result.code === 0) {
      ElMessage.success('医生注册成功')
      doctorDialogVisible.value = false
      await fetchDoctorList()
    } else {
      ElMessage.error(result.message || '医生注册失败')
    }
  } catch (error) {
    ElMessage.error('医生注册失败')
    console.error(error)
  } finally {
    doctorFormLoading.value = false
  }
}

// 提交新增化验员
const submitLabTech = async () => {
  if (!validateLabTechForm()) return

  labTechFormLoading.value = true
  try {
    const result = await registerLabTechService(labTechForm.value)
    if (result.code === 0) {
      ElMessage.success('化验员注册成功')
      labTechDialogVisible.value = false
      await fetchLabTechList()
    } else {
      ElMessage.error(result.message || '化验员注册失败')
    }
  } catch (error) {
    ElMessage.error('化验员注册失败')
    console.error(error)
  } finally {
    labTechFormLoading.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <div class="staff-manage">
    <div class="header-row">
      <h2>员工管理</h2>
      <el-button v-if="activeTab === 'doctor'" type="primary" @click="openDoctorDialog">
        新增医生
      </el-button>
      <el-button v-else type="primary" @click="openLabTechDialog">
        新增化验员
      </el-button>
    </div>

    <el-tabs v-model="activeTab" @tab-change="handleTabChange" class="staff-tabs">
      <!-- 医生列表 -->
      <el-tab-pane label="医生" name="doctor">
        <el-table v-loading="loading" :data="doctorList" stripe style="width: 100%">
          <el-table-column prop="staffId" label="工号" width="120" />
          <el-table-column prop="name" label="姓名" width="100" />
          <el-table-column prop="phone" label="电话" width="130" />
          <el-table-column prop="email" label="邮箱" width="180" />
          <el-table-column prop="deptName" label="科室" width="100" />
          <el-table-column prop="title" label="职称" width="100" />
          <el-table-column prop="specialty" label="擅长" />
        </el-table>
      </el-tab-pane>

      <!-- 化验员列表 -->
      <el-tab-pane label="化验员" name="labTech">
        <el-table v-loading="loading" :data="labTechList" stripe style="width: 100%">
          <el-table-column prop="staffId" label="工号" width="120" />
          <el-table-column prop="name" label="姓名" width="100" />
          <el-table-column prop="phone" label="电话" width="130" />
          <el-table-column prop="email" label="邮箱" />
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <!-- 新增医生对话框 -->
    <el-dialog
      v-model="doctorDialogVisible"
      title="新增医生"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form :model="doctorForm" label-width="80px">
        <el-form-item label="工号" required>
          <el-input v-model="doctorForm.staffId" placeholder="请输入工号" />
        </el-form-item>
        <el-form-item label="姓名" required>
          <el-input v-model="doctorForm.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="电话" required>
          <el-input v-model="doctorForm.phone" placeholder="请输入电话" />
        </el-form-item>
        <el-form-item label="密码" required>
          <el-input v-model="doctorForm.password" type="password" placeholder="请输入密码" show-password />
        </el-form-item>
        <el-form-item label="科室" required>
          <el-select v-model="doctorForm.deptName" placeholder="请选择科室" style="width: 100%">
            <el-option v-for="dept in deptList" :key="dept" :label="dept" :value="dept" />
          </el-select>
        </el-form-item>
        <el-form-item label="职称">
          <el-input v-model="doctorForm.title" placeholder="请输入职称" />
        </el-form-item>
        <el-form-item label="擅长">
          <el-input v-model="doctorForm.specialty" placeholder="请输入擅长领域" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="doctorDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="doctorFormLoading" @click="submitDoctor">确认</el-button>
      </template>
    </el-dialog>

    <!-- 新增化验员对话框 -->
    <el-dialog
      v-model="labTechDialogVisible"
      title="新增化验员"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form :model="labTechForm" label-width="80px">
        <el-form-item label="工号" required>
          <el-input v-model="labTechForm.staffId" placeholder="请输入工号" />
        </el-form-item>
        <el-form-item label="姓名" required>
          <el-input v-model="labTechForm.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="电话" required>
          <el-input v-model="labTechForm.phone" placeholder="请输入电话" />
        </el-form-item>
        <el-form-item label="密码" required>
          <el-input v-model="labTechForm.password" type="password" placeholder="请输入密码" show-password />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="labTechDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="labTechFormLoading" @click="submitLabTech">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.staff-manage {
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

.staff-tabs {
  background: #fff;
  padding: 20px;
  border-radius: 4px;
}

:deep(.el-tabs__item) {
  font-size: 15px;
}
</style>
