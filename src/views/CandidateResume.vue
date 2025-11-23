<template>
  <div class="candidate-layout">
    <!-- 共享的侧边栏 -->
    <CandidateSidebar 
      :candidates="sidebarCandidates"
      :activeCandidateId="candidateId"
      @candidate-selected="onCandidateSelected"
    />
    
    <!-- 简历内容区域 -->
    <div class="main-content">
      <div class="resume-page">
        <!-- 面包屑导航 -->
        <div class="breadcrumb-wrapper">
          <div class="breadcrumb">
            <router-link to="/talent-pool" class="breadcrumb-link">人才库</router-link>
            <span class="breadcrumb-separator">></span>
            <router-link 
              :to="{ name: 'CandidateList', params: { positionId: positionId } }" 
              class="breadcrumb-link"
            >
              {{ currentPosition.title }} - 候选人列表
            </router-link>
            <span class="breadcrumb-separator">></span>
            <span class="breadcrumb-current">{{ currentCandidate.candidate_name }} - 简历</span>
          </div>
        </div>

        <div class="resume-content">
          <!-- 简历查看器 -->
          <div class="resume-viewer">
            <div class="resume-container">
              <div class="pdf-viewer" v-if="resumeUrl">
                <iframe 
                  :src="resumeUrl" 
                  width="100%" 
                  height="100%"
                  frameborder="0"
                ></iframe>
              </div>
              <div class="pdf-placeholder" v-else>
                <p>无法加载简历PDF</p>
                <img src="@/assets/resume.png" :alt="currentCandidate.candidate_name + '的简历'">
              </div>
            </div>
          </div>
          
          <!-- 操作按钮 - 根据状态动态显示 -->
          <div class="resume-actions" v-if="showActionButtons">
            <!-- 已投递状态：3个按钮 -->
            <template v-if="currentCandidate.resume_status === '已投递'">
              <button class="btn-interview" @click="updateStatus('面试邀请')">
                <span class="btn-icon">📧 发送面试通知</span>
              </button>
              <button class="btn-reject" @click="updateStatus('拒绝')">
                <span class="btn-icon">❌ 拒绝</span>
              </button>
              <button class="btn-reserve" @click="updateStatus('候选人')">
                <span class="btn-icon">⭐ 列为候选人</span>
              </button>
            </template>

            <!-- 候选人状态：2个按钮 -->
            <template v-else-if="currentCandidate.resume_status === '候选人'">
              <button class="btn-interview" @click="updateStatus('面试邀请')">
                <span class="btn-icon">📧 发送面试通知</span>
              </button>
              <button class="btn-reject" @click="updateStatus('拒绝')">
                <span class="btn-icon">❌ 拒绝</span>
              </button>
            </template>

            <!-- 面试邀请状态：2个按钮 -->
            <template v-else-if="currentCandidate.resume_status === '面试邀请'">
              <button class="btn-pass" @click="updateStatus('通过')">
                <span class="btn-icon">✅ 通过</span>
              </button>
              <button class="btn-reject" @click="updateStatus('拒绝')">
                <span class="btn-icon">❌ 拒绝</span>
              </button>
            </template>

            <!-- 拒绝状态：无按钮 -->
            <!-- 通过状态：无按钮 -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CandidateSidebar from '../components/CandidateSiderBar.vue'

