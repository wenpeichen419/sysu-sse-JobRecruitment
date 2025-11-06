<template>
  <div class="job-center-page">
    <!-- 面包屑导航 -->
    <div class="breadcrumb">
      <span class="crumb-item">求职中心</span>
    </div>

    <!-- 筛选搜索栏 -->
    <div class="search-bar">
      <div class="search-group">
        <label>职位名称</label>
        <div class="search-input-wrapper">
          <input 
            type="text" 
            v-model="searchJobTitle" 
            placeholder="输入职位名称"
            class="search-input"
          />
          <button class="search-icon">🔍</button>
        </div>
      </div>

      <div class="search-group">
        <label>公司名称</label>
        <div class="search-input-wrapper">
          <input 
            type="text" 
            v-model="searchCompanyName" 
            placeholder="输入公司名称"
            class="search-input"
          />
          <button class="search-icon">🔍</button>
        </div>
      </div>

      <div class="search-group">
        <label>选择省份</label>
        <select v-model="selectedProvince" @change="onProvinceChange" class="search-select">
          <option value="">不限</option>
          <option v-for="province in provinceList" :key="province" :value="province">
            {{ province }}
          </option>
        </select>
      </div>

      <div class="search-group">
        <label>选择城市</label>
        <select v-model="selectedCity" class="search-select" :disabled="!selectedProvince">
          <option value="">不限</option>
          <option v-for="city in availableCities" :key="city" :value="city">
            {{ city }}
          </option>
        </select>
      </div>

      <div class="search-group">
        <label>职能类别</label>
        <select v-model="selectedCategory" class="search-select">
          <option value="">不限</option>
          <option value="算法">算法</option>
          <option value="产品">产品</option>
          <option value="测试">测试</option>
          <option value="开发">开发</option>
        </select>
      </div>

      <div class="search-group">
        <label>需求能力</label>
        <select v-model="selectedSkill" class="search-select">
          <option value="">不限</option>
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

        <!-- 左侧岗位信息 -->
        <div class="job-left-info">
          <div class="job-title">{{ job.title }}</div>
          <div class="job-details">
            <span class="salary">{{ job.salary }}</span>
            <span class="divider">|</span>
            <span class="location">{{ job.location }}</span>
            <span class="divider">|</span>
            <span class="type-tag">{{ job.type }}</span>
          </div>
        </div>

        <!-- 分隔线 -->
        <div class="vertical-divider"></div>

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
import { jobs } from '@/data/jobs.mock'

