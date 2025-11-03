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
      width="600px"
      :close-on-click-modal="false"
    >
      <div class="upload-dialog-content">
        <el-upload
          ref="uploadRef"
          class="upload-area"
          drag
          :auto-upload="false"
          :on-change="handleFileChange"
          :limit="1"
          accept=".doc,.docx,.pdf,.txt"
        >
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">
            将文件拖到此处，或<em>点击上传</em>
          </div>
          <template #tip>
            <div class="el-upload__tip">
              支持 .doc / .docx / .pdf / .txt 格式文件，大小不超过10MB
            </div>
          </template>
        </el-upload>

        <div v-if="uploadedFile" class="file-info">
          <el-icon class="file-icon"><document /></el-icon>
          <span class="file-name">{{ uploadedFile.name }}</span>
          <span class="file-size">{{ formatFileSize(uploadedFile.size) }}</span>
        </div>

        <div v-if="isProcessing" class="processing-info">
          <el-progress :percentage="processingProgress" :stroke-width="8" />
          <p class="processing-text">{{ processingText }}</p>
        </div>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="uploadDialogVisible = false">取消</el-button>
          <el-button 
            type="primary" 
            @click="handleUploadConfirm"
            :disabled="!uploadedFile || isProcessing"
            :loading="isProcessing"
          >
            {{ isProcessing ? '正在解析...' : '确认上传' }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { UploadFilled, Document } from '@element-plus/icons-vue'

export default {
  name: 'PostMethodChoice',
  components: {
    UploadFilled,
    Document
  },
  setup() {
    const router = useRouter()
    const uploadDialogVisible = ref(false)
    const uploadedFile = ref(null)
    const uploadRef = ref(null)
    const isProcessing = ref(false)
    const processingProgress = ref(0)
    const processingText = ref('正在上传文件...')

    // 跳转到手动填写表单
    const goToManualForm = () => {
      router.push('/position-form')
    }

    // 显示上传对话框
    const showUploadDialog = () => {
      uploadDialogVisible.value = true
      uploadedFile.value = null
      isProcessing.value = false
      processingProgress.value = 0
    }

    // 文件选择变化
    const handleFileChange = (file) => {
      // 验证文件大小（10MB）
      const maxSize = 10 * 1024 * 1024
      if (file.size > maxSize) {
        ElMessage.error('文件大小不能超过10MB')
        return false
      }
      
      uploadedFile.value = file.raw
    }

    // 格式化文件大小
    const formatFileSize = (bytes) => {
      if (bytes === 0) return '0 B'
      const k = 1024
      const sizes = ['B', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
    }

    // 模拟LLM解析过程
    const simulateLLMProcessing = () => {
      return new Promise((resolve) => {
        isProcessing.value = true
        processingProgress.value = 0
        processingText.value = '正在上传文件...'

        // 模拟上传进度
        const uploadInterval = setInterval(() => {
          processingProgress.value += 10
          if (processingProgress.value >= 30) {
            clearInterval(uploadInterval)
            processingText.value = 'LLM正在解析文档内容...'
            
            // 模拟解析进度
            const parseInterval = setInterval(() => {
              processingProgress.value += 5
              if (processingProgress.value >= 70) {
                clearInterval(parseInterval)
                processingText.value = '正在提取关键信息...'
                
                // 模拟提取进度
                const extractInterval = setInterval(() => {
                  processingProgress.value += 6
                  if (processingProgress.value >= 100) {
                    clearInterval(extractInterval)
                    processingText.value = '解析完成！'
                    setTimeout(() => {
                      resolve()
                    }, 500)
                  }
                }, 200)
              }
            }, 300)
          }
        }, 100)
      })
    }

    // 确认上传并处理
    const handleUploadConfirm = async () => {
      if (!uploadedFile.value) {
        ElMessage.warning('请先选择文件')
        return
      }

      try {
        // 模拟LLM处理过程
        await simulateLLMProcessing()
        
        ElMessage.success('文档解析成功！即将跳转到表单页面')
        
        // 模拟从LLM提取的数据
        const extractedData = {
          positionName: '后端开发工程师',
          department: '技术部',
          location: '北京市海淀区',
          category: '开发',
          tags: ['Java', 'Spring Boot', '微服务'],
          recruitCount: 5,
          deadline: '2025-12-31',
          description: '负责后端系统的开发与维护，参与系统架构设计，优化系统性能。',
          requirements: '1. 计算机相关专业本科及以上学历；\n2. 熟练掌握Java编程语言；\n3. 熟悉Spring Boot、MyBatis等主流框架；\n4. 具有良好的团队协作能力。',
          bonus: '有大型互联网公司实习经验者优先',
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

      } catch (error) {
        ElMessage.error('文档解析失败，请重试')
        isProcessing.value = false
      }
    }

    return {
      uploadDialogVisible,
      uploadedFile,
      uploadRef,
      isProcessing,
      processingProgress,
      processingText,
      goToManualForm,
      showUploadDialog,
      handleFileChange,
      formatFileSize,
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

.upload-area {
  margin-bottom: 20px;
}

:deep(.el-upload-dragger) {
  padding: 40px;
}

:deep(.el-icon--upload) {
  font-size: 67px;
  color: #325e21;
  margin-bottom: 16px;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px;
  background: #f5f5f5;
  border-radius: 8px;
  margin-top: 15px;
}

.file-icon {
  font-size: 24px;
  color: #325e21;
}

.file-name {
  flex: 1;
  color: #333;
  font-weight: 500;
}

.file-size {
  color: #999;
  font-size: 14px;
}

.processing-info {
  margin-top: 20px;
  padding: 20px;
  background: #f0f9ff;
  border-radius: 8px;
}

.processing-text {
  text-align: center;
  color: #325e21;
  font-weight: 500;
  margin-top: 15px;
  font-size: 16px;
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
</style>

