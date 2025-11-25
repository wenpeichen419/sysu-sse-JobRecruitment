<template>
  <div class="job-detail-page">
    <!-- 面包屑导航 -->
    <div class="breadcrumb">
      <span class="crumb-item" @click="goBack">求职中心</span>
      <span class="separator"> > </span>
      <span class="crumb-item current">职位详情</span>
    </div>

    <div class="content-wrapper">
      <!-- 左侧主内容区 -->
      <div class="main-content">
        <!-- 岗位标题卡片 -->
        <div class="job-header-card">
          <div class="header-top">
            <h1 class="job-title">{{ jobInfo.title }}</h1>
            <!-- 操作按钮 - 移到标题右侧 -->
            <div class="action-buttons">
              <button class="btn-favorite" @click="toggleFavorite" :class="{ favorited: isFavorited }">
                <span class="icon">{{ isFavorited ? '★' : '☆' }}</span>
                <span class="text">{{ isFavorited ? '已收藏' : '收藏' }}</span>
              </button>
              <button class="btn-apply" @click="showResumeDialog = true">
                <span class="icon">📄</span>
                <span class="text">投递</span>
              </button>
            </div>
          </div>
          
          <div class="job-meta">
            <span class="salary">{{ formatSalaryRangeToK(jobInfo.salary) }}</span>
            <span class="divider">|</span>
            <span class="location">{{ jobInfo.location }}</span>
            <span class="divider">|</span>
            <span class="type">{{ jobInfo.type }}</span>
            <span class="divider">|</span>
            <span class="education">{{ jobInfo.education }}</span>
          </div>
          <div class="job-stats">
            <span class="publish-date">{{ jobInfo.publishDate }}发布</span>
            <span class="divider">·</span>
            <span class="view-count">浏览次数: {{ jobInfo.viewCount }}</span>
          </div>
        </div>

        <!-- 职能类别标签 -->
        <div class="tags-section">
          <span class="tag-label">职能类别:</span>
          <span class="tag">{{ jobInfo.category }}</span>
          <span class="tag-label" style="margin-left: 20px;">能力需求:</span>
          <span class="tag" v-for="skill in jobInfo.skills" :key="skill">{{ skill }}</span>
          <span class="tag-label" style="margin-left: 20px;">招聘人数:</span>
          <span class="recruit-info">{{ jobInfo.recruitCount }}人</span>
          <span class="tag-label" style="margin-left: 20px;">要求到岗时间:</span>
          <span class="deadline-info">{{ jobInfo.startDate }}</span>
        </div>

        <!-- 岗位描述 -->
        <div class="section-card">
          <h2 class="section-title">岗位描述:</h2>
          <div class="section-content">
            <p v-for="(desc, index) in jobInfo.description" :key="index">
              {{ desc }}
            </p>
          </div>
        </div>

        <!-- 岗位要求 -->
        <div class="section-card">
          <h2 class="section-title">岗位要求:</h2>
          <div class="section-content">
            <p v-for="(req, index) in jobInfo.requirements" :key="index">
              {{ req }}
            </p>
          </div>
        </div>

        <!-- 加分项 -->
        <div class="section-card">
          <h2 class="section-title">加分项:</h2>
          <div class="section-content">
            <p v-for="(bonus, index) in jobInfo.bonusPoints" :key="index">
              {{ bonus }}
            </p>
          </div>
        </div>

        <!-- 工作地址 -->
        <div class="section-card">
          <h2 class="section-title">工作地址</h2>
          <div class="address-container-inline">
            <div class="address-text-inline">{{ jobInfo.address }}</div>
            <button class="btn-view-map-inline" @click="openInAMap">
              <span class="map-icon">📍</span>
              在高德地图中查看
            </button>
          </div>
        </div>
      </div>

      <!-- 右侧信息栏 -->
      <div class="sidebar">
        <!-- 基本信息卡片 -->
        <div class="info-card">
          <h3 class="info-title">基本信息</h3>
          
          <!-- 公司Logo -->
          <div class="company-logo-section">
            <img 
              :src="companyInfo.logo" 
              :alt="companyInfo.name" 
              class="company-logo"
              @error="handleImageError"
            />
            <div class="company-name">{{ companyInfo.name }}</div>
          </div>
          
          <div class="info-item">
            <span class="info-label">企业性质:</span>
            <span class="info-value">{{ companyInfo.nature }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">企业行业:</span>
            <span class="info-value">{{ companyInfo.industry }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">企业规模:</span>
            <span class="info-value">{{ companyInfo.scale }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">企业联系人:</span>
            <span class="info-value">{{ companyInfo.contact }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">联系电话:</span>
            <span class="info-value">{{ companyInfo.phone }}</span>
          </div>
        </div>

        <!-- 相关链接 -->
        <div class="info-card">
          <h3 class="info-title">相关链接</h3>
          <a :href="companyInfo.website" target="_blank" class="link-item">
            企业官网
          </a>
        </div>

        <!-- 查看企业其他职位 -->
        <div class="info-card view-more-jobs-card" @click="goToCompanyInfo">
          <div class="view-more-content">
            <div class="view-more-icon">🏢</div>
            <div class="view-more-text">点击查看该企业其他在招岗位</div>
            <div class="view-more-arrow">→</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 简历投递弹窗 -->
    <div class="dialog-overlay" v-if="showResumeDialog" @click="showResumeDialog = false">
      <div class="dialog-content" @click.stop>
        <h3 class="dialog-title">选择附件</h3>
        
        <div class="resume-list">
          <div 
            class="resume-item" 
            v-for="resume in resumeList" 
            :key="resume.id"
            :class="{ selected: selectedResumeId === resume.id }"
            @click="selectedResumeId = resume.id"
          >
            <div class="resume-icon">📄</div>
            <div class="resume-info">
              <div class="resume-name">{{ resume.name }}</div>
              <div class="resume-meta">
                {{ resume.size }} 更新于{{ resume.updateTime }}
              </div>
            </div>
            <div class="resume-check" v-if="selectedResumeId === resume.id">✓</div>
          </div>
        </div>

        <div class="dialog-actions">
          <button class="btn-submit" @click="submitResume">投递</button>
        </div>

        <!-- 添加附件按钮 -->
        <div class="add-attachment">
          <span class="add-icon" @click="triggerFileUpload">+</span>
        </div>
      </div>
    </div>

    <!-- 隐藏的文件输入框 -->
    <input 
      ref="fileInput" 
      type="file" 
      accept=".pdf" 
      style="display: none;" 
      @change="handleFileSelect"
    />
  </div>
</template>

<script>
import { formatSalaryRangeToK } from '@/utils/salaryFormatter'
import { getJobDetail, favoriteJob, unfavoriteJob, getResumeFilesForApply, applyJob, uploadResumeForApply } from '@/api/job'
import { loadImageWithAuth, revokeBlobUrls } from '@/utils/imageLoader'

export default {
  name: 'JobDetail',
  data() {
    return {
      jobId: null,
      isFavorited: false,
      showResumeDialog: false,
      selectedResumeId: null,
      loading: false,
      baseURL: 'http://localhost:8080',  // 后端基础URL
      blobUrls: [],  // 存储 blob URLs 用于清理
      
      // 岗位信息
      jobInfo: {
        title: '',
        salary: '',
        location: '',
        type: '',
        education: '',
        publishDate: '',
        viewCount: 0,
        category: '',
        skills: [],
        recruitCount: 0,
        startDate: '',
        description: [],
        requirements: [],
        bonusPoints: [],
        address: '',
        longitude: null,  // 经度（如果后端提供）
        latitude: null    // 纬度（如果后端提供）
      },
      
      // 公司信息
      companyInfo: {
        id: null,
        name: '',
        logo: require('@/assets/BDance_logo.png'),
        nature: '',
        industry: '',
        scale: '',
        contact: '',
        phone: '',
        website: '#'
      },
      
      // 简历列表
      resumeList: []
    }
  },
  mounted() {
    // 获取路由参数中的岗位ID
    this.jobId = this.$route.params.id
    
    // 加载岗位详情
    this.loadJobDetail()
  },
  beforeUnmount() {
    // ✅ 释放 blob URLs，避免内存泄漏
    revokeBlobUrls(this.blobUrls)
    this.blobUrls = []
  },
  methods: {
    // 加载岗位详情
    async loadJobDetail() {
      try {
        this.loading = true
        const response = await getJobDetail(this.jobId)
        
        // 映射接口数据到页面
        this.jobInfo = {
          title: response.title || '',
          salary: response.salary_range || '',
          location: response.address || '',
          type: response.work_nature || '',
          education: response.required_degree || '',
          publishDate: response.posted_at || '',
          viewCount: response.times || 0,
          category: response.type || '',
          skills: response.required_skills || [],
          recruitCount: response.headcount || 0,
          startDate: response.required_start_date || '',
          description: this.parseMultilineText(response.position_description),
          requirements: this.parseMultilineText(response.position_requirements),
          bonusPoints: response.bonus_points || [],
          address: response.address_detail || response.address || '',
          longitude: response.longitude || null,  // 经度（如果后端提供）
          latitude: response.latitude || null     // 纬度（如果后端提供）
        }
        
        // ✅ 加载公司信息（包括logo）
        if (response.company_info) {
          // 加载公司 logo（带 token 认证）
          const defaultLogo = require('@/assets/BDance_logo.png')
          const logoUrl = response.company_info.logo_url 
            ? await loadImageWithAuth(response.company_info.logo_url, this.baseURL, defaultLogo)
            : defaultLogo
          
          // 记录 blob URL 用于清理
          if (logoUrl && logoUrl.startsWith('blob:')) {
            this.blobUrls.push(logoUrl)
          }
          
          this.companyInfo = {
            id: response.company_info.company_id,
            name: response.company_info.company_name || '',
            logo: logoUrl,
            nature: response.company_info.company_nature || '',
            industry: response.company_info.company_industry || '',
            scale: response.company_info.company_scale || '',
            contact: response.company_info.contact_person_name || '',
            phone: response.company_info.contact_person_phone || '',
            website: response.company_info.company_website_url || '#'
          }
        }
        
        // 收藏状态
        this.isFavorited = response.is_favorited || false
        
        console.log('【加载岗位详情成功】', this.jobInfo)
      } catch (error) {
        console.error('【加载岗位详情失败】', error)
      } finally {
        this.loading = false
      }
    },
    
    // 解析多行文本（如果接口返回的是字符串，需要分割成数组）
    parseMultilineText(text) {
      if (Array.isArray(text)) {
        return text
      }
      if (typeof text === 'string') {
        // 按换行符或数字序号分割
        return text.split(/\n|；|;/).filter(line => line.trim())
      }
      return []
    },
    
    // 返回列表页
    goBack() {
      this.$router.push({ name: 'JobCenter' })
    },
    
    // 格式化薪资显示
    formatSalaryRangeToK,
    
    // 切换收藏
    async toggleFavorite() {
      try {
        if (this.isFavorited) {
          await unfavoriteJob(this.jobId)
          this.isFavorited = false
        } else {
          await favoriteJob(this.jobId)
          this.isFavorited = true
        }
      } catch (error) {
        console.error('【收藏操作失败】', error)
      }
    },
    
    // 加载简历列表
    async loadResumeList() {
      try {
        const response = await getResumeFilesForApply()
        
        // 映射接口数据到页面
        this.resumeList = response.map(resume => ({
          id: resume.id,
          name: resume.file_name,
          size: this.formatFileSize(resume.file_size),
          updateTime: this.formatDateTime(resume.uploaded_at)
        }))
        
        console.log('【加载简历列表成功】', this.resumeList)
      } catch (error) {
        console.error('【加载简历列表失败】', error)
      }
    },
    
    // 格式化文件大小
    formatFileSize(bytes) {
      if (bytes < 1024) return bytes + 'B'
      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + 'KB'
      return (bytes / (1024 * 1024)).toFixed(1) + 'MB'
    },
    
    // 格式化日期时间
    formatDateTime(dateStr) {
      if (!dateStr) return ''
      const date = new Date(dateStr)
      return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
    },
    
    // 提交简历
    async submitResume() {
      if (!this.selectedResumeId) {
        alert('请选择要投递的简历')
        return
      }
      
      try {
        await applyJob({
          job_id: parseInt(this.jobId),
          resume_id: String(this.selectedResumeId)
        })
        
        alert('简历投递成功！')
        this.showResumeDialog = false
        this.selectedResumeId = null
      } catch (error) {
        console.error('【投递简历失败】', error)
      }
    },
    
    // 跳转到企业信息页
    goToCompanyInfo() {
      console.log('【点击跳转企业信息】companyInfo.id:', this.companyInfo.id)
      
      if (!this.companyInfo.id) {
        alert('企业信息加载中，请稍后再试')
        console.error('【跳转失败】企业ID不存在')
        return
      }
      
      this.$router.push({ 
        name: 'CompanyInfo', 
        params: { 
          id: this.companyInfo.id 
        } 
      })
    },
    
    // 在高德地图中打开
    openInAMap() {
      if (!this.jobInfo.address) {
        alert('地址信息不完整')
        return
      }
      
      // 如果有经纬度，使用精确定位（优先）
      if (this.jobInfo.longitude && this.jobInfo.latitude) {
        // 使用经纬度打开地图（最精确）
        const name = encodeURIComponent(this.companyInfo.name || '工作地点')
        const url = `https://uri.amap.com/marker?position=${this.jobInfo.longitude},${this.jobInfo.latitude}&name=${name}&coordinate=gaode&callnative=1`
        window.open(url, '_blank')
      } else {
        // 使用地址搜索（备选方案）
        const query = encodeURIComponent(this.jobInfo.address)
        const url = `https://www.amap.com/search?query=${query}`
        window.open(url, '_blank')
      }
    },
    
    // ✅ 图片加载失败时显示默认图片
    handleImageError(event) {
      event.target.src = require('@/assets/BDance_logo.png')
    },
    
    // 触发文件选择
    triggerFileUpload() {
      this.$refs.fileInput.click()
    },
    
    // 处理文件选择和上传
    async handleFileSelect(event) {
      const file = event.target.files[0]
      if (!file) {
        return
      }
      
      // 验证文件类型
      if (file.type !== 'application/pdf') {
        alert('只能上传PDF格式的简历文件')
        return
      }
      
      // 验证文件大小（限制在10MB以内）
      const maxSize = 10 * 1024 * 1024 // 10MB
      if (file.size > maxSize) {
        alert('文件大小不能超过10MB')
        return
      }
      
      try {
        // 创建 FormData 对象
        const formData = new FormData()
        formData.append('file', file)
        
        // 显示上传中提示
        console.log('【开始上传简历】', file.name, `(${this.formatFileSize(file.size)})`)
        
        // 调用上传接口
        await uploadResumeForApply(formData)
        
        alert('简历上传成功！')
        console.log('【上传简历成功】')
        
        // 重新加载简历列表，让新上传的简历显示出来
        await this.loadResumeList()
        
      } catch (error) {
        console.error('【上传简历失败】', error)
        alert('简历上传失败，请重试')
      } finally {
        // 清空文件输入框，允许重复上传同一个文件
        event.target.value = ''
      }
    }
  },
  watch: {
    // 监听弹窗状态，打开时加载简历列表
    showResumeDialog(newVal) {
      if (newVal) {
        this.loadResumeList()
      }
    }
  }
}
</script>

<style scoped>
.job-detail-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 30px;
}

/* 面包屑导航 */
.breadcrumb {
  background: white;
  padding: 20px 30px;
  margin-bottom: 20px;
  border-radius: 10px;
  font-size: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.crumb-item {
  color: #666;
  cursor: pointer;
  transition: color 0.3s;
}

.crumb-item:hover {
  color: #2a5e23;
}

.crumb-item.current {
  color: #333;
  cursor: default;
}

.separator {
  margin: 0 8px;
  color: #999;
}

/* 内容布局 */
.content-wrapper {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.main-content {
  flex: 1;
  min-width: 0;
}

.sidebar {
  width: 320px;
  flex-shrink: 0;
}

/* 岗位标题卡片 */
.job-header-card {
  background: white;
  padding: 40px;
  margin-bottom: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

/* 标题和按钮在同一行 */
.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  gap: 20px;
}

.job-title {
  font-size: 30px;
  font-weight: bold;
  color: #333;
  margin: 0;
  flex: 1;
}

.job-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
  font-size: 18px;
}

.salary {
  color: #ff6b35;
  font-weight: 700;
  font-size: 20px;
}

.divider {
  color: #ddd;
}

.job-stats {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  color: #999;
}

/* 操作按钮 - 紧凑设计 */
.action-buttons {
  display: flex;
  gap: 12px;
  flex-shrink: 0;
}

.btn-favorite,
.btn-apply {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 18px;
  border-radius: 6px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
}

.btn-favorite {
  background: white;
  color: #666;
  border: 1.5px solid #ddd;
}

.btn-favorite:hover {
  border-color: #2a5e23;
  color: #2a5e23;
  background: #f8fdf8;
}

.btn-favorite.favorited {
  background: #fff8e1;
  border-color: #ffd700;
  color: #f39c12;
}

.btn-favorite.favorited:hover {
  background: #fff3cd;
}

.btn-apply {
  background: #2a5e23;
  color: white;
  border: 1.5px solid #2a5e23;
}

.btn-apply:hover {
  background: #1d4518;
  border-color: #1d4518;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(42, 94, 35, 0.3);
}

.btn-favorite .icon,
.btn-apply .icon {
  font-size: 16px;
  line-height: 1;
}

.btn-favorite .text,
.btn-apply .text {
  font-size: 15px;
}

/* 标签区 */
.tags-section {
  background: white;
  padding: 25px 40px;
  margin-bottom: 20px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  font-size: 18px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.tag-label {
  color: #666;
  font-weight: 600;
}

.tag {
  padding: 6px 14px;
  background: #eef5ee;
  color: #325e21;
  border-radius: 16px;
  font-size: 16px;
}

.recruit-info,
.deadline-info {
  color: #333;
  font-weight: 500;
}

/* 内容卡片 */
.section-card {
  background: white;
  padding: 40px;
  margin-bottom: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 30px;
  font-weight: bold;
  color: #325e21;
  margin: 0 0 20px 0;
  border-left: 4px solid #325e21;
  padding-left: 12px;
}

.section-content {
  font-size: 18px;
  line-height: 1.8;
  color: #555;
}

.section-content p {
  margin: 0 0 12px 0;
}

.section-content p:last-child {
  margin-bottom: 0;
}

/* 工作地址相关样式 */
.address-container-inline {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  background: #f8f9fa;
  padding: 20px 25px;
  border-radius: 8px;
}

.address-text-inline {
  flex: 1;
  font-size: 18px;
  font-weight: 500;
  color: #333;
  line-height: 1.6;
}

.btn-view-map-inline {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #325e21 0%, #4a7c35 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(50, 94, 33, 0.3);
  white-space: nowrap;
  flex-shrink: 0;
}

.btn-view-map-inline:hover {
  background: linear-gradient(135deg, #4a7c35 0%, #325e21 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(50, 94, 33, 0.4);
}

.btn-view-map-inline:active {
  transform: translateY(0);
}

.map-icon {
  font-size: 20px;
}

/* 侧边栏信息卡片 */
.info-card {
  background: white;
  padding: 30px;
  margin-bottom: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.info-title {
  font-size: 24px;
  font-weight: bold;
  color: #325e21;
  margin: 0 0 20px 0;
  padding-bottom: 12px;
  border-bottom: 2px solid #f0f0f0;
}

/* 公司Logo区域 */
.company-logo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
  margin-bottom: 20px;
  border-bottom: 2px solid #f0f0f0;
}

.company-logo {
  width: 120px;
  height: 120px;
  object-fit: contain;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 10px;
  background: #fafafa;
  margin-bottom: 15px;
}

.company-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  text-align: center;
}

.info-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  font-size: 18px;
}

.info-item:last-child {
  margin-bottom: 0;
}

.info-label {
  color: #666;
}

.info-value {
  color: #333;
  font-weight: 500;
}

.link-item {
  display: block;
  color: #325e21;
  text-decoration: none;
  font-size: 18px;
  padding: 10px 0;
  transition: color 0.3s;
  font-weight: 500;
}

.link-item:hover {
  color: #1d4518;
  text-decoration: underline;
}

/* 查看企业更多职位卡片 */
.view-more-jobs-card {
  cursor: pointer !important;
  transition: all 0.3s ease;
  background: linear-gradient(135deg, #f8fdf8 0%, #eef7ee 100%);
  border: 2px solid #e8f5e8;
  position: relative;
  z-index: 1;
}

.view-more-jobs-card:hover {
  background: linear-gradient(135deg, #eef7ee 0%, #e0f2e0 100%);
  border-color: #325e21;
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(50, 94, 33, 0.15);
}

.view-more-jobs-card:active {
  transform: translateY(0px);
  box-shadow: 0 2px 8px rgba(50, 94, 33, 0.1);
}

.view-more-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  padding: 10px;
  pointer-events: none;
}

.view-more-icon {
  font-size: 32px;
  flex-shrink: 0;
  pointer-events: none;
}

.view-more-text {
  flex: 1;
  font-size: 16px;
  font-weight: 600;
  color: #325e21;
  text-align: center;
  pointer-events: none;
}

.view-more-arrow {
  font-size: 24px;
  font-weight: bold;
  color: #325e21;
  flex-shrink: 0;
  transition: transform 0.3s ease;
  pointer-events: none;
}

.view-more-jobs-card:hover .view-more-arrow {
  transform: translateX(5px);
}

/* 简历投递弹窗 */
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.dialog-content {
  background: white;
  border-radius: 8px;
  padding: 30px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
}

.dialog-title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0 0 25px 0;
  text-align: center;
}

.resume-list {
  margin-bottom: 25px;
}

.resume-item {
  display: flex;
  align-items: center;
  padding: 20px;
  border: 2px solid #f0f0f0;
  border-radius: 8px;
  margin-bottom: 15px;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
}

.resume-item:hover {
  border-color: #2a5e23;
  background: #f9fdf9;
}

.resume-item.selected {
  border-color: #2a5e23;
  background: #f0f8f0;
}

.resume-icon {
  font-size: 40px;
  margin-right: 15px;
}

.resume-info {
  flex: 1;
}

.resume-name {
  font-size: 15px;
  font-weight: 500;
  color: #333;
  margin-bottom: 5px;
}

.resume-meta {
  font-size: 13px;
  color: #999;
}

.resume-check {
  font-size: 24px;
  color: #2a5e23;
  font-weight: bold;
}

.dialog-actions {
  text-align: center;
}

.btn-submit {
  padding: 12px 60px;
  background: #2a5e23;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-submit:hover {
  background: #1d4518;
}

.add-attachment {
  text-align: center;
  margin-top: 20px;
}

.add-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 2px dashed #ddd;
  border-radius: 50%;
  font-size: 24px;
  color: #999;
  cursor: pointer;
  transition: all 0.3s;
}

.add-icon:hover {
  border-color: #2a5e23;
  color: #2a5e23;
}

/* 响应式 */
@media (max-width: 1024px) {
  .content-wrapper {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .job-detail-page {
    padding: 15px;
  }

  .job-header-card {
    padding: 20px;
  }

  .job-title {
    font-size: 22px;
  }

  .action-buttons {
    flex-direction: column;
  }

  .section-card {
    padding: 20px;
  }

  .info-card {
    padding: 20px;
  }
}
</style>

