<template>
  <div class="candidate-layout">
    <!-- 侧边栏 -->
    <CandidateSidebar 
      :candidates="sidebarCandidates"
      :activeCandidateId="activeCandidateId"
      @candidate-selected="onCandidateSelected"
    />
    
    <!-- 主内容区域 -->
    <div class="main-content">
      <!-- 面包屑导航 -->
      <div class="breadcrumb-wrapper">
        <div class="breadcrumb">
          <router-link to="/talent-pool" class="breadcrumb-link">人才库</router-link>
          <span class="breadcrumb-separator">></span>
          <span class="breadcrumb-current">{{ currentPosition.title }} - 候选人列表</span>
        </div>
      </div>

      <div class="content-wrapper">
        <!-- 筛选区 -->
        <div class="filter-section fixed-filter">
          <div class="filter-row">
            <div class="filter-item">
              <label>候选人名字</label>
              <input 
                type="text" 
                v-model="filters.candidateName"
                placeholder="输入候选人名字"
                class="filter-input"
                @input="handleSearch"
              >
            </div>
            <div class="filter-item">
              <label>简历状态</label>
              <select v-model="filters.resumeStatus" class="filter-select" @change="handleSearch">
                <option value="">请选择</option>
                <option value="10">已投递</option>
                <option value="20">已候选</option>
                <option value="30">面试邀请</option>
                <option value="40">通过</option>
                <option value="50">拒绝</option>
              </select>
            </div>
            <button class="search-btn" @click="handleSearch">筛选</button>
          </div>
        </div>

        <!-- 数据表格 -->
        <div class="table-section">
          <div class="table-header">
            <div class="table-col">候选人</div>
            <div class="table-col">年级</div>
            <div class="table-col">学历</div>
            <div class="table-col">简历状态</div>
          </div>
          <div class="table-body">
            <div 
              v-for="candidate in sortedCandidates" 
              :key="candidate.application_id"
              class="table-row"
              @click="onCandidateSelected(candidate)"
            >
              <div class="table-col candidate-info-col">
                <div class="candidate-avatar">
                  <img src="@/assets/campus.png" alt="头像">
                </div>
                <span class="candidate-name">{{ candidate.candidate_name }}</span>
              </div>
              <div class="table-col grade-col">{{ candidate.grade }}</div>
              <div class="table-col degree-col">{{ getDegreeText(candidate.degree) }}</div>
              <div class="table-col status-col">
                <span :class="['status-tag', getStatusClass(candidate.resume_status)]">
                  {{ candidate.resume_status }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- 分页 -->
<div class="pagination" v-if="totalItems > 0">
  <span class="page-info">共 {{ totalItems }} 条数据</span>
  
  <div class="page-controls">
    <!-- 只有当总页数大于1时才显示第一页按钮 -->
    <button 
      v-if="totalPages > 1"
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
    
    <!-- 只有当总页数大于1时才显示最后一页按钮 -->
    <button 
      v-if="totalPages > 1"
      class="page-btn"
      :class="{ active: currentPage === totalPages }"
      @click="changePage(totalPages)"
    >{{ totalPages }}</button>

    <!-- 只有当总页数大于1时才显示下一页按钮 -->
    <button 
      v-if="totalPages > 1"
      class="page-next" 
      :disabled="currentPage >= totalPages"
      @click="changePage(currentPage + 1)"
    >›</button>
  </div>
</div>
      </div>
    </div>
  </div>
</template>

<script>
import CandidateSidebar from '../components/CandidateSiderBar.vue'

export default {
  name: 'CandidateList',
  components: {
    CandidateSidebar
  },
  props: {
    positionId: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      filters: {
        candidateName: '',
        resumeStatus: ''
      },
      currentPosition: { title: '加载中...' },
      allCandidates: [],
      sortedCandidates: [],
      activeCandidateId: '',
      // 分页相关
      currentPage: 1,
      pageSize: 10,
      totalItems: 0,
      totalPages: 0,
      loading: false
    }
  },
  computed: {
    // 侧边栏候选人数据 - 状态为"候选人"的
    sidebarCandidates() {
      return this.allCandidates
        .filter(candidate => candidate.resume_status === '候选人')
        .map(candidate => ({
          id: candidate.application_id,
          name: candidate.candidate_name,
          status: candidate.resume_status,
          avatar: ''
        }))
    },

    // 中间的页码
    middlePages() {
  // 如果总页数小于等于3，不显示中间页码
  if (this.totalPages <= 3) {
    return []
  }
  
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
    this.loadPositionData()
    this.loadCandidates()
  },
  methods: {
    async loadPositionData() {
      try {
        const token = 'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiaHIiLCJpZCI6Miwic3ViIjoiY2hlbndwMjhAbWFpbDIuc3lzdS5lZHUuY24iLCJpYXQiOjE3NjM2MDIyNDgsImV4cCI6MTc2MzY4ODY0OH0.A0KF0nyu6oTjNhYfkjTMiwqnGl9-lEOBmnRSJJxk7eg'
        
        const response = await fetch(`http://localhost:8080/api/hr/jobs/${this.positionId}`, {
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
        console.log('岗位详情接口返回数据:', data);
        
        if (data.code === 200 && data.data) {
          this.currentPosition = data.data.job_details || { title: '未知岗位' }
        } else {
          throw new Error(data.message || '获取岗位信息失败')
        }
      } catch (error) {
        console.error('获取岗位信息失败:', error)
        this.currentPosition = { title: '未知岗位' }
      }
    },

    async loadCandidates() {
      if (this.loading) return;
      
      this.loading = true;
      try {
        const token = 'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiaHIiLCJpZCI6Miwic3ViIjoiY2hlbndwMjhAbWFpbDIuc3lzdS5lZHUuY24iLCJpYXQiOjE3NjM2MDIyNDgsImV4cCI6MTc2MzY4ODY0OH0.A0KF0nyu6oTjNhYfkjTMiwqnGl9-lEOBmnRSJJxk7eg'
        
        // 构建查询参数
        const params = new URLSearchParams({
          page: this.currentPage,
          page_size: this.pageSize
        });

        // 添加搜索条件
        if (this.filters.candidateName) {
          params.append('name_keyword', this.filters.candidateName);
        }
        if (this.filters.resumeStatus) {
          params.append('status', this.filters.resumeStatus);
        }

        const response = await fetch(`http://localhost:8080/api/hr/talentpool/job/list/${this.positionId}?${params}`, {
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
        console.log('候选人列表接口返回数据:', data);
        
        if (data.code === 200 && data.data) {
          this.allCandidates = data.data.candidate_list || []
          this.sortCandidates()
          this.totalItems = data.data.pagination?.total_items || 0
          this.totalPages = data.data.pagination?.total_pages || 0
          this.currentPage = data.data.pagination?.current_page || 1
        } else {
          console.error('接口返回错误:', data.message)
          this.useMockData()
        }
      } catch (error) {
        console.error('获取候选人列表失败:', error)
        this.useMockData()
      } finally {
        this.loading = false;
      }
    },

    // 排序候选人，将"已投递"状态的放在最前面
    sortCandidates() {
      this.sortedCandidates = [...this.allCandidates].sort((a, b) => {
        if (a.resume_status === '已投递' && b.resume_status !== '已投递') {
          return -1;
        } else if (a.resume_status !== '已投递' && b.resume_status === '已投递') {
          return 1;
        } else {
          return 0;
        }
      });
    },

    useMockData() {
      // 模拟数据，当接口不可用时使用
      this.allCandidates = [
        {
          application_id: 1,
          candidate_name: '陈雯珮',
          grade: '2023级',
          degree: 'bachelor',
          resume_status: '候选人'
        },
        {
          application_id: 2,
          candidate_name: '大眼眼',
          grade: '2022级',
          degree: 'bachelor',
          resume_status: '已投递'
        },
        {
          application_id: 3,
          candidate_name: '大韩寒',
          grade: '2023级',
          degree: 'master',
          resume_status: '邀请面试'
        },
        {
          application_id: 4,
          candidate_name: '无名氏',
          grade: '2023级',
          degree: 'bachelor',
          resume_status: '通过'
        },
        {
          application_id: 5,
          candidate_name: '测试用户',
          grade: '2021级',
          degree: 'doctor',
          resume_status: '拒绝'
        }
      ]
      this.sortCandidates()
      this.totalItems = this.allCandidates.length
      this.totalPages = 1
    },

    getDegreeText(degree) {
      const degreeMap = {
        'bachelor': '本科',
        'master': '硕士',
        'doctor': '博士'
      }
      return degreeMap[degree] || degree
    },

    getStatusClass(status) {
      const statusClassMap = {
        '已投递': 'submitted',
        '候选人': 'candidate',
        '面试邀请': 'interview',
        '通过': 'passed',
        '拒绝': 'rejected'
      }
      return statusClassMap[status] || 'submitted'
    },

    handleSearch() {
      console.log('开始搜索，候选人名字:', this.filters.candidateName, '简历状态:', this.filters.resumeStatus);
      this.currentPage = 1
      this.loadCandidates()
    },

    onCandidateSelected(candidate) {
      this.activeCandidateId = candidate.application_id || candidate.id
      
      // 跳转到简历页面 - 修复路由参数问题
      this.$router.push({
        name: 'CandidateResume',
        params: { 
          positionId: this.positionId,
          candidateId: candidate.application_id || candidate.id
        }
      })
    },

    // 切换页码
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page
        this.loadCandidates()
        // 滚动到顶部
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
  }
}
</script>

<style scoped>
.candidate-layout {
  display: flex;
  min-height: calc(100vh - 105px);
}

.main-content {
  margin-left: 320px;
  flex: 1;
  background: #f5f5f5;
  min-height: calc(100vh - 105px);
}

/* 面包屑导航 */
.breadcrumb-wrapper {
  position: fixed;
  top: 105px;
  left: 320px;
  right: 0;
  background: #f4f4f4;
  padding: 20px 30px;
  z-index: 1000;
  height: 115px;
}

.breadcrumb {
  background: white;
  padding: 20px 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  font-size: 20px;
  box-sizing: border-box;
  width: calc(100% - 60px);
  position: fixed;
  top: 130px;
  left: 350px;
}

.breadcrumb-link {
  color: #325e21;
  text-decoration: none;
  font-weight: 500;
}

.breadcrumb-link:hover {
  text-decoration: underline;
}

.breadcrumb-separator {
  margin: 0 10px;
  color: #666;
}

.breadcrumb-current {
  color: #666;
}

.content-wrapper {
  padding-top: 120px;
  padding-left: 30px;
  padding-right: 30px;
  padding-bottom: 30px;
}

/* 筛选区样式 */
.fixed-filter {
  background: white;
  padding: 25px 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  position: sticky;
  top: 220px;
  z-index: 999;
}

.filter-row {
  display: flex;
  align-items: center;
  gap: 120px;
  flex-wrap: wrap;
  margin-left: 200px;
}

.filter-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 20px;
}

.filter-item label {
  font-size: 22px;
  color: #333;
  font-weight: 500;
}

.filter-input, .filter-select {
  padding: 10px 12px;
  border: 1px solid #d8d8d8;
  border-radius: 6px;
  font-size: 22px;
  min-width: 150px;
}

.filter-input:focus, .filter-select:focus {
  outline: none;
  border-color: #325e21;
}

.search-btn {
  background: #325e21;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 22px;
  transition: background-color 0.3s ease;
  align-self: center;
  margin-left: 50px;
}

.search-btn:hover {
  background: #2a4e1b;
}

/* 表格样式 */
.table-section {
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 20px;
}

.table-header {
  display: flex;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.table-header .table-col {
  font-size: 26px !important;
  font-weight: bold;
  color: #2a5e23;
  display: flex;
  align-items: center;
  justify-content: center;
}

.table-row {
  display: flex;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background-color 0.3s ease;
  min-height: 90px;
}

.table-row:hover {
  background: #f8f9fa;
}

.table-row:last-child {
  border-bottom: none;
}

.table-col {
  flex: 1;
  padding: 20px;
  text-align: center;
  font-size: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.candidate-info-col {
  display: flex;
  align-items: center;
  gap: 20px;
  justify-content: flex-start;
  padding-left: 40px;
}

.grade-col, .degree-col, .status-col {
  display: flex;
  align-items: center;
  justify-content: center;
}

.candidate-avatar {
  width: 75px;
  height: 75px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.candidate-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.candidate-name {
  font-weight: 500;
  font-size: 24px;
}

.status-tag {
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 20px;
  font-weight: bold;
  white-space: nowrap;
}

.status-tag.submitted {
  background: #e3f2fd;
  color: #1976d2;
}

.status-tag.candidate {
  background: #fff3e0;
  color: #ff9800;
}

.status-tag.interview {
  background: #f3e5f5;
  color: #9c27b0;
}

.status-tag.passed {
  background: #e8f5e8;
  color: #4caf50;
}

.status-tag.rejected {
  background: #ffebee;
  color: #f44336;
}

/* 分页样式 */
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

/* 响应式设计 */
@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
  }
  
  .breadcrumb-wrapper {
    left: 0;
  }
  
  .breadcrumb {
    left: 30px;
    width: calc(100% - 90px);
  }
  
  .filter-row {
    flex-direction: column;
    align-items: stretch;
    margin-left: 0;
  }
  
  .filter-input, .filter-select {
    min-width: auto;
  }
  
  .table-header, .table-row {
    flex-direction: column;
  }
  
  .table-col {
    padding: 12px 20px;
  }
  
  .candidate-info-col {
    justify-content: center;
    padding-left: 20px;
  }

  .pagination {
    flex-direction: column;
    gap: 15px;
    width: calc(100% - 20px);
  }
}
</style>