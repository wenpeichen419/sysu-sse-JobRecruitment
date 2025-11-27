<template>
  <div class="post-method-choice-page">
    <!-- 面包屑导航 -->
    <div class="breadcrumb-wrapper">
      <div class="breadcrumb">
        <router-link to="/position-manage" class="breadcrumb-link">岗位管理</router-link>
        <span class="breadcrumb-separator">></span>
        <span class="breadcrumb-current">岗位发布</span>
      </div>
    </div>

    <div class="content-wrapper">
      <h1 class="page-title">请选择合适的发布新岗模式！</h1>
      
      <div class="choice-container">
        <!-- 左侧：手动填写表单 -->
        <div class="choice-card manual-card" @click="goToManualForm">
          <h2 class="card-title">手动填写表单</h2>
          
          <div class="card-content">
            <p class="card-description">
              *这种方式下，您需要手动在系统中输入岗位的<br>
              信息并点击保存
            </p>
            
            <div class="form-preview">
              <img src="@/assets/sheet.png" alt="表单预览" class="preview-image">
            </div>
          </div>
          
          <div class="card-hover-overlay">
            <span class="overlay-text">点击进入手动填写</span>
          </div>
        </div>

        <!-- 右侧：LLM智能提取 -->
        <div class="choice-card ai-card" @click="showUploadDialog">
          <h2 class="card-title">上传岗位相关文件<br>大模型提取信息</h2>
          
          <div class="card-content">
            <p class="card-description">
              *这种方式下，您只需要上传一份与待发布岗位<br>
              相关的文件，我们系统会自动识别相关信息并填<br>
              充表单，您之后只需检查信息确认无误，便可发布
            </p>
            
            <div class="ai-preview">
              <img src="@/assets/LLM.png" alt="AI提取预览" class="preview-image ai-image">
            </div>
          </div>
          
          <div class="card-hover-overlay ai-overlay">
            <span class="overlay-text">点击上传文件</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 文件上传对话框 -->
    <el-dialog
      v-model="uploadDialogVisible"
      title="上传岗位相关文档"
      width="900px"
      :close-on-click-modal="false"
      class="large-dialog"
    >
      <div class="upload-dialog-content">
        <!-- 文件类型选择 -->
        <div class="input-type-selector">
          <el-form-item label="输入类型" required>
            <el-select v-model="inputType" placeholder="请选择输入类型" style="width: 100%">
              <el-option label="文本" value="text" />
              <el-option label="图片" value="image" />
            </el-select>
          </el-form-item>
        </div>

        <!-- 文本输入区域 -->
        <div v-if="inputType === 'text'" class="text-input-area">
          <el-form-item label="上传文本">
            <el-input
              v-model="textContent"
              type="textarea"
              :rows="8"
              placeholder="请输入岗位相关的文本内容"
              :disabled="inputType !== 'text'"
            />
          </el-form-item>
        </div>

        <!-- 图片上传区域 -->
        <div v-if="inputType === 'image'" class="image-upload-area">
          <el-form-item label="上传文件">
            <el-upload
              class="upload-demo"
              :action="uploadAction"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-change="handleImageChange"
              :on-success="handleImageSuccess"
              :file-list="fileList"
              list-type="picture"
              :disabled="inputType !== 'image'"
              accept=".jpg,.jpeg,.png,.gif"
              :auto-upload="false"
            >
              <el-button size="large" type="primary">点击上传</el-button>
              <template #tip>
                <div class="el-upload__tip">只能上传jpg/png文件，且不超过10MB</div>
              </template>
            </el-upload>
          </el-form-item>
        </div>

        <div v-if="isProcessing" class="processing-info">
          <el-progress :percentage="processingProgress" :stroke-width="8" />
          <p class="processing-text">{{ processingText }}</p>
        </div>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="uploadDialogVisible = false" size="large">取消</el-button>
          <el-button 
            type="primary" 
            @click="handleUploadConfirm"
            :disabled="!isFormValid || isProcessing"
            :loading="isProcessing"
            size="large"
          >
            {{ isProcessing ? '正在解析...' : '提交' }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

export default {
  name: 'PostMethodChoice',
  setup() {
    const router = useRouter()
    const uploadDialogVisible = ref(false)
    const isProcessing = ref(false)
    const processingProgress = ref(0)
    const processingText = ref('正在上传文件...')
    
    // 新增的状态
    const inputType = ref('')
    const textContent = ref('')
    const fileList = ref([])
    const uploadedFile = ref(null) // 新增：存储上传的文件对象
    const uploadAction = ref('https://jsonplaceholder.typicode.com/posts/') // 临时地址，实际不会使用

    // 计算表单是否有效 - 修复逻辑
    const isFormValid = computed(() => {
      if (!inputType.value) return false
      
      if (inputType.value === 'text') {
        return textContent.value.trim().length > 0
      } else if (inputType.value === 'image') {
        return fileList.value.length > 0 || uploadedFile.value !== null
      }
      
      return false
    })

    // 跳转到手动填写表单
    const goToManualForm = () => {
      router.push('/position-form')
    }

    // 显示上传对话框
    const showUploadDialog = () => {
      uploadDialogVisible.value = true
      // 重置状态
      inputType.value = ''
      textContent.value = ''
      fileList.value = []
      uploadedFile.value = null
      isProcessing.value = false
      processingProgress.value = 0
    }

    // 图片预览
    const handlePreview = (file) => {
      console.log('Preview file:', file)
    }

    // 图片移除
    const handleRemove = (file, fileList) => {
      console.log('Remove file:', file, fileList)
      uploadedFile.value = null
    }

    // 图片变化 - 修复：正确更新文件状态
    const handleImageChange = (file, files) => {
      console.log('File changed:', file, files)
      fileList.value = files
      if (file.raw) {
        uploadedFile.value = file.raw
      } else {
        uploadedFile.value = file
      }
    }

    // 图片上传成功
    const handleImageSuccess = (response, file, fileList) => {
      console.log('Upload success:', response, file, fileList)
      uploadedFile.value = file
    }

    // 模拟进度
    const simulateProcessing = () => {
      return new Promise((resolve) => {
        isProcessing.value = true
        processingProgress.value = 0
        processingText.value = '正在解析内容...'

        const interval = setInterval(() => {
          processingProgress.value += 10
          if (processingProgress.value >= 100) {
            clearInterval(interval)
            processingText.value = '解析完成！'
            setTimeout(() => {
              resolve()
            }, 500)
          }
        }, 200)
      })
    }

    // 确认上传并处理
    const handleUploadConfirm = async () => {
      if (!isFormValid.value) {
        ElMessage.warning('请完善输入内容')
        return
      }

      try {
        // 模拟处理过程
        await simulateProcessing()
        
        const token = localStorage.getItem('token')
        
        // 准备请求数据
        let requestData = new FormData()
        requestData.append('input_type', inputType.value)
        
        if (inputType.value === 'text') {
          requestData.append('text', textContent.value)
        } else if (inputType.value === 'image' && (fileList.value.length > 0 || uploadedFile.value)) {
          // 使用实际的文件对象
          const file = uploadedFile.value || (fileList.value[0]?.raw || fileList.value[0])
          if (file) {
            requestData.append('image', file)
          }
        }

        // 调用解析接口
        const response = await fetch('http://localhost:8080/api/hr/jobs/parse', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            // 注意：使用FormData时不要设置Content-Type，浏览器会自动设置
          },
          body: requestData
        })

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
        
        const data = await response.json()
        
        if (data.code === 200) {
          ElMessage.success('文档解析成功！即将跳转到表单页面')
          
          // 处理返回的数据
          const extractedData = {
            ...data.data.job_details,
            fromLLM: true // 标记这是从LLM提取的数据
          }

          // 延迟一点再跳转，让用户看到成功消息
          setTimeout(() => {
            uploadDialogVisible.value = false
            // 跳转到表单页面，并传递提取的数据
            router.push({
              path: '/position-form',
              query: { data: JSON.stringify(extractedData) }
            })
          }, 1000)

        } else {
          throw new Error(data.message || '解析失败')
        }

      } catch (error) {
        console.error('文档解析失败:', error)
        ElMessage.error('文档解析失败，请重试: ' + error.message)
        isProcessing.value = false
      }
    }

    return {
      uploadDialogVisible,
      isProcessing,
      processingProgress,
      processingText,
      inputType,
      textContent,
      fileList,
      uploadAction,
      isFormValid,
      goToManualForm,
      showUploadDialog,
      handlePreview,
      handleRemove,
      handleImageChange,
      handleImageSuccess,
      handleUploadConfirm
    }
  }
}
</script>

