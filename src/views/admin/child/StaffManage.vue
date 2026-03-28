<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  getDoctorListService,
  getLabTechListService,
  registerDoctorService,
  registerLabTechService,
  deleteDoctorService,
  deleteLabTechService,
  updateDoctorService,
  getDeptListService,
  type DoctorInfo,
  type LabTechInfo,
  type RegisterDoctorData,
  type RegisterLabTechData,
  type DeptInfo,
} from '@/api/admin/staffManage.ts'
import { ElMessage, ElMessageBox } from 'element-plus'

const activeTab = ref('doctor')
const loading = ref(false)
const doctorList = ref<DoctorInfo[]>([])
const labTechList = ref<LabTechInfo[]>([])

// 获取医生列表
const fetchDoctorList = async () => {
  loading.value = true
  try {
    const result = await getDoctorListService()
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
    const result = await getLabTechListService()
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

// 新增医生对话框
const doctorDialogVisible = ref(false)
const doctorForm = ref<RegisterDoctorData>({
  doctorNo: '',
  doctorName: '',
  phone: '',
  deptName: '',
  title: '',
  specialty: '',
  role: '医生',
})
const doctorFormLoading = ref(false)

// 新增化验员对话框
const labTechDialogVisible = ref(false)
const labTechForm = ref<RegisterLabTechData>({
  labNo: '',
  labName: '',
  phone: '',
  role: '化验员',
})
const labTechFormLoading = ref(false)

// 编辑医生对话框
const editDoctorDialogVisible = ref(false)
const editDoctorForm = ref({
  doctorNo: '',
  title: '',
})
const editDoctorFormLoading = ref(false)

// 医生职称列表
const titleList = ['医师', '主治医师', '副主任医师', '主任医师']

// 科室列表
const deptList = ref<DeptInfo[]>([])

// 获取科室列表
const fetchDeptList = async () => {
  try {
    const result = await getDeptListService()
    if (result.code === 0 && result.data) {
      deptList.value = result.data
    }
  } catch (error) {
    ElMessage.error('获取科室列表失败')
    console.error(error)
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
    doctorNo: '',
    doctorName: '',
    phone: '',
    deptName: '',
    title: '',
    specialty: '',
    role: '医生',
  }
}
// 打开新增医生对话框
const openDoctorDialog = () => {
  resetDoctorForm()
  doctorDialogVisible.value = true
}

// 重置化验员表单
const resetLabTechForm = () => {
  labTechForm.value = {
    labNo: '',
    labName: '',
    phone: '',
    role: '化验员',
  }
}
// 打开新增化验员对话框
const openLabTechDialog = () => {
  resetLabTechForm()
  labTechDialogVisible.value = true
}

// 验证医生表单
const validateDoctorForm = (): boolean => {
  if (!doctorForm.value.doctorNo.trim()) {
    ElMessage.warning('请输入工号')
    return false
  }
  if (!doctorForm.value.doctorName.trim()) {
    ElMessage.warning('请输入姓名')
    return false
  }
  if (!doctorForm.value.phone.trim()) {
    ElMessage.warning('请输入电话')
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
  if (!labTechForm.value.labNo.trim()) {
    ElMessage.warning('请输入工号')
    return false
  }
  if (!labTechForm.value.labName.trim()) {
    ElMessage.warning('请输入姓名')
    return false
  }
  if (!labTechForm.value.phone.trim()) {
    ElMessage.warning('请输入电话')
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

// 打开编辑医生对话框
const openEditDoctorDialog = (row: DoctorInfo) => {
  editDoctorForm.value = {
    doctorNo: row.doctorNo,
    title: row.title,
  }
  editDoctorDialogVisible.value = true
}

// 提交编辑医生
const submitEditDoctor = async () => {
  if (!editDoctorForm.value.title) {
    ElMessage.warning('请选择职称')
    return
  }

  editDoctorFormLoading.value = true
  try {
    const result = await updateDoctorService(editDoctorForm.value.doctorNo, editDoctorForm.value.title)
    if (result.code === 0) {
      ElMessage.success('医生职称修改成功')
      editDoctorDialogVisible.value = false
      await fetchDoctorList()
    } else {
      ElMessage.error(result.message || '医生职称修改失败')
    }
  } catch (error) {
    ElMessage.error('医生职称修改失败')
    console.error(error)
  } finally {
    editDoctorFormLoading.value = false
  }
}
// 删除医生
const handleDeleteDoctor = async (row: DoctorInfo) => {
  try {
    await ElMessageBox.confirm(`确定要删除医生 "${row.doctorName}" 吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    const result = await deleteDoctorService(row.doctorNo)
    if (result.code === 0) {
      ElMessage.success('删除成功')
      await fetchDoctorList()
    } else {
      ElMessage.error(result.message || '删除失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
      console.error(error)
    }
  }
}

// 删除化验员
const handleDeleteLabTech = async (row: LabTechInfo) => {
  try {
    await ElMessageBox.confirm(`确定要删除化验员 "${row.labName}" 吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    const result = await deleteLabTechService(row.labNo)
    if (result.code === 0) {
      ElMessage.success('删除成功')
      await fetchLabTechList()
    } else {
      ElMessage.error(result.message || '删除失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
      console.error(error)
    }
  }
}

onMounted(() => {
  fetchDeptList()
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
      <el-button v-else type="primary" @click="openLabTechDialog"> 新增化验员 </el-button>
    </div>

    <el-tabs v-model="activeTab" @tab-change="handleTabChange" class="staff-tabs">
      <!-- 医生列表 -->
      <el-tab-pane label="医生" name="doctor">
        <el-table v-loading="loading" :data="doctorList" stripe style="width: 100%">
          <el-table-column prop="doctorNo" label="工号" width="120" />
          <el-table-column prop="doctorName" label="姓名" width="100" />
          <el-table-column prop="phone" label="电话" width="130" />
          <el-table-column prop="email" label="邮箱" width="180" />
          <el-table-column prop="deptName" label="科室" width="100" />
          <el-table-column prop="title" label="职称" width="100" />
          <el-table-column prop="specialty" label="擅长" />
          <el-table-column label="操作" width="150" fixed="right">
            <template #default="{ row }">
              <el-button type="primary" link @click="openEditDoctorDialog(row)"> 编辑 </el-button>
              <el-button type="danger" link @click="handleDeleteDoctor(row)"> 删除 </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <!-- 化验员列表 -->
      <el-tab-pane label="化验员" name="labTech">
        <el-table v-loading="loading" :data="labTechList" stripe style="width: 100%">
          <el-table-column prop="labNo" label="工号" width="120" />
          <el-table-column prop="labName" label="姓名" width="100" />
          <el-table-column prop="phone" label="电话" width="130" />
          <el-table-column prop="email" label="邮箱" />
          <el-table-column label="操作" width="150" fixed="right">
            <template #default="{ row }">
              <el-button type="danger" link @click="handleDeleteLabTech(row)"> 删除 </el-button>
            </template>
          </el-table-column>
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
          <el-input v-model="doctorForm.doctorNo" placeholder="请输入工号" />
        </el-form-item>
        <el-form-item label="姓名" required>
          <el-input v-model="doctorForm.doctorName" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="电话" required>
          <el-input v-model="doctorForm.phone" placeholder="请输入电话" />
        </el-form-item>
        <el-form-item label="科室" required>
          <el-select v-model="doctorForm.deptName" placeholder="请选择科室" style="width: 100%">
            <el-option v-for="dept in deptList" :key="dept.deptId" :label="dept.deptName" :value="dept.deptName" />
          </el-select>
        </el-form-item>
        <el-form-item label="职称" required>
          <el-select v-model="doctorForm.title" placeholder="请选择职称" style="width: 100%">
            <el-option v-for="title in titleList" :key="title" :label="title" :value="title" />
          </el-select>
        </el-form-item>
        <el-form-item label="擅长">
          <el-input v-model="doctorForm.specialty" placeholder="请输入擅长领域" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="doctorDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="doctorFormLoading" @click="submitDoctor"
          >确认</el-button
        >
      </template>
    </el-dialog>

    <!-- 编辑医生对话框 -->
    <el-dialog
      v-model="editDoctorDialogVisible"
      title="修改医生职称"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form :model="editDoctorForm" label-width="80px">
        <el-form-item label="工号">
          <el-input v-model="editDoctorForm.doctorNo" disabled />
        </el-form-item>
        <el-form-item label="职称" required>
          <el-select v-model="editDoctorForm.title" placeholder="请选择职称" style="width: 100%">
            <el-option v-for="t in titleList" :key="t" :label="t" :value="t" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editDoctorDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="editDoctorFormLoading" @click="submitEditDoctor"
          >确认</el-button
        >
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
          <el-input v-model="labTechForm.labNo" placeholder="请输入工号" />
        </el-form-item>
        <el-form-item label="姓名" required>
          <el-input v-model="labTechForm.labName" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="电话" required>
          <el-input v-model="labTechForm.phone" placeholder="请输入电话" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="labTechDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="labTechFormLoading" @click="submitLabTech"
          >确认</el-button
        >
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
