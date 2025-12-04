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
      title="上传岗位文档"
      width="900px"
      :close-on-click-modal="false"
      class="upload-dialog-custom"
    >
      <!-- 对话框内容 -->
      <div class="dialog-container">
        <!-- 对话框头部装饰 -->
        <div class="dialog-header-decor">
          <div class="decor-line"></div>
          <div class="decor-icon">
            <i class="el-icon-upload"></i>
          </div>
          <div class="decor-line"></div>
        </div>

        <!-- 主要内容区域 -->
        <div class="dialog-main-content">
          <!-- 输入类型选择卡片 -->
          <div class="input-type-section">
            <h3 class="section-title">
              <i class="el-icon-document"></i>
              选择输入类型
            </h3>
            <div class="type-cards">
              <div 
                class="type-card" 
                :class="{ 'active': inputType === 'text' }"
                @click="inputType = 'text'"
              >
                <div class="card-icon">
                  <i class="el-icon-document"></i>
                </div>
                <h4>文本输入</h4>
                <p>直接粘贴岗位描述文本</p>
              </div>
              <div 
                class="type-card" 
                :class="{ 'active': inputType === 'image' }"
                @click="inputType = 'image'"
              >
                <div class="card-icon">
                  <i class="el-icon-picture"></i>
                </div>
                <h4>图片上传</h4>
                <p>上传岗位相关图片</p>
              </div>
            </div>
          </div>

          <!-- 输入内容区域 -->
          <div class="input-content-section">
            <!-- 文本输入区域 -->
            <div v-if="inputType === 'text'" class="text-input-section">
              <div class="section-header">
                <h3 class="section-title">
                  <i class="el-icon-edit"></i>
                  输入岗位文本
                </h3>
                <el-button 
                  type="text" 
                  @click="textContent = ''"
                  :disabled="!textContent"
                >
                  清空
                </el-button>
              </div>
              <div class="textarea-container">
                <el-input
                  v-model="textContent"
                  type="textarea"
                  :rows="8"
                  placeholder="请粘贴岗位描述、要求等相关文本内容..."
                  :maxlength="2000"
                  show-word-limit
                  class="custom-textarea"
                />
              </div>
              <div class="tips">
                <i class="el-icon-info"></i>
                支持纯文本格式，建议提供完整的岗位描述信息
              </div>
            </div>

            <!-- 图片上传区域 -->
            <div v-if="inputType === 'image'" class="image-upload-section">
              <div class="section-header">
                <h3 class="section-title">
                  <i class="el-icon-upload"></i>
                  上传岗位图片
                </h3>
                <el-button 
                  type="text" 
                  @click="clearFileList"
                  :disabled="fileList.length === 0"
                >
                  清空
                </el-button>
              </div>
              
              <div class="upload-area" @click="triggerFileUpload">
                <el-upload
                  ref="uploadRef"
                  class="upload-demo"
                  :action="uploadAction"
                  :on-preview="handlePreview"
                  :on-remove="handleRemove"
                  :on-change="handleImageChange"
                  :on-success="handleImageSuccess"
                  :file-list="fileList"
                  :auto-upload="false"
                  :show-file-list="false"
                  accept=".jpg,.jpeg,.png,.gif,.pdf"
                >
                  <div class="upload-placeholder">
                    <div class="upload-icon">
                      <i class="el-icon-upload"></i>
                    </div>
                    <div class="upload-text">
                      <p class="main-text">点击或拖拽文件到此区域</p>
                      <p class="sub-text">支持 JPG、PNG、PDF 格式，文件大小不超过 10MB</p>
                    </div>
                  </div>
                </el-upload>
              </div>

              <!-- 文件列表 -->
              <div v-if="fileList.length > 0" class="file-list">
                <div v-for="(file, index) in fileList" :key="index" class="file-item">
                  <div class="file-icon">
                    <i class="el-icon-document"></i>
                  </div>
                  <div class="file-info">
                    <div class="file-name">{{ file.name }}</div>
                    <div class="file-size">{{ formatFileSize(file.size) }}</div>
                  </div>
                  <div class="file-actions">
                    <el-button 
                      type="text" 
                      @click="handleRemove(file)"
                      class="remove-btn"
                    >
                      <i class="el-icon-delete"></i>
                    </el-button>
                  </div>
                </div>
              </div>

              <div class="tips">
                <i class="el-icon-info"></i>
                系统将自动识别图片中的文字信息并提取岗位相关内容
              </div>
            </div>
          </div>

          <!-- 处理进度 -->
          <div v-if="isProcessing" class="processing-section">
            <div class="progress-header">
              <h3 class="section-title">
                <i class="el-icon-loading"></i>
                正在解析文档
              </h3>
            </div>
            <div class="progress-container">
              <el-progress 
                :percentage="processingProgress" 
                :stroke-width="8"
                :show-text="false"
                class="custom-progress"
              />
              <div class="progress-info">
                <span class="progress-text">{{ processingText }}</span>
                <span class="progress-percent">{{ processingProgress }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button 
            @click="uploadDialogVisible = false"
            size="large"
            class="cancel-btn"
          >
            取消
          </el-button>
          <el-button 
            type="primary" 
            @click="handleUploadConfirm"
            :disabled="!isFormValid || isProcessing"
            :loading="isProcessing"
            size="large"
            class="submit-btn"
          >
            <template v-if="isProcessing">
              <i class="el-icon-loading"></i>
              解析中...
            </template>
            <template v-else>
              <i class="el-icon-check"></i>
              提交解析
            </template>
          </el-button>
        </div>
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
    const uploadedFile = ref(null)
    const uploadAction = ref('https://jsonplaceholder.typicode.com/posts/')
    const uploadRef = ref(null)

    // 计算表单是否有效
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

    // 格式化文件大小
    const formatFileSize = (bytes) => {
      if (bytes === 0 || !bytes) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    // 触发文件上传
    const triggerFileUpload = () => {
      if (uploadRef.value) {
        uploadRef.value.$el.querySelector('input[type="file"]')?.click()
      }
    }

    // 清空文件列表
    const clearFileList = () => {
      fileList.value = []
      uploadedFile.value = null
    }

    // 图片预览
    const handlePreview = (file) => {
      console.log('Preview file:', file)
    }

    // 图片移除
    const handleRemove = (file) => {
      const index = fileList.value.findIndex(f => f.uid === file.uid)
      if (index > -1) {
        fileList.value.splice(index, 1)
      }
      if (fileList.value.length === 0) {
        uploadedFile.value = null
      }
    }

    // 图片变化
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
    const handleImageSuccess = (response, file, files) => {
      console.log('Upload success:', response, file, files)
      uploadedFile.value = file
      fileList.value = files
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
            fromLLM: true
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
      uploadRef,
      isFormValid,
      formatFileSize,
      goToManualForm,
      showUploadDialog,
      triggerFileUpload,
      clearFileList,
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
/* 原有样式保持不变 */
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
  background: rgba(153, 197, 210, 0.7);
}

.choice-card:hover .card-hover-overlay {
  opacity: 1;
}

.overlay-text {
  color: white;
  font-size: 24px;
  font-weight: bold;
}

/* 新对话框样式 - 绿色主题 */
/* 对话框整体样式 */
:deep(.upload-dialog-custom .el-dialog) {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

:deep(.upload-dialog-custom .el-dialog__header) {
  padding: 30px 40px 20px;
  background: linear-gradient(135deg, #325e21 0%, #4a8c2a 100%);
  margin-right: 0;
}

:deep(.upload-dialog-custom .el-dialog__title) {
  color: white;
  font-size: 28px;
  font-weight: 600;
  text-align: center;
  display: block;
}

:deep(.upload-dialog-custom .el-dialog__headerbtn) {
  top: 30px;
  right: 30px;
}

:deep(.upload-dialog-custom .el-dialog__headerbtn .el-dialog__close) {
  color: white;
  font-size: 24px;
}

:deep(.upload-dialog-custom .el-dialog__body) {
  padding: 0;
}

:deep(.upload-dialog-custom .el-dialog__footer) {
  padding: 30px 40px;
  border-top: 1px solid #e8e8e8;
}

.dialog-container {
  padding: 0 40px;
}

/* 头部装饰 */
.dialog-header-decor {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 0 30px;
}

.decor-line {
  flex: 1;
  height: 2px;
  background: linear-gradient(90deg, transparent, #325e21, transparent);
}

.decor-icon {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #325e21 0%, #4a8c2a 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 20px;
}

.decor-icon i {
  color: white;
  font-size: 24px;
}

/* 主要内容 */
.dialog-main-content {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

/* 输入类型选择 */
.input-type-section {
  margin-bottom: 20px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #325e21;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-title i {
  color: #325e21;
}

.type-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.type-card {
  padding: 25px 20px;
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.type-card:hover {
  transform: translateY(-2px);
  border-color: #325e21;
  box-shadow: 0 8px 25px rgba(50, 94, 33, 0.1);
}

.type-card.active {
  background: linear-gradient(135deg, rgba(50, 94, 33, 0.05) 0%, rgba(74, 140, 42, 0.05) 100%);
  border-color: #325e21;
}

.type-card.active::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(135deg, #325e21 0%, #4a8c2a 100%);
}

.card-icon {
  width: 60px;
  height: 60px;
  margin: 0 auto 15px;
  background: linear-gradient(135deg, #325e21 0%, #4a8c2a 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-icon i {
  color: white;
  font-size: 28px;
}

.type-card h4 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.type-card p {
  font-size: 14px;
  color: #666;
  margin: 0;
}

/* 输入内容区域 */
.input-content-section {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

/* 文本输入 */
.textarea-container {
  margin-bottom: 15px;
}

:deep(.custom-textarea .el-textarea__inner) {
  font-size: 14px;
  line-height: 1.6;
  padding: 15px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  transition: all 0.3s ease;
  resize: vertical;
}

:deep(.custom-textarea .el-textarea__inner:focus) {
  border-color: #325e21;
  box-shadow: 0 0 0 2px rgba(50, 94, 33, 0.1);
}

:deep(.custom-textarea .el-input__count) {
  background: transparent;
  font-size: 12px;
  color: #666;
}

/* 图片上传区域 */
.upload-area {
  border: 2px dashed #e9ecef;
  border-radius: 12px;
  padding: 40px 20px;
  margin-bottom: 20px;
  transition: all 0.3s ease;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  text-align: center;
}

.upload-area:hover {
  border-color: #325e21;
  background: rgba(50, 94, 33, 0.02);
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 15px;
  width: 100%;
  height: 100%;
}

.upload-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #325e21 0%, #4a8c2a 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-icon i {
  color: white;
  font-size: 28px;
}

.upload-text {
  text-align: center;
  width: 100%;
}

.main-text {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 5px;
}

.sub-text {
  font-size: 14px;
  color: #666;
  margin: 0;
}

/* 文件列表 */
.file-list {
  margin-bottom: 20px;
}

.file-item {
  display: flex;
  align-items: center;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 10px;
  transition: all 0.3s ease;
}

.file-item:hover {
  background: #e9ecef;
}

.file-icon {
  width: 40px;
  height: 40px;
  background: #325e21;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
}

.file-icon i {
  color: white;
  font-size: 20px;
}

.file-info {
  flex: 1;
}

.file-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 3px;
  word-break: break-all;
}

.file-size {
  font-size: 12px;
  color: #666;
}

.remove-btn {
  color: #ff4757;
}

.remove-btn:hover {
  color: #ff6b81;
}

/* 提示信息 */
.tips {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #666;
  padding: 10px 15px;
  background: #f8f9fa;
  border-radius: 6px;
  margin-top: 15px;
}

.tips i {
  color: #325e21;
}

/* 处理进度 */
.processing-section {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.progress-container {
  margin-top: 15px;
}

:deep(.custom-progress .el-progress-bar__outer) {
  background-color: #e9ecef;
  border-radius: 10px;
}

:deep(.custom-progress .el-progress-bar__inner) {
  background: linear-gradient(135deg, #325e21 0%, #4a8c2a 100%);
  border-radius: 10px;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.progress-text {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.progress-percent {
  font-size: 16px;
  font-weight: 600;
  color: #325e21;
}

/* 对话框底部 */
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
}

:deep(.cancel-btn) {
  padding: 0 30px;
  border: 2px solid #e9ecef;
  color: #666;
  font-weight: 500;
}

:deep(.cancel-btn:hover) {
  border-color: #325e21;
  color: #325e21;
  background: transparent;
}

:deep(.submit-btn) {
  padding: 0 40px;
  background: linear-gradient(135deg, #325e21 0%, #4a8c2a 100%);
  border: none;
  font-weight: 500;
}

:deep(.submit-btn:hover) {
  opacity: 0.9;
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(50, 94, 33, 0.4);
}

:deep(.submit-btn.is-disabled) {
  opacity: 0.6;
  transform: none;
  box-shadow: none;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .dialog-container {
    padding: 0 20px;
  }
  
  :deep(.upload-dialog-custom .el-dialog) {
    width: 95% !important;
    margin: 20px auto;
  }
  
  :deep(.upload-dialog-custom .el-dialog__header),
  :deep(.upload-dialog-custom .el-dialog__footer) {
    padding: 20px;
  }
  
  .type-cards {
    grid-template-columns: 1fr;
  }
  
  .input-content-section {
    padding: 20px;
  }
}

/* 原有响应式设计 */
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
</style>