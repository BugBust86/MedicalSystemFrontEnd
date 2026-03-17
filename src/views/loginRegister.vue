<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElForm, ElMessage } from 'element-plus'
import { staffRegisterService, type StaffRegisterData } from '@/api/staff.ts'
import { staffLoginService, type StaffLoginData } from '@/api/staff.ts'

const router = useRouter()
// 表单ref引用，用于手动触发校验
const loginForm = ref<InstanceType<typeof ElForm>>()
const registerForm = ref<InstanceType<typeof ElForm>>()

// 绑定登录数据，用于在点击事件里向后端传请求
const loginData = reactive<StaffLoginData>({
  staffId: '',
  password: '',
  role: '医生',
})
// 使用的是reactiv的响应式数据，reactive只能接收数组、对象等引用类型数据，且reactive不用像ref那样.value.xx属性，直接.xx属性就好了
const registerData = reactive<StaffRegisterData>({
  staffId: '',
  name: '',
  phone: '',
  password: '',
  pswConfirm: '',
  role: '医生',
})
// 自定义密码确认的校验规则
const validatePsw = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请再次输入以确认密码'))
  } else if (value !== registerData.password) {
    callback(new Error('请确保两次输入的密码一样'))
  } else {
    callback()
  }
}
// 定义登录、注册的校验规则rules
const rules = {
  staffId: [{ required: true, message: '请输入工号', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 5, max: 16, message: '请输入5-16位的非空字符', trigger: 'blur' },
  ],
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { len: 11, message: '请输入11位的手机号', trigger: 'blur' },
  ],
  pswConfirm: [
    { validator: validatePsw, trigger: 'blur' }, // 鼠标放开不聚焦的时候触发校验
  ],
}
// 注册按钮点击事件（先校验表单）
const handleRegister = async () => {
  if (!registerForm.value) return
  // 先触发表单校验
  try {
    await registerForm.value.validate()
  } catch (error) {
    console.log(error)
    ElMessage.warning('请完善表单信息后再提交')
  }
  try {
    // 校验通过后调用接口，得到的result经过了拦截器的处理(因为Service底层调用了注册了拦截器的axios实例)，
    // 只有核心数据，若未通过会在拦截器处统一展示错误信息，并且在这里trycatch也能用ElementPlus的ElMessage打印弹窗友好提示
    const result = await staffRegisterService(registerData)
    if (result.code === 0) {
      ElMessage.success(result.message || '注册成功')
      // 注册成功后清空表单
      Object.keys(registerData).forEach((key) => {
        ;(registerData as Record<string, any>)[key] = ''
      })
    } else {
      ElMessage.error(result.message || '注册失败')
      console.log(result.message)
    }
  } catch (error) {
    // 表单校验失败时不执行接口请求
    console.log('注册失败', error)
  }
}
// 登录按钮点击事件（先校验表单）
const handleLogin = async () => {
  if (!loginForm.value) return
  try {
    // 先触发表单校验
    await loginForm.value.validate()
    // 校验通过后调用接口
    const result = await staffLoginService(loginData)
    console.log(loginData, result.code)
    if (result.code === 0) {
      ElMessage.success(result.message || '登录成功')
      // 存储 token、name 和 role 到 localStorage
      const token = (result as { data?: { token?: string } }).data?.token
      const name = (result as { data?: { name?: string } }).data?.name
      if (token) localStorage.setItem('token', token)
      if (name) localStorage.setItem('name', name)
      localStorage.setItem('role', loginData.role) // 存储角色信息
      
      // 获取重定向路径
      const redirectPath = router.currentRoute.value.query.redirect as string
      if (redirectPath) {
        // 如果有重定向路径，则跳转到该路径
        router.push(redirectPath)
      } else {
        // 根据角色跳转到对应页面
        if (loginData.role === '医生') {
          router.push('/doctor')
        } else if (loginData.role === '管理员') {
          router.push('/admin')
        } else if (loginData.role === '化验员') {
          router.push('/lab-technician')
        }
      }
    } else {
      ElMessage.error(result.message || '登录失败')
      console.log(result.message)
    }
  } catch (error) {
    console.log('登录失败', error)
  }
}
</script>

