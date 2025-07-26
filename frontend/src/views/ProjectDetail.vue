<template>
  <div v-loading="loading" class="project-detail-page">
    <div v-if="project" class="project-content">
      <div class="page-header">
        <el-button @click="$router.back()" text>
          <el-icon><ArrowLeft /></el-icon>
          返回项目列表
        </el-button>
        <div class="header-actions">
          <el-button @click="editMode = !editMode">
            <el-icon><Edit /></el-icon>
            {{ editMode ? '取消编辑' : '编辑项目' }}
          </el-button>
        </div>
      </div>

      <div v-if="!editMode" class="project-view">
        <div class="project-header">
          <h1 class="project-title">{{ project.title }}</h1>
          <div class="project-meta">
            <el-tag :type="getStatusType(project.status)" size="large">
              {{ getStatusText(project.status) }}
            </el-tag>
            <el-tag :type="getPriorityType(project.priority)" size="large">
              {{ getPriorityText(project.priority) }}
            </el-tag>
          </div>
        </div>

        <div class="project-info">
          <el-row :gutter="24">
            <el-col :span="16">
              <div class="info-section">
                <h3>项目描述</h3>
                <p class="description">{{ project.description || '暂无描述' }}</p>
              </div>
              
              <div class="info-section">
                <h3>进度跟踪</h3>
                <div class="progress-info">
                  <div class="progress-text">
                    <span>整体进度</span>
                    <span>{{ project.progress }}%</span>
                  </div>
                  <el-progress :percentage="project.progress" />
                </div>
              </div>
              
              <div class="info-section">
                <h3>技术栈</h3>
                <div class="tech-stack">
                  <el-tag 
                    v-for="tech in (project.tech_stack || [])" 
                    :key="tech" 
                    size="large"
                  >
                    {{ tech }}
                  </el-tag>
                  <span v-if="!project.tech_stack || project.tech_stack.length === 0" class="empty-text">
                    暂未设置技术栈
                  </span>
                </div>
              </div>
            </el-col>
            
            <el-col :span="8">
              <div class="sidebar-info">
                <div class="info-item">
                  <label>项目分类</label>
                  <span>{{ project.category || '未分类' }}</span>
                </div>
                <div class="info-item">
                  <label>开始日期</label>
                  <span>{{ project.start_date || '未设置' }}</span>
                </div>
                <div class="info-item">
                  <label>目标日期</label>
                  <span>{{ project.target_date || '未设置' }}</span>
                </div>
                <div class="info-item">
                  <label>创建时间</label>
                  <span>{{ formatDate(project.created_at) }}</span>
                </div>
                <div class="info-item">
                  <label>更新时间</label>
                  <span>{{ formatDate(project.updated_at) }}</span>
                </div>
              </div>
            </el-col>
          </el-row>
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
import { ArrowLeft, Edit } from '@element-plus/icons-vue'
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.project-view,
.project-edit {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.project-header {
  margin-bottom: 32px;
}

.project-title {
  font-size: 32px;
  font-weight: 700;
  color: #303133;
  margin: 0 0 16px 0;
}

.project-meta {
  display: flex;
  gap: 12px;
}

.info-section {
  margin-bottom: 32px;
}

.info-section h3 {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 16px 0;
}

.description {
  font-size: 16px;
  line-height: 1.6;
  color: #606266;
  margin: 0;
}

.progress-info {
  margin-top: 8px;
}

.progress-text {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
  color: #606266;
}

.tech-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.empty-text {
  color: #909399;
  font-style: italic;
}

.sidebar-info {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 24px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #ebeef5;
}

.info-item:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.info-item label {
  font-weight: 600;
  color: #909399;
}

.info-item span {
  color: #303133;
}

:deep(.el-form-item__label) {
  font-weight: 600;
  color: #303133;
}

:deep(.el-input__wrapper) {
  border-radius: 8px;
}

:deep(.el-button) {
  border-radius: 8px;
}

:deep(.el-select) {
  width: 100%;
}

:deep(.el-textarea__inner) {
  border-radius: 8px;
}
</style>