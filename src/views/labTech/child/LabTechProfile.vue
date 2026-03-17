<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getLabTechInfoService, updatePswService, type LabTechInfo } from '@/api/labTech/labTechProfile'
import { ElMessage } from 'element-plus'

const userInfo = ref<LabTechInfo | null>(null)
const loading = ref(false)
const activeTab = ref('info')

// 编辑状态
const isEditing = ref(false)

// 编辑表单数据
const editForm = ref({
  phone: '',
  email: '',
})
const editLoading = ref(false)

// 切换编辑状态
const toggleEdit = () => {
  if (isEditing.value) {
    if (userInfo.value) {
      editForm.value = {
        phone: userInfo.value.phone || '',
        email: userInfo.value.email || '',
      }
    }
  }
  isEditing.value = !isEditing.value
}

// 获取个人信息
const fetchUserInfo = async () => {
  loading.value = true
  try {
    const result = await getLabTechInfoService()
    if (result.code === 0 && result.data) {
      userInfo.value = result.data
      editForm.value = {
        phone: result.data.phone || '',
        email: result.data.email || '',
      }
    }
  } catch (error) {
    ElMessage.error('获取个人信息失败')
    console.error(error)
  } finally {
    loading.value = false
  }
}

// 保存基本信息（化验员暂不支持修改个人信息，保留接口）
const saveInfo = async () => {
  ElMessage.info('化验员暂不支持修改个人信息')
  isEditing.value = false
}

// 密码表单
const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
})
const passwordLoading = ref(false)

// 重置密码
const resetPassword = async () => {
  if (!passwordForm.value.oldPassword) {
    ElMessage.warning('请输入旧密码')
    return
  }
  if (!passwordForm.value.newPassword) {
    ElMessage.warning('请输入新密码')
    return
  }
  if (passwordForm.value.newPassword.length < 6) {
    ElMessage.warning('新密码长度不能少于6位')
    return
  }

  passwordLoading.value = true
  try {
    const result = await updatePswService({
      oldPassword: passwordForm.value.oldPassword,
      newPassword: passwordForm.value.newPassword,
    })
    if (result.code === 0) {
      ElMessage.success('密码修改成功')
      passwordForm.value = { oldPassword: '', newPassword: '' }
    } else {
      ElMessage.error(result.message || '密码修改失败')
    }
  } catch (error) {
    ElMessage.error('密码修改失败')
    console.error(error)
  } finally {
    passwordLoading.value = false
  }
}

onMounted(() => {
  fetchUserInfo()
})
</script>

<template>
  <div class="profile">
    <h2>个人中心</h2>
    <el-card v-loading="loading" class="profile-card">
      <el-tabs v-model="activeTab" class="profile-tabs">
        <!-- 基本资料 -->
        <el-tab-pane label="基本资料" name="info">
          <el-form label-width="80px" class="profile-form">
            <el-form-item label="姓名">
              <span>{{ userInfo?.name || '-' }}</span>
            </el-form-item>
            <el-form-item label="工号">
              <span>{{ userInfo?.staffId || '-' }}</span>
            </el-form-item>
            <el-form-item label="角色">
              <span>{{ userInfo?.role || '-' }}</span>
            </el-form-item>
            <el-form-item label="电话">
              <span v-if="!isEditing">{{ userInfo?.phone || '-' }}</span>
              <el-input v-else v-model="editForm.phone" />
            </el-form-item>
            <el-form-item label="邮箱">
              <span v-if="!isEditing">{{ userInfo?.email || '-' }}</span>
              <el-input v-else v-model="editForm.email" />
            </el-form-item>
            <el-form-item>
              <el-button v-if="!isEditing" type="primary" @click="toggleEdit">编辑</el-button>
              <div v-else class="edit-actions">
                <el-button type="primary" :loading="editLoading" @click="saveInfo">确认</el-button>
                <el-button @click="toggleEdit">取消</el-button>
              </div>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <!-- 重置密码 -->
        <el-tab-pane label="重置密码" name="password">
          <el-form label-width="80px" class="profile-form password-form">
            <el-form-item label="旧密码">
              <el-input
                v-model="passwordForm.oldPassword"
                type="password"
                placeholder="请输入旧密码"
                show-password
              />
            </el-form-item>
            <el-form-item label="新密码">
              <el-input
                v-model="passwordForm.newPassword"
                type="password"
                placeholder="请输入新密码"
                show-password
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" :loading="passwordLoading" @click="resetPassword">
                提交
              </el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
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

.profile-card {
  max-width: 600px;
}

.profile-tabs {
  padding: 0 10px;
}

.profile-form {
  border: 1px solid #000;
  padding: 20px;
  border-radius: 4px;
}

.password-form {
  max-width: 400px;
}

.edit-actions {
  display: flex;
  gap: 10px;
}

:deep(.el-input__wrapper) {
  box-shadow: 0 0 0 1px #000 inset;
}

:deep(.el-input__inner) {
  color: #606266;
}

:deep(.el-tabs__item) {
  font-size: 15px;
}
</style>
