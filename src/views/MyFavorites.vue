<template>
  <div class="my-favorites-page">
    <!-- 面包屑导航 -->
    <div class="breadcrumb">
      <span class="crumb-item" @click="goBack">学生中心</span>
      <span class="separator"> > </span>
      <span class="crumb-item current">我的收藏</span>
    </div>

    <!-- 岗位列表 -->
    <div class="job-list">
      <div 
        v-for="job in favoriteJobs" 
        :key="job.id"
        class="job-item"
        @click="goToJobDetail(job.id)"
      >
        <!-- 公司Logo -->
        <div class="job-logo">
          <img 
            :src="job.logo" 
            :alt="job.company"
            @error="handleImageError"
          />
        </div>

        <!-- 左侧岗位信息 -->
        <div class="job-left-info">
          <div class="job-title">{{ job.title }}</div>
          <div class="job-details">
            <span class="salary">{{ formatSalaryRangeToK(job.salary) }}</span>
            <span class="divider">|</span>
            <span class="location">{{ job.location }}</span>
            <span class="divider">|</span>
            <span class="type-tag">{{ job.type }}</span>
            <span class="divider">|</span>
            <span class="education-tag">{{ job.education }}</span>
          </div>
        </div>

        <!-- 右侧公司信息 -->
        <div class="job-right-info">
          <div class="company-name">{{ job.company }}</div>
          <div class="company-details">
            <span class="department">{{ job.department }}</span>
            <span class="divider">|</span>
            <span class="recruit-info">招聘人数 {{ job.recruitCount }}人</span>
          </div>
        </div>

        <!-- 收藏按钮 -->
        <div class="favorite-icon" @click.stop="toggleFavorite(job.id)">
          <span class="star active">★</span>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="favoriteJobs.length === 0 && !loading" class="empty-state">
        <p>暂无收藏的岗位</p>
      </div>
      
      <!-- 加载状态 -->
      <div v-if="loading" class="empty-state">
        <p>加载中...</p>
      </div>
    </div>

    <!-- 分页 -->
    <div class="pagination" v-if="totalPages > 1">
      <span class="page-info">共 {{ totalJobs }} 条数据</span>
      
      <div class="page-controls">
        <button 
          class="page-btn" 
          :class="{ active: currentPage === 1 }"
          @click="changePage(1)"
        >1</button>
        
        <button 
          v-for="page in middlePages" 
          :key="page"
          class="page-btn"
          :class="{ active: currentPage === page }"
          @click="changePage(page)"
        >{{ page }}</button>

        <span v-if="showEllipsis" class="ellipsis">...</span>
        
        <button 
          class="page-btn"
          :class="{ active: currentPage === totalPages }"
          @click="changePage(totalPages)"
        >{{ totalPages }}</button>

        <button 
          class="page-next" 
          :disabled="currentPage >= totalPages"
          @click="changePage(currentPage + 1)"
        >›</button>
      </div>
    </div>
  </div>
</template>

<script>
import { formatSalaryRangeToK } from '@/utils/salaryFormatter'
import { getFavoriteJobs, unfavoriteJob } from '@/api/job'
import { loadImageWithAuth, revokeBlobUrls } from '@/utils/imageLoader'

