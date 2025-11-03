<template>
  <div class="candidate-layout">
    <!-- 侧边栏 -->
    <CandidateSidebar 
      :candidates="allCandidates"
      :activeCandidateId="activeCandidateId"
      @candidate-selected="onCandidateSelected"
    />
    
    <!-- 主内容区域 -->
    <div class="main-content">
      <button class="back-to-talent-pool-btn" @click="backToTalentPool">
      返回人才总库
      </button>
      <div class="candidate-list-page">
        <div class="filters-container">
         <div class="filters">
            <!-- 候选人名字筛选 -->
             <div class="filter-item">
                <label>候选人名字</label>
      <input 
        type="text" 
        v-model="filters.candidateName"
        placeholder="输入候选人名字"
        class="filter-input"
      >
          </div>
    
    <!-- 简历状态筛选 -->
    <div class="filter-item">
      <label>简历状态</label>
      <select v-model="filters.resumeStatus" class="filter-select">
        <option value="">请选择</option>
        <option value="未审核">未审核</option>
        <option value="已候选">已候选</option>
        <option value="已发送面试通知">已发送面试通知</option>
        <option value="已拒绝">已拒绝</option>
      </select>
    </div>
    
               <!-- 筛选按钮 -->
              <button class="filter-btn" @click="handleFilter">筛选</button>
               </div>
         </div>

        <div class="candidates-list">
          <div 
            v-for="candidate in filteredCandidates" 
            :key="candidate.id"
            class="candidate-row"
            @click="onCandidateSelected(candidate)"
          >
            <!-- 左侧头像 -->
            <div class="candidate-avatar">
              <img v-if="candidate.avatar" :src="candidate.avatar" alt="头像">
              <div v-else class="avatar-placeholder">
                {{ candidate.name.charAt(0) }}
              </div>
            </div>
            
            <!-- 中间信息 -->
            <div class="candidate-info">
              <div class="name-section">
                <h3 class="candidate-name">{{ candidate.name }}</h3>
                <span class="candidate-grade">{{ candidate.grade }} </span>
              </div>
            </div>
            
            <!-- 右侧状态 -->
            <div class="candidate-status" :style="{ color: getStatusColor(candidate.status) }">
              {{ candidate.status }}
            </div>
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
        intern: false,
        freshGraduate: false
      },
      currentPosition: {},
      allCandidates: [],
      filteredCandidates: [],
      activeCandidateId: ''
    }
  },
  mounted() {
    this.loadPositionData()
    this.loadCandidates()
  },
  methods: {
     backToTalentPool() {
    this.$router.push('/talent-pool'); // 根据您的路由配置调整
    },
    loadPositionData() {
      const positions = {
        1: { id: 1, name: '官培士' },
        2: { id: 2, name: '导航算法工程师' },
        3: { id: 3, name: 'SLAM算法工程师' },
        4: { id: 4, name: '运营培训生' },
        5: { id: 5, name: '技术培训生' },
        6: { id: 6, name: '财务培训生' },
        7: { id: 7, name: 'IT工程师' },
        8: { id: 8, name: '设备工程师' },
        9: { id: 9, name: '工艺工程师' },
        10: { id: 10, name: '质量工程师' },
        11: { id: 11, name: '工艺综合工程师' },
        12: { id: 12, name: '技术研发工程师' },
        13: { id: 13, name: '产品开发助理' }
      }
      this.currentPosition = positions[this.positionId] || { name: '未知岗位' }
    },

    loadCandidates() {
      this.allCandidates = [
        {
          id: '487',
          name: 'ChoAi',
          grade: '2020级本科生',
          status: '已发送面试通知',
          resumeUrl: '/resumes/487.pdf',
          avatar: ''
        },
        {
          id: '488',
          name: 'DMD',
          grade: '2023级本科生',
          status: '已拒绝',
          resumeUrl: '/resumes/488.pdf',
          avatar: ''
        },
        {
          id: '489',
          name: 'Jelly',
          grade: '2022级本科生',
          status: '未审核',
          resumeUrl: '/resumes/489.pdf',
          avatar: ''
        },
        {
          id: '490',
          name: 'XMX',
          grade: '2021级研究生',
          status: '已候选',
          resumeUrl: '/resumes/490.pdf',
          avatar: ''
        },
        {
          id: '491',
          name: '张三',
          grade: '2023级本科生',
          status: '未审核',
          resumeUrl: '/resumes/491.pdf',
          avatar: ''
        }
      ]
      this.filteredCandidates = [...this.allCandidates]
    },

    filterCandidates() {
      let filtered = [...this.allCandidates]
      
      if (this.filters.intern && !this.filters.freshGraduate) {
        filtered = filtered.filter(c => c.type === '实习生')
      } else if (this.filters.freshGraduate && !this.filters.intern) {
        filtered = filtered.filter(c => c.type === '应届生')
      } else if (this.filters.intern && this.filters.freshGraduate) {
        filtered = filtered.filter(c => c.type === '实习生' || c.type === '应届生')
      }
      
      this.filteredCandidates = filtered
    },

    getStatusColor(status) {
      const statusColors = {
        '已发送面试通知': '#5b9862',
        '已拒绝': '#cf7774',
        '已候选': '#cc8e58',
        '未审核': '#90959e'
      }
      return statusColors[status] || '#90959e'
    },

    onCandidateSelected(candidate) {
      this.activeCandidateId = candidate.id
      // 跳转到简历页面
      this.$router.push({
        name: 'CandidateResume',
        params: { 
          positionId: this.positionId,
          candidateId: candidate.id
        }
      })
    },

    sendInterview(candidateId) {
      this.updateCandidateStatus(candidateId, '已发送面试通知')
    },

    rejectCandidate(candidateId) {
      this.updateCandidateStatus(candidateId, '已拒绝')
    },

    reserveCandidate(candidateId) {
      this.updateCandidateStatus(candidateId, '已候选')
    },

    updateCandidateStatus(candidateId, newStatus) {
      const candidate = this.allCandidates.find(c => c.id === candidateId)
      if (candidate) {
        candidate.status = newStatus
        this.filterCandidates()
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
  margin-top: 0px;
  background: #f5f5f5;
  min-height: calc(100vh - 105px);
}

.back-to-talent-pool-btn {
  position: fixed;
  top: 160px; /* 距离页面顶端超过105px */
  left: 480px; /* 距离页面左边超过320px */
  background: #4a7328;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 22px;
  font-weight: 540;
  cursor: pointer;
  z-index: 1001;
  transition: background-color 0.3s ease;
}

.back-to-talent-pool-btn:hover {
  background: #1d5e25;
}

.candidate-list-page {
  padding: 30px;
  min-height: calc(100vh - 105px);
  padding-top: 160px;
  max-width: 1400px;
  margin: 0 auto;
}

.candidate-row {
  cursor: pointer;
}

.header-left h1 {
  color: #325e21;
  margin: 0 0 10px 0;
  font-size: 28px;
}

.position-name {
  color: #666;
  font-size: 18px;
  margin: 0;
}

.user-info {
  color: #666;
  font-size: 16px;
}

.filters-container {
  position: fixed;
  top: 105px;
  left: 320px;
  right: 0;
  height: 150px;
  z-index: 1000;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: calc(1400px - 320px);
  margin: 0 auto;
}


.candidates-list {
  display: flex;
  flex-direction: column;
  gap: 22px;
  max-height: calc(100vh - 350px);
  margin-top:30px;
}

.candidate-row {
  background: white;
  border-radius: 12px;
  padding: 0px 25px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: center;
  gap: 40px;
  transition: all 0.3s ease;
  border: 1px solid #f0f0f0;
  min-width: 100%;
  min-height: 150px;
  margin-left: 0;
  
}

.candidate-row:hover {
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

.candidate-avatar {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #e9ecef;
}

.candidate-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
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
}

.candidate-info {
  flex: 1;
  min-width: 0;
}

.name-section {
  display: flex;
  align-items: center;
  gap: 15px;
}

.candidate-name {
  margin: 0;
  color: #333;
  font-size: 30px;
  font-weight: 600;
  padding-left: 100px;
}

.candidate-grade {
  color: #666;
  font-size: 22px;
  padding-left: 100px;
  font-weight: normal;
  margin-left:150px;
}

.candidate-status {
  font-size: 22px;
  font-weight: bold;
  white-space: nowrap;
  flex-shrink: 0;
  min-width: 120px;
  text-align: center;
}

.candidate-actions {
  display: flex;
  gap: 10px;
  flex-shrink: 0;
}

.btn-action {
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.filters {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 80px;
  padding: 0 30px;
  margin-top:40px;
}

.filter-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 15px;
}

.filter-item label {
  font-size: 22px;
  color: #333;
  font-weight: 500;
  white-space: nowrap;
}

.filter-input, .filter-select {
  padding: 12px 15px;
  border: 1px solid #d8d8d8;
  border-radius: 6px;
  font-size: 20px;
  min-width: 200px;
}

.filter-input:focus, .filter-select:focus {
  outline: none;
  border-color: #325e21;
}

.filter-btn {
  background: #325e21;
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 22px;
  font-weight: 500;
  transition: background-color 0.2s ease;
  white-space: nowrap;
}

.filter-btn:hover {
  background: #2a4e1b;
}


/* 响应式设计 */
@media (max-width: 768px) {
  .candidate-row {
    padding: 15px;
    gap: 15px;
    flex-wrap: wrap;
  }
  
  .candidate-avatar {
    width: 50px;
    height: 50px;
  }
  
  .candidate-name {
    font-size: 16px;
    padding-left: 0;
  }
  
  .candidate-grade {
    padding-left: 0;
  }
  
  .candidate-actions {
    order: 3;
    width: 100%;
    justify-content: center;
    margin-top: 10px;
  }
  
  .filters-container {
    left: 0;
    max-width: 100%;
  }
  
  .main-content {
    margin-left: 0;
  }
    .filters {
    flex-direction: column;
    gap: 20px;
  }
  
  .filter-item {
    width: 100%;
    justify-content: space-between;
  }
  
  .filter-input, .filter-select {
    min-width: 150px;
  }
}
</style>