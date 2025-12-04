<template>
  <div class="position-form-page">
    <!-- 面包屑导航 -->
    <div class="breadcrumb-wrapper">
      <div class="breadcrumb">
        <router-link to="/position-manage" class="breadcrumb-link">岗位管理</router-link>
        <span class="breadcrumb-separator">></span>
        <router-link to="/post-method-choice" class="breadcrumb-link" v-if="!isEditMode">岗位发布</router-link>
        <span class="breadcrumb-separator" v-if="!isEditMode">></span>
        <span class="breadcrumb-current">{{ isEditMode ? '编辑岗位' : '岗位信息表' }}</span>
      </div>
    </div>

    <div class="form-layout">
      <!-- 左侧导航 - 固定位置 -->
      <div class="left-sidebar fixed-sidebar">
        <div class="sidebar-title">{{ isEditMode ? '编辑岗位' : '岗位信息表' }}</div>
        <div class="title-divider"></div>
        <div 
          v-for="section in sections" 
          :key="section.id"
          class="sidebar-item"
          :class="{ active: activeSection === section.id }"
          @click="scrollToSection(section.id)"
        >
          {{ section.name }}
        </div>
      </div>

      <!-- 右侧表单区域 - 充满剩余空间 -->
      <div class="right-content full-width">
        <div class="form-container full-width-section">
          <h1 class="form-title">{{ isEditMode ? '编辑岗位' : '岗位信息表' }}</h1>
          
          <!-- LLM数据提示标签 -->
          <div v-if="isFromLLM && !isEditMode" class="llm-badge">
            <el-tag type="success" size="large" effect="dark">
              <el-icon><CircleCheck /></el-icon>
              LLM自动填充
            </el-tag>
          </div>

          <!-- 编辑模式提示 -->
          <div v-if="isEditMode" class="edit-mode-badge">
            <el-tag type="warning" size="large" effect="dark">
              <el-icon><Edit /></el-icon>
              编辑模式
            </el-tag>
          </div>

          <el-form
            ref="formRef"
            :model="formData"
            :rules="formRules"
            label-width="180px"
            class="position-form"
          >
            <!-- 基本信息部分 -->
            <div class="form-section" id="basic-section" ref="basicSection">
              <h3 class="section-title">基本信息</h3>
              
              <!-- 岗位名称 -->
              <el-form-item label="岗位名称" prop="title" required>
                <el-input 
                  v-model="formData.title" 
                  placeholder="请输入岗位名称"
                  clearable
                />
              </el-form-item>

              <!-- 岗位类别 -->
              <el-form-item label="岗位类别" prop="type" required>
                <el-radio-group v-model="formData.type">
                  <el-radio :label="1">产品</el-radio>
                  <el-radio :label="2">开发</el-radio>
                  <el-radio :label="3">测试</el-radio>
                  <el-radio :label="4">算法</el-radio>
                </el-radio-group>
              </el-form-item>

              <!-- 岗位性质 -->
              <el-form-item label="岗位性质" prop="work_nature" required>
                <el-radio-group v-model="formData.work_nature">
                  <el-radio :label="1">实习</el-radio>
                  <el-radio :label="2">全职</el-radio>
                </el-radio-group>
              </el-form-item>

              <!-- 部门 -->
              <el-form-item label="部门" prop="department">
                <el-input 
                  v-model="formData.department" 
                  placeholder="请输入部门名称"
                  clearable
                />
              </el-form-item>

              <!-- 招聘人数 -->
              <el-form-item label="招聘人数" prop="headcount" required>
                <el-input-number 
                  v-model="formData.headcount" 
                  :min="1" 
                  :max="999"
                  controls-position="right"
                  style="width: 200px"
                />
              </el-form-item>

              <!-- 学历要求 -->
              <el-form-item label="学历要求" prop="required_degree">
                <el-select v-model="formData.required_degree" placeholder="请选择学历要求" style="width: 500px;">
                  <el-option label="本科以上" :value="0" />
                  <el-option label="硕士以上" :value="1" />
                  <el-option label="博士以上" :value="2" />
                </el-select>
              </el-form-item>
            </div>

            <!-- 工作信息部分 -->
            <div class="form-section" id="work-section" ref="workSection">
              <h3 class="section-title">工作信息</h3>
              
              <!-- 工作地点 - 省 -->
              <el-form-item label="工作省份" prop="province_id">
                <el-select 
                  v-model="formData.province_id" 
                  placeholder="请选择省份"
                  @change="handleProvinceChange"
                  style="width: 500px;"
                >
                  <el-option 
                    v-for="province in provinceList" 
                    :key="province.province_id"
                    :label="province.name"
                    :value="province.province_id"
                  />
                </el-select>
              </el-form-item>

              <!-- 工作地点 - 市 -->
              <el-form-item label="工作城市" prop="city_id">
                <el-select 
                  v-model="formData.city_id" 
                  placeholder="请先选择省份"
                  :disabled="!formData.province_id"
                  style="width: 500px;"
                >
                  <el-option 
                    v-for="city in currentCities" 
                    :key="city.city_id"
                    :label="city.name"
                    :value="city.city_id"
                  />
                </el-select>
              </el-form-item>

              <!-- 详细地址 -->
              <el-form-item label="详细地址" prop="address_detail">
                <el-input 
                  v-model="formData.address_detail" 
                  placeholder="请输入详细工作地址"
                  clearable
                />
              </el-form-item>

              <!-- 薪资区间 -->
              <el-form-item label="薪资区间(k)" required>
                <div class="salary-range-container">
                  <el-form-item prop="min_salary" style="margin-bottom: 0;">
                    <el-input-number 
                      v-model="formData.min_salary" 
                      :min="0" 
                      :max="999"
                      placeholder="最低薪资"
                      controls-position="right"
                      style="width: 200px; margin-right: 10px;"
                    />
                  </el-form-item>
                  <span class="salary-separator">-</span>
                  <el-form-item prop="max_salary" style="margin-bottom: 0;">
                    <el-input-number 
                      v-model="formData.max_salary" 
                      :min="0" 
                      :max="999"
                      placeholder="最高薪资"
                      controls-position="right"
                      style="width: 200px; margin-left: 10px;"
                    />
                  </el-form-item>
                </div>
              </el-form-item>

              <!-- 要求到岗时间 -->
              <el-form-item label="要求到岗时间" prop="required_start_date">
                <el-date-picker
                  v-model="formData.required_start_date"
                  type="date"
                  placeholder="选择日期"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                  style="width: 500px;"
                />
              </el-form-item>

              <!-- 招聘截止时间 -->
              <el-form-item label="招聘截止时间" prop="deadline">
                <el-date-picker
                  v-model="formData.deadline"
                  type="date"
                  placeholder="选择日期"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                  style="width: 500px;"
                />
              </el-form-item>
            </div>

    
              <!-- 岗位标签 -->
        <div class="form-section" id="tags-section" ref="tagsSection">
          <h3 class="section-title">岗位标签</h3>
          <div class="tags-selector">
            <select v-model="selectedCategory" class="tag-select" @change="onCategoryChange">
              <option value="">选择标签分类</option>
              <option v-for="category in tagCategories" :key="category.category_id" :value="category.category_id">
                {{ category.category_name }}
              </option>
            </select>
            <select v-model="newTag" class="tag-select" :disabled="!selectedCategory">
              <option value="">选择具体标签</option>
              <option v-for="tag in currentCategoryTags" :key="tag.tag_id" :value="tag.tag_id">
                {{ tag.tag_name }}
              </option>
            </select>
            <button class="add-tag-btn" type="button" @click="showCustomTagDialog">
                + 自定义标签
            </button>
          </div>
          <div class="selected-tags">
            <span class="tag-label">已选择标签:</span>
            <div class="tags-list">
              <span 
                v-for="(tagId, index) in formData.tags" 
                :key="index" 
                class="tag"
              >
                {{ getTagName(tagId)  }}
                <span class="tag-remove" @click="removeTag(index)">×</span>
              </span>
            </div>
          </div>
        </div>
           

            <!-- 详细描述部分 -->
            <div class="form-section" id="description-section" ref="descriptionSection">
              <h3 class="section-title">详细描述</h3>
              
              <!-- 岗位描述 -->
              <el-form-item label="岗位描述" prop="description">
                <el-input
                  v-model="formData.description"
                  type="textarea"
                  :rows="6"
                  placeholder="请详细描述岗位职责和工作内容"
                />
              </el-form-item>

              <!-- 岗位要求 -->
              <el-form-item label="岗位要求" prop="tech_requirements">
                <el-input
                  v-model="formData.tech_requirements"
                  type="textarea"
                  :rows="6"
                  placeholder="请列出岗位的具体要求，例如学历、专业、技能等"
                />
              </el-form-item>

              <!-- 加分项 -->
              <el-form-item label="加分项" prop="bonus_points">
                <el-input
                  v-model="formData.bonus_points"
                  type="textarea"
                  :rows="4"
                  placeholder="请填写加分项（选填）"
                />
              </el-form-item>
            </div>

            <!-- 提交按钮 -->
            <div class="form-section submit-section">
              <el-form-item>
                <el-button 
                  type="primary" 
                  size="large" 
                  @click="handleSubmit(true)" 
                  :loading="submitting"
                  :disabled="!isFormComplete"
                >
                  {{ isEditMode ? '提交修改' : '提交申请' }}
                </el-button>
                <el-button 
                  v-if="!isEditMode"
                  type="success" 
                  size="large" 
                  @click="handleSubmit(false)" 
                  :loading="submitting"
                >
                  保存草稿
                </el-button>
                <el-button size="large" @click="handleCancel">
                  取消
                </el-button>
              </el-form-item>
            </div>
          </el-form>
        </div>
      </div>
    </div>

    <!-- 自定义标签对话框 - 美化版 -->
    <div class="custom-tag-dialog" v-if="customTagDialogVisible">
      <div class="dialog-overlay" @click="customTagDialogVisible = false"></div>
      <div class="dialog-content">
        <div class="dialog-header">
          <h3 class="dialog-title">创建自定义标签</h3>
          <button class="dialog-close" @click="customTagDialogVisible = false">×</button>
        </div>
        <div class="dialog-body">
          <form @submit.prevent="handleCreateCustomTag" class="custom-tag-form">
            <div class="form-group">
              <label for="tag-name">标签名称</label>
              <input 
                type="text" 
                id="tag-name" 
                v-model="customTagForm.name" 
                placeholder="请输入标签名称"
                required
                maxlength="20"
              />
              <div class="form-hint">标签名称长度在1到20个字符</div>
            </div>
            <div class="form-group">
              <label for="tag-category">标签类别</label>
              <select 
                id="tag-category" 
                v-model="customTagForm.category_id" 
                required
                class="category-select"
              >
                <option value="">请选择标签类别</option>
                <option 
                  v-for="category in tagCategories" 
                  :key="category.category_id"
                  :value="category.category_id"
                >
                  {{ category.category_name }}
                </option>
              </select>
            </div>
            <div class="form-actions">
              <button 
                type="button" 
                class="btn-cancel" 
                @click="customTagDialogVisible = false"
                :disabled="creatingTag"
              >
                取消
              </button>
              <button 
                type="submit" 
                class="btn-submit" 
                :disabled="creatingTag"
              >
                <span v-if="creatingTag">创建中...</span>
                <span v-else>创建标签</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed, watch, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { CircleCheck, Edit } from '@element-plus/icons-vue'

