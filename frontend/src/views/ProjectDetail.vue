<template>
  <div v-loading="loading" class="project-detail-page">
    <div v-if="project" class="project-content">
      <div class="page-header">
        <div class="header-content">
          <div class="breadcrumb">
            <el-button @click="$router.back()" text class="back-btn">
              <el-icon><ArrowLeft /></el-icon>
              返回项目列表
            </el-button>
          </div>
          <div class="header-actions">
            <el-button @click="editMode = !editMode" :type="editMode ? 'default' : 'primary'" class="edit-btn">
              <el-icon><Edit /></el-icon>
              {{ editMode ? '取消编辑' : '编辑项目' }}
            </el-button>
          </div>
        </div>
      </div>

      <div v-if="!editMode" class="project-view">
        <div class="project-overview">
          <div class="overview-header">
            <div class="title-section">
              <h1 class="project-title">{{ project.title }}</h1>
              <p class="project-category">{{ project.category || '未分类' }}</p>
            </div>
            <div class="status-tags">
              <el-tag :type="getStatusType(project.status)" size="large" class="status-tag">
                {{ getStatusText(project.status) }}
              </el-tag>
              <el-tag :type="getPriorityType(project.priority)" size="large" class="priority-tag">
                {{ getPriorityText(project.priority) }}
              </el-tag>
            </div>
          </div>
          
          <div class="progress-overview">
            <div class="progress-header">
              <span class="progress-label">项目进度</span>
              <span class="progress-value">{{ project.progress }}%</span>
            </div>
            <el-progress :percentage="project.progress" :stroke-width="8" />
          </div>
        </div>

        <div class="project-details">
          <div class="main-content">
            <div class="detail-section">
              <h3 class="section-title">
                <el-icon><Document /></el-icon>
                项目描述
              </h3>
              <div class="section-content">
                <p class="description">{{ project.description || '暂无项目描述' }}</p>
              </div>
            </div>
            
            <div class="detail-section">
              <h3 class="section-title">
                <el-icon><Tools /></el-icon>
                技术栈
              </h3>
              <div class="section-content">
                <div v-if="project.tech_stack && project.tech_stack.length" class="tech-stack">
                  <el-tag 
                    v-for="tech in project.tech_stack" 
                    :key="tech" 
                    size="large"
                    class="tech-tag"
                  >
                    {{ tech }}
                  </el-tag>
                </div>
                <div v-else class="empty-state">
                  <el-icon><Warning /></el-icon>
                  <span>暂未设置技术栈</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="sidebar-content">
            <div class="info-card">
              <h3 class="card-title">项目信息</h3>
              <div class="info-list">
                <div class="info-item">
                  <div class="info-label">
                    <el-icon><Calendar /></el-icon>
                    开始日期
                  </div>
                  <div class="info-value">{{ formatDateOnly(project.start_date) }}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">
                    <el-icon><Timer /></el-icon>
                    目标日期
                  </div>
                  <div class="info-value">{{ formatDateOnly(project.target_date) }}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">
                    <el-icon><Clock /></el-icon>
                    创建时间
                  </div>
                  <div class="info-value">{{ formatDate(project.created_at) }}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">
                    <el-icon><Edit /></el-icon>
                    更新时间
                  </div>
                  <div class="info-value">{{ formatDate(project.updated_at) }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="editMode" class="project-edit">
        <el-form ref="formRef" :model="editForm" :rules="rules" label-width="100px" size="large">
          <el-row :gutter="24">
            <el-col :span="16">
              <el-form-item label="项目标题" prop="title">
                <el-input v-model="editForm.title" />
              </el-form-item>
              
              <el-form-item label="项目描述">
                <el-input 
                  v-model="editForm.description" 
                  type="textarea" 
                  :rows="4"
                />
              </el-form-item>
              
              <el-row :gutter="16">
                <el-col :span="8">
                  <el-form-item label="状态">
                    <el-select v-model="editForm.status">
                      <el-option label="想法" value="idea" />
                      <el-option label="规划中" value="planning" />
                      <el-option label="开发中" value="development" />
                      <el-option label="测试中" value="testing" />
                      <el-option label="已完成" value="completed" />
                      <el-option label="暂停" value="paused" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="优先级">
                    <el-select v-model="editForm.priority">
                      <el-option label="低" value="low" />
                      <el-option label="中" value="medium" />
                      <el-option label="高" value="high" />
                      <el-option label="紧急" value="urgent" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="进度">
                    <el-slider v-model="editForm.progress" :max="100" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>
            
            <el-col :span="8">
              <el-form-item label="分类">
                <el-input v-model="editForm.category" />
              </el-form-item>
              
              <el-form-item label="开始日期">
                <el-date-picker 
                  v-model="editForm.start_date" 
                  type="date"
                  style="width: 100%"
                />
              </el-form-item>
              
              <el-form-item label="目标日期">
                <el-date-picker 
                  v-model="editForm.target_date" 
                  type="date"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
          </el-row>
          
          <el-form-item>
            <el-button type="primary" @click="handleSave" :loading="saving">
              保存修改
            </el-button>
            <el-button @click="cancelEdit">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProjectStore } from '@/stores/project'
import { ElMessage } from 'element-plus'
import { ArrowLeft, Edit, Document, Tools, Warning, Calendar, Timer, Clock } from '@element-plus/icons-vue'
import dayjs from 'dayjs'

