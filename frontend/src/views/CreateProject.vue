<template>
  <div class="create-project-page">
    <div class="page-header">
      <div class="header-content">
        <div class="breadcrumb">
          <el-button @click="$router.back()" text class="back-btn">
            <el-icon><ArrowLeft /></el-icon>
            返回项目列表
          </el-button>
        </div>
        <div class="header-text">
          <h1 class="page-title">创建新项目</h1>
          <p class="page-description">填写项目基本信息，开始你的开发计划</p>
        </div>
      </div>
    </div>

    <div class="form-container">
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top" size="large">
        <div class="form-content">
          <div class="main-form">
            <div class="form-section">
              <h3 class="section-title">基本信息</h3>
              
              <el-form-item label="项目名称" prop="title">
                <el-input 
                  v-model="form.title" 
                  placeholder="为你的项目取一个响亮的名字" 
                  class="form-input"
                />
              </el-form-item>
              
              <el-form-item label="项目描述" prop="description">
                <el-input 
                  v-model="form.description" 
                  type="textarea" 
                  :rows="4" 
                  placeholder="详细描述项目的目标、功能和价值..."
                  class="form-textarea"
                />
              </el-form-item>
            </div>
            
            <div class="form-section">
              <h3 class="section-title">项目配置</h3>
              
              <div class="form-row">
                <el-form-item label="项目状态" prop="status">
                  <el-select v-model="form.status" placeholder="选择当前状态" class="form-select">
                    <el-option label="💡 想法" value="idea" />
                    <el-option label="📋 规划中" value="planning" />
                    <el-option label="⚡ 开发中" value="development" />
                    <el-option label="🧪 测试中" value="testing" />
                    <el-option label="✅ 已完成" value="completed" />
                    <el-option label="⏸️ 暂停" value="paused" />
                  </el-select>
                </el-form-item>
                
                <el-form-item label="优先级" prop="priority">
                  <el-select v-model="form.priority" placeholder="设置优先级" class="form-select">
                    <el-option label="🟢 低" value="low" />
                    <el-option label="🟡 中" value="medium" />
                    <el-option label="🟠 高" value="high" />
                    <el-option label="🔴 紧急" value="urgent" />
                  </el-select>
                </el-form-item>
                
                <el-form-item label="项目分类" prop="category">
                  <el-input v-model="form.category" placeholder="如：Web应用、移动端..." class="form-input" />
                </el-form-item>
              </div>
              
              <div class="form-row">
                <el-form-item label="开始日期">
                  <el-date-picker 
                    v-model="form.start_date" 
                    type="date" 
                    placeholder="项目开始时间"
                    class="form-date"
                  />
                </el-form-item>
                
                <el-form-item label="目标完成日期">
                  <el-date-picker 
                    v-model="form.target_date" 
                    type="date" 
                    placeholder="预期完成时间"
                    class="form-date"
                  />
                </el-form-item>
              </div>
            </div>
          </div>
          
          <div class="sidebar-form">
            <div class="form-section">
              <h3 class="section-title">技术栈</h3>
              <div class="tech-input-group">
                <el-input 
                  v-model="currentTech" 
                  placeholder="输入技术名称" 
                  @keyup.enter="addTech"
                  class="tech-input"
                >
                  <template #suffix>
                    <el-button text @click="addTech" class="add-btn">
                      <el-icon><Plus /></el-icon>
                    </el-button>
                  </template>
                </el-input>
              </div>
              <div v-if="form.tech_stack.length" class="tags-container">
                <el-tag 
                  v-for="(tech, index) in form.tech_stack" 
                  :key="index"
                  closable
                  @close="removeTech(index)"
                  class="tech-tag"
                >
                  {{ tech }}
                </el-tag>
              </div>
            </div>
            
            <div class="form-section">
              <h3 class="section-title">项目标签</h3>
              <div class="tag-input-group">
                <el-input 
                  v-model="currentTag" 
                  placeholder="输入项目标签" 
                  @keyup.enter="addTag"
                  class="tag-input"
                >
                  <template #suffix>
                    <el-button text @click="addTag" class="add-btn">
                      <el-icon><Plus /></el-icon>
                    </el-button>
                  </template>
                </el-input>
              </div>
              <div v-if="form.tags.length" class="tags-container">
                <el-tag 
                  v-for="(tag, index) in form.tags" 
                  :key="index"
                  closable
                  type="success"
                  @close="removeTag(index)"
                  class="project-tag"
                >
                  {{ tag }}
                </el-tag>
              </div>
            </div>
          </div>
        </div>
        
        <div class="form-actions">
          <el-button size="large" @click="handleReset" class="reset-btn">
            <el-icon><RefreshLeft /></el-icon>
            重置表单
          </el-button>
          <el-button type="primary" size="large" @click="handleSubmit" :loading="submitting" class="submit-btn">
            <el-icon><Check /></el-icon>
            创建项目
          </el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useProjectStore } from '@/stores/project'
