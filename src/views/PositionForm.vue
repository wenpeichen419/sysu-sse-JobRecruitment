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

    <div class="content-wrapper">
      <div class="form-container">
        <h1 class="form-title">岗位信息表</h1>
        
        <el-form
          ref="formRef"
          :model="formData"
          :rules="formRules"
          label-width="140px"
          class="position-form"
        >
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
            />
          </el-form-item>

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
              style="width: 100%"
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
              style="width: 100%"
            />
          </el-form-item>

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
                style="width: 100%"
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

          <!-- 提交按钮 -->
          <el-form-item class="submit-section">
            <el-button type="primary" size="large" @click="handleSubmit" :loading="submitting">
              提交申请
            </el-button>
            <el-button size="large" @click="handleCancel">
              取消
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <!-- LLM数据提示标签 -->
    <div v-if="isFromLLM" class="llm-badge">
      <el-tag type="success" size="large" effect="dark">
        <el-icon><CircleCheck /></el-icon>
        LLM自动填充
      </el-tag>
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

.content-wrapper {
  padding-top: 85px;
}

.form-container {
  max-width: 1000px;
  margin: 0 auto;
  background: white;
  padding: 50px 60px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.form-title {
  text-align: center;
  color: #325e21;
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 40px;
}

.position-form {
  margin-top: 30px;
}

:deep(.el-form-item__label) {
  font-weight: 500;
  color: #333;
}

:deep(.el-form-item.is-required:not(.is-no-asterisk) .el-form-item__label::before) {
  color: #f56c6c;
  margin-right: 4px;
}

/* 标签输入区域 */
.tags-input-container {
  display: flex;
  gap: 10px;
  align-items: flex-start;
}

.add-tag-btn {
  flex-shrink: 0;
}

.tags-hint {
  margin-top: 5px;
  color: #999;
  font-size: 14px;
}

/* 提交区域 */
.submit-section {
  margin-top: 40px;
  text-align: center;
}

:deep(.submit-section .el-form-item__content) {
  justify-content: center;
}

.submit-section .el-button {
  min-width: 150px;
  padding: 12px 30px;
  font-size: 16px;
}

/* LLM标签 */
.llm-badge {
  position: fixed;
  top: 130px;
  right: 40px;
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
  padding: 12px 20px;
  font-size: 16px;
}

:deep(.llm-badge .el-icon) {
  margin-right: 5px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .form-container {
    padding: 30px 20px;
  }

  .form-title {
    font-size: 24px;
  }

  :deep(.el-form-item__label) {
    width: 100% !important;
    text-align: left;
    margin-bottom: 10px;
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
    top: auto;
    bottom: 20px;
    right: 20px;
  }
}
</style>