export default {
  name: 'CandidateResume',
  components: {
    CandidateSidebar
  },
  data() {
    return {
      currentCandidate: {
        candidate_name: '',
        grade: '',
        degree: '',
        resume_status: ''
      },
      currentPosition: { title: '加载中...' },
      resumeUrl: '',
      sidebarCandidates: []
    }
  },
  computed: {
    positionId() {
      return this.$route.params.positionId
    },
    candidateId() {
      return this.$route.params.candidateId
    },
    // 计算是否显示操作按钮
    showActionButtons() {
      const status = this.currentCandidate.resume_status
      return status === '已投递' || status === '候选人' || status === '面试邀请'
    }
  },
  mounted() {
    this.loadCandidateData()
    this.loadResumeUrl()
    this.loadPositionData()
    this.loadSidebarCandidates()
  },
  watch: {
    candidateId() {
      this.loadCandidateData()
      this.loadResumeUrl()
    }
  },
  methods: {
    async loadCandidateData() {
      try {
        const token = 'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiaHIiLCJpZCI6Miwic3ViIjoiY2hlbndwMjhAbWFpbDIuc3lzdS5lZHUuY24iLCJpYXQiOjE3NjM4OTE1MjUsImV4cCI6MTc2Mzk3NzkyNX0.gHZ5sW6CFoq_VxuqxvKEcEDvtLTpi8F02Qpz950AsaQ'
        
        // 获取候选人详细信息
        const response = await fetch(`http://localhost:8080/api/hr/talentpool/job/list/${this.positionId}?page=1&page_size=100`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        
        if (response.ok) {
          const data = await response.json()
          if (data.code === 200 && data.data) {
            const candidate = data.data.candidate_list.find(c => 
              c.application_id.toString() === this.candidateId.toString()
            )
            if (candidate) {
              this.currentCandidate = candidate
            }
          }
        }
      } catch (error) {
        console.error('获取候选人信息失败:', error)
      }
    },

    async loadSidebarCandidates() {
      try {
        const token = 'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiaHIiLCJpZCI6Miwic3ViIjoiY2hlbndwMjhAbWFpbDIuc3lzdS5lZHUuY24iLCJpYXQiOjE3NjM4OTE1MjUsImV4cCI6MTc2Mzk3NzkyNX0.gHZ5sW6CFoq_VxuqxvKEcEDvtLTpi8F02Qpz950AsaQ'
        
        const response = await fetch(`http://localhost:8080/api/hr/talentpool/job/list/${this.positionId}?page=1&page_size=100`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        
        if (response.ok) {
          const data = await response.json()
          if (data.code === 200 && data.data) {
            this.sidebarCandidates = data.data.candidate_list
              .filter(candidate => candidate.resume_status === '候选人')
              .map(candidate => ({
                id: candidate.application_id,
                name: candidate.candidate_name,
                status: candidate.resume_status,
                avatar: candidate.avatar_url || '' // 这里要传递头像URL
              }))
          }
        }
      } catch (error) {
        console.error('获取侧边栏候选人失败:', error)
      }
    },

    async loadResumeUrl() {
      try {
        const token = 'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiaHIiLCJpZCI6Miwic3ViIjoiY2hlbndwMjhAbWFpbDIuc3lzdS5lZHUuY24iLCJpYXQiOjE3NjM4OTE1MjUsImV4cCI6MTc2Mzk3NzkyNX0.gHZ5sW6CFoq_VxuqxvKEcEDvtLTpi8F02Qpz950AsaQ'
        
        const response = await fetch(`http://localhost:8080/api/hr/applications/${this.candidateId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        
        if (response.ok) {
          const data = await response.json()
          if (data.code === 200 && data.data) {
            this.resumeUrl = data.data.resume_url
          }
        }
      } catch (error) {
        console.error('获取简历URL失败:', error)
      }
    },

    async loadPositionData() {
      try {
        const token = 'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiaHIiLCJpZCI6Miwic3ViIjoiY2hlbndwMjhAbWFpbDIuc3lzdS5lZHUuY24iLCJpYXQiOjE3NjM4OTE1MjUsImV4cCI6MTc2Mzk3NzkyNX0.gHZ5sW6CFoq_VxuqxvKEcEDvtLTpi8F02Qpz950AsaQ'
        
        const response = await fetch(`http://localhost:8080/api/hr/jobs/${this.positionId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        
        if (response.ok) {
          const data = await response.json()
          if (data.code === 200 && data.data) {
            this.currentPosition = data.data.job_details || { title: '未知岗位' }
          }
        }
      } catch (error) {
        console.error('获取岗位信息失败:', error)
        this.currentPosition = { title: '未知岗位' }
      }
    },

    getDegreeText(degree) {
      const degreeMap = {
        'bachelor': '本科',
        'master': '硕士',
        'doctor': '博士'
      }
      return degreeMap[degree] || degree
    },

    onCandidateSelected(candidate) {
      this.$router.push({
        name: 'CandidateResume',
        params: { 
          positionId: this.positionId,
          candidateId: candidate.id
        }
      })
    },

    goBack() {
      this.$router.push({
        name: 'CandidateList',
        params: { positionId: this.positionId }
      })
    },

    // 更新候选人状态
    // 更新候选人状态
async updateStatus(newStatus) {
  try {
    const token = 'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiaHIiLCJpZCI6Miwic3ViIjoiY2hlbndwMjhAbWFpbDIuc3lzdS5lZHUuY24iLCJpYXQiOjE3NjM4OTE1MjUsImV4cCI6MTc2Mzk3NzkyNX0.gHZ5sW6CFoq_VxuqxvKEcEDvtLTpi8F02Qpz950AsaQ'
    
    const response = await fetch(`http://localhost:8080/api/hr/applications/${this.candidateId}/status`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        status: newStatus
      })
    })
    
    if (response.ok) {
      const data = await response.json()
      if (data.code === 200) {
        // 跳转回候选人列表页面，并传递成功消息
        this.$router.push({
          name: 'CandidateList',
          params: { 
            positionId: this.positionId
          },
          query: {
            success: 'true',
            message: `已成功${this.getStatusText(newStatus)}：${this.currentCandidate.candidate_name}`,
            candidateName: this.currentCandidate.candidate_name,
            newStatus: newStatus
          }
        })
      } else {
        alert('操作失败：' + (data.message || '未知错误'))
      }
    } else {
      alert('操作失败：网络请求错误')
    }
  } catch (error) {
    console.error('更新状态失败:', error)
    alert('操作失败：网络错误')
  }
},

    // 获取状态对应的中文文本
    getStatusText(status) {
      const statusMap = {
        '面试邀请': '发送面试通知',
        '拒绝': '拒绝',
        '候选人': '列为候选人',
        '通过': '通过'
      }
      return statusMap[status] || status
    }
  }
}
</script>