const route = useRoute()
const router = useRouter()
const projectStore = useProjectStore()

const { loading } = projectStore
const project = ref(null)
const editMode = ref(false)
const saving = ref(false)
const formRef = ref()

const editForm = reactive({
  title: '',
  description: '',
  status: '',
  priority: '',
  category: '',
  progress: 0,
  start_date: '',
  target_date: ''
})

const rules = {
  title: [
    { required: true, message: '请输入项目标题', trigger: 'blur' }
  ]
}

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

const formatDate = (dateString) => {
  return dayjs(dateString).format('YYYY-MM-DD HH:mm')
}

const formatDateOnly = (dateString) => {
  if (!dateString) return '未设置'
  return dayjs(dateString).format('YYYY年MM月DD日')
}

const initEditForm = () => {
  Object.assign(editForm, {
    title: project.value.title,
    description: project.value.description || '',
    status: project.value.status,
    priority: project.value.priority,
    category: project.value.category || '',
    progress: project.value.progress || 0,
    start_date: project.value.start_date || '',
    target_date: project.value.target_date || ''
  })
}

const handleSave = async () => {
  try {
    await formRef.value.validate()
    
    saving.value = true
    
    const updateData = {
      ...editForm,
      start_date: editForm.start_date ? dayjs(editForm.start_date).format('YYYY-MM-DD') : null,
      target_date: editForm.target_date ? dayjs(editForm.target_date).format('YYYY-MM-DD') : null
    }
    
    await projectStore.updateProject(route.params.id, updateData)
    project.value = await projectStore.fetchProjectById(route.params.id)
    editMode.value = false
    ElMessage.success('项目更新成功！')
  } catch (error) {
    console.error('更新项目失败:', error)
  } finally {
    saving.value = false
  }
}

const cancelEdit = () => {
  editMode.value = false
  initEditForm()
}

onMounted(async () => {
  try {
    project.value = await projectStore.fetchProjectById(route.params.id)
    initEditForm()
  } catch (error) {
    ElMessage.error('加载项目失败')
    router.push('/projects')
  }
})
</script>

<style scoped>
.project-detail-page {
  max-width: 100%;
}

.page-header {
  margin-bottom: 24px;
}

.header-content {
  background: white;
  border-radius: 16px;
  padding: 20px 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.back-btn {
  color: #6b7280;
  font-size: 14px;
  padding: 0;
}

.back-btn:hover {
  color: #6366f1;
}

.edit-btn {
  border-radius: 8px;
  font-weight: 500;
}

.project-view {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.project-overview {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #f1f5f9;
}

.overview-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.title-section {
  flex: 1;
}

.project-title {
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 8px 0;
  line-height: 1.2;
}

.project-category {
  font-size: 14px;
  color: #9ca3af;
  margin: 0;
}

.status-tags {
  display: flex;
  gap: 12px;
  align-items: center;
}

.status-tag,
.priority-tag {
  border-radius: 8px;
  font-weight: 500;
}

.progress-overview {
  background: #f8fafc;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #e2e8f0;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.progress-label {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.progress-value {
  font-size: 16px;
  font-weight: 700;
  color: #1f2937;
}

.project-details {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
}

.main-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.detail-section {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #f1f5f9;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 16px 0;
  padding-bottom: 12px;
  border-bottom: 1px solid #f1f5f9;
}

.section-content {
  line-height: 1.6;
}

.description {
  font-size: 15px;
  color: #4b5563;
  margin: 0;
}

.tech-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tech-tag {
  border-radius: 8px;
  background-color: #eff6ff;
  border-color: #bfdbfe;
  color: #1e40af;
  font-weight: 500;
}

.empty-state {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #9ca3af;
  font-style: italic;
}

.sidebar-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.info-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #f1f5f9;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 20px 0;
  padding-bottom: 12px;
  border-bottom: 1px solid #f1f5f9;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.info-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 500;
  color: #6b7280;
}

.info-value {
  font-size: 14px;
  color: #1f2937;
  font-weight: 500;
}

.project-edit {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #f1f5f9;
}

:deep(.el-form-item__label) {
  font-weight: 600;
  color: #374151;
}

:deep(.el-input__wrapper) {
  border-radius: 8px;
  border-color: #e5e7eb;
}

:deep(.el-input__wrapper:hover) {
  border-color: #d1d5db;
}

:deep(.el-input__wrapper.is-focus) {
  border-color: #6366f1;
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1);
}

:deep(.el-textarea__inner) {
  border-radius: 8px;
  border-color: #e5e7eb;
}

:deep(.el-textarea__inner:hover) {
  border-color: #d1d5db;
}

:deep(.el-textarea__inner:focus) {
  border-color: #6366f1;
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1);
}

:deep(.el-select .el-input__wrapper) {
  border-radius: 8px;
}

:deep(.el-date-editor .el-input__wrapper) {
  border-radius: 8px;
}

:deep(.el-button--primary) {
  background-color: #6366f1;
  border-color: #6366f1;
}

:deep(.el-button--primary:hover) {
  background-color: #5855eb;
  border-color: #5855eb;
}

:deep(.el-progress-bar__outer) {
  background-color: #f1f5f9;
  border-radius: 4px;
}

:deep(.el-progress-bar__inner) {
  border-radius: 4px;
}

@media (max-width: 1024px) {
  .project-details {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .overview-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .status-tags {
    align-self: stretch;
  }
}
</style>