export default {
  name: 'MyFavorites',
  data() {
    return {
      // 收藏的岗位列表
      favoriteJobs: [],
      
      // 分页
      currentPage: 1,
      pageSize: 10,
      totalJobs: 0,
      
      // 加载状态
      loading: false,
      
      // 后端基础URL
      baseURL: 'http://localhost:8080',
      
      // 存储已创建的 blob URLs，用于清理
      blobUrls: []
    }
  },
  computed: {
    // 总页数
    totalPages() {
      return Math.ceil(this.totalJobs / this.pageSize)
    },

    // 中间的页码
    middlePages() {
      const pages = []
      const start = Math.max(2, this.currentPage - 1)
      const end = Math.min(this.totalPages - 1, this.currentPage + 1)
      
      for (let i = start; i <= end; i++) {
        if (i !== 1 && i !== this.totalPages) {
          pages.push(i)
        }
      }
      return pages
    },

    // 是否显示省略号
    showEllipsis() {
      return this.totalPages > 5 && this.currentPage < this.totalPages - 2
    }
  },
  mounted() {
    // 加载收藏列表
    this.loadFavorites()
  },
  beforeUnmount() {
    // ✅ 释放所有 blob URLs，避免内存泄漏
    revokeBlobUrls(this.blobUrls)
    this.blobUrls = []
  },
  methods: {
    
    // 加载收藏列表
    async loadFavorites() {
      try {
        this.loading = true
        
        // 清理之前的 blob URLs
        revokeBlobUrls(this.blobUrls)
        this.blobUrls = []
        
        const response = await getFavoriteJobs({
          page: this.currentPage,
          size: this.pageSize
        })
        
        // 根据接口文档，数据结构为 response.data.jobs
        const jobs = response.jobs || []
        
        console.log('【收藏列表原始数据】共', jobs.length, '条')
        jobs.forEach((job, index) => {
          console.log(`  [${index}] logo_url:`, job.logo_url)
        })
        
        // 映射接口字段到页面需要的字段
        const mappedJobs = jobs.map(job => ({
          id: job.job_id,
          title: job.title,
          company: job.company_name,
          salary: job.salary_range,
          location: job.location,
          type: job.work_nature,
          education: job.required_degree || '',
          department: job.department,
          recruitCount: job.headcount,
          logoPath: job.logo_url,  // 暂存路径
          logo: '',  // 稍后加载
          isFavorited: job.is_favorited
        }))
        
        console.log('【开始并行加载', mappedJobs.length, '个Logo】')
        
        // ✅ 并行加载所有 logo（带 token）
        const logoPromises = mappedJobs.map((job, index) => {
          console.log(`  → 加载第 ${index + 1} 个:`, job.logoPath)
          return loadImageWithAuth(job.logoPath, this.baseURL)
        })
        const logos = await Promise.all(logoPromises)
        
        console.log('【所有Logo加载完成】')
        
        // 设置 logo
        mappedJobs.forEach((job, index) => {
          const logoUrl = logos[index]
          job.logo = logoUrl
          console.log(`  [${index}] ${job.title}: logo =`, logoUrl ? logoUrl.substring(0, 50) + '...' : 'empty')
          
          // ✅ 记录 blob URL 用于清理
          if (logoUrl && logoUrl.startsWith('blob:')) {
            this.blobUrls.push(logoUrl)
          }
        })
        
        this.favoriteJobs = mappedJobs
        this.totalJobs = response.total || 0
        
        console.log('【✅ 加载收藏列表成功】共', this.favoriteJobs.length, '条')
      } catch (error) {
        console.error('【加载收藏列表失败】', error)
      } finally {
        this.loading = false
      }
    },
    
    // 返回
    goBack() {
      this.$router.push({ name: 'StudentCenter' })
    },
    
    // 格式化薪资显示
    formatSalaryRangeToK,
    
    // 取消收藏
    async toggleFavorite(jobId) {
      try {
        await unfavoriteJob(jobId)
        
        // 成功后重新加载列表
        await this.loadFavorites()
        
        // 如果当前页没有数据了，回到上一页
        if (this.favoriteJobs.length === 0 && this.currentPage > 1) {
          this.currentPage--
          await this.loadFavorites()
        }
      } catch (error) {
        console.error('【取消收藏失败】', error)
      }
    },
    
    // 跳转到岗位详情
    goToJobDetail(jobId) {
      this.$router.push({ name: 'JobDetail', params: { id: jobId } })
    },
    
    // 图片加载失败处理
    handleImageError(event) {
      console.error('【图片加载失败】', event.target.src)
      // 不显示默认图片，隐藏图片元素
      event.target.style.display = 'none'
    },
    
    // 切换页码
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page
        this.loadFavorites()
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
  }
}
</script>

<style scoped>
/* 复用JobCenter的样式 */
.my-favorites-page {
  min-height: 100vh;
  background: #f0f0f0;
  padding: 20px 40px;
}

/* 面包屑导航 */
.breadcrumb {
  background: white;
  padding: 20px 30px;
  margin-bottom: 20px;
  border-radius: 10px;
  font-size: 18px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.crumb-item {
  color: #666;
  cursor: pointer;
  transition: color 0.3s;
}

.crumb-item:hover {
  color: #325e21;
}

.crumb-item.current {
  color: #333;
  cursor: default;
}

.separator {
  margin: 0 8px;
  color: #999;
}

/* 岗位列表 */
.job-list {
  background: white;
  padding: 30px;
  border-radius: 12px;
  margin-bottom: 20px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.08);
}

