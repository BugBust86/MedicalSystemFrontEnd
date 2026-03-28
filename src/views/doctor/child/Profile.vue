<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  getDoctorInfoService,
  updateDoctorInfoService,
  type DoctorInfo,
} from '@/api/doctor/doctorProfile.ts'
import { uploadAvatarService } from '@/api/doctor/doctorProfile.ts'
import { updatePswService } from '@/api/staff'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, View, Upload } from '@element-plus/icons-vue'

// 处理头像 URL，后端已返回完整URL
const getAvatarUrl = (url: string): string => {
  if (!url) return '/images/default-avatar.png' // 如果为空返回默认的图片加载
  // 后端已返回完整URL，直接返回
  return url
}

const userInfo = ref<DoctorInfo | null>(null)
const loading = ref(false)
const avatarUrl = ref(userInfo.value?.pic) // 头像URL
const uploadLoading = ref(false) // 是否正在上传，如果正在上传避免重复网络请求
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

// 获取个人中心信息
const fetchUserInfo = async () => {
  loading.value = true
  try {
    const result = await getDoctorInfoService()
    console.log('API Response:', result) // 调试日志
    if (result.code === 0 && result.data) {
      userInfo.value = result.data
      avatarUrl.value = getAvatarUrl(result.data.pic || '')
      console.log('Processed avatarUrl:', avatarUrl.value) // 调试日志
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
  // Element Plus 的 el-upload 组件在文件选择后会传递一个包含文件信息的对象，其中 raw 属性就是浏览器原生的 File 对象
  const file = uploadFile.raw // uploadFile代表选择上传的文件的文件信息对象，该对象的 raw 属性就是浏览器原生的 File 对象
  //file.type 返回文件的 MIME 类型（如 'image/jpeg', 'image/png', 'application/pdf' 等）,如果以image/开头，则是图片文件
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
      if (userInfo.value) {
        userInfo.value.pic = result.data.url
      }
      ElMessage.success('头像上传成功')
    } else {
      ElMessage.error('上传失败')
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
    // 使用 MessageBox 显示头像
    ElMessageBox.confirm(
      `<div style="text-align: center;">
        <img src="${avatarUrl.value}" alt="头像" style="max-width: 100%; max-height: 400px; border-radius: 8px;"/>
      </div>`,
      '查看头像',
      {
        confirmButtonText: '关闭',
        showCancelButton: false,
        dangerouslyUseHTMLString: true,
        customClass: 'avatar-preview-dialog',
      }
    ).catch(() => {}) // 忽略取消操作
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

// 重置密码表单
const passwordForm = ref({
  oldPsw: '',
  newPsw: '',
})
const passwordLoading = ref(false)
// 重置密码
const resetPassword = async () => {
  if (!passwordForm.value.oldPsw) {
    ElMessage.warning('请输入旧密码')
    return
  }
  if (!passwordForm.value.newPsw) {
    ElMessage.warning('请输入新密码')
    return
  }
  if (passwordForm.value.newPsw.length < 5 || passwordForm.value.newPsw.length > 16) {
    ElMessage.warning('新密码长度必须在5-16字符之间')
    return
  }

  passwordLoading.value = true
  try {
    const result = await updatePswService({
      oldPsw: passwordForm.value.oldPsw,
      newPsw: passwordForm.value.newPsw,
    })
    if (result.code === 0) {
      ElMessage.success('密码修改成功')
      passwordForm.value = { oldPsw: '', newPsw: '' }
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
            <el-form-item label="电话">
              <span v-if="!isEditing">{{ userInfo?.phone || '-' }}</span>
              <el-input v-else v-model="editForm.phone" />
            </el-form-item>
            <el-form-item label="邮箱">
              <span v-if="!isEditing">{{ userInfo?.email || '-' }}</span>
              <el-input v-else v-model="editForm.email" />
            </el-form-item>
            <el-form-item label="科室">
              <span>{{ userInfo?.deptName || '-' }}</span>
            </el-form-item>
            <el-form-item label="擅长">
              <span v-if="!isEditing">{{ userInfo?.specialty || '-' }}</span>
              <el-input v-else v-model="editForm.specialty" />
            </el-form-item>
            <el-form-item label="职称">
              <span>{{ userInfo?.title || '-' }}</span>
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
              <!-- 头像预览 -->
              <div v-else class="avatar-placeholder">
                <el-icon :size="60"><Plus /></el-icon>
              </div>
            </div>
            <div class="avatar-actions">
              <el-button type="primary" :icon="View" @click="viewAvatar">查看头像</el-button>
              <el-upload
                class="avatar-upload-btn"
                action="/api/doctor/profile/upload-avatar"
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
                v-model="passwordForm.oldPsw"
                type="password"
                placeholder="请输入旧密码"
                show-password
              />
            </el-form-item>
            <el-form-item label="新密码">
              <el-input
                v-model="passwordForm.newPsw"
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

.avatar-preview-dialog .el-message-box__content {
  padding: 0 !important;
}

.avatar-preview-dialog .el-message-box__message {
  margin: 0 !important;
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