export default {
  name: 'PositionForm',
  components: {
    CircleCheck,
    Edit
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const formRef = ref(null)
    const submitting = ref(false)
    const creatingTag = ref(false)
    const isFromLLM = ref(false)
    const isEditMode = ref(false)
    const currentPositionId = ref(null)
    const activeSection = ref('basic')
    const customTagDialogVisible = ref(false)
    
    // 新增的标签选择相关变量
    const selectedCategory = ref('')
    const newTag = ref('')
    const currentCategoryTags = ref([])

    const sections = [
      { id: 'basic', name: '基本信息' },
      { id: 'work', name: '工作信息' },
      { id: 'tags', name: '标签信息' },
      { id: 'description', name: '详细描述' }
    ]

    // 表单数据
    const formData = ref({
      title: '',
      type: null,
      work_nature: null,
      department: '',
      headcount: 1,
      required_degree: null,
      province_id: null,
      city_id: null,
      address_detail: '',
      min_salary: null,
      max_salary: null,
      required_start_date: '',
      deadline: '',
      description: '',
      tech_requirements: '',
      bonus_points: '',
      tags: []
    })

    // 自定义标签表单
    const customTagForm = ref({
      name: '',
      category_id: null
    })

    // 自定义标签验证规则
    const customTagRules = {
      name: [
        { required: true, message: '请输入标签名称', trigger: 'blur' },
        { min: 1, max: 20, message: '标签名称长度在 1 到 20 个字符', trigger: 'blur' }
      ],
      category_id: [
        { required: true, message: '请选择标签类别', trigger: 'change' }
      ]
    }

    // 表单验证规则
    const formRules = {
      title: [
        { required: true, message: '请输入岗位名称', trigger: 'blur' },
        { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
      ],
      type: [
        { required: true, message: '请选择岗位类别', trigger: 'change' }
      ],
      work_nature: [
        { required: true, message: '请选择岗位性质', trigger: 'change' }
      ],
      headcount: [
        { required: true, message: '请输入招聘人数', trigger: 'blur' }
      ],
      min_salary: [
        { required: true, message: '请输入最低薪资', trigger: 'blur' }
      ],
      max_salary: [
        { required: true, message: '请输入最高薪资', trigger: 'blur' }
      ]
    }

    // 省市数据
    const provinceList = ref([])
    const currentCities = ref([])

    // 标签数据
    const tagCategories = ref([])
    const currentTags = ref([])
    const selectedTagCategory = ref(null)
    
    // 获取标签名称
    const getTagName = (tagId) => {
      for (const category of tagCategories.value) {
        if (category.tags) {
          const tag = category.tags.find(t => t.tag_id === tagId)
          if (tag) return tag.tag_name
        }
      }
      return '未命名标签'
    }
    
    // 移除标签
    const removeTag = (index) => {
      formData.value.tags.splice(index, 1)
    }

    // 检查表单是否完整（用于启用提交申请按钮）
    const isFormComplete = computed(() => {
      const data = formData.value
      return data.title && 
             data.type !== null && 
             data.work_nature !== null && 
             data.headcount > 0 &&
             data.min_salary !== null &&
             data.max_salary !== null &&
             data.description &&
             data.tech_requirements
    })

    // 获取省市数据
    const fetchLocations = async () => {
      try {
        const token = localStorage.getItem('token')
        
        const response = await fetch('http://localhost:8080/api/locations', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
        
        const data = await response.json()
        if (data.code === 200) {
          provinceList.value = data.data || []
        }
      } catch (error) {
        console.error('获取省市数据失败:', error)
        ElMessage.error('获取省市数据失败')
      }
    }

    // 获取标签数据
    const fetchTags = async () => {
      try {
        const token = localStorage.getItem('token')
        
        const response = await fetch('http://localhost:8080/api/tags', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
        
        const data = await response.json()
        if (data.code === 200) {
          tagCategories.value = data.data.grouped_tags || []
        }
      } catch (error) {
        console.error('获取标签数据失败:', error)
        ElMessage.error('获取标签数据失败')
      }
    }

    // 获取岗位详情数据（编辑模式）

const fetchPositionDetail = async (positionId) => {
  try {
    const token = localStorage.getItem('token')
    
    const response = await fetch(`http://localhost:8080/api/hr/jobs/${positionId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
    
    const data = await response.json()
    if (data.code === 200 && data.data) {
      const jobDetails = data.data.job_details
      console.log('获取到的岗位详情:', jobDetails)
      
      // 等待省市数据加载完成
      await new Promise((resolve) => {
        const checkLocationsLoaded = () => {
          if (provinceList.value.length > 0) {
            console.log('省市数据已加载完成')
            resolve()
          } else {
            console.log('等待省市数据加载...')
            setTimeout(checkLocationsLoaded, 100)
          }
        }
        checkLocationsLoaded()
      })

      // 等待标签数据加载完成
      await new Promise((resolve) => {
        const checkTagsLoaded = () => {
          if (tagCategories.value.length > 0) {
            console.log('标签数据已加载完成')
            resolve()
          } else {
            console.log('等待标签数据加载...')
            setTimeout(checkTagsLoaded, 100)
          }
        }
        checkTagsLoaded()
      })

      // 填充表单数据
      formData.value = {
        title: jobDetails.title || '',
        type: jobDetails.type || null,
        work_nature: jobDetails.work_nature || null,
        department: jobDetails.department || '',
        headcount: jobDetails.headcount || 1,
        required_degree: jobDetails.required_degree || null,
        province_id: jobDetails.province_id || null,
        city_id: jobDetails.city_id || null,
        address_detail: jobDetails.address_detail || '',
        min_salary: jobDetails.min_salary || null,
        max_salary: jobDetails.max_salary || null,
        required_start_date: jobDetails.required_start_date || '',
        deadline: jobDetails.deadline || '',
        description: jobDetails.description || '',
        tech_requirements: jobDetails.tech_requirements || '',
        bonus_points: jobDetails.bonus_points || '',
        tags: jobDetails.tags ? jobDetails.tags.map(tag => tag.tag_id) : []
      }

      console.log('填充后的表单数据:', formData.value)

      // 处理省市联动
      if (jobDetails.province_id) {
        console.log('处理省份数据，省份ID:', jobDetails.province_id)
        handleProvinceChange(jobDetails.province_id, true)
        
        setTimeout(() => {
          console.log('设置城市ID:', jobDetails.city_id, '当前城市列表:', currentCities.value)
          formData.value.city_id = jobDetails.city_id || null
        }, 300)
      }

      // 处理标签数据 - 关键修改：将所有标签合并到currentTags中
      if (jobDetails.tags && jobDetails.tags.length > 0) {
        console.log('处理标签数据:', jobDetails.tags)
        
        // 解决方案：将所有类别的标签合并到currentTags中
        const allTags = []
        tagCategories.value.forEach(category => {
          if (category.tags && category.tags.length > 0) {
            allTags.push(...category.tags)
          }
        })
        
        // 去重
        const uniqueTags = allTags.filter((tag, index, self) => 
          index === self.findIndex(t => t.tag_id === tag.tag_id)
        )
        
        currentTags.value = uniqueTags
        console.log('合并后的所有标签:', currentTags.value)
        
        // 设置第一个标签类别（保持原有逻辑，但不影响标签显示）
        if (tagCategories.value.length > 0) {
          selectedTagCategory.value = tagCategories.value[0].category_id
        }
      } else {
        console.log('没有标签数据')
        // 如果没有标签，仍然设置默认类别
        if (tagCategories.value.length > 0) {
          selectedTagCategory.value = tagCategories.value[0].category_id
          handleTagCategoryChange(tagCategories.value[0].category_id)
        }
      }

      ElMessage.success('数据加载成功')
    } else {
      throw new Error(data.message || '获取岗位详情失败')
    }
  } catch (error) {
    console.error('获取岗位详情失败:', error)
    ElMessage.error('获取岗位详情失败: ' + error.message)
  }
}

    // 省份变化处理
    const handleProvinceChange = (provinceId) => {
      formData.value.city_id = null
      const province = provinceList.value.find(p => p.province_id === provinceId)
      currentCities.value = province ? province.cities : []
    }

    // 标签类别变化处理
const handleTagCategoryChange = (categoryId) => {
  const category = tagCategories.value.find(c => c.category_id === categoryId)
  // 只更新当前可选的标签，不影响已选择的标签
  currentTags.value = category ? category.tags : []
}
    
    // 分类变化时更新可选标签
    const onCategoryChange = () => {
      console.log('【选择的分类ID】', selectedCategory.value)
      console.log('【所有分类】', tagCategories.value)
      
      const category = tagCategories.value.find(cat => cat.category_id === selectedCategory.value)
      console.log('【找到的分类】', category)
      
      currentCategoryTags.value = category ? category.tags : []
      console.log('【当前分类下的标签】', currentCategoryTags.value)
      
      newTag.value = ''
    }

    // 显示自定义标签对话框
    const showCustomTagDialog = () => {
      customTagForm.value = { name: '', category_id: null }
      customTagDialogVisible.value = true
    }

    // 创建自定义标签
    const handleCreateCustomTag = async () => {
      // 验证必填字段
      if (!customTagForm.value.name || !customTagForm.value.category_id) {
        ElMessage.error('请填写标签名称并选择标签类别')
        return
      }
      
      if (customTagForm.value.name.length < 1 || customTagForm.value.name.length > 20) {
        ElMessage.error('标签名称长度在 1 到 20 个字符')
        return
      }

      creatingTag.value = true
      try {
        const token = localStorage.getItem('token')
        
        const response = await fetch('http://localhost:8080/api/tags', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(customTagForm.value)
        })
        
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
        
        const data = await response.json()
        if (data.code === 201) {
          ElMessage.success('自定义标签创建成功')
          customTagDialogVisible.value = false
          
          // 重新获取标签数据
          await fetchTags()
          
          // 如果当前选择了对应的类别，自动选择新创建的标签
          if (selectedCategory.value === customTagForm.value.category_id) {
            formData.value.tags.push(data.data.tag_id)
          }
        }
      } catch (error) {
        console.error('创建自定义标签失败:', error)
        ElMessage.error('创建自定义标签失败')
      } finally {
        creatingTag.value = false
      }
    }

    // 滚动到指定区域
    const scrollToSection = (sectionId) => {
      activeSection.value = sectionId
      const element = document.getElementById(`${sectionId}-section`)
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        })
        
        // 添加高亮效果
        element.classList.add('highlight')
        setTimeout(() => {
          element.classList.remove('highlight')
        }, 2000)
      }
    }

    const setupScrollSpy = () => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.id.replace('-section', '')
            activeSection.value = sectionId
          }
        })
      }, {
        threshold: 0.3
      })

      // 观察所有章节
      sections.forEach(section => {
        const element = document.getElementById(`${section.id}-section`)
        if (element) observer.observe(element)
      })
    }

    // 提交表单
    const handleSubmit = async (isSubmit) => {
      if (!formRef.value) return

      // 验证必填字段
      formRef.value.validate((valid) => {
        if (!valid && isSubmit) {
          ElMessage.error('请完善必填信息')
          return false
        }

        // 构建提交数据
        const submitData = {
          ...formData.value
        }

        // 编辑模式和新建模式的状态处理不同
        if (isEditMode.value) {
          // 编辑模式：保持原有状态，只更新数据
          // 不需要设置status
        } else {
          // 新建模式：设置状态
          submitData.status = isSubmit ? 10 : 1 // 10=提交申请, 1=保存草稿
        }

        // 移除空值字段
        Object.keys(submitData).forEach(key => {
          if (submitData[key] === null || submitData[key] === '' || (Array.isArray(submitData[key]) && submitData[key].length === 0)) {
            delete submitData[key]
          }
        })

        ElMessageBox.confirm(
          isEditMode.value ? '确认提交修改吗？' : 
          (isSubmit ? '确认提交岗位信息吗？提交后将进入审核流程。' : '确认保存为草稿吗？'),
          isEditMode.value ? '确认修改' : (isSubmit ? '确认提交' : '确认保存'),
          {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: isSubmit ? 'warning' : 'info'
          }
        ).then(async () => {
          submitting.value = true
          try {
            const token = localStorage.getItem('token')
            
            let url = 'http://localhost:8080/api/hr/jobs'
            let method = 'POST'
            
            // 编辑模式使用PUT请求和特定URL
            if (isEditMode.value) {
              url = `http://localhost:8080/api/hr/jobs/${currentPositionId.value}`
              method = 'PUT'
            }
            
            const response = await fetch(url, {
              method: method,
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(submitData)
            })
            
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
            
            const data = await response.json()
            if (data.code === 200 || data.code === 201) {
              ElMessage.success(isEditMode.value ? '岗位信息修改成功！' : 
                              (isSubmit ? '岗位信息提交成功！' : '草稿保存成功！'))
              
              // 跳转到岗位管理页面
              setTimeout(() => {
                router.push('/position-manage')
              }, 1500)
            } else {
              throw new Error(data.message || '提交失败')
            }
          } catch (error) {
            console.error('提交失败:', error)
            ElMessage.error('提交失败：' + error.message)
          } finally {
            submitting.value = false
          }
        }).catch(() => {
          // 用户取消
        })
      })
    }

    // 取消操作
    const handleCancel = () => {
      ElMessageBox.confirm(
        '确定要取消吗？未保存的内容将丢失。',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        router.back()
      }).catch(() => {
        // 用户取消
      })
    }

    // 从URL参数加载LLM提取的数据
    onMounted(() => {
      // 检查是否是编辑模式
      const positionId = route.query.positionId
      const isEdit = route.query.isEdit
      
      if (positionId && isEdit) {
        isEditMode.value = true
        currentPositionId.value = positionId
        // 获取岗位详情数据
        fetchPositionDetail(positionId)
      } else {
        // 新建模式：检查是否有LLM数据
        const dataParam = route.query.data
        if (dataParam) {
          try {
            const extractedData = JSON.parse(dataParam)
            if (extractedData.fromLLM) {
              isFromLLM.value = true
              // 填充表单数据
              formData.value = {
                ...formData.value,
                title: extractedData.title || '',
                type: extractedData.type || null,
                work_nature: extractedData.work_nature || null,
                department: extractedData.department || '',
                headcount: extractedData.headcount || 1,
                required_degree: extractedData.required_degree || null,
                address_detail: extractedData.address_detail || '',
                min_salary: extractedData.min_salary || null,
                max_salary: extractedData.max_salary || null,
                required_start_date: extractedData.required_start_date || '',
                deadline: extractedData.deadline || '',
                description: extractedData.description || '',
                tech_requirements: extractedData.tech_requirements || '',
                bonus_points: extractedData.bonus_points || '',
                tags: extractedData.tags || []
              }
              
              ElMessage.success({
                message: 'LLM已自动填充表单，请检查信息是否准确',
                duration: 3000
              })
            }
          } catch (error) {
            console.error('解析数据失败:', error)
          }
        }
      }
      
      setupScrollSpy()
      fetchLocations()
      fetchTags()
      
      // 监听新标签选择
      const unwatch = watch(newTag, (tagId) => {
        console.log('【选择了标签ID】', tagId)
        
        if (tagId) {
          // 检查是否已经添加
          if (formData.value.tags.some(existingTagId => existingTagId === tagId)) {
            console.log('【标签已存在，跳过】')
            newTag.value = ''
            return
          }
          
          // 找到标签名称
          console.log('【从以下标签中查找】', currentCategoryTags.value)
          const tag = currentCategoryTags.value.find(t => t.tag_id === tagId)
          console.log('【找到的标签】', tag)
          
          if (tag) {
            console.log('【添加标签ID】', tagId)
            formData.value.tags.push(tagId)
            console.log('【当前所有标签】', formData.value.tags)
          }
          
          newTag.value = ''
        }
      })
      
      // 在组件卸载时取消监听
      onUnmounted(() => {
        unwatch()
      })
    })

    return {
      formRef,
      formData,
      formRules,
      customTagForm,
      customTagRules,
      submitting,
      creatingTag,
      isFromLLM,
      isEditMode,
      activeSection,
      customTagDialogVisible,
      sections,
      provinceList,
      currentCities,
      tagCategories,
      currentTags,
      selectedTagCategory,
      isFormComplete,
      scrollToSection,
      handleProvinceChange,
      handleTagCategoryChange,
      showCustomTagDialog,
      handleCreateCustomTag,
      handleSubmit,
      handleCancel,
      selectedCategory,
      newTag,
      currentCategoryTags,
      onCategoryChange,
      removeTag,
      getTagName
    }
  }
}
</script>

