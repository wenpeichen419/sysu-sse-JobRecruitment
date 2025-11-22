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
          <div class="section-content">
            <p>{{ jobInfo.address }}</p>
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
            <img :src="companyInfo.logo" :alt="companyInfo.name" class="company-logo" />
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

        <!-- 其他职位 -->
        <div class="info-card">
          <h3 class="info-title">其他职位</h3>
          <div 
            class="other-job-item" 
            v-for="job in otherJobs" 
            :key="job.id"
            @click="goToCompanyInfo"
          >
            <div class="other-job-title">{{ job.title }}</div>
            <div class="other-job-arrow">›</div>
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
          <span class="add-icon">+</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { formatSalaryRangeToK } from '@/utils/salaryFormatter'

export default {
  name: 'JobDetail',
  data() {
    return {
      jobId: null,
      isFavorited: false,
      showResumeDialog: false,
      selectedResumeId: null,
      
      // 岗位信息 (模拟数据)
      jobInfo: {
        title: '算法设计师',
        salary: '15000及以上',
        location: '北京市朝阳区',
        type: '校招',
        education: '本科',
        publishDate: '2025-10-09',
        viewCount: 9,
        category: '算法',
        skills: ['AI', '算法', '机器学习', 'Python'],
        recruitCount: 6,
        startDate: '2025-11-11',
        description: [
          '作为推荐算法方向的研究工程师，你可以:',
          '1、负责推荐系统中具体推荐业务的召回、排序等模型算法的设计与优化;',
          '2、深入理解业务场景，通过对数据的敏锐洞察聚焦产品潜在在价值和需求，针对现有业务场景特点优化推荐策略和模型，不断提升用户体验和业务指标;',
          '3、基于超大规模深度神经网络模型和机器学习系统，探索业界前沿推荐技术的研发工作，通过技术创新推动产品成长，包含但不限于推荐多模态大模型、图神经网络、多任务学习、超长序列建模、强化学习等技术方向。'
        ],
        requirements: [
          '1、本科及以上学历，计算机、数学、人工智能等相关专业;',
          '2、扎实的编程能力和算法功底，熟练掌握Python/C++/Java等至少一种编程语言;',
          '3、扎实的机器学习/深度学习理论基础，熟练掌握Tensorflow/Pytorch等至少一种主流深度学习框架，了解Hadoop/Spark/Flink等大数据平台工具的使用;',
          '4、优秀的逻辑思维能力，优秀的分析问题与解决问题的能力，对解决具有挑战性问题充满激情;',
          '5、善于沟通，工作积极主动，责任心强，自驱力强，能持续学习，具备良好的团队协作能力。'
        ],
        bonusPoints: [
          '1、xxx',
          '2、xxx'
        ],
        address: ''
      },
      
      // 公司信息
      companyInfo: {
        name: '浙商银行股份有限公司',
        logo: require('@/assets/BDance_logo.png'),
        nature: '民营企业',
        industry: '金融业',
        scale: '10000人以上',
        contact: '郑老师',
        phone: '0571-88265996',
        website: '#'
      },
      
      // 其他职位
      otherJobs: [
        { id: 101, title: '产品经理' },
        { id: 102, title: 'UI设计师' },
        { id: 103, title: 'Java工程师' }
      ],
      
      // 简历列表 (模拟数据)
      resumeList: [
        {
          id: 1,
          name: '周意简历-前端.pdf',
          size: '66.5KB',
          updateTime: '2025.10.22 22:54'
        },
        {
          id: 2,
          name: '周意简历-后端.pdf',
          size: '99.5KB',
          updateTime: '2025.10.22 23:00'
        }
      ]
    }
  },
  mounted() {
    // 获取路由参数中的岗位ID
    this.jobId = this.$route.params.id
    
    // 检查是否已收藏
    this.checkFavoriteStatus()
    
    // 模拟增加浏览次数
    this.jobInfo.viewCount++
  },
  methods: {
    // 返回列表页
    goBack() {
      this.$router.push({ name: 'JobCenter' })
    },
    
    // 格式化薪资显示
    formatSalaryRangeToK,
    
    // 检查收藏状态
    checkFavoriteStatus() {
      const saved = localStorage.getItem('favoriteJobs')
      if (saved) {
        const favoriteIds = JSON.parse(saved)
        this.isFavorited = favoriteIds.includes(parseInt(this.jobId))
      }
    },
    
    // 切换收藏
    toggleFavorite() {
      const saved = localStorage.getItem('favoriteJobs')
      let favoriteIds = saved ? JSON.parse(saved) : []
      const jobIdNum = parseInt(this.jobId)
      
      const index = favoriteIds.indexOf(jobIdNum)
      if (index > -1) {
        favoriteIds.splice(index, 1)
        this.isFavorited = false
      } else {
        favoriteIds.push(jobIdNum)
        this.isFavorited = true
      }
      
      localStorage.setItem('favoriteJobs', JSON.stringify(favoriteIds))
    },
    
    // 提交简历
    submitResume() {
      if (!this.selectedResumeId) {
        alert('请选择要投递的简历')
        return
      }
      
      // 这里应该调用API提交简历
      alert('简历投递成功！')
      this.showResumeDialog = false
      this.selectedResumeId = null
    },
    
    // 跳转到企业信息页
    goToCompanyInfo() {
      this.$router.push({ 
        name: 'CompanyInfo', 
        params: { 
          id: 'company-' + this.jobId 
        } 
      })
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

/* 其他职位 */
.other-job-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #f5f5f5;
  cursor: pointer;
  transition: color 0.3s;
  font-size: 18px;
}

.other-job-item:last-child {
  border-bottom: none;
}

.other-job-item:hover {
  color: #2a5e23;
}

.other-job-title {
  font-size: 14px;
}

.other-job-arrow {
  font-size: 18px;
  color: #999;
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

