<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Calendar, User, Document, Avatar, SwitchButton } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute() // 当前激活的路由对象
const activeMenu = ref('duty-info') // 默认菜单是值班信息
const userName = ref('')

onMounted(() => {
  userName.value = localStorage.getItem('name') || ''
})

// 监听路由变化，同步菜单选中状态
watch(
  () => route.path,
  (path) => {
    if (path.includes('duty-info')) activeMenu.value = 'duty-info'
    else if (path.includes('appointment')) activeMenu.value = 'appointment'
    else if (path.includes('prescription')) activeMenu.value = 'prescription'
    else if (path.includes('profile')) activeMenu.value = 'profile'
  },
  { immediate: true }
)

// 菜单点击事件
const handleMenuSelect = (index: string) => {
  activeMenu.value = index
  router.push(`/doctor/${index}`)
}

// 退出登录功能
const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('name')
  localStorage.removeItem('role')
  ElMessage.success('已退出登录')
  router.push('/')
}
</script>

<template>
  <el-container class="layout-container">
    <!-- 侧边栏 -->
    <el-aside width="220px" class="aside">
      <div class="logo">医生工作台</div>
      <el-menu :default-active="activeMenu" class="menu" @select="handleMenuSelect">
        <el-menu-item index="duty-info">
          <el-icon><Calendar /></el-icon>
          <span>值班信息</span>
        </el-menu-item>
        <el-menu-item index="appointment">
          <el-icon><User /></el-icon>
          <span>患者预约</span>
        </el-menu-item>
        <el-menu-item index="prescription">
          <el-icon><Document /></el-icon>
          <span>处方管理</span>
        </el-menu-item>
        <el-menu-item index="profile">
          <el-icon><Avatar /></el-icon>
          <span>个人中心</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <!-- 右侧内容区 -->
    <el-container>
      <!-- 头部 -->
      <el-header class="header">
        <div class="header-title">医疗管理系统 - 医生端</div>
        <div class="header-user">
          您好，{{ userName }}
          <el-button type="info" plain size="small" @click="handleLogout" style="margin-left: 20px;">
            <el-icon><SwitchButton /></el-icon>
            退出登录
          </el-button>
        </div>
      </el-header>

      <!-- 中间内容区 -->
      <el-main class="main">
        <!-- 内容区为路由视图，根据选中的跳转至对应的页面 -->
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
.layout-container {
  min-height: 100vh;
}

.aside {
  background-color: #304156;
}

.logo {
  height: 60px;
  line-height: 60px;
  text-align: center;
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  background-color: #2b3a4a;
}

.menu {
  border-right: none;
  background-color: #304156;
}

.menu .el-menu-item {
  color: #bfcbd9;
}

.menu .el-menu-item:hover {
  background-color: #263445;
  color: #409eff;
}

.menu .el-menu-item.is-active {
  background-color: #409eff;
  color: #fff;
}

.header {
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  padding: 0 20px;
}

.header-title {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
}

.main {
  background-color: #f5f7fa;
  padding: 20px;
}
</style>