<template>
  <div class="candidate-layout">
    <!-- 侧边栏 -->
    <CandidateSidebar 
      :candidates="sidebarCandidates"
      :activeCandidateId="activeCandidateId"
      @candidate-selected="onCandidateSelected"
    />
    
    <!-- 成功提示 -->
    <div v-if="showSuccessAlert" class="success-alert">
      <div class="alert-content">
        <span class="alert-icon">✅</span>
        <span class="alert-message">{{ successMessage }}</span>
        <button class="alert-close" @click="closeSuccessAlert">×</button>
      </div>
    </div>

    <!-- 候选人简介弹窗 -->
    <CandidateProfileModal
      :visible="showProfileModal"
      :candidateName="selectedCandidateName"
      :userId="selectedUserId"
      @close="closeProfileModal"
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
                  <img 
                    v-if="getAvatarUrl(candidate)" 
                    :src="getAvatarUrl(candidate)" 
                    :alt="candidate.candidate_name + '的头像'"
                    @error="handleAvatarError($event, candidate)"
                  >
                  <div v-else class="avatar-placeholder">
                    {{ getCandidateInitial(candidate.candidate_name) }}
                  </div>
                </div>
                <div class="candidate-info-wrapper">
                  <span class="candidate-name">{{ candidate.candidate_name }}</span>
                  <span 
                    class="view-profile-link" 
                    @click.stop="viewCandidateProfile(candidate)"
                  >
                    >>点击查看候选人简介
                  </span>
                </div>
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
            
            <button 
              v-if="totalPages > 1"
              class="page-btn"
              :class="{ active: currentPage === totalPages }"
              @click="changePage(totalPages)"
            >{{ totalPages }}</button>

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
import CandidateProfileModal from '../components/CandidateProfileModal.vue'

