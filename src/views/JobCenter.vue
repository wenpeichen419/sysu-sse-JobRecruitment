<template>
  <div class="job-center-page">
    <!-- 面包屑导航 -->
    <div class="breadcrumb">
      <span class="crumb-item">求职中心</span>
    </div>

    <!-- 筛选搜索栏 -->
    <div class="search-bar">
      <!-- 第一行筛选 -->
      <div class="search-row">
        <div class="search-group">
          <label>职位名称</label>
          <div class="search-input-wrapper">
            <input 
              type="text" 
              v-model="searchJobTitle" 
              @input="onSearchInputChange"
              placeholder="输入职位名称"
              class="search-input"
            />
            <button class="search-icon"></button>
          </div>
        </div>

        <div class="search-group">
          <label>公司名称</label>
          <div class="search-input-wrapper">
            <input 
              type="text" 
              v-model="searchCompanyName" 
              @input="onSearchInputChange"
              placeholder="输入公司名称"
              class="search-input"
            />
            <button class="search-icon"></button>
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
          <select v-model="selectedCity" @change="onCityChange" class="search-select" :disabled="!selectedProvince">
            <option value="">不限</option>
            <option v-for="city in availableCities" :key="city" :value="city">
              {{ city }}
            </option>
          </select>
        </div>

        <!-- 操作按钮 -->
        <div class="search-actions">
          <button class="search-btn" @click="handleSearch">搜索</button>
          <button class="favorite-btn" @click="toggleFavoriteView">我的收藏</button>
        </div>
      </div>

      <!-- 第二行筛选 -->
      <div class="search-row">
        <div class="search-group">
          <label>职能类别</label>
          <select v-model="selectedCategory" @change="onFilterChange" class="search-select">
            <option value="">不限</option>
            <option value="算法">算法</option>
            <option value="产品">产品</option>
            <option value="测试">测试</option>
            <option value="开发">开发</option>
          </select>
        </div>

        <div class="search-group">
          <label>公司性质</label>
          <select v-model="selectedCompanyNature" @change="onFilterChange" class="search-select">
            <option value="">不限</option>
            <option value="事业单位招聘">事业单位招聘</option>
            <option value="企业招聘">企业招聘</option>
          </select>
        </div>

        <div class="search-group">
          <label>工作性质</label>
          <select v-model="selectedType" @change="onFilterChange" class="search-select">
            <option value="">不限</option>
            <option value="校招">校招</option>
            <option value="实习">实习</option>
          </select>
        </div>

        <div class="search-group">
          <label>薪资范围</label>
          <div class="salary-range-inputs">
            <input 
              v-model.number="minSalary" 
              @input="onSalaryChange"
              type="number" 
              class="salary-input" 
              placeholder="最低薪资"
            />
            <span class="separator">-</span>
            <input 
              v-model.number="maxSalary" 
              @input="onSalaryChange"
              type="number" 
              class="salary-input" 
              placeholder="最高薪资"
            />
          </div>
        </div>

        <!-- 占位元素，保持对齐 -->
        <div class="search-spacer"></div>
      </div>
    </div>

    <!-- 岗位列表 -->
    <div class="job-list">
      <!-- ✅ 加载中状态 -->
      <div v-if="loading" class="loading-state">
        <p>加载中...</p>
      </div>

      <!-- ✅ 岗位列表(注意字段名改为后端返回的字段) -->
      <div 
        v-for="job in displayedJobs" 
        :key="job.job_id"
        class="job-item"
        @click="goToJobDetail(job.job_id)"
        v-show="!loading"
      >
        <!-- 公司Logo -->
        <div class="job-logo">
          <img 
            :src="job.logo_url || require('@/assets/BDance_logo.png')" 
            :alt="job.company_name"
            @error="handleImageError"
          />
        </div>

        <!-- 左侧岗位信息 -->
        <div class="job-left-info">
          <div class="job-title">{{ job.title }}</div>
          <div class="job-details">
            <span class="salary">{{ formatSalaryRangeToK(job.salary_range) }}</span>
            <span class="divider">|</span>
            <span class="location">{{ job.address }}</span>
            <span class="divider">|</span>
            <span class="type-tag">{{ job.work_nature }}</span>
          </div>
        </div>

        <!-- 分隔线 -->
        <div class="vertical-divider"></div>

        <!-- 右侧公司信息 -->
        <div class="job-right-info">
          <div class="company-name">{{ job.company_name }}</div>
          <div class="company-details">
            <span class="department">{{ job.department }}</span>
            <span class="divider">|</span>
            <span class="recruit-info">招聘人数 {{ job.headcount }}人</span>
          </div>
        </div>

        <!-- 收藏按钮 -->
        <div class="favorite-icon" @click.stop="toggleFavorite(job.job_id)">
          <span class="star" :class="{ active: isFavorited(job.job_id) }">★</span>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="!loading && displayedJobs.length === 0" class="empty-state">
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
// ✅ 导入API方法(替代mock数据)
import { getJobList, favoriteJob, unfavoriteJob, getFavoriteJobs } from '@/api/job'
import { getLocations } from '@/api/location'
import { formatSalaryRangeToK } from '@/utils/salaryFormatter'

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
      minSalary: null,
      maxSalary: null,
      selectedType: '',
      selectedCompanyNature: '',  // 新增：公司性质筛选

      // 省市数据(从API获取)
      provinceCity: {},
      
      // 收藏相关
      showFavoriteOnly: false,
      favoriteJobIds: [],
      
      // 分页
      currentPage: 1,
      pageSize: 10, // ✅ 改为10,与后端API默认值一致

      // ✅ 岗位数据(从API获取,初始为空数组)
      allJobs: [],
      
      // ✅ 新增:总数据量和加载状态
      totalJobs: 0,
      loading: false,
      
      // ✅ 防抖定时器
      searchDebounceTimer: null,
      
      // 后端基础URL
      baseURL: 'http://localhost:8080',
      
      // 存储已创建的 blob URLs，用于清理
      blobUrls: []
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

    // ✅ 简化:由于后端已经做了筛选,前端不需要再次过滤
    // allJobs就是显示的岗位列表
    displayedJobs() {
      return Array.isArray(this.allJobs) ? this.allJobs : []
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
    // ✅ 页面加载时获取省市数据和岗位数据
    this.loadLocations()
    this.loadJobs()
  },
  beforeUnmount() {
    // ✅ 组件销毁前清理定时器
    if (this.searchDebounceTimer) {
      clearTimeout(this.searchDebounceTimer)
    }
    
    // ✅ 释放所有 blob URLs，避免内存泄漏
    this.blobUrls.forEach(url => URL.revokeObjectURL(url))
    this.blobUrls = []
  },
  methods: {
    formatSalaryRangeToK,
    
    // ✅ 获取带token的图片URL（转换为blob URL）
    async loadImageWithAuth(logoPath) {
      if (!logoPath) {
        return ''
      }
      
      try {
        // 如果已经是完整URL（包含http），可能是外部图片或已处理的URL
        if (logoPath.startsWith('http://') || logoPath.startsWith('https://')) {
          return logoPath
        }
        
        // 拼接完整URL
        const fullUrl = logoPath.startsWith('/') 
          ? `${this.baseURL}${logoPath}` 
          : `${this.baseURL}/${logoPath}`
        
        console.log('【加载Logo】', fullUrl)
        
        // 从 localStorage 获取 token（和 config.js 中一致）
        const token = localStorage.getItem('token') || 
          ""
        
        // 使用 fetch 带 token 请求图片
        const response = await fetch(fullUrl, {
          method: 'GET',
          headers: {
            'Authorization': token.startsWith('Bearer ') ? token : `Bearer ${token}`
          }
        })
        
        const contentType = response.headers.get('content-type')
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }
        
        // 检查是否是图片类型
        if (!contentType || !contentType.startsWith('image/')) {
          throw new Error(`响应类型不是图片: ${contentType}`)
        }
        
        // 将响应转换为 blob
        const blob = await response.blob()
        
        // 验证 blob 大小
        if (blob.size === 0) {
          throw new Error('图片内容为空')
        }
        
        // 创建 blob URL
        const blobUrl = URL.createObjectURL(blob)
        
        // 保存 blob URL 用于后续清理
        this.blobUrls.push(blobUrl)
        
        console.log('【Logo加载成功】', blobUrl)
        
        return blobUrl
      } catch (error) {
        console.error('【Logo加载失败】', logoPath, error)
        // 不使用默认logo，返回空字符串
        return ''
      }
    },
    
    // ✅ 新增:加载省市数据
    async loadLocations() {
      try {
        // 尝试从缓存读取
        const cachedData = localStorage.getItem('provinceCity')
        if (cachedData) {
          this.provinceCity = JSON.parse(cachedData)
          console.log('【省市数据】从缓存加载')
          return
        }

        // 从API获取
        const response = await getLocations()
        console.log('【省市数据API响应】', response)
        
        // 转换数据格式: [{name, cities: [...]}] -> {省名: [市名...]}
        const provinceCity = {}
        if (response && Array.isArray(response)) {
          response.forEach(province => {
            const cities = province.cities.map(city => city.name)
            provinceCity[province.name] = cities
          })
        }
        
        this.provinceCity = provinceCity
        
        // 缓存到localStorage
        localStorage.setItem('provinceCity', JSON.stringify(provinceCity))
        console.log('【省市数据】加载成功,已缓存', Object.keys(provinceCity).length, '个省份')
        
      } catch (error) {
        console.error('【省市数据】加载失败', error)
        // 如果加载失败，使用一个基础的备份数据
        this.provinceCity = {
          '广东省': ['广州市', '深圳市', '珠海市', '佛山市', '东莞市'],
          '北京市': ['北京市'],
          '上海市': ['上海市'],
          '四川省': ['成都市', '绵阳市']
        }
      }
    },
    
    // ✅ 新增:加载岗位列表(核心方法)
    async loadJobs() {
      try {
        this.loading = true
        
        // 清理之前的 blob URLs
        this.blobUrls.forEach(url => URL.revokeObjectURL(url))
        this.blobUrls = []
        
        // 构建查询参数(对应接口文档的参数)
        const params = {
          page: this.currentPage,
          page_size: this.pageSize
        }
        
        // 添加筛选条件(只添加有值的参数)
        if (this.searchJobTitle) params.title = this.searchJobTitle
        if (this.searchCompanyName) params.company_name = this.searchCompanyName
        if (this.selectedProvince) params.province = this.selectedProvince
        if (this.selectedCity) params.city = this.selectedCity
        if (this.selectedCategory) params.type = this.selectedCategory
        if (this.selectedType) params.work_nature = this.selectedType
        if (this.selectedCompanyNature) params.company_nature = this.selectedCompanyNature  // 新增：公司性质参数
        if (this.minSalary) params.min_salary = String(this.minSalary)
        if (this.maxSalary) params.max_salary = String(this.maxSalary)
        
        // 根据是否查看收藏调用不同的API
        let response
        if (this.showFavoriteOnly) {
          response = await getFavoriteJobs({
            page: params.page,
            size: params.page_size
          })
        } else {
          response = await getJobList(params)
        }
        
        // 更新数据
        // 注意:根据接口文档,返回的数据结构是 { total, page, page_size, jobs }
        const jobs = response.jobs || []
        this.totalJobs = response.total || 0
        
        console.log('【岗位列表原始数据】', jobs)
        
        // ✅ 并行加载所有 logo（带 token）
        const logoPromises = jobs.map(job => this.loadImageWithAuth(job.logo_url))
        const logos = await Promise.all(logoPromises)
        
        // 设置 logo 的 blob URL
        jobs.forEach((job, index) => {
          job.logo_url = logos[index]
        })
        
        this.allJobs = jobs
        
        // 打印日志,方便调试
        console.log('【加载岗位成功】', `共${this.totalJobs}条,当前第${this.currentPage}页`, this.allJobs)
        
      } catch (error) {
        console.error('【加载岗位失败】', error)
        this.allJobs = []
        this.totalJobs = 0
      } finally {
        this.loading = false
      }
    },
    
    // ✅ 防抖搜索 - 用于文本输入框
    debouncedSearch() {
      // 清除之前的定时器
      if (this.searchDebounceTimer) {
        clearTimeout(this.searchDebounceTimer)
      }
      
      // 设置新的定时器，500ms后执行搜索
      this.searchDebounceTimer = setTimeout(() => {
        this.currentPage = 1
        this.loadJobs()
      }, 500)
    },
    
    // ✅ 文本输入框变化（职位名称、公司名称）
    onSearchInputChange() {
      this.debouncedSearch()
    },
    
    // ✅ 省份变化
    onProvinceChange() {
      this.selectedCity = ''  // 重置城市选择
      this.currentPage = 1
      this.loadJobs()  // 立即搜索
    },
    
    // ✅ 城市变化
    onCityChange() {
      this.currentPage = 1
      this.loadJobs()  // 立即搜索
    },
    
    // ✅ 其他筛选条件变化（职能类别、工作性质）
    onFilterChange() {
      this.currentPage = 1
      this.loadJobs()  // 立即搜索
    },
    
    // ✅ 薪资范围变化
    onSalaryChange() {
      this.debouncedSearch()  // 使用防抖，避免频繁搜索
    },
    
    // ✅ 手动搜索按钮（保留，用于强制刷新）
    handleSearch() {
      // 清除防抖定时器
      if (this.searchDebounceTimer) {
        clearTimeout(this.searchDebounceTimer)
      }
      this.currentPage = 1
      this.loadJobs()  // 立即搜索
    },
    
    toggleFavoriteView() {
      this.showFavoriteOnly = !this.showFavoriteOnly
      this.currentPage = 1
      // ✅ 调用API重新加载
      this.loadJobs()
    },
    
    isFavorited(jobId) {
      // ✅ 根据后端返回的is_favorited字段判断
      const job = this.allJobs.find(j => j.job_id === jobId)
      return job ? job.is_favorited : false
    },
    
    // ✅ 收藏/取消收藏(调用API)
    async toggleFavorite(jobId) {
      try {
        // 查找当前岗位
        const job = this.allJobs.find(j => j.job_id === jobId)
        if (!job) return
        
        // 根据当前状态调用对应的API
        if (job.is_favorited) {
          await unfavoriteJob(jobId)
          job.is_favorited = false
      } else {
          await favoriteJob(jobId)
          job.is_favorited = true
        }
        
        console.log('【收藏操作成功】', jobId, '当前状态:', job.is_favorited)
      } catch (error) {
        console.error('【收藏操作失败】', error)
      }
    },
    
    goToJobDetail(jobId) {
      this.$router.push({ name: 'JobDetail', params: { id: jobId } })
    },
    
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page
        window.scrollTo({ top: 0, behavior: 'smooth' })
        // ✅ 调用API加载新页面数据
        this.loadJobs()
      }
    },
    
    // ✅ 图片加载失败处理
    handleImageError(event) {
      console.error('【图片加载失败】', event.target.src)
      // 不显示默认图片，隐藏图片元素
      event.target.style.display = 'none'
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
  padding: 30px 40px;
  margin-bottom: 20px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.search-row {
  display: flex;
  gap: 20px;
  align-items: flex-end;
}

.search-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  min-width: 0;
}