<style scoped>
.position-form-page {
  padding: 30px;
  background: #f5f5f5;
  min-height: calc(100vh - 105px);
  position: relative;
}

.breadcrumb-wrapper {
  position: fixed;
  top: 105px;
  left: 0;
  width: 100%;
  background: #f4f4f4;
  padding: 20px 30px;
  z-index: 1000;
  height: 115px;
}

.breadcrumb {
  background: white;
  padding: 20px 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  font-size: 20px;
  box-sizing: border-box;
  width: 97.3%;
  position: fixed;
}

.breadcrumb-link {
  color: #325e21;
  text-decoration: none;
  font-weight: 500;
}

.breadcrumb-link:hover {
  text-decoration: underline;
}

.breadcrumb-separator {
  margin: 0 10px;
  color: #666;
}

.breadcrumb-current {
  color: #666;
}

/* 表单布局 */
.form-layout {
  display: flex;
  gap: 20px;
  width: 100%;
  align-items: flex-start;
  padding-top: 85px;
}

/* 左侧边栏 - 固定位置 */
.fixed-sidebar {
  width: 280px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 30px;
  flex-shrink: 0;
  position: fixed;
  top: 220px;
  height: calc(100vh - 250px);
  overflow-y: auto;
}

.sidebar-title {
  font-size: 30px;
  font-weight: bold;
  color: #333;
  margin-bottom: 15px;
}