import { ElMessage } from 'element-plus'
import { ArrowLeft, Plus, RefreshLeft, Check } from '@element-plus/icons-vue'
import dayjs from 'dayjs'

const router = useRouter()
const projectStore = useProjectStore()

const formRef = ref()
const submitting = ref(false)
const currentTech = ref('')
const currentTag = ref('')

const form = reactive({
  title: '',
  description: '',
  status: 'idea',
  priority: 'medium',
  category: '',
  tech_stack: [],
  tags: [],
  start_date: '',
  target_date: ''
})

const rules = {
  title: [
    { required: true, message: '请输入项目标题', trigger: 'blur' },
    { min: 2, max: 100, message: '标题长度在 2 到 100 个字符', trigger: 'blur' }
  ],
  description: [
    { max: 1000, message: '描述不能超过 1000 个字符', trigger: 'blur' }
  ],
  status: [
    { required: true, message: '请选择项目状态', trigger: 'change' }
  ],
  priority: [
    { required: true, message: '请选择优先级', trigger: 'change' }
  ]
}

const addTech = () => {
  const tech = currentTech.value.trim()
  if (tech && !form.tech_stack.includes(tech)) {
    form.tech_stack.push(tech)
    currentTech.value = ''
  }
}

const removeTech = (index) => {
  form.tech_stack.splice(index, 1)
}

const addTag = () => {
  const tag = currentTag.value.trim()
  if (tag && !form.tags.includes(tag)) {
    form.tags.push(tag)
    currentTag.value = ''
  }
}

const removeTag = (index) => {
  form.tags.splice(index, 1)
}

const handleSubmit = async () => {
  try {
    await formRef.value.validate()
    
    submitting.value = true
    
    const submitData = {
      ...form,
      start_date: form.start_date ? dayjs(form.start_date).format('YYYY-MM-DD') : null,
      target_date: form.target_date ? dayjs(form.target_date).format('YYYY-MM-DD') : null
    }
    
    await projectStore.createProject(submitData)
    ElMessage.success('项目创建成功！')
    router.push('/projects')
  } catch (error) {
    console.error('创建项目失败:', error)
  } finally {
    submitting.value = false
  }
}

const handleReset = () => {
  formRef.value.resetFields()
  form.tech_stack = []
  form.tags = []
  currentTech.value = ''
  currentTag.value = ''
}
</script>

<style scoped>
.create-project-page {
  max-width: 100%;
}

.page-header {
  margin-bottom: 24px;
}

.header-content {
  background: white;
  border-radius: 16px;
  padding: 24px 32px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #f1f5f9;
}

.breadcrumb {
  margin-bottom: 16px;
}

.back-btn {
  color: #6b7280;
  font-size: 14px;
  padding: 0;
}

.back-btn:hover {
  color: #6366f1;
}

.header-text {
  text-align: center;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.page-description {
  font-size: 16px;
  color: #6b7280;
  margin: 0;
}

.form-container {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #f1f5f9;
}

.form-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 32px;
  margin-bottom: 32px;
}

.main-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.sidebar-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-section {
  background: #f8fafc;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #e2e8f0;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 20px 0;
  padding-bottom: 12px;
  border-bottom: 1px solid #e5e7eb;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.form-input,
.form-textarea,
.form-select,
.form-date {
  width: 100%;
}

.tech-input-group,
.tag-input-group {
  margin-bottom: 16px;
}

.tech-input,
.tag-input {
  width: 100%;
}

.add-btn {
  color: #6366f1;
  padding: 0 8px;
}

.add-btn:hover {
  color: #5855eb;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  min-height: 32px;
}

.tech-tag,
.project-tag {
  border-radius: 6px;
}

.tech-tag {
  background-color: #eff6ff;
  border-color: #bfdbfe;
  color: #1e40af;
}

.project-tag {
  background-color: #f0fdf4;
  border-color: #bbf7d0;
  color: #15803d;
}

.form-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;
}

.reset-btn {
  height: 48px;
  padding: 0 24px;
  border-radius: 12px;
  border-color: #d1d5db;
  color: #6b7280;
}

.reset-btn:hover {
  border-color: #9ca3af;
  color: #4b5563;
}

.submit-btn {
  height: 48px;
  padding: 0 32px;
  border-radius: 12px;
  font-weight: 600;
}

:deep(.el-form-item__label) {
  font-weight: 600;
  color: #374151;
  font-size: 14px;
  margin-bottom: 8px;
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
  resize: vertical;
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

:deep(.el-date-editor.el-input) {
  width: 100%;
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

@media (max-width: 1024px) {
  .form-content {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>