.search-actions {
  display: flex;
  gap: 12px;
  align-items: flex-end;
  flex-shrink: 0;
  width: 240px;
}

.search-spacer {
  width: 240px;
  flex-shrink: 0;
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

/* 薪资范围输入框样式 */
.salary-range-inputs {
  display: flex;
  align-items: center;
  gap: 8px;
}

.salary-input {
  padding: 12px 16px;
  border: 1px solid #d8d8d8;
  border-radius: 6px;
  font-size: 18px;
  width: 100%;
  outline: none;
  transition: all 0.3s;
}

.salary-input:focus {
  border-color: #2a5e23;
}

.separator {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.search-btn {
  padding: 12px 20px;
  background: linear-gradient(135deg, #325e21 0%, #4a7c35 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(50, 94, 33, 0.3);
  height: 48px;
  flex: 1;
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
  padding: 12px 16px;
  background: white;
  color: #325e21;
  border: 2px solid #325e21;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(50, 94, 33, 0.2);
  height: 48px;
  flex: 1;
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

/* 加载中状态 */
.loading-state {
  text-align: center;
  padding: 80px 20px;
  color: #666;
  font-size: 18px;
  font-weight: 500;
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
    padding: 20px;
  }

  .search-row {
    flex-wrap: wrap;
  }

  .search-group {
    min-width: calc(50% - 10px);
  }

  .search-actions {
    width: 100%;
    justify-content: center;
    margin-top: 10px;
  }

  .search-spacer {
    display: none;
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