<template>
  <div class="wrapper">
    <h1>医疗管理系统</h1>
    <el-card class="login-card">
      <el-tabs class="custom-tabs">
        <el-tab-pane label="登录">
          <el-form :model="loginData" :rules="rules" ref="loginForm" class="login-form">
            <el-form-item label="工号：" prop="staffId">
              <el-input v-model="loginData.staffId" placeholder="请输入工号" />
            </el-form-item>
            <el-form-item label="密码：" prop="password">
              <el-input v-model="loginData.password" type="password" placeholder="请输入密码" show-password />
            </el-form-item>
            <el-form-item label="角色：" prop="role">
              <el-radio-group v-model="loginData.role">
                <el-radio value="医生">医生</el-radio>
                <el-radio value="化验员">化验员</el-radio>
                <el-radio value="管理员">管理员</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-button type="primary" class="center-btn" @click="handleLogin">登录</el-button>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="注册">
          <el-form :model="registerData" :rules="rules" ref="registerForm" class="register-form">
            <el-form-item label="工号：" prop="staffId">
              <el-input v-model="registerData.staffId" placeholder="请输入工号" />
            </el-form-item>
            <el-form-item label="姓名：" prop="name">
              <el-input v-model="registerData.name" placeholder="请输入姓名" />
            </el-form-item>
            <el-form-item label="手机号：" prop="phone">
              <el-input v-model="registerData.phone" placeholder="请输入手机号" />
            </el-form-item>
            <el-form-item label="密码：" prop="password">
              <el-input v-model="registerData.password" placeholder="请输入密码" show-password />
            </el-form-item>
            <el-form-item label="确认密码：" prop="pswConfirm">
              <el-input v-model="registerData.pswConfirm" placeholder="再次输入密码" show-password />
            </el-form-item>
            <el-form-item label="角色：" prop="role">
              <el-radio-group v-model="registerData.role">
                <el-radio value="医生">医生</el-radio>
                <el-radio value="化验员">化验员</el-radio>
                <el-radio value="管理员">管理员</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-button type="primary" class="center-btn" @click="handleRegister">注册</el-button>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<style scoped>
/* 外层容器：实现全屏居中，防止滚动 */
.wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f5f7fa;
  padding: 0 20px;
  margin: 0;
  overflow: hidden; /* 禁止页面滚动 */
  box-sizing: border-box;
}

/* 标题样式 */
h1 {
  font-size: 36px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 24px 0;
  text-align: center;
}

/* 卡片样式：固定大小，确保内容不溢出 */
.login-card {
  width: 100%;
  max-width: 460px;
  max-height: 90vh; /* 限制卡片最大高度为视口的90% */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  border: none;
  padding: 0;
  overflow-y: auto; /* 仅在卡片内部需要时滚动，而非整个页面 */
}

/* 标签页头部：实现登录/注册标签在两侧分布 */
.custom-tabs {
  --el-tabs-header-height: 48px;
}

.custom-tabs .el-tabs__header {
  display: flex;
  justify-content: space-between;
  margin: 0;
  border-bottom: 1px solid #e5e7eb;
  padding: 0 20px;
}

.custom-tabs .el-tabs__item {
  font-size: 16px;
  font-weight: 500;
  color: #6b7280;
  padding: 0 20px;
  height: 48px;
  line-height: 48px;
}

.custom-tabs .el-tabs__item.is-active {
  color: #409eff;
  font-weight: 600;
}

.custom-tabs .el-tabs__active-bar {
  height: 2px;
  background-color: #409eff;
}

/* 标签页内容区域 */
.custom-tabs .el-tabs__content {
  padding: 24px 20px;
}

/* 表单样式：优化间距 */
.login-form,
.register-form {
  max-width: 100%;
}

.el-form-item {
  margin-bottom: 18px;
}

.el-form-item__label {
  color: #374151;
  font-weight: 500;
  font-size: 14px;
}

/* 输入框样式 */
.el-input__wrapper {
  border-radius: 4px;
  box-shadow: 0 0 0 1px #dcdfe6 inset;
}

.el-input__wrapper:hover {
  box-shadow: 0 0 0 1px #c0c4cc inset;
}

.el-input.is-focus .el-input__wrapper {
  box-shadow: 0 0 0 1px #409eff inset;
}

/* 单选框样式 */
.el-radio {
  margin-right: 24px;
}

/* 按钮样式：实现文字完美居中 */
.center-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80%;
  height: 44px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 4px;
  margin: 24px auto 0; /* 上下间距 + 水平居中 */
  background-color: #409eff;
  border: none;
  line-height: 1; /* 重置行高，避免影响垂直居中 */
}

.center-btn:hover {
  background-color: #337ecc;
}

/* 响应式适配 */
@media (max-width: 480px) {
  h1 {
    font-size: 28px;
  }
  .login-card {
    max-width: 100%;
  }
  .center-btn {
    width: 90%;
  }
}
</style>