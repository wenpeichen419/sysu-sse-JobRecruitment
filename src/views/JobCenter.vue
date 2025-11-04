<template>
  <div class="job-center-page">
    <!-- 面包屑导航 -->
    <div class="breadcrumb">
      <span class="crumb-item">求职中心</span>
    </div>

    <!-- 筛选搜索栏 -->
    <div class="search-bar">
      <div class="search-group">
        <label>职位名称/公司名称</label>
        <div class="search-input-wrapper">
          <input 
            type="text" 
            v-model="searchKeyword" 
            placeholder="输入查询关键字"
            class="search-input"
          />
          <button class="search-icon">🔍</button>
        </div>
      </div>

      <div class="search-group">
        <label>选择地区</label>
        <select v-model="selectedRegion" class="search-select">
          <option value="">请选择</option>
          <option value="北京">北京</option>
          <option value="上海">上海</option>
          <option value="广州">广州</option>
          <option value="深圳">深圳</option>
          <option value="杭州">杭州</option>
        </select>
      </div>

      <div class="search-group">
        <label>职能类别</label>
        <select v-model="selectedCategory" class="search-select">
          <option value="">请选择</option>
          <option value="算法">算法</option>
          <option value="产品">产品</option>
          <option value="设计">设计</option>
          <option value="研发">研发</option>
          <option value="运营">运营</option>
        </select>
      </div>

      <div class="search-group">
        <label>需求能力</label>
        <select v-model="selectedSkill" class="search-select">
          <option value="">请选择</option>
          <option value="AI">AI</option>
          <option value="算法">算法</option>
          <option value="机器学习">机器学习</option>
          <option value="Python">Python</option>
          <option value="Java">Java</option>
        </select>
      </div>

      <div class="search-group">
        <label>工作性质</label>
        <select v-model="selectedType" class="search-select">
          <option value="">不限</option>
          <option value="校招">校招</option>
          <option value="实习">实习</option>
          <option value="社招">社招</option>
        </select>
      </div>

      <button class="search-btn" @click="handleSearch">搜索</button>

      <!-- 我的收藏按钮 -->
      <button class="favorite-btn" @click="toggleFavoriteView">
        我的收藏
      </button>
    </div>

    <!-- 岗位列表 -->
    <div class="job-list">
      <div 
        v-for="job in displayedJobs" 
        :key="job.id"
        class="job-item"
        @click="goToJobDetail(job.id)"
      >
        <!-- 公司Logo -->
        <div class="job-logo">
          <img :src="job.logo" :alt="job.company" />
        </div>

        <!-- 岗位信息 -->
        <div class="job-info">
          <div class="job-header">
            <span class="job-title">职位名称</span>
            <span class="job-name">{{ job.title }}</span>
            
            <span class="company-label">公司名称</span>
            <span class="company-name">{{ job.company }}</span>

            <span class="category-label">职能类别</span>
            <span class="category-value">{{ job.category }}</span>

            <span class="department-label">部门</span>
            <span class="department-value">{{ job.department }}</span>
          </div>

          <div class="job-details">
            <span class="salary">{{ job.salary }}</span>
            <span class="divider">|</span>
            <span class="location">{{ job.location }}</span>
            <span class="divider">|</span>
            <span class="type">{{ job.type }}</span>
          </div>

          <div class="job-footer">
            <span class="recruit-label">招聘人数</span>
            <span class="recruit-count">{{ job.recruitCount }}人</span>
          </div>
        </div>

        <!-- 收藏按钮 -->
        <div class="favorite-icon" @click.stop="toggleFavorite(job.id)">
          <span class="star" :class="{ active: isFavorited(job.id) }">★</span>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="displayedJobs.length === 0" class="empty-state">
        <p>{{ showFavoriteOnly ? '暂无收藏的岗位' : '暂无岗位信息' }}</p>
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
export default {
  name: 'JobCenter',
  data() {
    return {
      // 搜索筛选条件
      searchKeyword: '',
      selectedRegion: '',
      selectedCategory: '',
      selectedSkill: '',
      selectedType: '',
      
      // 收藏相关
      showFavoriteOnly: false,
      favoriteJobIds: [], // 收藏的岗位ID列表
      
      // 分页
      currentPage: 1,
      pageSize: 10,
      
      // 岗位数据 (模拟数据)
      allJobs: [
        {
          id: 1,
          title: '推荐算法工程师',
          company: '百度',
          category: '算法',
          department: 'xx部门',
          salary: '7000-8000',
          location: '深圳',
          type: '校招/实习',
          recruitCount: 5,
          logo: require('@/assets/BDance_logo.png')
        },
        {
          id: 2,
          title: '产品经理',
          company: '华为',
          category: '产品',
          department: 'xx部门',
          salary: '7000-8000',
          location: '深圳',
          type: '校招/实习',
          recruitCount: 3,
          logo: require('@/assets/BDance_logo.png')
        },
        {
          id: 3,
          title: '产品设计',
          company: '支付宝',
          category: '设计',
          department: 'xx部门',
          salary: '7000-8000',
          location: '深圳',
          type: '校招/实习',
          recruitCount: 5,
          logo: require('@/assets/BDance_logo.png')
        },
        {
          id: 4,
          title: '前端开发工程师',
          company: '腾讯',
          category: '研发',
          department: '技术部',
          salary: '8000-10000',
          location: '深圳',
          type: '校招',
          recruitCount: 10,
          logo: require('@/assets/BDance_logo.png')
        },
        {
          id: 5,
          title: '算法工程师',
          company: '字节跳动',
          category: '算法',
          department: 'AI部门',
          salary: '15000-20000',
          location: '北京',
          type: '校招',
          recruitCount: 8,
          logo: require('@/assets/BDance_logo.png')
        },
        {
          id: 6,
          title: 'Java后端开发',
          company: '阿里巴巴',
          category: '研发',
          department: '技术部',
          salary: '10000-15000',
          location: '杭州',
          type: '校招/实习',
          recruitCount: 15,
          logo: require('@/assets/BDance_logo.png')
        },
        {
          id: 7,
          title: 'UI设计师',
          company: '美团',
          category: '设计',
          department: '设计部',
          salary: '8000-12000',
          location: '北京',
          type: '校招',
          recruitCount: 4,
          logo: require('@/assets/BDance_logo.png')
        },
        {
          id: 8,
          title: '数据分析师',
          company: '京东',
          category: '算法',
          department: '数据部',
          salary: '9000-13000',
          location: '北京',
          type: '校招/实习',
          recruitCount: 6,
          logo: require('@/assets/BDance_logo.png')
        },
        {
          id: 9,
          title: '运营专员',
          company: '小红书',
          category: '运营',
          department: '运营部',
          salary: '7000-9000',
          location: '上海',
          type: '实习',
          recruitCount: 5,
          logo: require('@/assets/BDance_logo.png')
        },
        {
          id: 10,
          title: 'Python工程师',
          company: '网易',
          category: '研发',
          department: '技术部',
          salary: '10000-14000',
          location: '杭州',
          type: '校招',
          recruitCount: 7,
          logo: require('@/assets/BDance_logo.png')
        }
      ]
    }
  },
  computed: {
    // 过滤后的岗位列表
    filteredJobs() {
      let jobs = this.allJobs

      // 如果显示收藏,只显示收藏的岗位
      if (this.showFavoriteOnly) {
        jobs = jobs.filter(job => this.isFavorited(job.id))
      }

      // 关键字搜索
      if (this.searchKeyword.trim()) {
        const keyword = this.searchKeyword.toLowerCase()
        jobs = jobs.filter(job => 
          job.title.toLowerCase().includes(keyword) || 
          job.company.toLowerCase().includes(keyword)
        )
      }

      // 地区筛选
      if (this.selectedRegion) {
        jobs = jobs.filter(job => job.location.includes(this.selectedRegion))
      }

      // 职能类别筛选
      if (this.selectedCategory) {
        jobs = jobs.filter(job => job.category === this.selectedCategory)
      }

      // 技能筛选
      if (this.selectedSkill) {
        jobs = jobs.filter(job => 
          job.title.includes(this.selectedSkill) || 
          job.category.includes(this.selectedSkill)
        )
      }

      // 工作性质筛选
      if (this.selectedType) {
        jobs = jobs.filter(job => job.type.includes(this.selectedType))
      }

      return jobs
    },
    
    // 总岗位数
    totalJobs() {
      return this.filteredJobs.length
    },
    
    // 总页数
    totalPages() {
      return Math.ceil(this.totalJobs / this.pageSize)
    },
    
    // 当前页显示的岗位
    displayedJobs() {
      const start = (this.currentPage - 1) * this.pageSize
      const end = start + this.pageSize
      return this.filteredJobs.slice(start, end)
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
    // 从本地存储读取收藏列表
    const saved = localStorage.getItem('favoriteJobs')
    if (saved) {
      this.favoriteJobIds = JSON.parse(saved)
    }
  },
  methods: {
    // 搜索
    handleSearch() {
      this.currentPage = 1 // 搜索后回到第一页
    },
    
    // 切换收藏视图
    toggleFavoriteView() {
      this.showFavoriteOnly = !this.showFavoriteOnly
      this.currentPage = 1
    },
    
    // 判断是否收藏
    isFavorited(jobId) {
      return this.favoriteJobIds.includes(jobId)
    },
    
    // 切换收藏状态
    toggleFavorite(jobId) {
      const index = this.favoriteJobIds.indexOf(jobId)
      if (index > -1) {
        this.favoriteJobIds.splice(index, 1)
      } else {
        this.favoriteJobIds.push(jobId)
      }
      // 保存到本地存储
      localStorage.setItem('favoriteJobs', JSON.stringify(this.favoriteJobIds))
    },
    
    // 跳转到岗位详情
    goToJobDetail(jobId) {
      this.$router.push({ name: 'JobDetail', params: { id: jobId } })
    },
    
    // 切换页码
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page
        // 滚动到顶部
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
  }
}
</script>

<style scoped>
.job-center-page {
  min-height: 100vh;
  background: #f0f0f0;
  padding: 20px 40px;
}

/* 面包屑导航 */
.breadcrumb {
  background: white;
  padding: 18px 30px;
  margin-bottom: 20px;
  border-radius: 6px;
  font-size: 18px;
  color: #333;
}

.crumb-item {
  color: #666;
  font-weight: 500;
}

/* 搜索筛选栏 */
.search-bar {
  background: white;
  padding: 32px 35px;
  margin-bottom: 20px;
  border-radius: 6px;
  display: flex;
  flex-wrap: wrap;
  gap: 95px;
  align-items: flex-end;
}

.search-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.search-group label {
  font-size: 18px;
  color: #333;
  font-weight: 600;
}

.search-input-wrapper {
  position: relative;
  width: 240px;
}

.search-input {
  width: 100%;
  padding: 10px 40px 10px 14px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 17px;
  outline: none;
}

.search-input:focus {
  border-color: #2a5e23;
}

.search-icon {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
}

.search-select {
  padding: 10px 14px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 17px;
  min-width: 180px;
  outline: none;
  cursor: pointer;
  background: white;
}

.search-select:focus {
  border-color: #2a5e23;
}

.search-btn {
  padding: 10px 40px;
  background: #2a5e23;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 18px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.3s;
}

.search-btn:hover {
  background: #1d4518;
}

.favorite-btn {
  padding: 10px 28px;
  background: white;
  color: #2a5e23;
  border: 2px solid #2a5e23;
  border-radius: 6px;
  font-size: 18px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
  margin-left: auto;
}

.favorite-btn:hover {
  background: #2a5e23;
  color: white;
}

/* 岗位列表 */
.job-list {
  background: white;
  padding: 25px;
  border-radius: 6px;
  margin-bottom: 20px;
}

.job-item {
  display: flex;
  align-items: center;
  padding: 28px 24px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background 0.2s;
  position: relative;
}

.job-item:hover {
  background: #f8faf8;
}

.job-item:last-child {
  border-bottom: none;
}

.job-logo {
  width: 90px;
  height: 90px;
  margin-right: 30px;
  flex-shrink: 0;
}

.job-logo img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 8px;
}

