<script setup lang="ts">
import { ref } from 'vue'

// 切换登录/注册标签
const activeTab = ref('login')

// 切换角色
const activeRole = ref('doctor')

// 表单数据
const formData = ref({
  username: '',
  password: '',
  remember: false,
})

// 密码可见性
const passwordVisible = ref(false)

// 切换密码可见性
const togglePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value
}
</script>

<template>
  <div class="login-container">
    <div class="login-header">
      <h1 class="login-title">医疗管理系统</h1>
      <p class="login-subtitle">高效管理医疗资源，提升医疗服务质量</p>
    </div>

    <div class="login-form-wrapper">        <!-- 最外层包裹所有表单等内容的盒子 -->
      <div class="login-tabs">  <!-- 登录注册项的盒子 -->
        <el-tabs v-model="activeTab" class="login-tab">     <!--  -->
          <el-tab-pane label="登录" name="login"></el-tab-pane>
          <el-tab-pane label="注册" name="register"></el-tab-pane>
        </el-tabs>
      </div>

      <div class="role-selector">
        <p class="role-label">角色</p>
        <el-radio-group v-model="activeRole" class="role-group">
          <el-radio-button label="doctor">医生</el-radio-button>
          <el-radio-button label="admin">管理员</el-radio-button>
          <el-radio-button label="lab">化验员</el-radio-button>
        </el-radio-group>
      </div>

      <el-form :model="formData" class="login-form">
        <el-form-item label="工号" class="form-item">
          <el-input
            v-model="formData.username"
            placeholder="请输入工号"
            prefix-icon="el-icon-user"
          ></el-input>
        </el-form-item>

        <el-form-item label="密码" class="form-item">
          <el-input
            v-model="formData.password"
            :type="passwordVisible ? 'text' : 'password'"
            placeholder="请输入密码"
            prefix-icon="el-icon-lock"
            :suffix-icon="passwordVisible ? 'el-icon-view' : 'el-icon-view-off'"
            @click:suffix="togglePasswordVisibility"
          ></el-input>
        </el-form-item>

        <div class="form-footer">
          <el-checkbox v-model="formData.remember">记住密码</el-checkbox>
          <el-link type="primary" :underline="false" class="forgot-password">忘记密码?</el-link>
        </div>

        <el-button type="primary" class="login-button" :loading="false" block>
          {{ activeTab === 'login' ? '登录' : '注册' }}
        </el-button>
      </el-form>
    </div>
  </div>
</template>

<style scoped lang="scss">
.login-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
  padding: 20px;
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.login-title {
  font-size: 28px;
  font-weight: bold;
  color: #1890ff;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;

  i {
    margin-right: 10px;
    font-size: 32px;
  }
}

.login-subtitle {
  font-size: 14px;
  color: #606266;
}

.login-form-wrapper {
  width: 100%;
  max-width: 400px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 30px;
}

.login-tabs {
  margin-bottom: 20px;
}

.role-selector {
  margin-bottom: 20px;
}

.role-label {
  font-size: 14px;
  color: #606266;
  margin-bottom: 8px;
}

.role-group {
  width: 100%;
}

.login-form {
  width: 100%;
}

.form-item {
  margin-bottom: 20px;
}

.form-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.forgot-password {
  font-size: 12px;
}

.login-button {
  width: 100%;
  height: 40px;
  font-size: 16px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .login-form-wrapper {
    padding: 20px;
  }

  .login-title {
    font-size: 24px;
  }
}
</style>
