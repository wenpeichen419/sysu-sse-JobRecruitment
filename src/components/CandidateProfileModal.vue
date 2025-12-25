<template>
  <div class="modal-overlay" v-if="visible" @click="closeModal">
    <div class="modal-content" @click.stop>
      <button class="modal-close" @click="closeModal">×</button>
      
      <div class="modal-header">
        <h2 class="modal-title">候选人简介</h2>
        <span class="modal-subtitle">{{ displayValue(candidateName, '暂无') }}的个人简历</span>
      </div>

      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <span>加载中...</span>
      </div>

      <div v-else-if="resumeData" class="resume-content">
        <div class="resume-left">
          <div class="resume-avatar-section">
            <div class="resume-avatar">
              <img 
                v-if="avatarUrl" 
                :src="avatarUrl" 
                :alt="displayValue(resumeData.basic_info?.full_name || candidateName, '暂无') + '的头像'"
                @error="handleAvatarError"
              >
              <div v-else class="avatar-placeholder">
                {{ getCandidateDisplayName(resumeData.basic_info?.full_name || candidateName) }}
              </div>
            </div>
            <h2 class="resume-name" :class="{ 'empty-value': !resumeData.basic_info?.full_name }">
              {{ displayValue(resumeData.basic_info?.full_name || candidateName, '暂无') }}
            </h2>
            
            <div class="job-status-badge" :class="getJobStatusClass()">
              <span class="status-icon">{{ getJobStatusIcon() }}</span>
              <span class="status-text">{{ getJobStatusText() }}</span>
            </div>
            
            <div class="resume-basic-info">
              <span class="info-tag" :class="{ 'empty-value': !resumeData.basic_info?.gender }">
                {{ displayValue(resumeData.basic_info?.gender, '暂无') }}
              </span>
              <span class="info-separator">|</span>
              <span class="info-tag" :class="{ 'empty-value': !resumeData.basic_info?.age }">
                {{ displayValue(resumeData.basic_info?.age, '暂无') }}{{ resumeData.basic_info?.age && resumeData.basic_info.age !== '暂无' ? '岁' : '' }}
              </span>
              <span class="info-separator">|</span>
              <span class="info-tag" :class="{ 'empty-value': !resumeData.basic_info?.degree_level }">
                {{ displayValue(resumeData.basic_info?.degree_level, '暂无') }}
              </span>
            </div>
          </div>
          
          <div class="resume-section">
            <h4 class="resume-section-title">期望职位</h4>
            <div class="resume-text">
              <div class="text-item">
                <span class="item-label">岗位:</span>
                <span class="item-value" :class="{ 'empty-value': !resumeData.expected_job?.expected_position }">
                  {{ displayValue(resumeData.expected_job?.expected_position, '暂无') }}
                </span>
              </div>
              <div class="text-item">
                <span class="item-label">期望薪资:</span>
                <span class="item-value" :class="{ 'empty-value': !hasSalaryData }">
                  {{ formatSalary() }}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="resume-right">
          <div class="resume-section">
            <h4 class="resume-section-title">教育经历</h4>
            <div 
              v-for="(edu, index) in educations" 
              :key="index"
              class="education-item"
              :class="{ 'not-first': index > 0 }"
            >
              <div class="edu-school" :class="{ 'empty-value': !edu.school }">
                {{ displayValue(edu.school, '暂无') }}
              </div>
              <div class="edu-time">
                <span :class="{ 'empty-value': !edu.startDate }">{{ displayValue(edu.startDate, '暂无') }}</span>
                 至 
                <span :class="{ 'empty-value': !edu.endDate }">{{ displayValue(edu.endDate, '暂无') }}</span>
              </div>
              <div class="edu-details">
                <span class="edu-major" :class="{ 'empty-value': !edu.major }">{{ displayValue(edu.major, '暂无') }}</span>
                <span class="info-separator">|</span>
                <span class="edu-degree" :class="{ 'empty-value': !edu.degree }">{{ displayValue(edu.degree, '暂无') }}</span>
                <span class="info-separator">|</span>
                <span class="edu-rank" :class="{ 'empty-value': !edu.ranking }">专业排名: {{ displayValue(edu.ranking, '暂无') }}</span>
              </div>
            </div>
            <div v-if="educations.length === 0" class="education-item">
              <div class="edu-school empty-value">暂无</div>
            </div>
          </div>

          <div class="resume-section">
            <h4 class="resume-section-title">能力标签</h4>
            <div class="resume-tags">
              <span 
                v-if="personalTags.length === 0" 
                class="empty-resume-tag"
              >暂无</span>
              <span 
                v-for="tag in personalTags" 
                :key="tag.tag_id" 
                class="resume-tag"
              >{{ tag.name }}</span>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="error-state">
        <span>加载简历信息失败</span>
        <button class="retry-btn" @click="fetchResume">重试</button>
      </div>
    </div>
  </div>
