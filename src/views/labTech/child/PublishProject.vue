<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

const loading = ref(false)

// 待实现的发布检验项目功能
onMounted(() => {
  // TODO: 等后端提供API后实现
})
</script>

<template>
  <div class="publish-project">
    <h2>发布检验项目</h2>
    <el-card>
      <el-empty description="待后端提供API后实现" />
    </el-card>
  </div>
</template>

<style scoped>
.publish-project {
  padding: 20px;
}

h2 {
  margin-bottom: 20px;
  font-size: 20px;
  font-weight: 600;
  color: #303133;
}
</style>
