<template>
  <div class="student-center-page">
    <!-- 面包屑导航 -->
    <div class="breadcrumb">
      <span class="crumb-item">学生中心</span>
    </div>

    <!-- 欢迎信息框 -->
    <div class="welcome-card">
      <div class="welcome-left">
        <div class="avatar-section">
          <img :src="studentInfo.avatar" alt="头像" class="avatar" />
        </div>
        <div class="user-info">
          <div class="user-header">
            <h2 class="user-name">您好，{{ studentInfo.name }}</h2>
          </div>
          <div class="user-details-grid">
            <div class="info-item">
              <span class="info-label">学号:</span>
              <span class="info-value" :class="{ 'empty-value': !studentInfo.studentId }">{{ displayValue(studentInfo.studentId) }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">手机:</span>
              <span class="info-value" :class="{ 'empty-value': !studentInfo.phone }">{{ displayValue(studentInfo.phone) }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">邮箱:</span>
              <span class="info-value" :class="{ 'empty-value': !studentInfo.email }">{{ displayValue(studentInfo.email) }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">上次登录:</span>
              <span class="info-value">{{ displayValue(studentInfo.lastLogin) }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="tags-section">
        <div class="tags-container">
          <span class="tags-label">能力标签:</span>
          <div class="tags-content">
            <span 
              v-if="displayTags.length === 0" 
              class="empty-tag"
            >待完善</span>
            <span 
              v-for="(tag, index) in displayTags" 
              :key="index" 
              class="tag"
            >{{ tag }}</span>
            <a class="more-link" @click="goToTags">
              <span class="more-text">{{ displayTags.length === 0 ? '去添加' : '查看全部' }}</span>
              <span class="more-arrow">›</span>
            </a>
          </div>
        </div>
      </div>

      <!-- 快捷操作按钮 - 放在右上角 -->
      <div class="quick-actions">
        <button class="action-btn edit-info" @click="goToEditInfo">
          <span class="btn-icon">✎</span>
          <span class="btn-text">编辑信息</span>
        </button>
        <button class="action-btn change-pwd" @click="showPasswordDialog = true">
          <span class="btn-icon"></span>
          <span class="btn-text">修改密码</span>
        </button>
      </div>
    </div>

    <!-- 企业侧信息预览和功能按钮区 -->
    <div class="main-content-area">
      <!-- 企业侧信息预览 -->
      <div class="resume-preview-card">
        <div class="preview-header">
          <h3 class="preview-title">企业侧信息预览</h3>
          <span class="preview-subtitle">您的信息在企业HR眼中的展示如下</span>
        </div>
        
        <div class="resume-content">
          <div class="resume-left">
            <div class="resume-avatar-section">
              <img :src="studentInfo.avatar" alt="简历照片" class="resume-avatar" />
              <h2 class="resume-name" :class="{ 'empty-value': !studentInfo.name }">{{ displayValue(studentInfo.name) }}</h2>
              
              <!-- 求职状态徽章 -->
              <div class="job-status-badge" :class="getJobStatusClass()">
                <span class="status-icon">{{ getJobStatusIcon() }}</span>
                <span class="status-text">{{ getJobStatusText() }}</span>
              </div>
              
              <div class="resume-basic-info">
                <span class="info-tag" :class="{ 'empty-value': !studentInfo.gender }">{{ displayValue(studentInfo.gender) }}</span>
                <span class="info-separator">|</span>
                <span class="info-tag" :class="{ 'empty-value': calculateAge(studentInfo.birthday) === '--' }">{{ displayValue(calculateAge(studentInfo.birthday), '待完善') }}{{ calculateAge(studentInfo.birthday) !== '--' && calculateAge(studentInfo.birthday) !== '待完善' ? '岁' : '' }}</span>
                <span class="info-separator">|</span>
                <span class="info-tag" :class="{ 'empty-value': !studentInfo.degree }">{{ displayValue(studentInfo.degree) }}</span>
              </div>
            </div>
            
            <div class="resume-section">
              <h4 class="resume-section-title">期望职位</h4>
              <div class="resume-text">
                <div class="text-item">
                  <span class="item-label">岗位:</span>
                  <span class="item-value" :class="{ 'empty-value': !studentInfo.desiredPosition }">{{ displayValue(studentInfo.desiredPosition) }}</span>
                </div>
                <div class="text-item">
                  <span class="item-label">期望薪资:</span>
                  <span class="item-value" :class="{ 'empty-value': !studentInfo.expectedMinSalary && !studentInfo.expectedMaxSalary }">{{ formatSalary() }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="resume-right">
            <div class="resume-section">
              <h4 class="resume-section-title">教育经历</h4>
              <div 
                v-for="(edu, index) in studentInfo.educations" 
                :key="index"
                class="education-item"
                :class="{ 'not-first': index > 0 }"
              >
                <div class="edu-school" :class="{ 'empty-value': !edu.school }">{{ displayValue(edu.school) }}</div>
                <div class="edu-time">
                  <span :class="{ 'empty-value': !edu.startDate }">{{ displayValue(edu.startDate) }}</span>
                   至 
                  <span :class="{ 'empty-value': !edu.endDate }">{{ displayValue(edu.endDate) }}</span>
                </div>
                <div class="edu-details">
                  <span class="edu-major" :class="{ 'empty-value': !edu.major }">{{ displayValue(edu.major) }}</span>
                  <span class="info-separator">|</span>
                  <span class="edu-degree" :class="{ 'empty-value': !edu.degree }">{{ displayValue(edu.degree) }}</span>
                  <span class="info-separator">|</span>
                  <span class="edu-rank" :class="{ 'empty-value': !edu.ranking }">专业排名: {{ displayValue(edu.ranking) }}</span>
                </div>
              </div>
              <div v-if="!studentInfo.educations || studentInfo.educations.length === 0" class="education-item">
                <div class="edu-school empty-value">待完善</div>
              </div>
            </div>
            
            <div class="resume-section">
              <h4 class="resume-section-title">技能标签</h4>
              <div class="resume-tags">
                <span 
                  v-if="!studentInfo.tags || studentInfo.tags.length === 0" 
                  class="empty-resume-tag"
                >待完善</span>
                <span 
                  v-for="(tag, index) in studentInfo.tags.slice(0, 6)" 
                  :key="index" 
                  class="resume-tag"
                >{{ tag }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 功能卡片区 -->
      <div class="functions-grid">
        <div class="function-card" @click="goToResume">
          <div class="card-icon" style="background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%);">
            <img :src="documentIcon" alt="我的简历" class="icon-img" />
          </div>
          <div class="card-title">我的简历</div>
          <div class="card-desc">管理和编辑个人简历</div>
        </div>

        <div class="function-card" @click="goToFavorites">
          <div class="card-icon" style="background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%);">
            <img :src="favoriteIcon" alt="我的收藏" class="icon-img" />
          </div>
          <div class="card-title">我的收藏</div>
          <div class="card-desc">查看收藏的岗位信息</div>
        </div>

        <div class="function-card" @click="goToApplications">
          <div class="card-icon" style="background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%);">
            <img :src="applyIcon" alt="投递进度" class="icon-img" />
          </div>
          <div class="card-title">投递进度</div>
          <div class="card-desc">查看已投递的岗位状态</div>
        </div>
      </div>
    </div>

    <!-- 修改密码弹窗 -->
    <div class="dialog-overlay" v-if="showPasswordDialog" @click="showPasswordDialog = false">
      <div class="dialog-content" @click.stop>
        <h3 class="dialog-title">修改密码</h3>
        
        <div class="form-group">
          <label class="form-label">原密码</label>
          <input 
            type="password" 
            v-model="passwordForm.oldPassword" 
            class="form-input"
            placeholder="请输入原密码"
          />
        </div>

        <div class="form-group">
          <label class="form-label">新密码</label>
          <input 
            type="password" 
            v-model="passwordForm.newPassword" 
            class="form-input"
            placeholder="请输入新密码"
          />
        </div>

        <div class="form-group">
          <label class="form-label">确认密码</label>
          <input 
            type="password" 
            v-model="passwordForm.confirmPassword" 
            class="form-input"
            placeholder="请再次输入新密码"
          />
        </div>

        <div class="dialog-actions">
          <button class="btn-cancel" @click="cancelPasswordChange">取消修改</button>
          <button class="btn-submit" @click="submitPasswordChange">立即修改</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// ✅ 导入API方法
import { getWelcomeInfo, getResumePreview, changePassword } from '@/api'
import { loadImageWithAuth, revokeBlobUrls } from '@/utils/imageLoader'
// ✅ 导入默认头像
import defaultAvatar from '@/assets/default-avatar.png'
// ✅ 导入功能图标
import documentIcon from '@/assets/文档.png'
import favoriteIcon from '@/assets/收藏.png'
import applyIcon from '@/assets/立即投递.png'

export default {
  name: 'StudentCenter',
  data() {
    return {
      showPasswordDialog: false,
      // ✅ 学生信息(从API获取,初始为空对象)
      studentInfo: {
        avatar: defaultAvatar,  // 初始使用默认头像
        name: '',
        studentId: '',
        school: '',
        major: '',
        phone: '',
        email: '',
        lastLogin: '',
        tags: [],
        gender: '',
        birthday: '',
        degree: '',
        desiredPosition: '',
        expectedMinSalary: 0,
        expectedMaxSalary: 0,
        jobSeekingStatus: 0,
        educations: [] // 教育经历数组
      },
      // 密码表单
      passwordForm: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      // ✅ 加载状态
      loading: false,
      // ✅ 后端基础URL
      baseURL: 'http://localhost:8080',
      // ✅ 功能图标
      documentIcon,
      favoriteIcon,
      applyIcon
    }
  },
  computed: {
    // 最多显示4个标签
    displayTags() {
      return this.studentInfo.tags ? this.studentInfo.tags.slice(0, 4) : []
    }
  },
  mounted() {
    // ✅ 页面加载时获取学生信息
    this.loadStudentInfo()
  },
  beforeUnmount() {
    // ✅ 释放 blob URL，避免内存泄漏
    if (this.studentInfo.avatar && this.studentInfo.avatar.startsWith('blob:')) {
      revokeBlobUrls([this.studentInfo.avatar])
    }
  },
  methods: {
    // ✅ 辅助方法：处理空值显示
    displayValue(value, defaultText = '待完善') {
      // 处理各种空值情况
      if (value === null || value === undefined || value === '') {
        return defaultText
      }
      // 处理字符串类型的空白
      if (typeof value === 'string' && value.trim() === '') {
        return defaultText
      }
      return value
    },
    
    // ✅ 新增：将后端返回的求职状态字符串转换为数字
    convertJobStatusToNumber(statusString) {
      const statusMap = {
        '在校-暂不考虑': 0,
        '在校-寻求实习': 1,
        '应届-寻求实习': 2,
        '应届-寻求校招': 3
      }
      // 如果已经是数字，直接返回
      if (typeof statusString === 'number') {
        return statusString
      }
      // 转换字符串为数字，如果找不到匹配则返回0
      return statusMap[statusString] || 0
    },
    
    // ✅ 新增:加载学生信息
    async loadStudentInfo() {
      try {
        this.loading = true
        
        // 并行调用两个接口
        const [welcomeData, resumeData] = await Promise.all([
          getWelcomeInfo(),
          getResumePreview()
        ])
        
        console.log('【欢迎信息】', welcomeData)
        console.log('【简历预览】', resumeData)
        console.log('【头像路径】', resumeData.avatar_url)
        
        // ✅ 加载头像（带token验证），如果没有头像URL则使用默认头像
        let avatarBlobUrl = defaultAvatar // 默认使用本地默认头像
        if (resumeData.avatar_url) {
          try {
            avatarBlobUrl = await loadImageWithAuth(resumeData.avatar_url, this.baseURL)
          } catch (error) {
            console.warn('【头像加载失败，使用默认头像】', error)
            avatarBlobUrl = defaultAvatar
          }
        }
        
        // 处理教育经历数组（支持单个对象或数组）
        let educations = []
        
        // 检查多种可能的字段名称，兼容不同的接口返回格式
        if (resumeData.education_list && Array.isArray(resumeData.education_list)) {
          // 如果有 education_list 数组
          educations = resumeData.education_list.map(edu => ({
            school: edu.school_name || '',
            degree: edu.degree_level || '',
            major: edu.major || '',
            startDate: edu.start_date || '',
            endDate: edu.end_date || '',
            ranking: edu.major_rank || ''
          }))
        } else if (resumeData.educations && Array.isArray(resumeData.educations)) {
          // 如果有 educations 数组
          educations = resumeData.educations.map(edu => ({
            school: edu.school_name || '',
            degree: edu.degree_level || '',
            major: edu.major || '',
            startDate: edu.start_date || '',
            endDate: edu.end_date || '',
            ranking: edu.major_rank || ''
          }))
        } else if (resumeData.primary_education) {
          // 如果只有 primary_education，判断是数组还是对象
          if (Array.isArray(resumeData.primary_education)) {
            // 如果是数组
            educations = resumeData.primary_education.map(edu => ({
              school: edu.school_name || '',
              degree: edu.degree_level || '',
              major: edu.major || '',
              startDate: edu.start_date || '',
              endDate: edu.end_date || '',
              ranking: edu.major_rank || ''
            }))
          } else {
            // 如果是对象，转换为单元素数组
            educations = [{
              school: resumeData.primary_education.school_name || '',
              degree: resumeData.primary_education.degree_level || '',
              major: resumeData.primary_education.major || '',
              startDate: resumeData.primary_education.start_date || '',
              endDate: resumeData.primary_education.end_date || '',
              ranking: resumeData.primary_education.major_rank || ''
            }]
          }
        }
        
        console.log('【教育经历数组】', educations)
        
        // 获取最高学历（数组最后一条）
        const highestDegree = educations.length > 0 ? educations[educations.length - 1].degree : ''
        console.log('【最高学历】', highestDegree)
        
        // 获取求职状态和薪资信息
        const jobSeekingStatusRaw = resumeData.basic_info.job_seeking_status || 0
        const jobSeekingStatus = this.convertJobStatusToNumber(jobSeekingStatusRaw)
        const minSalary = resumeData.expected_job.expected_min_salary || 0
        const maxSalary = resumeData.expected_job.expected_max_salary || 0
        console.log('【求职状态（原始）】', jobSeekingStatusRaw)
        console.log('【求职状态（转换后）】', jobSeekingStatus)
        console.log('【期望薪资】', minSalary, '-', maxSalary)
        
        // 合并数据到 studentInfo
        this.studentInfo = {
          // 从欢迎信息接口获取
          name: welcomeData.full_name,
          studentId: welcomeData.student_id,
          school: welcomeData.school_name,
          phone: welcomeData.phone_number,
          email: welcomeData.email,
          lastLogin: this.formatDateTime(welcomeData.last_login_at),
          tags: welcomeData.personal_tags.map(tag => tag.name),
          
          // 从简历预览接口获取
          avatar: avatarBlobUrl,  // 使用 blob URL
          gender: resumeData.basic_info.gender,
          birthday: '', // 接口不返回生日，使用 age 字段
          age: resumeData.basic_info.age,
          degree: highestDegree, // 使用教育经历数组最后一条的学历
          jobSeekingStatus: jobSeekingStatus,
          
          // 教育信息数组
          educations: educations,
          
          // 期望职位
          desiredPosition: resumeData.expected_job.expected_position,
          expectedMinSalary: minSalary,
          expectedMaxSalary: maxSalary
        }
        
        console.log('【加载学生信息成功】', this.studentInfo)
      } catch (error) {
        console.error('【加载学生信息失败】', error)
        alert('加载学生信息失败，请刷新页面重试')
      } finally {
        this.loading = false
      }
    },
    
    // 计算年龄（如果有 age 字段直接使用，否则根据生日计算）
    calculateAge(birthday) {
      // 如果直接有 age 字段，使用它
      if (this.studentInfo.age) {
        return this.studentInfo.age
      }
      // 否则根据生日计算
      if (!birthday) return '--'
      const birthYear = parseInt(birthday.split('-')[0])
      const currentYear = new Date().getFullYear()
      return currentYear - birthYear
    },
    
    // 格式化日期时间
    formatDateTime(dateTimeStr) {
      if (!dateTimeStr) return '--'
      try {
        const date = new Date(dateTimeStr)
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        const hours = String(date.getHours()).padStart(2, '0')
        const minutes = String(date.getMinutes()).padStart(2, '0')
        return `${year}-${month}-${day} ${hours}:${minutes}`
      } catch (error) {
        console.error('日期格式化失败:', error)
        return dateTimeStr
      }
    },
    
    // 格式化薪资显示
    formatSalary() {
      const minSalary = this.studentInfo.expectedMinSalary
      const maxSalary = this.studentInfo.expectedMaxSalary
      const status = this.studentInfo.jobSeekingStatus
      
      // 如果没有薪资数据
      if (!minSalary && !maxSalary) {
        return '待完善'
      }
      
      // 求职状态：1=在校-寻求实习, 2=应届-寻求实习 -> 不加k
      // 求职状态：3=应届-寻求校招 -> 加k（用户填的就是k值，直接加后缀即可）
      const shouldAddK = status === 3
      
      if (shouldAddK) {
        // 校招：直接加k后缀
        return `${minSalary || 0}k-${maxSalary || 0}k`
      } else {
        // 实习：不加k，直接显示数字
        return `${minSalary || 0}-${maxSalary || 0}`
      }
    },
    
    // 获取求职状态文本
    getJobStatusText() {
      const status = this.studentInfo.jobSeekingStatus
      const statusMap = {
        0: '在校 · 暂不考虑',
        1: '在校 · 寻求实习',
        2: '应届 · 寻求实习',
        3: '应届 · 寻求校招'
      }
      return statusMap[status] || '待完善'
    },
    
    // 获取求职状态图标
    getJobStatusIcon() {
      const status = this.studentInfo.jobSeekingStatus
      const iconMap = {
        0: '',
        1: '',
        2: '',
        3: ''
      }
      return iconMap[status] || ''
    },
    
    // 获取求职状态样式类名
    getJobStatusClass() {
      const status = this.studentInfo.jobSeekingStatus
      // 所有状态统一使用绿色样式
      const classMap = {
        0: 'status-active',
        1: 'status-active',
        2: 'status-active',
        3: 'status-active'
      }
      return classMap[status] || 'status-incomplete'
    },
    
    // 跳转到标签编辑（定位到能力标签部分）
    goToTags() {
      this.$router.push({ 
        name: 'StudentProfile', 
        hash: '#tags' 
      })
    },
    
    // 跳转到编辑信息
    goToEditInfo() {
      this.$router.push({ name: 'StudentProfile' })
    },
    
    // 跳转到简历管理
    goToResume() {
      this.$router.push({ name: 'ResumeManage' })
    },
    
    // 跳转到我的收藏
    goToFavorites() {
      this.$router.push({ name: 'MyFavorites' })
    },
    
    // 跳转到投递进度
    goToApplications() {
      this.$router.push({ name: 'AppliedList' })
    },
    
    // 取消修改密码
    cancelPasswordChange() {
      this.showPasswordDialog = false
      this.passwordForm = {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      }
    },
    
    // ✅ 提交密码修改(调用API)
    async submitPasswordChange() {
      // 验证
      if (!this.passwordForm.oldPassword) {
        alert('请输入原密码')
        return
      }
      if (!this.passwordForm.newPassword) {
        alert('请输入新密码')
        return
      }
      if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
        alert('两次输入的新密码不一致')
        return
      }
      if (this.passwordForm.newPassword.length < 6) {
        alert('新密码长度不能少于6位')
        return
      }
      
      try {
        // ✅ 调用API修改密码
        await changePassword({
          oldPassword: this.passwordForm.oldPassword,
          newPassword: this.passwordForm.newPassword
        })
        alert('密码修改成功!')
        this.cancelPasswordChange()
      } catch (error) {
        console.error('【修改密码失败】', error)
        // 错误信息已经在axios拦截器中显示了
      }
    }
  }
}
</script>

<style scoped>
.student-center-page {
  min-height: calc(100vh - 105px);
  background: #f5f5f5;
  padding: 30px;
}

/* 面包屑导航 - 固定定位 */
.breadcrumb {
  position: fixed;
  top: 105px;
  left: 0;
  width: 100%;
  background: #f4f4f4;
  padding: 20px 30px 20px 60px;
  z-index: 1000;
  height: 115px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
}

.breadcrumb::after {
  content: '';
  position: absolute;
  top: 20px;
  left: 30px;
  right: 30px;
  bottom: 20px;
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: -1;
  border-radius: 0;
}

.crumb-item {
  color: #325e21;
  cursor: pointer;
  font-weight: 500;
  font-size: 20px;
  position: relative;
  z-index: 1;
}

.crumb-item:hover {
  text-decoration: underline;
}

.crumb-item.current {
  color: #666;
  cursor: default;
}

.crumb-item.current:hover {
  text-decoration: none;
}

/* 欢迎信息框 */
.welcome-card {
  background: white;
  padding: 40px;
  border-radius: 12px;
  margin-bottom: 30px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.08);
  position: relative;
  margin-top: 85px; /* 为固定面包屑留出空间 */
}

.welcome-left {
  display: flex;
  gap: 30px;
  margin-bottom: 30px;
}

.avatar-section {
  flex-shrink: 0;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 3px solid #e8e8e8;
  object-fit: cover;
}

.user-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.user-header {
  display: flex;
  align-items: center;
  gap: 15px;
}

.user-name {
  font-size: 36px;
  font-weight: 700;
  color: #325e21;
  margin: 0;
}

.user-details-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 18px 50px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 17px;
}

.info-label {
  color: #666;
  font-weight: 500;
  min-width: 75px;
}

.info-value {
  color: #333;
  font-weight: 600;
}

.info-value.empty-value {
  color: #ff9800;
  font-style: italic;
}

/* 标签区域 */
.tags-section {
  padding-top: 25px;
  border-top: 2px solid #f0f0f0;
}

.tags-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.tags-label {
  font-size: 20px;
  font-weight: 600;
  color: #325e21;
}

.tags-content {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.tag {
  padding: 10px 20px;
  background: linear-gradient(135deg, #eef5ee 0%, #d4e7d4 100%);
  color: #325e21;
  border-radius: 20px;
  font-size: 16px;
  font-weight: 500;
  border: 1px solid #c3d6c0;
}

.empty-tag {
  padding: 10px 20px;
  background: #fff3e0;
  color: #ff9800;
  border-radius: 20px;
  font-size: 16px;
  font-weight: 500;
  border: 1px dashed #ffb74d;
}

.more-link {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  background: #325e21;
  color: white;
  border-radius: 20px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  text-decoration: none;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(50, 94, 33, 0.2);
}

.more-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(50, 94, 33, 0.3);
}

.more-text {
  font-size: 16px;
}

.more-arrow {
  font-size: 20px;
  font-weight: 700;
}

/* 快捷操作按钮 */
.quick-actions {
  position: absolute;
  top: 35px;
  right: 40px;
  display: flex;
  gap: 18px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 32px;
  border-radius: 10px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.action-btn.edit-info {
  background: #325e21;
  color: white;
}

.action-btn.edit-info:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 18px rgba(50, 94, 33, 0.35);
}

.action-btn.change-pwd {
  background: white;
  color: #666;
  border: 2px solid #e0e0e0;
}

.action-btn.change-pwd:hover {
  border-color: #325e21;
  color: #325e21;
  background: #f8fdf8;
  transform: translateY(-3px);
  box-shadow: 0 6px 18px rgba(50, 94, 33, 0.15);
}

.btn-icon {
  font-size: 22px;
  line-height: 1;
}

.btn-text {
  font-size: 18px;
}

/* 主内容区域 - 简历预览和功能按钮并排 */
.main-content-area {
  display: flex;
  gap: 25px;
  margin-bottom: 30px;
  align-items: stretch;
}

/* 企业侧信息预览 */
.resume-preview-card {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.08);
  flex: 1;
  min-width: 0;
}

.preview-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #f0f0f0;
}

.preview-title {
  font-size: 26px;
  font-weight: 700;
  color: #325e21;
  margin: 0;
}

.preview-subtitle {
  font-size: 15px;
  color: #999;
  font-style: italic;
}

.resume-content {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 40px;
}

.resume-left {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.resume-avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 25px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px;
}

.resume-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 4px solid white;
  object-fit: cover;
  margin-bottom: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.resume-name {
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin: 0 0 10px 0;
}

.resume-name.empty-value {
  color: #ff9800;
  font-style: italic;
}

/* 求职状态徽章 */
.job-status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 18px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  margin: 12px 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
}

.job-status-badge:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.status-icon {
  font-size: 16px;
  line-height: 1;
}

.status-text {
  font-size: 14px;
  letter-spacing: 0.5px;
}

/* 在校-寻求实习 */
.status-internship-student {
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  color: #1976d2;
  border: 1px solid #90caf9;
}

/* 应届-寻求实习 */
.status-internship-graduate {
  background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%);
  color: #7b1fa2;
  border: 1px solid #ce93d8;
}