.title-divider {
  height: 1px;
  background: #d8d8d8;
  margin-bottom: 20px;
  width: 100%;
}

.sidebar-item {
  padding: 15px 0;
  cursor: pointer;
  font-size: 22px;
  color: #666;
  border-bottom: 1px solid #f0f0f0;
  transition: all 0.3s ease;
}

.sidebar-item:hover {
  color: #325e21;
  background: #f8f9fa;
}

.sidebar-item.active {
  color: #325e21;
  font-weight: bold;
  background: #f0f7f0;
}

/* 右侧内容 - 充满剩余空间 */
.full-width {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 0;
  margin-left: 300px;
}

.full-width-section {
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 40px;
  transition: all 0.3s ease;
  width: 100%;
  box-sizing: border-box;
}

.form-container {
  position: relative;
}

.form-title {
  text-align: center;
  color: #325e21;
  font-size: 42px;
  font-weight: bold;
  margin-bottom: 40px;
}

/* 表单内部章节 */
.form-section {
  margin-bottom: 40px;
  padding-bottom: 30px;
  border-bottom: 1px solid #f0f0f0;
  transition: all 0.3s ease;
}

.form-section:last-of-type {
  border-bottom: none;
  margin-bottom: 0;
}

.form-section.highlight {
  background: #f8fff8;
  box-shadow: 0 0 0 2px #325e21;
  border-radius: 8px;
  padding: 30px;
  margin: 20px -10px;
}

