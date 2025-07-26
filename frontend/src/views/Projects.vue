<template>
  <div class="projects-page">
    <div class="page-header">
      <div class="header-content">
        <div class="header-text">
          <h1 class="page-title">项目概览</h1>
          <p class="page-description">管理和跟踪你的开发项目进度</p>
        </div>
        <el-button type="primary" size="large" @click="$router.push('/create')" class="create-btn">
          <el-icon><Plus /></el-icon>
          新建项目
        </el-button>
      </div>
    </div>

    <div class="filters-section">
      <div class="filters-container">
        <div class="filter-group">
          <label class="filter-label">状态筛选</label>
          <el-select v-model="filters.status" placeholder="所有状态" clearable @change="handleFilterChange" class="filter-select">
            <el-option label="想法" value="idea" />
            <el-option label="规划中" value="planning" />
            <el-option label="开发中" value="development" />
            <el-option label="测试中" value="testing" />
            <el-option label="已完成" value="completed" />
            <el-option label="暂停" value="paused" />
          </el-select>
        </div>
        
        <div class="filter-group">
          <label class="filter-label">优先级</label>
          <el-select v-model="filters.priority" placeholder="所有优先级" clearable @change="handleFilterChange" class="filter-select">
            <el-option label="低" value="low" />
            <el-option label="中" value="medium" />
            <el-option label="高" value="high" />
            <el-option label="紧急" value="urgent" />
          </el-select>
        </div>
        
        <div class="filter-group">
          <label class="filter-label">分类</label>
          <el-input v-model="filters.category" placeholder="搜索分类" clearable @input="handleFilterChange" class="filter-input" />
        </div>
        
        <div class="filter-actions">
          <el-button @click="clearFilters" size="small">
            <el-icon><RefreshLeft /></el-icon>
            清除筛选
          </el-button>
        </div>
      </div>
    </div>

    <div class="projects-container">
      <div v-loading="loading" class="projects-content">
        <div v-if="projects.length === 0 && !loading" class="empty-state">
          <el-icon size="80" color="#d1d5db"><DocumentAdd /></el-icon>
          <h3>还没有项目</h3>
          <p>开始创建你的第一个开发项目吧！</p>
          <el-button type="primary" size="large" @click="$router.push('/create')">
            <el-icon><Plus /></el-icon>
            创建项目
          </el-button>
        </div>
        
        <div v-else class="projects-grid">
          <div v-for="project in projects" :key="project.id" class="project-card" @click="goToProject(project.id)">
            <div class="card-header">
              <div class="title-section">
                <h3 class="project-title">{{ project.title }}</h3>
                <p class="project-category">{{ project.category || '未分类' }}</p>
              </div>
              <el-dropdown @command="handleCommand" @click.stop>
                <el-button text class="more-btn">
                  <el-icon><MoreFilled /></el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item :command="`edit-${project.id}`">
                      <el-icon><Edit /></el-icon>
                      编辑
                    </el-dropdown-item>
                    <el-dropdown-item :command="`delete-${project.id}`" divided class="danger-item">
                      <el-icon><Delete /></el-icon>
                      删除
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
            
            <div class="project-description">
              {{ project.description || '暂无项目描述' }}
            </div>
            
            <div class="project-tags">
              <el-tag :type="getStatusType(project.status)" size="small" class="status-tag">
                {{ getStatusText(project.status) }}
              </el-tag>
              <el-tag :type="getPriorityType(project.priority)" size="small" class="priority-tag">
                {{ getPriorityText(project.priority) }}
              </el-tag>
            </div>
            
            <div class="progress-section">
              <div class="progress-header">
                <span class="progress-label">完成进度</span>
                <span class="progress-value">{{ project.progress }}%</span>
              </div>
              <el-progress :percentage="project.progress" :show-text="false" :stroke-width="6" />
            </div>
            
            <div class="card-footer">
              <div class="task-info">
                <el-icon class="task-icon"><List /></el-icon>
                <span>{{ project.completed_tasks || 0 }}/{{ project.task_count || 0 }} 任务</span>
              </div>
              
              <div v-if="project.tech_stack && project.tech_stack.length" class="tech-stack">
                <el-tag 
                  v-for="tech in project.tech_stack.slice(0, 2)" 
                  :key="tech" 
                  size="small" 
                  effect="plain"
                  class="tech-tag"
                >
                  {{ tech }}
                </el-tag>
                <span v-if="project.tech_stack.length > 2" class="more-tech">
                  +{{ project.tech_stack.length - 2 }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useProjectStore } from '@/stores/project'
import { ElMessageBox, ElMessage } from 'element-plus'
import { Plus, DocumentAdd, MoreFilled, Edit, Delete, List, RefreshLeft } from '@element-plus/icons-vue'

const router = useRouter()
const projectStore = useProjectStore()

const { projects, loading } = projectStore
const filters = reactive({
  status: '',
  priority: '',
  category: ''
})

const getStatusType = (status) => {
  const types = {
    idea: '',
    planning: 'info',
    development: 'warning',
    testing: 'warning',
    completed: 'success',
    paused: 'info'
  }
  return types[status] || ''
}

