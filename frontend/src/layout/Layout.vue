<template>
  <div class="layout">
    <header class="header">
      <div class="header-content">
        <div class="logo-section">
          <div class="logo">
            <el-icon size="28" color="#6366f1">
              <Document />
            </el-icon>
            <div class="logo-text">
              <h1 class="title">DevPlan</h1>
              <span class="subtitle">开发计划管理</span>
            </div>
          </div>
        </div>
        
        <nav class="navigation">
          <router-link to="/projects" class="nav-link" active-class="active">
            <el-icon><Folder /></el-icon>
            <span>项目</span>
          </router-link>
          <router-link to="/create" class="nav-link" active-class="active">
            <el-icon><Plus /></el-icon>
            <span>新建</span>
          </router-link>
        </nav>
      </div>
    </header>
    
    <main class="main-content">
      <div class="container">
        <transition name="fade" mode="out-in">
          <router-view />
        </transition>
      </div>
    </main>
  </div>
</template>

<script setup>
import { Document, Folder, Plus } from '@element-plus/icons-vue'
</script>

<style scoped>
.layout {
  min-height: 100vh;
  background-color: #fafbfc;
}

.header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo-section {
  display: flex;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-text {
  display: flex;
  flex-direction: column;
}

.title {
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
  line-height: 1;
}

.subtitle {
  font-size: 12px;
  color: #6b7280;
  font-weight: 400;
}

.navigation {
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 8px;
  text-decoration: none;
  color: #6b7280;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.2s ease;
  position: relative;
}

.nav-link:hover {
  color: #6366f1;
  background-color: #f3f4f6;
}

.nav-link.active {
  color: #6366f1;
  background-color: #eef2ff;
}

.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 2px;
  background-color: #6366f1;
  border-radius: 1px;
}

.main-content {
  padding: 32px 0;
  min-height: calc(100vh - 72px);
}
</style>