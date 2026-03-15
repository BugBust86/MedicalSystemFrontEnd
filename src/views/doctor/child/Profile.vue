<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  getDoctorInfoService,
  updateDoctorInfoService,
  type DoctorInfo,
} from '@/api/doctor/doctorProfile'
import { uploadAvatarService } from '@/api/doctor/doctorProfile.ts'
import { ElMessage } from 'element-plus'
import { Plus, View, Upload } from '@element-plus/icons-vue'

// 处理头像 URL，替换后端地址为前端代理地址
const getAvatarUrl = (url: string): string => {
  if (!url) return ''
  // 如果已经是完整 URL（http 开头），直接返回
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  // 如果是相对路径，添加前端代理前缀
  return url
}

const userInfo = ref<DoctorInfo | null>(null)
const loading = ref(false)
const avatarUrl = ref('')
const uploadLoading = ref(false)
const activeTab = ref('info')

// 编辑状态
const isEditing = ref(false)

// 编辑表单数据
const editForm = ref({
  phone: '',
  email: '',
  specialty: '',
})
const editLoading = ref(false)

// 切换编辑状态
const toggleEdit = () => {
  if (isEditing.value) {
    // 取消编辑时，恢复原始数据
    if (userInfo.value) {
      editForm.value = {
        phone: userInfo.value.phone || '',
        email: userInfo.value.email || '',
        specialty: userInfo.value.specialty || '',
      }
    }
  }
  isEditing.value = !isEditing.value
}

// 重置密码表单
const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
})
const passwordLoading = ref(false)

// 获取个人中心信息
const fetchUserInfo = async () => {
  loading.value = true
  try {
    const result = await getDoctorInfoService()
    if (result.code === 0 && result.data) {
      userInfo.value = result.data
      avatarUrl.value = getAvatarUrl(result.data.pic || '')
      editForm.value = {
        phone: result.data.phone || '',
        email: result.data.email || '',
        specialty: result.data.specialty || '',
      }
    }
  } catch (error) {
    ElMessage.error('获取个人信息失败')
    console.error(error)
  } finally {
    loading.value = false
  }
}

// 上传头像 - 使用 on-change 处理
const handleFileChange = async (uploadFile: any) => {
  const file = uploadFile.raw
  const isImage = file.type.startsWith('image/')
  const isLt5M = file.size / 1024 / 1024 < 5

  if (!isImage) {
    ElMessage.error('只能上传图片文件!')
    return
  }
  if (!isLt5M) {
    ElMessage.error('图片大小不能超过 5MB!')
    return
  }

  uploadLoading.value = true
  try {
    const formData = new FormData()
    formData.append('file', file)

    const result = await uploadAvatarService(formData)
    if (result.code === 0 && result.data) {
      avatarUrl.value = getAvatarUrl(result.data.url)
      if (userInfo.value) {
        userInfo.value.pic = result.data.url
      }
      ElMessage.success('头像上传成功')
    } else {
      ElMessage.error(result.message || '上传失败')
    }
  } catch (error) {
    ElMessage.error('上传头像失败')
    console.error(error)
  } finally {
    uploadLoading.value = false
  }
}

// 查看头像
const viewAvatar = () => {
  if (avatarUrl.value) {
    window.open(avatarUrl.value, '_blank')
  } else {
    ElMessage.warning('暂无头像')
  }
}

// 保存基本信息
const saveInfo = async () => {
  if (!editForm.value.phone.trim()) {
    ElMessage.warning('电话不能为空')
    return
  }

  editLoading.value = true
  try {
    const result = await updateDoctorInfoService({
      phone: editForm.value.phone,
      email: editForm.value.email || '',
      specialty: editForm.value.specialty,
    })
    if (result.code === 0) {
      ElMessage.success('保存成功')
      isEditing.value = false
      // 重新请求最新数据
      await fetchUserInfo()
      // 切换回基本资料 tab
      activeTab.value = 'info'
    } else {
      ElMessage.error(result.message || '保存失败')
    }
  } catch (error) {
    ElMessage.error('保存失败')
    console.error(error)
  } finally {
    editLoading.value = false
  }
}

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
    // 模拟重置密码API调用
    // const result = await resetPasswordService(passwordForm.value)
    // 这里使用setTimeout模拟
    await new Promise((resolve) => setTimeout(resolve, 500))
    ElMessage.success('密码重置成功')
    passwordForm.value = { oldPassword: '', newPassword: '' }
  } catch (error) {
    ElMessage.error('密码重置失败')
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
              <span v-if="!isEditing">{{ userInfo?.staffId || '-' }}</span>
            </el-form-item>
            <el-form-item label="电话">
              <span v-if="!isEditing">{{ userInfo?.phone || '-' }}</span>
              <el-input v-else v-model="editForm.phone" />
            </el-form-item>
            <el-form-item label="邮箱">
              <span v-if="!isEditing">{{ userInfo?.email || '-' }}</span>
              <el-input v-else v-model="editForm.email" />
            </el-form-item>
            <el-form-item label="科室">
              <span v-if="!isEditing">{{ userInfo?.deptName || '-' }}</span>
            </el-form-item>
            <el-form-item label="擅长">
              <span v-if="!isEditing">{{ userInfo?.specialty || '-' }}</span>
              <el-input v-else v-model="editForm.specialty" />
            </el-form-item>
            <el-form-item label="职称">
              <span v-if="!isEditing">{{ userInfo?.title || '-' }}</span>
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

        <!-- 更换头像 -->
        <el-tab-pane label="更换头像" name="avatar">
          <div class="avatar-section">
            <div class="avatar-preview">
              <img v-if="avatarUrl" :src="avatarUrl" class="avatar-large" />
              <div v-else class="avatar-placeholder">
                <el-icon :size="60"><Plus /></el-icon>
              </div>
            </div>
            <div class="avatar-actions">
              <el-button type="primary" :icon="View" @click="viewAvatar">查看头像</el-button>
              <el-upload
                class="avatar-upload-btn"
                action="#"
                :show-file-list="false"
                :auto-upload="false"
                :on-change="handleFileChange"
                :disabled="uploadLoading"
                accept="image/jpeg,image/png"
              >
                <el-button type="success" :icon="Upload" :loading="uploadLoading">
                  上传头像
                </el-button>
              </el-upload>
            </div>
            <div class="upload-tip">支持 jpg、png 格式，大小不超过 5MB</div>
          </div>
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

.avatar-section {
  text-align: center;
  padding: 20px;
}

.avatar-preview {
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
}

.avatar-large {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #ddd;
}

.avatar-placeholder {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: #f5f7fa;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed #dcdfe6;
  color: #909399;
}

.avatar-actions {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 15px;
}

.avatar-upload-btn {
  display: inline-block;
}

.upload-tip {
  font-size: 12px;
  color: #909399;
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