<style scoped>
.post-method-choice-page {
  padding: 30px;
  background: #f5f5f5;
  min-height: calc(100vh - 105px);
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

.page-title {
  text-align: center;
  color: #325e21;
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 50px;
  margin-top: 30px;
}

.choice-container {
  display: flex;
  gap: 330px;
  justify-content: center;
  align-items: stretch;
  max-width: 2000px;
  margin: 0 auto;
  margin-top: 60px;
}

.choice-card {
  flex: 1;
  max-width: 600px;
  background: white;
  border: 3px solid #325e21;
  border-radius: 15px;
  padding: 40px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  min-height: 800px;
  display: flex;
  flex-direction: column;
}

.choice-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 25px rgba(50, 94, 33, 0.3);
}

.card-title {
  text-align: center;
  font-size: 34px;
  font-weight: bold;
  color: #333;
  margin-bottom: 30px;
  line-height: 1.4;
}

.card-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.card-description {
  color: #666;
  font-size: 24px;
  line-height: 1.8;
  margin-bottom: 30px;
  text-align: left;
}

.form-preview,
.ai-preview {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.preview-image {
  max-width: 100%;
  max-height: 350px;
  object-fit: contain;
  border-radius: 10px;
}

.ai-image {
  max-height: 280px;
}

.card-hover-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(50, 94, 33, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.ai-overlay {
  background: rgba(153, 197, 210, 0.7);;
}

.choice-card:hover .card-hover-overlay {
  opacity: 1;
}

.overlay-text {
  color: white;
  font-size: 24px;
  font-weight: bold;
}

/* 上传对话框样式 */
.upload-dialog-content {
  padding: 20px 0;
}

.input-type-selector {
  margin-bottom: 30px;
}

.text-input-area,
.image-upload-area {
  margin-top: 30px;
}

.processing-info {
  margin-top: 30px;
  padding: 30px;
  background: #f0f9ff;
  border-radius: 8px;
}

.processing-text {
  text-align: center;
  color: #325e21;
  font-weight: 500;
  margin-top: 20px;
  font-size: 20px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .choice-container {
    flex-direction: column;
    align-items: center;
  }

  .choice-card {
    max-width: 700px;
    width: 100%;
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 28px;
  }

  .card-title {
    font-size: 22px;
  }

  .choice-card {
    padding: 30px;
  }
}

/* 放大弹窗字体样式 */
:deep(.large-dialog .el-dialog__title) {
  font-size: 32px !important;
  font-weight: bold;
}

:deep(.large-dialog .el-form-item__label) {
  font-size: 24px !important;
  font-weight: 600;
  line-height: 1.5;
  margin-bottom: 10px;
}

:deep(.large-dialog .el-select .el-input__inner) {
  font-size: 22px !important;
  height: 60px !important;
  line-height: 60px !important;
  padding: 0 20px !important;
}

:deep(.large-dialog .el-textarea__inner) {
  font-size: 22px !important;
  line-height: 1.6 !important;
  padding: 20px !important;
  min-height: 200px !important;
}

:deep(.large-dialog .el-button) {
  font-size: 22px !important;
  height: 60px !important;
  padding: 0 40px !important;
}

:deep(.large-dialog .el-upload__tip) {
  font-size: 18px !important;
  margin-top: 15px;
}

:deep(.large-dialog .el-upload-list__item-name) {
  font-size: 20px !important;
}

:deep(.large-dialog .el-upload-list__item-status-label) {
  font-size: 18px !important;
}

:deep(.large-dialog .el-progress__text) {
  font-size: 18px !important;
}

:deep(.large-dialog .el-select-dropdown__item) {
  font-size: 20px !important;
  height: 50px !important;
  line-height: 50px !important;
}
</style>