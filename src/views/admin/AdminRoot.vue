<template>
  <div class="admin-root">
    <el-container>
      <el-header class="header">
        <div class="header-title">医疗管理系统 - 管理端</div>
        <div class="header-user">
          您好，{{ userName }}
          <el-button type="info" plain size="small" @click="handleLogout" style="margin-left: 20px;">
            <el-icon><SwitchButton /></el-icon>
            退出登录
          </el-button>
        </div>
      </el-header>
      <el-container>
        <el-aside width="200px" class="aside">
          <el-menu class="menu">
            <el-menu-item index="dashboard">
              <el-icon><House /></el-icon>
              <span>仪表板</span>
            </el-menu-item>
            <el-menu-item index="users">
              <el-icon><User /></el-icon>
              <span>用户管理</span>
            </el-menu-item>
            <el-menu-item index="reports">
              <el-icon><Document /></el-icon>
              <span>报表管理</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-main class="main">
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { House, User, Document, SwitchButton } from '@element-plus/icons-vue'
import { ElButton, ElContainer, ElHeader, ElAside, ElMain, ElMenu, ElMenuItem, ElIcon } from 'element-plus'
import { ElMessage } from 'element-plus'

const router = useRouter()
const userName = ref('')

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

<style scoped>
.admin-root {
  min-height: 100vh;
}

.header {
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  padding: 0 20px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

.header-title {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
}

.aside {
  position: fixed;
  top: 60px;
  bottom: 0;
  left: 0;
  width: 200px;
  background-color: #f5f5f5;
  padding-top: 20px;
}

.main {
  margin-top: 60px;
  margin-left: 200px;
  background-color: #f5f7fa;
  padding: 20px;
}

.menu {
  border-right: none;
}
</style>