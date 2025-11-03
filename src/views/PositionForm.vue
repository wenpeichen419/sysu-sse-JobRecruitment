<template>
  <div class="position-form-page">
    <!-- 面包屑导航 -->
    <div class="breadcrumb-wrapper">
      <div class="breadcrumb">
        <router-link to="/position-manage" class="breadcrumb-link">岗位管理</router-link>
        <span class="breadcrumb-separator">></span>
        <router-link to="/post-method-choice" class="breadcrumb-link">岗位发布</router-link>
        <span class="breadcrumb-separator">></span>
        <span class="breadcrumb-current">岗位信息表</span>
      </div>
    </div>

    <div class="form-layout">
      <!-- 左侧导航 - 固定位置 -->
      <div class="left-sidebar fixed-sidebar">
        <div class="sidebar-title">岗位信息表</div>
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
          <h1 class="form-title">岗位信息表</h1>
          
          <!-- LLM数据提示标签 -->
          <div v-if="isFromLLM" class="llm-badge">
            <el-tag type="success" size="large" effect="dark">
              <el-icon><CircleCheck /></el-icon>
              LLM自动填充
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
              <el-form-item label="岗位名称" prop="positionName" required>
                <el-input 
                  v-model="formData.positionName" 
                  placeholder="请输入岗位名称"
                  clearable
                />
              </el-form-item>

              <!-- 岗位类别 -->
              <el-form-item label="岗位类别" prop="category" required>
                <el-radio-group v-model="formData.category">
                  <el-radio label="校招">校招</el-radio>
                  <el-radio label="实习">实习</el-radio>
                  <el-radio label="开发">开发</el-radio>
                  <el-radio label="算法">算法</el-radio>
                  <el-radio label="测试">测试</el-radio>
                  <el-radio label="产品">产品</el-radio>
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
              <el-form-item label="招聘人数" prop="recruitCount" required>
                <el-input-number 
                  v-model="formData.recruitCount" 
                  :min="1" 
                  :max="999"
                  controls-position="right"
                  style="width: 200px"
                />
              </el-form-item>
            </div>

            <!-- 工作信息部分 -->
            <div class="form-section" id="work-section" ref="workSection">
              <h3 class="section-title">工作信息</h3>
              
              <!-- 工作地 -->
              <el-form-item label="工作地" prop="location">
                <el-input 
                  v-model="formData.location" 
                  placeholder="请输入工作地点"
                  clearable
                />
              </el-form-item>

              <!-- 薪资区间 -->
              <el-form-item label="薪资区间" prop="salaryRange">
                <el-input 
                  v-model="formData.salaryRange" 
                  placeholder="例如：8500-9499"
                  clearable
                />
              </el-form-item>

              <!-- 要求到岗时间 -->
              <el-form-item label="要求到岗时间" prop="deadline">
                <el-date-picker
                  v-model="formData.deadline"
                  type="date"
                  placeholder="选择日期"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                  style="width: 500px;height:50px;"
                />
              </el-form-item>

              <!-- 招聘截止时间 -->
              <el-form-item label="招聘截止时间" prop="recruitDeadline">
                <el-date-picker
                  v-model="formData.recruitDeadline"
                  type="date"
                  placeholder="选择日期"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                  style="width: 500px;height:50px;"
                />
              </el-form-item>
            </div>

            <!-- 标签信息部分 -->
            <div class="form-section" id="tags-section" ref="tagsSection">
              <h3 class="section-title">标签信息</h3>
              
              <!-- 岗位标签 -->
              <el-form-item label="岗位标签" prop="tags">
                <div class="tags-input-container">
                  <el-select
                    v-model="formData.tags"
                    multiple
                    filterable
                    allow-create
                    default-first-option
                    placeholder="请选择或输入标签，最多5个"
                    style="width: 500px;height:80px;"
                    :multiple-limit="5"
                  >
                    <el-option label="C++" value="C++" />
                    <el-option label="机器学习" value="机器学习" />
                    <el-option label="推荐算法" value="推荐算法" />
                    <el-option label="从系统库中选择" value="从系统库中选择" disabled />
                  </el-select>
                  <el-button class="add-tag-btn" type="success">+自定义</el-button>
                </div>
                <div class="tags-hint">
                  <el-button link size="small">输入新标签</el-button>
                </div>
              </el-form-item>
            </div>

            <!-- 详细描述部分 -->
            <div class="form-section" id="description-section" ref="descriptionSection">
              <h3 class="section-title">详细描述</h3>
              
              <!-- 岗位描述 -->
              <el-form-item label="岗位描述" prop="description" required>
                <el-input
                  v-model="formData.description"
                  type="textarea"
                  :rows="6"
                  placeholder="请详细描述岗位职责和工作内容"
                />
              </el-form-item>

              <!-- 岗位要求 -->
              <el-form-item label="岗位要求" prop="requirements" required>
                <el-input
                  v-model="formData.requirements"
                  type="textarea"
                  :rows="6"
                  placeholder="请列出岗位的具体要求，例如学历、专业、技能等"
                />
              </el-form-item>

              <!-- 加分项 -->
              <el-form-item label="加分项" prop="bonus">
                <el-input
                  v-model="formData.bonus"
                  type="textarea"
                  :rows="4"
                  placeholder="请填写加分项（选填）"
                />
              </el-form-item>
            </div>

            <!-- 提交按钮 -->
            <div class="form-section submit-section">
              <el-form-item>
               
                <el-button type="primary" size="large" @click="handleSubmit" :loading="submitting">
                  提交申请
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
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { CircleCheck } from '@element-plus/icons-vue'