export default {
  name: 'JobCenter',
  data() {
    return {
      // 搜索筛选条件
      searchJobTitle: '',
      searchCompanyName: '',
      selectedProvince: '',
      selectedCity: '',
      selectedCategory: '',
      selectedSkill: '',
      selectedType: '',

      // 省市数据
      provinceCity: {
        '广东省': ['广州', '深圳', '珠海', '佛山', '东莞', '中山', '惠州'],
        '北京市': ['东城区', '西城区', '朝阳区', '海淀区', '丰台区'],
        '上海市': ['黄浦区', '徐汇区', '长宁区', '静安区', '浦东新区'],
        '浙江省': ['杭州', '宁波', '温州', '绍兴', '嘉兴'],
        '江苏省': ['南京', '苏州', '无锡', '常州', '南通'],
        '四川省': ['成都', '绵阳', '德阳', '乐山', '宜宾']
      },

      // 收藏相关
      showFavoriteOnly: false,
      favoriteJobIds: [],

      // 分页
      currentPage: 1,
      pageSize: 5,

      // 岗位数据（从 mock 引入）
      allJobs: jobs
    }
  },
  computed: {
    provinceList() {
      return Object.keys(this.provinceCity)
    },
    availableCities() {
      if (!this.selectedProvince) return []
      return this.provinceCity[this.selectedProvince] || []
    },

    filteredJobs() {
      let list = Array.isArray(this.allJobs) ? [...this.allJobs] : []

      if (this.showFavoriteOnly) {
        list = list.filter(job => this.isFavorited(job.id))
      }
      if (this.searchJobTitle.trim()) {
        const kw = this.searchJobTitle.toLowerCase()
        list = list.filter(job => job.title.toLowerCase().includes(kw))
      }
      if (this.searchCompanyName.trim()) {
        const kw = this.searchCompanyName.toLowerCase()
        list = list.filter(job => job.company.toLowerCase().includes(kw))
      }
      if (this.selectedProvince) list = list.filter(job => job.province === this.selectedProvince)
      if (this.selectedCity)     list = list.filter(job => job.city === this.selectedCity)
      if (this.selectedCategory) list = list.filter(job => job.category === this.selectedCategory)
      if (this.selectedSkill) {
        list = list.filter(job =>
          job.title.includes(this.selectedSkill) || job.category.includes(this.selectedSkill)
        )
      }
      if (this.selectedType)     list = list.filter(job => job.type.includes(this.selectedType))

      return list
    },

    // ↓ 这里改为内联，移除临时变量，解决 no-unused-vars
    displayedJobs() {
      const start = (this.currentPage - 1) * this.pageSize
      return (Array.isArray(this.filteredJobs) ? this.filteredJobs : []).slice(start, start + this.pageSize)
    },

    totalJobs() {
      return this.filteredJobs.length
    },
    totalPages() {
      return Math.ceil(this.totalJobs / this.pageSize)
    },
    middlePages() {
      const pages = []
      const start = Math.max(2, this.currentPage - 1)
      const end = Math.min(this.totalPages - 1, this.currentPage + 1)
      for (let i = start; i <= end; i++) {
        if (i !== 1 && i !== this.totalPages) pages.push(i)
      }
      return pages
    },
    showEllipsis() {
      return this.totalPages > 5 && this.currentPage < this.totalPages - 2
    }
  },
  mounted() {
    const saved = localStorage.getItem('favoriteJobs')
    if (saved) this.favoriteJobIds = JSON.parse(saved)
  },
  methods: {
    onProvinceChange() {
      this.selectedCity = ''
      this.currentPage = 1
    },
    handleSearch() {
      this.currentPage = 1
    },
    toggleFavoriteView() {
      this.showFavoriteOnly = !this.showFavoriteOnly
      this.currentPage = 1
    },
    isFavorited(jobId) {
      return this.favoriteJobIds.includes(jobId)
    },
    toggleFavorite(jobId) {
      const idx = this.favoriteJobIds.indexOf(jobId)
      if (idx > -1) this.favoriteJobIds.splice(idx, 1)
      else this.favoriteJobIds.push(jobId)
      localStorage.setItem('favoriteJobs', JSON.stringify(this.favoriteJobIds))
    },
    goToJobDetail(jobId) {
      this.$router.push({ name: 'JobDetail', params: { id: jobId } })
    },
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page
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
  padding: 20px 30px;
  margin-bottom: 20px;
  border-radius: 10px;
  font-size: 20px;
  color: #333;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.crumb-item {
  color: #666;
  font-weight: 500;
}

/* 搜索筛选栏 */
.search-bar {
  background: white;
  padding: 35px 40px;
  margin-bottom: 20px;
  border-radius: 10px;
  display: flex;
  flex-wrap: nowrap; /* 不换行，保持在一行 */
  gap: 20px;
  align-items: flex-end;
  overflow-x: auto; /* 如果内容太多，可以横向滚动 */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.search-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1; /* 让每个搜索组平均分配空间 */
  min-width: 140px; /* 设置最小宽度，防止过窄 */
}

.search-group label {
  font-size: 18px;
  color: #333;
  font-weight: 600;
}

.search-input-wrapper {
  position: relative;
  width: 100%; /* 改为100%以适应flex布局 */
}

.search-input {
  width: 100%;
  padding: 12px 40px 12px 16px;
  border: 1px solid #d8d8d8;
  border-radius: 6px;
  font-size: 18px;
  outline: none;
}

.search-input:focus {
  border-color: #325e21;
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
  padding: 12px 16px;
  border: 1px solid #d8d8d8;
  border-radius: 6px;
  font-size: 18px;
  width: 100%; /* 改为100%以适应flex布局 */
  outline: none;
  cursor: pointer;
  background: white;
  transition: all 0.3s;
}

.search-select:focus {
  border-color: #2a5e23;
}

.search-select:disabled {
  background: #f5f5f5;
  color: #999;
  cursor: not-allowed;
  border-color: #e0e0e0;
}

.search-btn {
  padding: 12px 35px;
  background: linear-gradient(135deg, #325e21 0%, #4a7c35 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
  flex-shrink: 0; /* 不缩小 */
  white-space: nowrap; /* 不换行 */
  box-shadow: 0 2px 8px rgba(50, 94, 33, 0.3);
}

.search-btn:hover {
  background: linear-gradient(135deg, #4a7c35 0%, #325e21 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(50, 94, 33, 0.4);
}

.search-btn:active {
  transform: translateY(0);
}

.favorite-btn {
  padding: 12px 24px;
  background: white;
  color: #325e21;
  border: 2px solid #325e21;
  border-radius: 8px;
  font-size: 18px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
  flex-shrink: 0; /* 不缩小 */
  white-space: nowrap; /* 不换行 */
  box-shadow: 0 2px 8px rgba(50, 94, 33, 0.2);
}

.favorite-btn:hover {
  background: linear-gradient(135deg, #325e21 0%, #4a7c35 100%);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(50, 94, 33, 0.3);
}

.favorite-btn:active {
  transform: translateY(0);
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

/* 中间分隔线
.vertical-divider {
  width: 1px;
  height: 60px;
  background: #e8e8e8;
  margin: 0 40px;
  flex-shrink: 0;
} */

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
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 2px solid #dee2e6;
}

.favorite-icon:hover {
  transform: translateY(-2px) scale(1.08);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  background: linear-gradient(135deg, #fff8e1 0%, #ffe082 100%);
  border-color: #ffb300;
}

.star {
  font-size: 24px;
  color: #adb5bd;
  transition: all 0.3s ease;
  filter: none;
  line-height: 1;
}

.favorite-icon:hover .star {
  color: #ff9800;
}

.star.active {
  color: #ff9800;
  background: linear-gradient(135deg, #ffd54f 0%, #ff9800 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: starPulse 0.5s ease;
  filter: drop-shadow(0 0 8px rgba(255, 152, 0, 0.4));
}

.favorite-icon:has(.star.active) {
  background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
  border-color: #ff9800;
  box-shadow: 0 3px 10px rgba(255, 152, 0, 0.3);
}

@keyframes starPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.25); }
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
@media (max-width: 1024px) {
  .vertical-divider {
    margin: 0 20px;
  }

  .job-left-info,
  .job-right-info {
    flex: 1;
  }
}

@media (max-width: 768px) {
  .job-center-page {
    padding: 15px;
  }

  .search-bar {
    padding: 15px;
    flex-wrap: wrap;
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

  .vertical-divider {
    display: none;
  }

  .job-right-info {
    width: 100%;
    margin-top: 15px;
    padding-top: 15px;
    padding-right: 50px; /* 移动端也为星标留出空间 */
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

