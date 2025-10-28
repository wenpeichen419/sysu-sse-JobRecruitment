<template>
  <div class="candidate-layout">
    <!-- 共享的侧边栏 -->
    <CandidateSidebar 
      :candidates="candidates"
      :activeCandidateId="$route.params.candidateId"
      @candidate-selected="onCandidateSelected"
    />
    
    <!-- 简历内容区域 -->
    <div class="main-content">
      <div class="resume-page">
        <!-- 返回按钮 -->
        <div class="back-header">
          <button class="back-btn" @click="goBack">
            <span class="back-icon">←</span>
            返回候选人列表
          </button>
        </div>
        
        <div class="resume-header">
          <h1>{{ currentCandidate.name }} - 简历</h1>
          <p>{{ currentCandidate.grade }} · {{ currentCandidate.type }}</p>
        </div>
        
        <div class="resume-content">
          <!-- 简历查看器 -->
          <div class="resume-viewer">
            <div class="resume-container">
              <div class="pdf-placeholder">
                <img src="@/assets/resume.png" :alt="currentCandidate.name + '的简历'">
              </div>
            </div>
          </div>
          
          <!-- 操作按钮 - 固定位置 -->
          <div class="resume-actions">
            <button class="btn-interview" @click="sendInterview">
              <span class="btn-icon">📧 发送面试通知</span>
            </button>
            <button class="btn-reject" @click="rejectCandidate">
              <span class="btn-icon">❌ 拒绝</span>
            </button>
            <button class="btn-reserve" @click="reserveCandidate">
              <span class="btn-icon">⭐ 列为候选人</span>
            </button>
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
  props: {
    positionId: {
      type: [String, Number],
      required: true
    },
    candidateId: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      candidates: [],
      currentCandidate: {}
    }
  },
  mounted() {
    this.loadCandidates()
    this.loadCurrentCandidate()
  },
  methods: {
    loadCandidates() {
      // 这里应该从API获取数据，暂时使用模拟数据
      this.candidates = [
        {
          id: '487',
          name: 'ChoAi',
          grade: '2020级本科生',
          type: '实习生',
          status: '已发送面试通知',
          resumeUrl: '/resumes/487.pdf',
          avatar: ''
        },
        {
          id: '488',
          name: 'DMD',
          grade: '2023级本科生',
          type: '应届生',
          status: '已拒绝',
          resumeUrl: '/resumes/488.pdf',
          avatar: ''
        },
        {
          id: '489',
          name: 'Jelly',
          grade: '2022级本科生',
          type: '实习生',
          status: '未审核',
          resumeUrl: '/resumes/489.pdf',
          avatar: ''
        },
        {
          id: '490',
          name: 'XMX',
          grade: '2021级研究生',
          type: '应届生',
          status: '已候选',
          resumeUrl: '/resumes/490.pdf',
          avatar: ''
        },
        {
          id: '491',
          name: '张三',
          grade: '2023级本科生',
          type: '实习生',
          status: '未审核',
          resumeUrl: '/resumes/491.pdf',
          avatar: ''
        }
      ]
    },

    loadCurrentCandidate() {
      this.currentCandidate = this.candidates.find(c => c.id === this.candidateId.toString()) || {}
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

    sendInterview() {
      this.updateCandidateStatus('已发送面试通知')
      alert('已发送面试通知')
    },

    rejectCandidate() {
      this.updateCandidateStatus('已拒绝')
      alert('已拒绝该候选人')
    },

    reserveCandidate() {
      this.updateCandidateStatus('已候选')
      alert('已列为候选人')
    },

    updateCandidateStatus(newStatus) {
      const candidate = this.candidates.find(c => c.id === this.candidateId.toString())
      if (candidate) {
        candidate.status = newStatus
        // 这里应该调用API更新状态
      }
    }
  },
  watch: {
    candidateId() {
      this.loadCurrentCandidate()
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
  margin-left: 80px;
  flex: 1;
  background: #f5f5f5;
  margin-top: 0px;
  padding-left: 20px;
  min-height: calc(100vh - 105px);
}

.resume-page {
  padding: 30px;
  min-height: calc(100vh - 105px);
  margin: 0 auto;
  max-width: 1400px;
}

/* 返回按钮样式 */
.back-header {
  margin-bottom: 20px;
  margin-left: 0px;
}

.back-btn {
  background: #325e21;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 18px;
  font-weight: 550;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
}

.back-btn:hover {
  background: #2a4e1b;
  transform: translateY(-1px);
}

.back-icon {
  font-size: 18px;
}

.resume-header {
  margin-bottom: 30px;
  text-align: center;
  padding-left: 0px;
  margin-left: -50px;;
}

.resume-header h1 {
  color: #325e21;
  margin: 0 0 10px 0;
  font-size: 28px;
}

.resume-header p {
  color: #666;
  font-size: 18px;
  margin: 0;
  padding-left: 0;
}

.resume-content {
  display: flex;
  gap: 40px;
  align-items: flex-start;
  position: relative;
  padding-left: 0px;
  margin-left: 0;
}

/* 简历查看器 */
.resume-viewer {
  flex: 1;
  min-width: 0;
  margin-left: 0;
}

.resume-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  overflow: auto;
  padding: 40px 50px;
  text-align: center;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  min-height: 800px;
  max-height: calc(100vh - 300px);
  width: 100%;
  margin-left: 0;
}

.pdf-placeholder {
  width: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: center;
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

/* 操作按钮样式 - 固定位置 */
.resume-actions {
  position: sticky;
  top: 150px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 200px;
  flex-shrink: 0;
  margin-right: -220px;
  margin-top: 130px;
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
    padding-left: 15px;
    margin-left: 0;
  }
  
  .resume-page {
    padding: 20px;
    
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
  }
  
  .resume-actions button {
    min-height: 10px;
    padding: 15px 20px;
  }
  
  .resume-container {
    padding: 20px;
    min-height: 500px;
    max-height: 60vh;
    
  }
  
  .pdf-placeholder img {
    max-width: 100%;
  }
}

/* 大屏幕优化 */
@media (min-width: 1200px) {
  .main-content {
    padding-left: 40px;
  }
  
  .resume-container {
    min-height: 700px;
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