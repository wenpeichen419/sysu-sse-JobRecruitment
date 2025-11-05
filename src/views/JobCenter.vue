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
export default {
  name: 'JobCenter',
  data() {
    return {
      // 搜索筛选条件
      searchJobTitle: '',
      searchCompanyName: '',
      selectedProvince: '', // 选择的省份
      selectedCity: '', // 选择的城市
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
      favoriteJobIds: [], // 收藏的岗位ID列表
      
      // 分页
      currentPage: 1,
      pageSize: 5, // 改为5条每页，这样10条数据会显示2页
      
      // 岗位数据 (模拟数据)
      allJobs: [
        {
          id: 1,
          title: '推荐算法工程师',
          company: '百度在线网络技术（北京）有限公司',
          category: '算法',
          department: 'xx部门',
          salary: '7000-8000',
          province: '广东省',
          city: '深圳',
          location: '广东省深圳市南山区',
          type: '校招',
          recruitCount: 5,
          logo: require('@/assets/BDance_logo.png')
        },
        {
          id: 2,
          title: '产品经理',
          company: '华为技术有限公司',
          category: '产品',
          department: '产品部',
          salary: '7000-8000',
          province: '广东省',
          city: '深圳',
          location: '广东省深圳市南山区',
          type: '实习',
          recruitCount: 3,
          logo: require('@/assets/BDance_logo.png')
        },
        {
          id: 3,
          title: '产品设计',
          company: '支付宝（中国）网络技术有限公司',
          category: '设计',
          department: '设计部',
          salary: '7000-8000',
          province: '广东省',
          city: '广州',
          location: '广东省广州市天河区',
          type: '校招',
          recruitCount: 5,
          logo: require('@/assets/BDance_logo.png')
        },
        {
          id: 4,
          title: '前端开发工程师',
          company: '腾讯科技（深圳）有限公司',
          category: '研发',
          department: '技术部',
          salary: '8000-10000',
          province: '广东省',
          city: '深圳',
          location: '广东省深圳市南山区',
          type: '校招',
          recruitCount: 10,
          logo: require('@/assets/BDance_logo.png')
        },
        {
          id: 5,
          title: '算法工程师',
          company: '北京字节跳动科技有限公司',
          category: '算法',
          department: 'AI部门',
          salary: '15000-20000',
          province: '北京市',
          city: '海淀区',
          location: '北京市海淀区',
          type: '校招',
          recruitCount: 8,
          logo: require('@/assets/BDance_logo.png')
        },
        {
          id: 6,
          title: 'Java后端开发',
          company: '阿里巴巴（中国）网络技术有限公司',
          category: '研发',
          department: '技术部',
          salary: '10000-15000',
          province: '浙江省',
          city: '杭州',
          location: '浙江省杭州市余杭区',
          type: '校招',
          recruitCount: 15,
          logo: require('@/assets/BDance_logo.png')
        },
        {
          id: 7,
          title: 'UI设计师',
          company: '美团网（北京）科技有限公司',
          category: '设计',
          department: '设计部',
          salary: '8000-12000',
          province: '北京市',
          city: '朝阳区',
          location: '北京市朝阳区',
          type: '校招',
          recruitCount: 4,
          logo: require('@/assets/BDance_logo.png')
        },
        {
          id: 8,
          title: '数据分析师',
          company: '京东集团股份有限公司',
          category: '算法',
          department: '数据部',
          salary: '9000-13000',
          province: '北京市',
          city: '朝阳区',
          location: '北京市朝阳区',
          type: '实习',
          recruitCount: 6,
          logo: require('@/assets/BDance_logo.png')
        },
        {
          id: 9,
          title: '运营专员',
          company: '小红书科技有限公司',
          category: '运营',
          department: '运营部',
          salary: '7000-9000',
          province: '上海市',
          city: '浦东新区',
          location: '上海市浦东新区',
          type: '实习',
          recruitCount: 5,
          logo: require('@/assets/BDance_logo.png')
        },
        {
          id: 10,
          title: 'Python工程师',
          company: '网易（杭州）网络有限公司',
          category: '研发',
          department: '技术部',
          salary: '10000-14000',
          province: '浙江省',
          city: '杭州',
          location: '浙江省杭州市滨江区',
          type: '校招',
          recruitCount: 7,
          logo: require('@/assets/BDance_logo.png')
        }
      ]
    }
  },
  computed: {
    // 省份列表
    provinceList() {
      return Object.keys(this.provinceCity)
    },
    
    // 根据选择的省份获取可用的城市列表
    availableCities() {
      if (!this.selectedProvince) {
        return []
      }
      return this.provinceCity[this.selectedProvince] || []
    },
    
    // 过滤后的岗位列表
    filteredJobs() {
      let jobs = this.allJobs

      // 如果显示收藏,只显示收藏的岗位
      if (this.showFavoriteOnly) {
        jobs = jobs.filter(job => this.isFavorited(job.id))
      }

      // 职位名称搜索
      if (this.searchJobTitle.trim()) {
        const keyword = this.searchJobTitle.toLowerCase()
        jobs = jobs.filter(job => 
          job.title.toLowerCase().includes(keyword)
        )
      }

      // 公司名称搜索
      if (this.searchCompanyName.trim()) {
        const keyword = this.searchCompanyName.toLowerCase()
        jobs = jobs.filter(job => 
          job.company.toLowerCase().includes(keyword)
        )
      }

      // 省份筛选
      if (this.selectedProvince) {
        jobs = jobs.filter(job => job.province === this.selectedProvince)
      }

      // 城市筛选
      if (this.selectedCity) {
        jobs = jobs.filter(job => job.city === this.selectedCity)
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
    // 省份变化时重置城市选择
    onProvinceChange() {
      this.selectedCity = '' // 切换省份时清空城市选择
      this.currentPage = 1 // 回到第一页
    },
    
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

