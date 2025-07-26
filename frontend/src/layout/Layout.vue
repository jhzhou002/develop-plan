<template>
  <div class="layout">
    <el-container>
      <el-header class="header">
        <div class="header-content">
          <div class="logo">
            <el-icon size="24" color="#409eff">
              <Document />
            </el-icon>
            <span class="title">开发计划管理</span>
          </div>
          <nav class="nav">
            <router-link to="/projects" class="nav-item" active-class="active">
              项目列表
            </router-link>
            <router-link to="/create" class="nav-item" active-class="active">
              创建项目
            </router-link>
          </nav>
        </div>
      </el-header>
      <el-main class="main">
        <transition name="fade" mode="out-in">
          <router-view />
        </transition>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { Document } from '@element-plus/icons-vue'
</script>

<style scoped>
.layout {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  height: 64px;
  padding: 0;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 600;
  font-size: 18px;
  color: #303133;
}

.title {
  background: linear-gradient(135deg, #409eff, #667eea);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav {
  display: flex;
  gap: 20px;
}

.nav-item {
  padding: 8px 16px;
  border-radius: 20px;
  text-decoration: none;
  color: #606266;
  font-weight: 500;
  transition: all 0.3s ease;
  position: relative;
}

.nav-item:hover {
  color: #409eff;
  background: rgba(64, 158, 255, 0.1);
}

.nav-item.active {
  color: #409eff;
  background: rgba(64, 158, 255, 0.15);
}

.main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  min-height: calc(100vh - 64px);
}
</style>