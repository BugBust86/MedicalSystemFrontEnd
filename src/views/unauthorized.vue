<template>
  <div class="unauthorized-container">
    <div class="unauthorized-content">
      <h1>403</h1>
      <h2>无权访问</h2>
      <p>抱歉，您没有权限访问此页面。</p>
      <div class="actions">
        <el-button type="primary" @click="goHome">返回首页</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ElButton } from 'element-plus'

const router = useRouter()

const goHome = () => {
  router.push('/')
}
</script>

<style scoped>
.unauthorized-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f7fa;
}

.unauthorized-content {
  text-align: center;
  padding: 40px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.unauthorized-content h1 {
  font-size: 72px;
  color: #303133;
  margin: 0;
}

.unauthorized-content h2 {
  font-size: 24px;
  color: #606266;
  margin: 20px 0;
}

.unauthorized-content p {
  font-size: 16px;
  color: #909399;
  margin: 20px 0;
}

.actions {
  margin-top: 30px;
}
</style>