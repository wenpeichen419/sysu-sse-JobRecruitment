<template>
  <div class="modal-overlay" v-if="visible" @click="closeModal">
    <div class="modal-content" @click.stop>
      <!-- 关闭按钮 -->
      <button class="modal-close" @click="closeModal">×</button>
      
      <!-- 弹窗标题 -->
      <div class="modal-header">
        <h2 class="modal-title">候选人简介</h2>
        <span class="modal-subtitle">{{ candidateName }}的个人简历</span>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <span>加载中...</span>
      </div>

      <!-- 简历内容 -->
      <div v-else-if="resumeData" class="resume-content">
        <div class="resume-left">
          <div class="resume-avatar-section">
            <div class="resume-avatar">
              <img 
                v-if="avatarUrl" 
                :src="avatarUrl" 
                :alt="resumeData.basic_info?.full_name || candidateName + '的头像'"
                @error="handleAvatarError"
              >
              <div v-else class="avatar-placeholder">
                {{ getCandidateInitial(resumeData.basic_info?.full_name || candidateName) }}
              </div>
            </div>
            <h2 class="resume-name">{{ resumeData.basic_info?.full_name || candidateName }}</h2>
            <div class="resume-basic-info">
              <span class="info-tag">{{ resumeData.basic_info?.gender || '--' }}</span>
              <span class="info-separator">|</span>
              <span class="info-tag">{{ resumeData.basic_info?.age || '--' }}岁</span>
              <span class="info-separator">|</span>
              <span class="info-tag">{{ resumeData.basic_info?.degree_level || '--' }}</span>
            </div>
          </div>
          
          <div class="resume-section">
            <h4 class="resume-section-title">期望职位</h4>
            <div class="resume-text">
              <div class="text-item">
                <span class="item-label">岗位:</span>
                <span class="item-value">{{ resumeData.expected_job?.expected_position || '--' }}</span>
              </div>
              <div class="text-item">
                <span class="item-label">期望薪资:</span>
                <span class="item-value">{{ resumeData.expected_job?.expected_salary || '--' }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="resume-right">
          <!-- 教育经历 -->
          <div class="resume-section">
            <h4 class="resume-section-title">教育经历</h4>
            <div class="education-item" v-if="resumeData.primary_education">
              <div class="edu-school">{{ resumeData.primary_education.school_name || '--' }}</div>
              <div class="edu-time">
                {{ resumeData.primary_education.start_date || '--' }} 至 {{ resumeData.primary_education.end_date || '--' }}
              </div>
              <div class="edu-details">
                <span class="edu-major">{{ resumeData.primary_education.major || '--' }}</span>
                <span class="info-separator">|</span>
                <span class="edu-degree">{{ resumeData.primary_education.degree_level || '--' }}</span>
                <span class="info-separator">|</span>
                <span class="edu-rank">专业排名: {{ resumeData.primary_education.major_rank || '--' }}</span>
              </div>
            </div>
            <div v-else class="no-data">暂无教育经历信息</div>
          </div>

          <!-- 个人标签 -->
          <div class="resume-section" v-if="hasPersonalTags">
            <h4 class="resume-section-title">个人标签</h4>
            <div class="resume-tags">
              <span 
                v-for="tag in personalTags" 
                :key="tag.tag_id" 
                class="resume-tag"
              >{{ tag.name }}</span>
            </div>
          </div>

          <!-- 技能标签 -->
          <div class="resume-section" v-if="hasSkills">
            <h4 class="resume-section-title">技能标签</h4>
            <div class="resume-tags">
              <span 
                v-for="(skill, index) in resumeData.skills" 
                :key="index" 
                class="resume-tag"
              >{{ skill }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 错误状态 -->
      <div v-else class="error-state">
        <span>加载简历信息失败</span>
        <button class="retry-btn" @click="fetchResume">重试</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CandidateProfileModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    candidateName: {
      type: String,
      default: ''
    },
    userId: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      loading: false,
      resumeData: null,
      error: null,
      avatarUrl: null,
      avatarLoaded: false
    }
  },
  computed: {
    // 计算是否有个人标签
    hasPersonalTags() {
      return this.resumeData?.personal_tags && this.resumeData.personal_tags.length > 0
    },
    // 获取个人标签数组
    personalTags() {
      return this.resumeData?.personal_tags || []
    },
    // 计算是否有技能标签
    hasSkills() {
      return this.resumeData?.skills && this.resumeData.skills.length > 0
    }
  },
  watch: {
    visible(newVal) {
      if (newVal && this.userId) {
        this.fetchResume()
      } else {
        this.resetData()
      }
    }
  },
  methods: {
    async fetchResume() {
      if (!this.userId) return
      
      this.loading = true
      this.error = null
      this.avatarUrl = null
      this.avatarLoaded = false
      
      try {
        const token = localStorage.getItem('token')
        
        const response = await fetch(`http://localhost:8080/api/hr/resume/${this.userId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        console.log('候选人简历接口返回数据:', data)
        
        if (data.code === 200 && data.data) {
          this.resumeData = data.data
          // 获取头像
          if (this.resumeData.avatar_url) {
            this.fetchAvatar(this.resumeData.avatar_url)
          }
        } else {
          throw new Error(data.message || '获取简历信息失败')
        }
      } catch (error) {
        console.error('获取候选人简历失败:', error)
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    // 获取候选人头像
    async fetchAvatar(avatarUrl) {
      if (!avatarUrl) {
        this.avatarUrl = null
        return
      }
      
      try {
        const token = localStorage.getItem('token')
        
        let finalAvatarUrl = avatarUrl
        if (finalAvatarUrl.startsWith('/')) {
          finalAvatarUrl = `http://localhost:8080${finalAvatarUrl}`
        }
        
        console.log('请求头像URL:', finalAvatarUrl)
        
        const response = await fetch(finalAvatarUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        })
        
        console.log('头像响应状态:', response.status)
        
        if (response.ok) {
          const blob = await response.blob()
          this.avatarUrl = URL.createObjectURL(blob)
          this.avatarLoaded = true
        } else {
          console.error('获取头像失败，状态码:', response.status)
          this.avatarUrl = null
        }
      } catch (error) {
        console.error('获取候选人头像失败:', error)
        this.avatarUrl = null
      }
    },

    // 获取候选人姓名的首字母
    getCandidateInitial(name) {
      if (!name) return '?'
      return name.charAt(0)
    },

    // 头像加载失败时的处理
    handleAvatarError() {
      console.log('头像加载失败，显示姓氏占位符')
      this.avatarUrl = null
      this.avatarLoaded = false
    },

    closeModal() {
      this.$emit('close')
    },

    resetData() {
      this.resumeData = null
      this.error = null
      this.loading = false
      this.avatarUrl = null
      this.avatarLoaded = false
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 12px;
  padding: 30px;
  width: 90%;
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.modal-close {
  position: absolute;
  top: 15px;
  right: 20px;
  background: none;
  border: none;
  font-size: 30px;
  cursor: pointer;
  color: #999;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s;
}

.modal-close:hover {
  background: #f5f5f5;
  color: #333;
}

.modal-header {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #f0f0f0;
}

.modal-title {
  font-size: 26px;
  font-weight: 700;
  color: #325e21;
  margin: 0 0 8px 0;
}

.modal-subtitle {
  font-size: 15px;
  color: #999;
  font-style: italic;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  padding: 40px;
  color: #666;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #325e21;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  padding: 40px;
  color: #f44336;
}

.retry-btn {
  padding: 8px 16px;
  background: #325e21;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.retry-btn:hover {
  background: #2a4e1b;
}

/* 简历内容样式 */
.resume-content {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 30px;
}

.resume-left {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.resume-avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px;
}

.resume-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  position: relative;
  margin-bottom: 12px;
  border: 4px solid white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.resume-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #325e21, #4a7c2f);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  font-weight: bold;
  border-radius: 50%;
}

