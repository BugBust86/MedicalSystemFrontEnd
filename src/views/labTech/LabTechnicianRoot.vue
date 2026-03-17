<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { UserFilled, Plus, SwitchButton } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()
const userName = ref('')

const activeMenu = computed(() => route.path)

onMounted(() => {
  userName.value = localStorage.getItem('name') || ''
})

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
      <div class="logo">化验员工作台</div>
      <el-menu class="menu" :default-active="activeMenu" router>
        <el-menu-item index="/lab-technician/profile">
          <el-icon><UserFilled /></el-icon>
          <span>个人中心</span>
        </el-menu-item>
        <el-menu-item index="/lab-technician/publish-project">
          <el-icon><Plus /></el-icon>
          <span>发布检验项目</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <!-- 右侧内容区 -->
    <el-container>
      <!-- 头部 -->
      <el-header class="header">
        <div class="header-title">医疗管理系统 - 化验员端</div>
        <div class="header-user">
          您好，{{ userName }}
          <el-button type="info" plain size="small" @click="handleLogout" style="margin-left: 20px">
            <el-icon><SwitchButton /></el-icon>
            退出登录
          </el-button>
        </div>
      </el-header>

      <!-- 中间内容区 -->
      <el-main class="main">
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