</template>

<script>
import { loadImageWithAuth, revokeBlobUrls } from '@/utils/imageLoader'

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
      avatarLoaded: false,
      jobSeekingStatus: 0,
      baseURL: 'http://localhost:8080',
      hasSalaryData: false
    }
  },
  computed: {
    personalTags() {
      return this.resumeData?.personal_tags || []
    },
    educations() {
      if (!this.resumeData) return []
      let educations = []
      if (this.resumeData.primary_education && Array.isArray(this.resumeData.primary_education)) {
        educations = this.resumeData.primary_education.map(edu => ({
          school: edu.school_name,
          degree: edu.degree_level,
          major: edu.major,
          startDate: edu.start_date,
          endDate: edu.end_date,
          ranking: edu.major_rank
        }))
      }
      return educations
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
    displayValue(value, defaultText = '暂无') {
      if (value === null || value === undefined || value === '') {
        return defaultText
      }
      if (typeof value === 'string' && value.trim() === '') {
        return defaultText
      }
      return value
    },
    
    convertJobStatusToNumber(statusString) {
      const statusMap = {
        '在校-暂不考虑': 0,
        '在校-寻求实习': 1,
        '应届-寻求实习': 2,
        '应届-寻求校招': 3
      }
      if (typeof statusString === 'number') {
        return statusString
      }
      return statusMap[statusString] || 0
    },
    
    formatSalary() {
      if (!this.resumeData?.expected_job) {
        this.hasSalaryData = false
        return '暂无'
      }
      const minSalary = this.resumeData.expected_job.expected_min_salary
      const maxSalary = this.resumeData.expected_job.expected_max_salary
      const status = this.jobSeekingStatus
      const hasMinSalary = minSalary !== null && minSalary !== undefined && minSalary !== 0
      const hasMaxSalary = maxSalary !== null && maxSalary !== undefined && maxSalary !== 0
      if (!hasMinSalary && !hasMaxSalary) {
        this.hasSalaryData = false
        return '暂无'
      }
      this.hasSalaryData = true
      const shouldAddK = status === 3
      if (shouldAddK) {
        return `${minSalary || 0}k-${maxSalary || 0}k`
      } else {
        return `${minSalary || 0}-${maxSalary || 0}`
      }
    },
    
    getJobStatusText() {
      const status = this.jobSeekingStatus
      const statusMap = {
        0: '在校 · 暂不考虑',
        1: '在校 · 寻求实习',
        2: '应届 · 寻求实习',
        3: '应届 · 寻求校招'
      }
      return statusMap[status] || '暂无'
    },
    
    getJobStatusIcon() {
      return ''
    },
    
    getJobStatusClass() {
      const status = this.jobSeekingStatus
      const classMap = {
        0: 'status-active',
        1: 'status-active',
        2: 'status-active',
        3: 'status-active'
      }
      return classMap[status] || 'status-incomplete'
    },
    
    async fetchResume() {
      if (!this.userId) return
      this.loading = true
      this.error = null
      this.avatarUrl = null
      this.avatarLoaded = false
      this.hasSalaryData = false
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
        if (data.code === 200 && data.data) {
          this.resumeData = data.data
          const jobSeekingStatusRaw = this.resumeData.basic_info?.job_seeking_status || 0
          this.jobSeekingStatus = this.convertJobStatusToNumber(jobSeekingStatusRaw)
          if (this.resumeData.avatar_url) {
            try {
              this.avatarUrl = await loadImageWithAuth(this.resumeData.avatar_url, this.baseURL)
              this.avatarLoaded = true
            } catch (error) {
              console.warn('【头像加载失败】', error)
              this.avatarUrl = null
            }
          }
          this.formatSalary()
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

    /**
     * 修改后的方法：获取候选人姓名展示文字
     * 逻辑：取姓名的后两个字。如果姓名长度小于等于2，则显示全名。
     */
    getCandidateDisplayName(name) {
      if (!name) return '?'
      // 去除首尾空格
      const trimmedName = name.trim()
      if (trimmedName.length <= 2) {
        return trimmedName
      }
      // 取最后两个字符
      return trimmedName.substring(trimmedName.length - 2)
    },

    handleAvatarError() {
      this.avatarUrl = null
      this.avatarLoaded = false
    },

    closeModal() {
      if (this.avatarUrl && this.avatarUrl.startsWith('blob:')) {
        revokeBlobUrls([this.avatarUrl])
      }
      this.$emit('close')
    },

    resetData() {
      this.resumeData = null
      this.error = null
      this.loading = false
      this.avatarUrl = null
      this.avatarLoaded = false
      this.jobSeekingStatus = 0
      this.hasSalaryData = false
    }
  }
}
</script>

<style scoped>
/* 样式部分保持不变，仅在 avatar-placeholder 处优化字体大小以适应两个字 */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
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
  top: 15px; right: 20px;
  background: none; border: none;
  font-size: 30px; cursor: pointer;
  color: #999; width: 40px; height: 40px;
  display: flex; align-items: center; justify-content: center;
  border-radius: 50%; transition: all 0.3s;
}

.modal-close:hover { background: #f5f5f5; color: #333; }

.modal-header {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #f0f0f0;
}

.modal-title {
  font-size: 26px; font-weight: 700;
  color: #325e21; margin: 0 0 8px 0;
}

.modal-subtitle { font-size: 15px; color: #999; font-style: italic; }

.loading-state {
  display: flex; flex-direction: column;
  align-items: center; gap: 15px; padding: 40px; color: #666;
}

.loading-spinner {
  width: 40px; height: 40px;
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
  display: flex; flex-direction: column;
  align-items: center; gap: 15px; padding: 40px; color: #f44336;
}

.retry-btn {
  padding: 8px 16px; background: #325e21;
  color: white; border: none; border-radius: 6px;
  cursor: pointer; font-size: 14px;
}

.resume-content {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 30px;
}

.resume-avatar-section {
  display: flex; flex-direction: column;
  align-items: center; padding: 20px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px;
}

.resume-avatar {
  width: 100px; height: 100px;
  border-radius: 50%; overflow: hidden;
  position: relative; margin-bottom: 12px;
  border: 4px solid white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.resume-avatar img { width: 100%; height: 100%; object-fit: cover; }

.avatar-placeholder {
  width: 100%; height: 100%;
  background: linear-gradient(135deg, #325e21, #4a7c2f);
  color: white; display: flex;
  align-items: center; justify-content: center;
  font-size: 24px; /* 减小了字体以容纳两个字 */
  font-weight: bold; border-radius: 50%;
}

.resume-name { font-size: 24px; font-weight: 700; color: #333; margin: 0 0 8px 0; }
.resume-name.empty-value { color: #ff9800; }

.job-status-badge {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 8px 18px; border-radius: 20px;
  font-size: 14px; font-weight: 600; margin: 12px 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
}

.status-active {
  background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
  color: #2e7d32; border: 1px solid #81c784;
}

.resume-basic-info { display: flex; align-items: center; gap: 8px; font-size: 14px; color: #666; }
.info-tag.empty-value { color: #ff9800; }
.info-separator { color: #ccc; }

.resume-right { display: flex; flex-direction: column; gap: 20px; }

.resume-section {
  padding: 18px; background: #f8f9fa;
  border-radius: 10px; border-left: 4px solid #325e21;
}

.resume-section-title { font-size: 18px; font-weight: 700; color: #325e21; margin: 0 0 12px 0; }
.text-item { display: flex; align-items: center; gap: 8px; font-size: 14px; }
.item-label { color: #666; font-weight: 600; min-width: 70px; }
.item-value { color: #333; font-weight: 500; }
.item-value.empty-value { color: #ff9800; }

.education-item.not-first { margin-top: 20px; padding-top: 20px; border-top: 1px dashed #ddd; }
.edu-school { font-size: 18px; font-weight: 700; color: #333; }
.edu-school.empty-value { color: #ff9800; }
.edu-time { font-size: 15px; color: #666; font-weight: 500; }
.edu-details { display: flex; align-items: center; gap: 8px; font-size: 14px; }
.edu-major { color: #333; font-weight: 600; }

.resume-tags { display: flex; flex-wrap: wrap; gap: 8px; }
.resume-tag {
  padding: 6px 12px; background: white; color: #325e21;
  border-radius: 16px; font-size: 12px; font-weight: 500;
  border: 1px solid #c3d6c0;
}

@media (max-width: 768px) {
  .resume-content { grid-template-columns: 1fr; }
}
</style>