.resume-name {
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin: 0 0 8px 0;
}

.resume-basic-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #666;
}

.info-tag {
  color: #666;
}

.info-separator {
  color: #ccc;
}

.resume-right {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.resume-section {
  padding: 18px;
  background: #f8f9fa;
  border-radius: 10px;
  border-left: 4px solid #325e21;
}

.resume-section-title {
  font-size: 18px;
  font-weight: 700;
  color: #325e21;
  margin: 0 0 12px 0;
}

.resume-text {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.text-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.item-label {
  color: #666;
  font-weight: 600;
  min-width: 70px;
}

.item-value {
  color: #333;
  font-weight: 500;
}

.education-item {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.edu-school {
  font-size: 18px;
  font-weight: 700;
  color: #333;
}

.edu-time {
  font-size: 15px;
  color: #666;
  font-weight: 500;
}

.edu-details {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.edu-major {
  color: #333;
  font-weight: 600;
}

.edu-degree {
  color: #666;
}

.edu-rank {
  color: #666;
}

.resume-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.resume-tag {
  padding: 6px 12px;
  background: white;
  color: #325e21;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid #c3d6c0;
}

.no-data {
  color: #999;
  font-style: italic;
  text-align: center;
  padding: 20px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .modal-content {
    padding: 20px;
    width: 95%;
  }
  
  .resume-content {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .resume-avatar-section {
    padding: 15px;
  }
  
  .resume-avatar {
    width: 80px;
    height: 80px;
  }
  
  .resume-name {
    font-size: 20px;
  }
  
  .resume-section {
    padding: 15px;
  }
}
</style>