import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/utils/api'

export const useProjectStore = defineStore('project', () => {
  const projects = ref([])
  const currentProject = ref(null)
  const loading = ref(false)
  const filters = ref({
    status: '',
    category: '',
    priority: ''
  })

  const fetchProjects = async () => {
    loading.value = true
    try {
      const params = {}
      Object.keys(filters.value).forEach(key => {
        if (filters.value[key]) {
          params[key] = filters.value[key]
        }
      })
      
      const response = await api.get('/projects', { params })
      projects.value = response.data.data || []
    } catch (error) {
      console.error('获取项目列表失败:', error)
      console.error('错误详情:', error.response?.data || error.message)
      projects.value = []
    } finally {
      loading.value = false
    }
  }

  const fetchProjectById = async (id) => {
    loading.value = true
    try {
      const response = await api.get(`/projects/${id}`)
      currentProject.value = response.data.data
      return response.data.data
    } catch (error) {
      console.error('获取项目详情失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const createProject = async (projectData) => {
    try {
      const response = await api.post('/projects', projectData)
      await fetchProjects()
      return response.data.data
    } catch (error) {
      console.error('创建项目失败:', error)
      throw error
    }
  }

  const updateProject = async (id, projectData) => {
    try {
      await api.put(`/projects/${id}`, projectData)
      await fetchProjects()
      if (currentProject.value && currentProject.value.id === id) {
        await fetchProjectById(id)
      }
    } catch (error) {
      console.error('更新项目失败:', error)
      throw error
    }
  }

  const deleteProject = async (id) => {
    try {
      await api.delete(`/projects/${id}`)
      await fetchProjects()
    } catch (error) {
      console.error('删除项目失败:', error)
      throw error
    }
  }

  const setFilters = (newFilters) => {
    filters.value = { ...filters.value, ...newFilters }
    fetchProjects()
  }

  const clearFilters = () => {
    filters.value = {
      status: '',
      category: '',
      priority: ''
    }
    fetchProjects()
  }

  return {
    projects,
    currentProject,
    loading,
    filters,
    fetchProjects,
    fetchProjectById,
    createProject,
    updateProject,
    deleteProject,
    setFilters,
    clearFilters
  }
})