<style scoped>
.btn-pass {
  background: #5b9862;
  color: white;
}

.btn-pass:hover {
  background: #4a7c2f;
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(91, 152, 98, 0.4);
}

.candidate-layout {
  display: flex;
  min-height: calc(100vh - 105px);
}

.main-content {
  margin-left: 320px;
  flex: 1;
  background: #f5f5f5;
  margin-top: 0px;
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

.resume-page {
  padding: 30px;
  min-height: calc(100vh - 105px);
  margin: 0 auto;
  max-width: 1400px;
  padding-top: 120px;
}



.resume-content {
  display: flex;
  gap: 40px;
  align-items: flex-start;
  position: relative;
  padding-left: 0px;
  margin-left: 0;
  height: calc(100vh - 280px); /* 动态计算高度 */
  min-height: 60000px; /* 最小高度保证 */
}

/* 简历查看器 */
.resume-viewer {
  flex: 1;
  min-width: 0;
  margin-left: 0;
  height: 100%;
}

.resume-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  padding: 0;
  text-align: center;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  min-height: 1200px; /* 增加高度 */
  max-height: calc(100vh - 200px);
  width: 100%;
  height: 100%;
  margin-left: 0;
}

.pdf-viewer {
  width: 100%;
  height: 100%;
  min-height: 1200px; /* 增加高度 */
}

.pdf-placeholder {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  min-height: 1200px; /* 增加高度 */
}

.pdf-placeholder img {
  width: auto;
  height: auto;
  max-width: 900px;
  max-height: none;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  object-fit: contain;
  margin-left: 0;
}

.pdf-placeholder p {
  font-size: 18px;
  color: #666;
  margin-bottom: 20px;
}

/* 操作按钮样式 - 固定位置 */
.resume-actions {
  position: sticky;
  top: 150px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 250px;
  flex-shrink: 0;
  margin-right: -220px;
  margin-top: 300px;
}

.resume-actions button {
  padding: 20px 25px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 10px;
  font-weight: 550;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  transition: all 0.3s ease;
  width: 120%;
  min-height: 0px;
  justify-content: center;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-right: 10px;
}

.btn-interview {
  background: #5b9862;
  color: white;
}

.btn-interview:hover {
  background: #4a7c2f;
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(91, 152, 98, 0.4);
}

.btn-reject {
  background: #cf7774;
  color: white;
}

.btn-reject:hover {
  background: #b86562;
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(207, 119, 116, 0.4);
}

.btn-reserve {
  background: #cc8e58;
  color: white;
}

.btn-reserve:hover {
  background: #b87c46;
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(204, 142, 88, 0.4);
}

.btn-icon {
  font-size: 24px;
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
  
  .resume-page {
    padding: 20px;
    padding-top: 120px;
  }
  
  .resume-content {
    flex-direction: column;
    gap: 20px;
  }
  
  .resume-actions {
    position: static;
    width: 100%;
    flex-direction: row;
    margin-right: 0;
    margin-top: 20px;
  }
  
  .resume-actions button {
    min-height: 10px;
    padding: 15px 20px;
  }
  
  .resume-container {
    padding: 0;
    min-height: 800px;
    max-height: 60vh;
  }
  
  .pdf-placeholder img {
    max-width: 100%;
  }
}

/* 大屏幕优化 */
@media (min-width: 1200px) {
  .main-content {
    padding-left: 0;
  }
  
  .resume-container {
    min-height: 1400px;
    max-height: 85vh;
  }
  
  .pdf-placeholder img {
    max-width: 1000px;
  }
}

/* 超大屏幕优化 */
@media (min-width: 1600px) {
  .pdf-placeholder img {
    max-width: 1100px;
  }
  
  .resume-actions {
    width: 220px;
  }
  
  .resume-actions button {
    padding: 22px 28px;
    min-height: 20px;
  }
}
</style>