export default {
  name: 'PositionForm',
  components: {
    CircleCheck
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const formRef = ref(null)
    const submitting = ref(false)
    const isFromLLM = ref(false)
    const activeSection = ref('basic')

    const sections = [
      { id: 'basic', name: '基本信息' },
      { id: 'work', name: '工作信息' },
      { id: 'tags', name: '标签信息' },
      { id: 'description', name: '详细描述' }
    ]

    // 表单数据
    const formData = ref({
      positionName: '',
      category: '校招',
      department: '',
      recruitCount: 1,
      location: '',
      salaryRange: '',
      deadline: '',
      recruitDeadline: '',
      tags: [],
      description: '',
      requirements: '',
      bonus: ''
    })

    // 表单验证规则
    const formRules = {
      positionName: [
        { required: true, message: '请输入岗位名称', trigger: 'blur' },
        { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
      ],
      category: [
        { required: true, message: '请选择岗位类别', trigger: 'change' }
      ],
      recruitCount: [
        { required: true, message: '请输入招聘人数', trigger: 'blur' }
      ],
      description: [
        { required: true, message: '请填写岗位描述', trigger: 'blur' },
        { min: 10, message: '岗位描述至少10个字符', trigger: 'blur' }
      ],
      requirements: [
        { required: true, message: '请填写岗位要求', trigger: 'blur' },
        { min: 10, message: '岗位要求至少10个字符', trigger: 'blur' }
      ]
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

    // 从URL参数加载LLM提取的数据
    onMounted(() => {
      const dataParam = route.query.data
      if (dataParam) {
        try {
          const extractedData = JSON.parse(dataParam)
          if (extractedData.fromLLM) {
            isFromLLM.value = true
            // 填充表单数据
            formData.value = {
              positionName: extractedData.positionName || '',
              category: extractedData.category || '校招',
              department: extractedData.department || '',
              recruitCount: extractedData.recruitCount || 1,
              location: extractedData.location || '',
              salaryRange: extractedData.salaryRange || '',
              deadline: extractedData.deadline || '',
              recruitDeadline: extractedData.recruitDeadline || '',
              tags: extractedData.tags || [],
              description: extractedData.description || '',
              requirements: extractedData.requirements || '',
              bonus: extractedData.bonus || ''
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
      
      setupScrollSpy()
    })

    // 提交表单
    const handleSubmit = async () => {
      if (!formRef.value) return

      formRef.value.validate((valid) => {
        if (valid) {
          ElMessageBox.confirm(
            '确认提交岗位信息吗？提交后将进入审核流程。',
            '确认提交',
            {
              confirmButtonText: '确认',
              cancelButtonText: '取消',
              type: 'warning'
            }
          ).then(() => {
            submitting.value = true
            
            // 模拟提交过程
            setTimeout(() => {
              submitting.value = false
              ElMessage.success('岗位信息提交成功！')
              
              // 跳转到岗位管理页面
              setTimeout(() => {
                router.push('/position-manage')
              }, 1500)
            }, 1500)
          }).catch(() => {
            // 用户取消
          })
        } else {
          ElMessage.error('请完善必填信息')
          return false
        }
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

    return {
      formRef,
      formData,
      formRules,
      submitting,
      isFromLLM,
      activeSection,
      sections,
      scrollToSection,
      handleSubmit,
      handleCancel
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

/* 修改输入框行高和间距 */
:deep(.el-input__inner) {
  font-size: 22px !important;
  height: 50px !important;
  line-height: 50px !important;
  padding: 0 15px !important;
}

:deep(.el-input__inner::placeholder) {
  font-size: 22px !important;
  color: #999;
  line-height: 50px !important;
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
  height: 50px !important;
  line-height: 50px !important;
}

:deep(.el-input-number__decrease),
:deep(.el-input-number__increase) {
  height: 24px !important;
  line-height: 24px !important;
}

/* 修改选择框字号和高度 */
:deep(.el-select .el-input__inner) {
  font-size: 22px !important;
  height: 50px !important;
  line-height: 50px !important;
}

:deep(.el-select-dropdown__item) {
  font-size: 22px !important;
  height: 45px !important;
  line-height: 45px !important;
}

/* 修改日期选择器字号和高度 */
:deep(.el-date-editor .el-input__inner) {
  font-size: 22px !important;
  height: 50px !important;
  line-height: 50px !important;
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
/* 修改多选选择框的高度 */
:deep(.el-select .el-input__inner) {
  font-size: 22px !important;
  height: 80px !important; /* 增加高度 */
  line-height: 80px !important; /* 调整行高匹配高度 */
  padding: 0 15px !important;
}

/* 修改多选选择框的标签容器 */
:deep(.el-select .el-select__tags) {
  height: 100% !important;
  display: flex !important;
  align-items: center !important;
  flex-wrap: wrap !important;
  padding: 10px 0 !important; /* 添加内边距 */
}

/* 修改标签的样式以适应更高容器 */
:deep(.el-select .el-tag) {
  font-size: 20px !important;
  height: 40px !important; /* 增加标签高度 */
  line-height: 40px !important; /* 调整标签行高 */
  margin: 5px 8px 5px 0 !important; /* 调整标签边距 */
  padding: 0 12px !important;
}

/* 修改输入框在标签模式下的样式 */
:deep(.el-select .el-select__input) {
  height: 40px !important;
  line-height: 40px !important;
  margin: 5px 0 !important;
  font-size: 22px !important;
}

/* 修改下拉面板的样式，使其与更高的输入框匹配 */
:deep(.el-select-dropdown) {
  max-height: 400px !important; /* 增加下拉面板最大高度 */
}

:deep(.el-select-dropdown__item) {
  font-size: 22px !important;
  height: 50px !important; /* 增加下拉项高度 */
  line-height: 50px !important; /* 调整下拉项行高 */
  padding: 0 20px !important;
}

/* 专门针对多选选择框的占位文字 */
:deep(.el-select__placeholder) {
  font-size: 22px !important;
  color: #999 !important;
  line-height: 80px !important;
  position: absolute !important;
  top: 50% !important; /* 改为垂直居中 */
  left: 15px !important;
  transform: translateY(-50%) !important; /* 垂直居中 */
  margin: 0 !important;
  padding: 0 !important;
  z-index: 1 !important;
  width: calc(100% - 30px) !important; /* 限制宽度 */
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
}

/* 针对岗位标签选择器的专门调整 */
:deep(.tags-input-container .el-select__placeholder) {
  font-size: 22px !important;
  color: #999 !important;
  line-height: normal !important;
  position: absolute !important;
  top: 50% !important;
  left: 15px !important;
  transform: translateY(-50%) !important;
  margin: 0 !important;
  padding: 0 !important;
  z-index: 1 !important;
}

/* 确保选择框容器有正确的定位上下文 */
:deep(.el-select .el-input__inner) {
  position: relative !important;
  font-size: 22px !important;
  height: 80px !important;
  line-height: 80px !important;
  padding: 0 15px !important;
}

/* 调整标签容器，为占位文字留出空间 */
:deep(.el-select .el-select__tags) {
  position: relative !important;
  min-height: 80px !important;
  padding: 10px 40px 10px 15px !important; /* 调整内边距 */
  align-items: center !important;
  flex-wrap: wrap !important;
}

/* 当有标签时隐藏占位文字 */
:deep(.el-select .el-select__tags:not(:empty) ~ .el-select__placeholder) {
  display: none !important;
}

/* 当有标签时隐藏占位文字 */
:deep(.el-select .el-select__tags:not(:empty) ~ .el-select__placeholder) {
  display: none !important;
}

:deep(.el-form-item.is-required:not(.is-no-asterisk) .el-form-item__label::before) {
  color: #f56c6c;
  margin-right: 6px;
  font-size: 20px;
}

/* 标签输入区域 */
.tags-input-container {
  display: flex;
  gap: 15px;
  align-items: flex-start;
}

.add-tag-btn {
  flex-shrink: 0;
  height: 50px !important;
}

.tags-hint {
  margin-top: 10px;
  color: #999;
  font-size: 18px;
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

  .tags-input-container {
    flex-direction: column;
  }

  .add-tag-btn {
    width: 100%;
  }

  .llm-badge {
    position: static;
    text-align: center;
    margin-bottom: 20px;
  }
}
</style>