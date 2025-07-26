<template>
  <div class="create-project-page">
    <div class="page-header">
      <el-button @click="$router.back()" text>
        <el-icon><ArrowLeft /></el-icon>
        返回
      </el-button>
      <h1 class="page-title">创建新项目</h1>
    </div>

    <div class="form-container">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px" size="large">
        <el-row :gutter="24">
          <el-col :span="16">
            <el-form-item label="项目标题" prop="title">
              <el-input v-model="form.title" placeholder="输入项目标题" />
            </el-form-item>
            
            <el-form-item label="项目描述" prop="description">
              <el-input 
                v-model="form.description" 
                type="textarea" 
                :rows="4" 
                placeholder="描述你的项目想法和目标..."
              />
            </el-form-item>
            
            <el-row :gutter="16">
              <el-col :span="8">
                <el-form-item label="状态" prop="status">
                  <el-select v-model="form.status" placeholder="选择状态">
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
                <el-form-item label="优先级" prop="priority">
                  <el-select v-model="form.priority" placeholder="选择优先级">
                    <el-option label="低" value="low" />
                    <el-option label="中" value="medium" />
                    <el-option label="高" value="high" />
                    <el-option label="紧急" value="urgent" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="分类" prop="category">
                  <el-input v-model="form.category" placeholder="如：Web应用" />
                </el-form-item>
              </el-col>
            </el-row>
            
            <el-row :gutter="16">
              <el-col :span="12">
                <el-form-item label="开始日期">
                  <el-date-picker 
                    v-model="form.start_date" 
                    type="date" 
                    placeholder="选择开始日期"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="目标日期">
                  <el-date-picker 
                    v-model="form.target_date" 
                    type="date" 
                    placeholder="选择目标完成日期"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
          
          <el-col :span="8">
            <div class="sidebar">
              <el-form-item label="技术栈">
                <div class="tech-input">
                  <el-input 
                    v-model="currentTech" 
                    placeholder="输入技术名称" 
                    @keyup.enter="addTech"
                  >
                    <template #append>
                      <el-button @click="addTech">添加</el-button>
                    </template>
                  </el-input>
                </div>
                <div v-if="form.tech_stack.length" class="tech-list">
                  <el-tag 
                    v-for="(tech, index) in form.tech_stack" 
                    :key="index"
                    closable
                    @close="removeTech(index)"
                    style="margin: 4px 4px 4px 0"
                  >
                    {{ tech }}
                  </el-tag>
                </div>
              </el-form-item>
              
              <el-form-item label="标签">
                <div class="tag-input">
                  <el-input 
                    v-model="currentTag" 
                    placeholder="输入标签名称" 
                    @keyup.enter="addTag"
                  >
                    <template #append>
                      <el-button @click="addTag">添加</el-button>
                    </template>
                  </el-input>
                </div>
                <div v-if="form.tags.length" class="tag-list">
                  <el-tag 
                    v-for="(tag, index) in form.tags" 
                    :key="index"
                    closable
                    type="success"
                    @close="removeTag(index)"
                    style="margin: 4px 4px 4px 0"
                  >
                    {{ tag }}
                  </el-tag>
                </div>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        
        <el-form-item>
          <el-button type="primary" size="large" @click="handleSubmit" :loading="submitting">
            创建项目
          </el-button>
          <el-button size="large" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useProjectStore } from '@/stores/project'
import { ElMessage } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'
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
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: white;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-container {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.sidebar {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  height: fit-content;
}

.tech-input,
.tag-input {
  margin-bottom: 12px;
}

.tech-list,
.tag-list {
  min-height: 40px;
  max-height: 120px;
  overflow-y: auto;
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