export default {
  name: 'CandidateList',
  components: {
    CandidateSidebar,
    CandidateProfileModal
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
      candidateAvatars: {},
      currentPage: 1,
      pageSize: 10,
      totalItems: 0,
      totalPages: 0,
      loading: false,
      successMessage: '',
      showSuccessAlert: false,
      showProfileModal: false,
      selectedCandidateName: '',
      selectedUserId: null
    }
  },
  computed: {
    sidebarCandidates() {
      return this.allCandidates
        .filter(candidate => candidate.resume_status === '候选人')
        .map(candidate => ({
          id: candidate.application_id,
          name: candidate.candidate_name,
          status: candidate.resume_status,
          avatar: candidate.avatar_url || ''
        }))
    },

    middlePages() {
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

    showEllipsis() {
      return this.totalPages > 5 && this.currentPage < this.totalPages - 2
    }
  },
  mounted() {
    this.loadPositionData()
    this.loadCandidates()
    this.checkSuccessMessage()
  },
  methods: {
    viewCandidateProfile(candidate) {
      this.selectedCandidateName = candidate.candidate_name
      this.selectedUserId = candidate.user_id
      this.showProfileModal = true
    },

    closeProfileModal() {
      this.showProfileModal = false
      this.selectedCandidateName = ''
      this.selectedUserId = null
    },

    checkSuccessMessage() {
      const success = this.$route.query.success
      const message = this.$route.query.message
      
      if (success === 'true' && message) {
        this.successMessage = message
        this.showSuccessAlert = true
        
        setTimeout(() => {
          this.showSuccessAlert = false
          this.$router.replace({ 
            name: 'CandidateList', 
            params: { positionId: this.positionId } 
          })
        }, 3000)
      }
    },
    
    closeSuccessAlert() {
      this.showSuccessAlert = false
      this.$router.replace({ 
        name: 'CandidateList', 
        params: { positionId: this.positionId } 
      })
    },

    getCandidateInitial(name) {
      if (!name) return '?'
      return name.charAt(0)
    },

    async fetchCandidateAvatar(candidate) {
      if (!candidate.avatar_url) return null
      
      try {
        const token = localStorage.getItem('token')
        
        let avatarUrl = candidate.avatar_url
        if (avatarUrl.startsWith('/')) {
          avatarUrl = `http://localhost:8080${avatarUrl}`
        }
        
        // 准备headers对象，仅在token存在时添加Authorization头
        const headers = {}
        if (token) {
          headers['Authorization'] = `Bearer ${token}`
        }
        
        const response = await fetch(avatarUrl, {
          method: 'GET',
          headers: Object.keys(headers).length > 0 ? headers : undefined
        })
        
        if (response.ok) {
          const blob = await response.blob()
          const avatarBlobUrl = URL.createObjectURL(blob)
          this.candidateAvatars[candidate.application_id] = avatarBlobUrl
          this.$forceUpdate()
        } else {
          console.error('获取头像失败，状态码:', response.status)
        }
      } catch (error) {
        console.error('获取候选人头像失败:', error)
      }
    },

    getAvatarUrl(candidate) {
      if (this.candidateAvatars[candidate.application_id]) {
        return this.candidateAvatars[candidate.application_id]
      }
      
      if (candidate.avatar_url) {
        return null
      }
      
      return null
    },

    handleAvatarError(event) {
      console.log('头像加载失败，显示姓氏占位符')
      event.target.style.display = 'none'
    },

    async loadPositionData() {
      try {
        const token = localStorage.getItem('token')
        
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
        console.log('岗位详情接口返回数据:', data)
        
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
      if (this.loading) return
      
      this.loading = true
      try {
        const token = localStorage.getItem('token')
        
        const params = new URLSearchParams({
          page: this.currentPage,
          page_size: this.pageSize
        })

        if (this.filters.candidateName) {
          params.append('name_keyword', this.filters.candidateName)
        }
        if (this.filters.resumeStatus) {
          params.append('status', this.filters.resumeStatus)
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
        console.log('候选人列表接口返回数据:', data)
        
        if (data.code === 200 && data.data) {
          this.allCandidates = data.data.candidate_list || []
          this.sortCandidates()
          this.totalItems = data.data.pagination?.total_items || 0
          this.totalPages = data.data.pagination?.total_pages || 0
          this.currentPage = data.data.pagination?.current_page || 1
          
          this.allCandidates.forEach(candidate => {
            if (candidate.avatar_url) {
              this.fetchCandidateAvatar(candidate)
            }
          })
        } else {
          console.error('接口返回错误:', data.message)
          this.useMockData()
        }
      } catch (error) {
        console.error('获取候选人列表失败:', error)
        this.useMockData()
      } finally {
        this.loading = false
      }
      this.checkSuccessMessage()
    },

    sortCandidates() {
      this.sortedCandidates = [...this.allCandidates].sort((a, b) => {
        if (a.resume_status === '已投递' && b.resume_status !== '已投递') {
          return -1
        } else if (a.resume_status !== '已投递' && b.resume_status === '已投递') {
          return 1
        } else {
          return 0
        }
      })
    },

    useMockData() {
      this.allCandidates = [
        {
          application_id: 1,
          candidate_name: '陈雯珮',
          grade: '2023级',
          degree: 'bachelor',
          resume_status: '候选人',
          avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
          user_id: 3
        },
        {
          application_id: 2,
          candidate_name: '大眼眼',
          grade: '2022级',
          degree: 'bachelor',
          resume_status: '已投递',
          avatar_url: null,
          user_id: 4
        }
      ]
      this.sortCandidates()
      this.totalItems = this.allCandidates.length
      this.totalPages = 1
      
      this.allCandidates.forEach(candidate => {
        if (candidate.avatar_url) {
          this.fetchCandidateAvatar(candidate)
        }
      })
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
      console.log('开始搜索，候选人名字:', this.filters.candidateName, '简历状态:', this.filters.resumeStatus)
      this.currentPage = 1
      this.loadCandidates()
    },

    onCandidateSelected(candidate) {
      this.activeCandidateId = candidate.application_id || candidate.id
      
      this.$router.push({
        name: 'CandidateResume',
        params: { 
          positionId: this.positionId,
          candidateId: candidate.application_id || candidate.id
        }
      })
    },

    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page
        this.loadCandidates()
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

/* 成功提示样式 */
.success-alert {
  position: fixed;
  top: 120px;
  left: 50%;
  transform: translateX(-50%);
  background: #f0f9f0;
  border: 1px solid #4caf50;
  border-radius: 8px;
  padding: 16px 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 10000;
  min-width: 400px;
  max-width: 600px;
}

.alert-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.alert-icon {
  font-size: 18px;
}

.alert-message {
  flex: 1;
  color: #2e7d32;
  font-size: 16px;
  font-weight: 500;
}

.alert-close {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #666;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.alert-close:hover {
  color: #333;
}

/* 面包屑导航 */
.breadcrumb-wrapper {
  position: fixed;
  top: 105px;
  left: 320px;
  right: 0;
  background: #f4f4f4;
  padding: 20px 30px; /* 这个padding需要调整 */
  z-index: 1000;
  height: 115px;
  box-sizing: border-box;
}

.breadcrumb {
  background: white;
  padding: 20px 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  font-size: 20px;
  box-sizing: border-box;
  /* 关键修改：计算正确的宽度 */
  width: calc(100vw - 320px - 80px); /* 视口宽度 - 侧边栏宽度 - 左右padding */
  position: fixed;
  top: 130px;
  left: 350px; /* 320px侧边栏 + 30px padding */
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
  padding-right: 30px; /* 确保内容区域有相同的右侧间距 */
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
  margin-left: 350px;
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

.candidate-info-wrapper {
  display: flex;
  align-items: center;
  gap: 15px;
}

.candidate-name {
  font-weight: 500;
  font-size: 24px;
  white-space: nowrap;
}

.view-profile-link {
  color: #325e21;
  font-size: 16px;
  cursor: pointer;
  text-decoration: none;
  transition: color 0.3s ease;
  font-weight: 500;
  white-space: nowrap;
}

.view-profile-link:hover {
  color: #2a4e1b;
  text-decoration: underline;
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
  position: relative;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #325e21, #4a7c2f);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  border-radius: 50%;
}

.candidate-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
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

  .candidate-info-wrapper {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }

  .pagination {
    flex-direction: column;
    gap: 15px;
    width: calc(100% - 20px);
  }
}
</style>