const getStatusText = (status) => {
  const texts = {
    idea: '想法',
    planning: '规划中',
    development: '开发中',
    testing: '测试中',
    completed: '已完成',
    paused: '暂停'
  }
  return texts[status] || status
}

const getPriorityType = (priority) => {
  const types = {
    low: 'info',
    medium: '',
    high: 'warning',
    urgent: 'danger'
  }
  return types[priority] || ''
}

const getPriorityText = (priority) => {
  const texts = {
    low: '低',
    medium: '中',
    high: '高',
    urgent: '紧急'
  }
  return texts[priority] || priority
}

const handleFilterChange = () => {
  console.log('筛选条件变更:', filters)
  projectStore.setFilters(filters)
}

const clearFilters = () => {
  Object.assign(filters, {
    status: '',
    priority: '',
    category: ''
  })
  projectStore.clearFilters()
}

const goToProject = (id) => {
  router.push(`/project/${id}`)
}

const handleCommand = async (command) => {
  const [action, id] = command.split('-')
  
  if (action === 'edit') {
    router.push(`/project/${id}`)
  } else if (action === 'delete') {
    try {
      await ElMessageBox.confirm('确定要删除这个项目吗？', '确认删除', {
        type: 'warning'
      })
      await projectStore.deleteProject(id)
      ElMessage.success('项目删除成功')
    } catch (error) {
      if (error !== 'cancel') {
        console.error('删除项目失败:', error)
      }
    }
  }
}

onMounted(async () => {
  console.log('Projects页面已挂载，开始获取项目数据...')
  try {
    await projectStore.fetchProjects()
    console.log('项目数据获取成功，共', projects.value.length, '个项目')
  } catch (error) {
    console.error('初始加载项目失败:', error)
  }
})
</script>

<style scoped>
.projects-page {
  max-width: 100%;
}

.page-header {
  margin-bottom: 32px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #f1f5f9;
}

.header-text {
  flex: 1;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.page-description {
  font-size: 16px;
  color: #6b7280;
  margin: 0;
}

.create-btn {
  border-radius: 12px;
  height: 48px;
  padding: 0 24px;
  font-weight: 600;
}

.filters-section {
  margin-bottom: 24px;
}

.filters-container {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #f1f5f9;
  display: flex;
  gap: 24px;
  align-items: end;
}

.filter-group {
  flex: 1;
  max-width: 200px;
}

.filter-actions {
  display: flex;
  align-items: end;
  padding-bottom: 2px;
}

.filter-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
}

.filter-select,
.filter-input {
  width: 100%;
}

.projects-container {
  min-height: 400px;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 24px;
}

.project-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid #f1f5f9;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.project-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border-color: #e5e7eb;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.title-section {
  flex: 1;
}

.project-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 4px 0;
  line-height: 1.4;
}

.project-category {
  font-size: 13px;
  color: #9ca3af;
  margin: 0;
}

.more-btn {
  color: #9ca3af;
  padding: 8px;
  margin: -8px;
}

.more-btn:hover {
  color: #6366f1;
  background-color: #f3f4f6;
}

.project-description {
  color: #4b5563;
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 16px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  min-height: 42px;
}

.project-tags {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.status-tag,
.priority-tag {
  border-radius: 6px;
}

.progress-section {
  margin-bottom: 20px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.progress-label {
  font-size: 13px;
  color: #6b7280;
  font-weight: 500;
}

.progress-value {
  font-size: 13px;
  color: #1f2937;
  font-weight: 600;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.task-info {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #6b7280;
}

.task-icon {
  font-size: 14px;
}

.tech-stack {
  display: flex;
  align-items: center;
  gap: 6px;
}

.tech-tag {
  border-radius: 6px;
  background-color: #f8fafc;
  border-color: #e2e8f0;
  color: #475569;
}

.more-tech {
  font-size: 12px;
  color: #9ca3af;
  font-weight: 500;
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 16px;
  border: 2px dashed #e5e7eb;
}

.empty-state h3 {
  font-size: 20px;
  font-weight: 600;
  color: #374151;
  margin: 16px 0 8px 0;
}

.empty-state p {
  color: #6b7280;
  margin: 0 0 24px 0;
  font-size: 16px;
}

:deep(.el-dropdown-menu__item.danger-item) {
  color: #ef4444;
}

:deep(.el-dropdown-menu__item.danger-item:hover) {
  background-color: #fef2f2;
  color: #dc2626;
}

:deep(.el-progress-bar__outer) {
  background-color: #f1f5f9;
  border-radius: 3px;
}

:deep(.el-progress-bar__inner) {
  border-radius: 3px;
}

:deep(.el-button--primary) {
  background-color: #6366f1;
  border-color: #6366f1;
}

:deep(.el-button--primary:hover) {
  background-color: #5855eb;
  border-color: #5855eb;
}

:deep(.el-select .el-input__wrapper) {
  border-radius: 8px;
}

:deep(.el-input__wrapper) {
  border-radius: 8px;
}
</style>