.section-title {
  color: #325e21;
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 25px;
  padding-left: 12px;
  border-left: 4px solid #325e21;
}

.position-form {
  margin-top: 20px;
}


/* 修改表单项间距 */
:deep(.el-form-item) {
  margin-bottom: 35px !important;
}

:deep(.el-form-item__label) {
  font-weight: 500;
  color: #333;
  font-size: 22px;
  line-height: 1.5;
  padding-right: 20px !important;
  white-space: normal !important;
  word-break: break-all;
}

/* 修改输入框行高和间距 - 统一高度 */
:deep(.el-input__inner) {
  font-size: 22px !important;
  height: 60px !important;
  line-height: 60px !important;
  padding: 0 15px !important;
}

:deep(.el-input__inner::placeholder) {
  font-size: 22px !important;
  color: #999;
  line-height: 60px !important;
}

/* 修改文本域行高和间距 */
:deep(.el-textarea__inner) {
  font-size: 22px !important;
  line-height: 1.6 !important;
  padding: 15px !important;
  min-height: 120px !important;
}

:deep(.el-textarea__inner::placeholder) {
  font-size: 22px !important;
  color: #999;
}

/* 修改单选框字号和间距 */
:deep(.el-radio-group) {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

:deep(.el-radio) {
  margin-right: 0 !important;
}

:deep(.el-radio__label) {
  font-size: 22px !important;
  line-height: 1.5;
}

/* 修改数字输入框字号和高度 */
:deep(.el-input-number) {
  width: 100%;
}

:deep(.el-input-number .el-input__inner) {
  height: 60px !important;
  line-height: 60px !important;
}

:deep(.el-input-number__decrease),
:deep(.el-input-number__increase) {
  height: 29px !important;
  line-height: 29px !important;
}

/* 修改所有下拉框高度 - 统一为60px */
:deep(.el-select .el-input__inner) {
  font-size: 22px !important;
  height: 60px !important;
  line-height: 60px !important;
  padding: 0 15px !important;
}

/* 修改下拉选项的高度 */
:deep(.el-select-dropdown__item) {
  font-size: 22px !important;
  height: 55px !important;
  line-height: 55px !important;
  padding: 0 20px !important;
}

/* 修改日期选择器字号和高度 */
:deep(.el-date-editor .el-input__inner) {
  font-size: 22px !important;
  height: 60px !important;
  line-height: 60px !important;
}

/* 修改按钮字号 */
:deep(.el-button) {
  font-size: 22px !important;
  height: 50px !important;
  padding: 0 25px !important;
}

/* 修改标签选择器字号 */
:deep(.el-select__tags-text) {
  font-size: 20px !important;
  line-height: 1.5;
}

:deep(.el-tag) {
  font-size: 20px !important;
  height: 36px !important;
  line-height: 36px !important;
  margin: 4px 6px 4px 0 !important;
}

/* 专门针对学历、省份、城市、标签类别选择器 - 统一高度 */
:deep(.el-form-item .el-select .el-input__inner) {
  height: 60px !important;
  line-height: 60px !important;
}

/* 修改下拉面板的样式 */
:deep(.el-select-dropdown) {
  max-height: 400px !important;
}

:deep(.el-form-item.is-required:not(.is-no-asterisk) .el-form-item__label::before) {
  color: #f56c6c;
  margin-right: 6px;
  font-size: 20px;
}

/* 薪资区间容器 */
.salary-range-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.salary-separator {
  font-size: 22px;
  color: #666;
  margin: 0 10px;
}

/* 标签选择器样式 - 参考StudentProfile */
/* 标签选择器 */
.tags-selector {
  margin-bottom: 20px;
  display: flex;
  gap: 15px;
  align-items: center; /* 添加垂直居中 */
}

.tag-select {
  flex: 0.8; /* 从原来的1改为0.8，缩小宽度 */
  padding: 12px 16px;
  border: 1px solid #d8d8d8;
  border-radius: 6px;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.3s;
  background: white;
  height: 50px; /* 添加固定高度 */
  box-sizing: border-box;
}

/* 新增自定义标签按钮样式 */
.add-tag-btn {
  flex: 0.2; /* 占据剩余空间 */
  padding: 12px 16px;
  background: #325e21;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
  height: 50px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-tag-btn:hover {
  background: #2a4e1b;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(50, 94, 33, 0.3);
}

.tag-select:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
  color: #999;
}

.tag-select:focus {
  outline: none;
  border-color: #325e21;
}

/* 已选择标签区域固定高度 */
.selected-tags {
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  margin-top: 15px;
  max-height: 150px; /* 固定最大高度 */
  overflow-y: auto; /* 超出时滚动 */
  border: 1px solid #e8e8e8;
}

.tag-label {
  display: block;
  font-size: 16px;
  font-weight: 600;
  color: #666;
  margin-bottom: 15px;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.tag {
  padding: 8px 16px;
  background: linear-gradient(135deg, #eef5ee 0%, #d4e7d4 100%);
  color: #325e21;
  border-radius: 20px;
  font-size: 15px;
  font-weight: 500;
  border: 1px solid #c3d6c0;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.tag-remove {
  cursor: pointer;
  font-size: 20px;
  font-weight: 700;
  color: #999;
  transition: color 0.3s;
}

.tag-remove:hover {
  color: #f44336;
}

/* 当没有标签时的提示样式 */
.selected-tags:empty::before {
  content: '暂无选择的标签';
  color: #999;
  font-size: 16px;
}

/* 提交区域 */
.submit-section {
  margin-top: 40px;
  text-align: center;
  border: none !important;
}

:deep(.submit-section .el-form-item__content) {
  justify-content: center;
  margin-left: 0 !important;
}

.submit-section .el-button {
  min-width: 180px;
  padding: 12px 40px !important;
  font-size: 24px !important;
  height: 60px !important;
}

/* LLM标签 */
.llm-badge {
  position: absolute;
  top: 30px;
  right: 30px;
  z-index: 999;
  animation: slideIn 0.5s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateX(100px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

:deep(.llm-badge .el-tag) {
  padding: 15px 25px;
  font-size: 24px;
  height: auto !important;
}

:deep(.llm-badge .el-icon) {
  margin-right: 8px;
}

/* 自定义标签对话框 - 美化版 */
.custom-tag-dialog {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dialog-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.dialog-content {
  position: relative;
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  width: 500px;
  max-width: 90vw;
  max-height: 90vh;
  overflow: hidden;
  animation: dialogSlideIn 0.3s ease-out;
}

@keyframes dialogSlideIn {
  from {
    transform: translateY(-50px) scale(0.95);
    opacity: 0;
  }
  to {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}

.dialog-header {
  padding: 24px 30px;
  background: linear-gradient(135deg, #325e21 0%, #2a4e1b 100%);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dialog-title {
  font-size: 24px;
  font-weight: bold;
  margin: 0;
}

.dialog-close {
  background: none;
  border: none;
  color: white;
  font-size: 32px;
  cursor: pointer;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s;
}

.dialog-close:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: rotate(90deg);
}

.dialog-body {
  padding: 30px;
}

.custom-tag-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
}

.form-group label::after {
  content: '*';
  color: #f56c6c;
  font-size: 16px;
}

.form-group input,
.form-group select {
  padding: 14px 18px;
  border: 2px solid #e8e8e8;
  border-radius: 8px;
  font-size: 18px;
  transition: all 0.3s;
  background: white;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #325e21;
  box-shadow: 0 0 0 3px rgba(50, 94, 33, 0.1);
}

.category-select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23333' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;
  background-size: 20px;
  padding-right: 50px;
  cursor: pointer;
}

.form-hint {
  font-size: 14px;
  color: #999;
  margin-top: 4px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 20px;
  padding-top: 24px;
  border-top: 1px solid #e8e8e8;
}

.btn-cancel,
.btn-submit {
  padding: 12px 28px;
  border-radius: 8px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
  min-width: 120px;
}

.btn-cancel {
  background: #6c757d;
  color: #fff;
}

.btn-cancel:hover:not(:disabled) {
  background: #5a6268;
  transform: translateY(-2px);
}

.btn-submit {
  background: #325e21;
  color: white;
}

.btn-submit:hover:not(:disabled) {
  background: #2a4e1b;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(50, 94, 33, 0.3);
}

.btn-cancel:disabled,
.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .form-layout {
    flex-direction: column;
  }
  
  .fixed-sidebar {
    width: 100%;
    position: static;
    height: auto;
  }
  
  .full-width {
    margin-left: 0;
  }
  
  .form-container {
    padding: 30px 20px;
  }

  .form-title {
    font-size: 32px;
  }

  :deep(.el-form-item__label) {
    width: 100% !important;
    text-align: left;
    margin-bottom: 15px;
    padding-right: 0 !important;
  }

  :deep(.el-form-item__content) {
    margin-left: 0 !important;
  }

  .tags-selector {
    flex-direction: column;
    align-items: stretch;
  }

  .add-tag-btn {
    width: 100%;
  }

  .llm-badge {
    position: static;
    text-align: center;
    margin-bottom: 20px;
  }

  .salary-range-container {
    flex-direction: column;
    align-items: flex-start;
  }

  .salary-separator {
    margin: 10px 0;
  }
  
  .dialog-content {
    width: 90%;
    margin: 20px;
  }
  
  .dialog-header {
    padding: 20px;
  }
  
  .dialog-body {
    padding: 20px;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .btn-cancel,
  .btn-submit {
    width: 100%;
  }
}
</style>