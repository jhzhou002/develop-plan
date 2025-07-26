<template>
  <div class="projects-page">
    <div class="page-header">
      <div class="header-left">
        <h1 class="page-title">我的项目</h1>
        <p class="page-subtitle">管理你的开发计划和想法</p>
      </div>
      <el-button type="primary" size="large" @click="$router.push('/create')">
        <el-icon><Plus /></el-icon>
        新建项目
      </el-button>
    </div>

    <div class="filters">
      <el-row :gutter="16">
        <el-col :span="6">
          <el-select v-model="filters.status" placeholder="选择状态" clearable @change="handleFilterChange">
            <el-option label="想法" value="idea" />
            <el-option label="规划中" value="planning" />
            <el-option label="开发中" value="development" />
            <el-option label="测试中" value="testing" />
            <el-option label="已完成" value="completed" />
            <el-option label="暂停" value="paused" />
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-select v-model="filters.priority" placeholder="选择优先级" clearable @change="handleFilterChange">
            <el-option label="低" value="low" />
            <el-option label="中" value="medium" />
            <el-option label="高" value="high" />
            <el-option label="紧急" value="urgent" />
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-input v-model="filters.category" placeholder="项目分类" clearable @input="handleFilterChange" />
        </el-col>
      </el-row>
    </div>

    <div v-loading="loading" class="projects-grid">
      <div v-if="projects.length === 0 && !loading" class="empty-state">
        <el-icon size="64" color="#c0c4cc"><DocumentAdd /></el-icon>
        <p>还没有项目，开始创建你的第一个项目吧！</p>
        <el-button type="primary" @click="$router.push('/create')">创建项目</el-button>
      </div>
      
      <div v-for="project in projects" :key="project.id" class="project-card" @click="goToProject(project.id)">
        <div class="card-header">
          <div class="project-title">{{ project.title }}</div>
          <el-dropdown @command="handleCommand" @click.stop>
            <el-icon class="more-icon"><MoreFilled /></el-icon>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item :command="`edit-${project.id}`">编辑</el-dropdown-item>
                <el-dropdown-item :command="`delete-${project.id}`" divided>删除</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        
        <div class="project-description">
          {{ project.description || '暂无描述' }}
        </div>
        
        <div class="project-meta">
          <div class="meta-row">
            <el-tag :type="getStatusType(project.status)" size="small">
              {{ getStatusText(project.status) }}
            </el-tag>
            <el-tag :type="getPriorityType(project.priority)" size="small">
              {{ getPriorityText(project.priority) }}
            </el-tag>
          </div>
          
          <div class="meta-row">
            <span class="category">{{ project.category || '未分类' }}</span>
            <span class="task-count">{{ project.completed_tasks || 0 }}/{{ project.task_count || 0 }} 任务</span>
          </div>
        </div>
        
        <div class="progress-section">
          <div class="progress-info">
            <span>进度</span>
            <span>{{ project.progress }}%</span>
          </div>
          <el-progress :percentage="project.progress" :show-text="false" />
        </div>
        
        <div v-if="project.tech_stack && project.tech_stack.length" class="tech-stack">
          <el-tag v-for="tech in project.tech_stack" :key="tech" size="small" effect="plain">
            {{ tech }}
          </el-tag>
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
import { Plus, DocumentAdd, MoreFilled } from '@element-plus/icons-vue'

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
  projectStore.setFilters(filters)
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

onMounted(() => {
  projectStore.fetchProjects()
})
</script>

<style scoped>
.projects-page {
  max-width: 100%;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 32px;
}

.header-left {
  flex: 1;
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  color: white;
  margin: 0 0 8px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.page-subtitle {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
}

.filters {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
}

.project-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.project-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.project-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  flex: 1;
  line-height: 1.4;
}

.more-icon {
  color: #909399;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s;
}

.more-icon:hover {
  background: #f5f7fa;
  color: #409eff;
}

.project-description {
  color: #606266;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 16px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.project-meta {
  margin-bottom: 16px;
}

.meta-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.meta-row:last-child {
  margin-bottom: 0;
}

.category {
  font-size: 13px;
  color: #909399;
}

.task-count {
  font-size: 13px;
  color: #909399;
}

.progress-section {
  margin-bottom: 16px;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 13px;
  color: #606266;
}

.tech-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 60px 20px;
  color: rgba(255, 255, 255, 0.7);
}

.empty-state p {
  margin: 16px 0 24px 0;
  font-size: 16px;
}
</style>