/* 应届-寻求校招 */
.status-campus-recruit {
  background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
  color: #2e7d32;
  border: 1px solid #81c784;
}

/* 统一的激活状态 - 绿色 */
.status-active {
  background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
  color: #2e7d32;
  border: 1px solid #81c784;
}

/* 待完善状态 */
.status-incomplete {
  background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
  color: #f57c00;
  border: 1px dashed #ffb74d;
}

.resume-basic-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  color: #666;
}

.info-tag {
  color: #666;
}

.info-tag.empty-value {
  color: #ff9800;
  font-style: italic;
}

.info-separator {
  color: #ccc;
}

.resume-right {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.resume-section {
  padding: 20px;
  background: #f8f9fa;
  border-radius: 10px;
  border-left: 4px solid #325e21;
}

.resume-section-title {
  font-size: 20px;
  font-weight: 700;
  color: #325e21;
  margin: 0 0 15px 0;
}

.resume-text {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.text-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
}

.item-label {
  color: #666;
  font-weight: 600;
  min-width: 80px;
}

.item-value {
  color: #333;
  font-weight: 500;
}

.item-value.empty-value {
  color: #ff9800;
  font-style: italic;
}

.education-item {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.education-item.not-first {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px dashed #ddd;
}

.edu-school {
  font-size: 20px;
  font-weight: 700;
  color: #333;
}

.edu-school.empty-value {
  color: #ff9800;
  font-style: italic;
}

.edu-time {
  font-size: 17px;
  color: #666;
  font-weight: 500;
}

.edu-time .empty-value {
  color: #ff9800;
  font-style: italic;
}

.edu-details {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
}

.edu-major {
  color: #333;
  font-weight: 600;
}

.edu-major.empty-value {
  color: #ff9800;
  font-style: italic;
}

.edu-degree {
  color: #666;
}

.edu-degree.empty-value {
  color: #ff9800;
  font-style: italic;
}

.edu-rank {
  color: #666;
}

.edu-rank.empty-value {
  color: #ff9800;
  font-style: italic;
}

.resume-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.resume-tag {
  padding: 8px 16px;
  background: white;
  color: #325e21;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 500;
  border: 1px solid #c3d6c0;
}

.empty-resume-tag {
  padding: 8px 16px;
  background: #fff3e0;
  color: #ff9800;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 500;
  border: 1px dashed #ffb74d;
}

/* 功能卡片区 - 右侧垂直排列 */
.functions-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 280px;
  flex-shrink: 0;
}

.function-card {
  background: white;
  padding: 25px 20px;
  border-radius: 12px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.function-card:hover {
  transform: translateX(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.card-icon {
  width: 70px;
  height: 70px;
  margin-bottom: 15px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.card-icon .icon {
  font-size: 35px;
}

.card-icon .icon-img {
  width: 35px;
  height: 35px;
  object-fit: contain;
}

.card-title {
  font-size: 20px;
  font-weight: 700;
  color: #333;
  margin-bottom: 8px;
}

.card-desc {
  font-size: 14px;
  color: #999;
  line-height: 1.4;
}

/* 修改密码弹窗 */
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.dialog-content {
  background: white;
  border-radius: 12px;
  padding: 35px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.dialog-title {
  font-size: 26px;
  font-weight: 700;
  color: #333;
  margin: 0 0 30px 0;
  text-align: center;
}

.form-group {
  margin-bottom: 25px;
}

.form-label {
  display: block;
  font-size: 16px;
  font-weight: 600;
  color: #666;
  margin-bottom: 10px;
}

.form-input {
  width: 100%;
  padding: 14px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #325e21;
  background: #f8fdf8;
}

.dialog-actions {
  display: flex;
  gap: 15px;
  margin-top: 30px;
}

.btn-cancel,
.btn-submit {
  flex: 1;
  padding: 14px 20px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
}

.btn-cancel {
  background: #f5f5f5;
  color: #666;
}

.btn-cancel:hover {
  background: #e8e8e8;
}

.btn-submit {
  background: #325e21;
  color: white;
}

.btn-submit:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(50, 94, 33, 0.3);
}

/* 响应式 */
@media (max-width: 1200px) {
  .main-content-area {
    flex-direction: column;
  }
  
  .functions-grid {
    flex-direction: row;
    width: 100%;
  }
  
  .function-card {
    flex: 1;
  }
}

@media (max-width: 1024px) {
  .resume-content {
    grid-template-columns: 1fr;
  }
  
  .quick-actions {
    position: static;
    justify-content: flex-end;
    margin-top: 20px;
  }
}

@media (max-width: 768px) {
  .student-center-page {
    padding: 15px;
  }
  
  .welcome-card {
    padding: 25px;
  }
  
  .welcome-left {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .user-details-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .info-item {
    justify-content: center;
  }
  
  .tags-content {
    gap: 8px;
  }
  
  .tag {
    padding: 8px 16px;
    font-size: 14px;
  }
  
  .more-link {
    padding: 8px 16px;
    font-size: 14px;
  }
  
  .resume-preview-card {
    padding: 20px;
  }
  
  .functions-grid {
    flex-direction: column;
    width: 100%;
  }
  
  .function-card:hover {
    transform: translateY(-5px);
  }
  
  .quick-actions {
    flex-direction: column;
    width: 100%;
  }
  
  .action-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>