.job-info {
  flex: 1;
}

.job-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.job-title,
.company-label,
.category-label,
.department-label {
  font-size: 22px;
  color: #666;
  font-weight: 500;
}

.job-name {
  font-size: 20px;
  font-weight: 700;
  color: #333;
}

.company-name {
  font-size: 18px;
  color: #333;
  font-weight: 500;
}

.category-value,
.department-value {
  font-size: 16px;
  color: #2a5e23;
  font-weight: 600;
}

.job-details {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 14px;
  font-size: 16px;
  color: #666;
}

.salary {
  color: #ff6b35;
  font-weight: 700;
  font-size: 17px;
}

.divider {
  color: #ddd;
}

.job-footer {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
}

.recruit-label {
  color: #666;
  font-weight: 500;
}

.recruit-count {
  color: #2a5e23;
  font-weight: 700;
}

/* 收藏图标 */
.favorite-icon {
  margin-left: 25px;
  padding: 12px;
  cursor: pointer;
}

.star {
  font-size: 38px;
  color: #ddd;
  transition: color 0.3s;
}

.star.active {
  color: #ffd700;
}

.star:hover {
  color: #ffed4e;
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
  padding: 24px 30px;
  border-radius: 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-info {
  font-size: 16px;
  color: #666;
  font-weight: 500;
}

.page-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.page-btn {
  min-width: 42px;
  height: 42px;
  padding: 0 14px;
  border: 1.5px solid #ddd;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 15px;
  transition: all 0.3s;
  font-weight: 500;
}

.page-btn:hover {
  border-color: #2a5e23;
  color: #2a5e23;
}

.page-btn.active {
  background: #2a5e23;
  color: white;
  border-color: #2a5e23;
}

.page-next {
  min-width: 42px;
  height: 42px;
  border: 1.5px solid #ddd;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 22px;
  transition: all 0.3s;
  font-weight: 600;
}

.page-next:hover:not(:disabled) {
  border-color: #2a5e23;
  color: #2a5e23;
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
  .job-center-page {
    padding: 15px;
  }

  .search-bar {
    padding: 15px;
  }

  .job-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .job-logo {
    margin-right: 0;
    margin-bottom: 15px;
  }

  .favorite-icon {
    position: absolute;
    top: 20px;
    right: 20px;
    margin: 0;
  }
}
</style>