.job-item {
  display: flex;
  align-items: center;
  padding: 25px 30px;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  margin-bottom: 15px;
  background: white;
}

.job-item:hover {
  border-color: #325e21;
  box-shadow: 0 4px 16px rgba(50, 94, 33, 0.12);
  transform: translateY(-2px);
}

.job-item:last-child {
  margin-bottom: 0;
}

/* 公司Logo */
.job-logo {
  width: 110px;
  height: 110px;
  margin-right: 40px;
  flex-shrink: 0;
  border: 2px solid #e8e8e8;
  border-radius: 12px;
  padding: 10px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.job-logo img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* 左侧岗位信息 */
.job-left-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
}

.job-title {
  font-size: 25px;
  font-weight: 600;
  color: #325e21;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.job-details {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 18px;
  color: #666;
}

.salary {
  color: #ff6b35;
  font-weight: 600;
  font-size: 20px;
}

.location {
  color: #666;
}

.divider {
  color: #ddd;
}

.type-tag {
  color: #666;
}

.education-tag {
  color: #666;
}

/* 右侧公司信息 */
.job-right-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-end;
  text-align: right;
  min-width: 0;
  padding-right: 150px;
}

.company-name {
  font-size: 22px;
  font-weight: 600;
  color: #325e21;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
}

.company-details {
  display: flex;
  align-items: center;
  gap: 15px;
  font-size: 18px;
  color: #666;
}

.department {
  color: #666;
}

.recruit-info {
  color: #666;
}

/* 收藏图标 */
.favorite-icon {
  position: absolute;
  top: 15px;
  right: 15px;
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
  border: 2px solid #ff9800;
  box-shadow: 0 3px 10px rgba(255, 152, 0, 0.3);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;
}

.favorite-icon:hover {
  transform: translateY(-2px) scale(1.08);
  box-shadow: 0 4px 12px rgba(255, 152, 0, 0.4);
}

.star {
  font-size: 24px;
  color: #adb5bd;
  transition: all 0.3s ease;
  filter: none;
  line-height: 1;
}

.star.active {
  color: #ff9800;
  background: linear-gradient(135deg, #ffd54f 0%, #ff9800 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 0 8px rgba(255, 152, 0, 0.4));
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 80px 20px;
  color: #999;
  font-size: 18px;
}

/* 分页 */
.pagination {
  background: white;
  padding: 25px 35px;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.page-info {
  font-size: 18px;
  color: #666;
  font-weight: 500;
}

.page-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.page-btn {
  min-width: 45px;
  height: 45px;
  padding: 0 16px;
  border: 1.5px solid #d8d8d8;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 18px;
  transition: all 0.3s;
  font-weight: 500;
}

.page-btn:hover {
  border-color: #325e21;
  color: #325e21;
}

.page-btn.active {
  background: #325e21;
  color: white;
  border-color: #325e21;
}

.page-next {
  min-width: 45px;
  height: 45px;
  border: 1.5px solid #d8d8d8;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 24px;
  transition: all 0.3s;
  font-weight: 600;
}

.page-next:hover:not(:disabled) {
  border-color: #325e21;
  color: #325e21;
}

.page-next:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.ellipsis {
  padding: 0 8px;
  color: #999;
}

/* 响应式 */
@media (max-width: 768px) {
  .my-favorites-page {
    padding: 15px;
  }

  .job-item {
    flex-wrap: wrap;
    padding: 20px 15px 15px;
  }

  .job-logo {
    width: 90px;
    height: 90px;
    margin-right: 20px;
  }

  .job-left-info {
    flex: 1;
    min-width: calc(100% - 110px);
  }

  .job-right-info {
    width: 100%;
    margin-top: 15px;
    padding-top: 15px;
    padding-right: 50px;
    border-top: 1px solid #f0f0f0;
    align-items: flex-start;
    text-align: left;
  }

  .favorite-icon {
    top: 10px;
    right: 10px;
  }

  .star {
    font-size: 24px;
  }
}
</style>

