<template>
  <div class="candidate-layout">
    <CandidateSidebar 
      :candidates="sidebarCandidates"
      :activeCandidateId="candidateId"
      @candidate-selected="onCandidateSelected"
    />
    
    <div class="main-content">
      <div class="resume-page">
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
          <div class="resume-viewer">
            <div class="resume-container">
              
              <div class="pdf-viewer" v-if="pdfBlobUrl">
                <iframe 
                  :src="pdfBlobUrl" 
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
          
          <div class="resume-actions" v-if="showActionButtons">
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

            <template v-else-if="currentCandidate.resume_status === '候选人'">
               <button class="btn-cancel" @click="updateStatus('已投递')">
                <span class="btn-icon">⭐ 取消候选</span>
              </button>
              <button class="btn-interview" @click="updateStatus('面试邀请')">
                <span class="btn-icon">📧 发送面试通知</span>
              </button>
              <button class="btn-reject" @click="updateStatus('拒绝')">
                <span class="btn-icon">❌ 拒绝</span>
              </button>
             
            </template>

            <template v-else-if="currentCandidate.resume_status === '面试邀请'">
              <button class="btn-pass" @click="updateStatus('通过')">
                <span class="btn-icon">✅ 通过</span>
              </button>
              <button class="btn-reject" @click="updateStatus('拒绝')">
                <span class="btn-icon">❌ 拒绝</span>
              </button>
            </template>

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
      resumeUrl: '', // 存储原始 URL，不用于 iframe src
      sidebarCandidates: [],
      baseUrl: 'http://localhost:8080',
      pdfBlobUrl: null // 用于存储PDF的Blob URL，用于 iframe src
    }
  },
  computed: {
    positionId() {
      return this.$route.params.positionId
    },
    candidateId() {
      return this.$route.params.candidateId
    },
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
      // 切换候选人时，需要重新加载数据和简历
      this.loadCandidateData()
      this.loadResumeUrl() // loadResumeUrl 会清理旧的 pdfBlobUrl 并加载新的
    }
  },
  beforeUnmount() {
    // 清理Blob URL防止内存泄漏
    if (this.pdfBlobUrl) {
      URL.revokeObjectURL(this.pdfBlobUrl)
    }
  },
  methods: {
    async loadCandidateData() {
      try {
        const token = localStorage.getItem('token')
        
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
        const token = localStorage.getItem('token')
        
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
                avatar: candidate.avatar_url || ''
              }))
          }
        }
      } catch (error) {
        console.error('获取侧边栏候选人失败:', error)
      }
    },

    async loadResumeUrl() {
      try {
        const token = localStorage.getItem('token')
        
        // 每次加载新简历时，先清理旧的 blob URL 和 resumeUrl
        this.fallbackToImage() // 清理 pdfBlobUrl
        this.resumeUrl = '' 
        
        const response = await fetch(`http://localhost:8080/api/hr/applications/${this.candidateId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        
        if (response.ok) {
          const data = await response.json()
          if (data.code === 200 && data.data && data.data.resume_url) {
            this.resumeUrl = data.data.resume_url // 存储原始URL
            // 获取 URL 后，立即开始加载 PDF 内容并创建 Blob URL
            await this.loadPdfContent()
          } else {
             console.error('获取简历URL失败: 响应数据不完整')
             this.fallbackToImage()
          }
        } else {
          console.error('获取简历URL失败:', response.status)
          this.fallbackToImage()
        }
      } catch (error) {
        console.error('获取简历URL失败:', error)
        this.fallbackToImage()
      }
    },

    async loadPdfContent() {
      // 1. 清理之前的Blob URL
      if (this.pdfBlobUrl) {
        URL.revokeObjectURL(this.pdfBlobUrl)
        this.pdfBlobUrl = null
      }

      // 2. 构建完整的PDF URL
      let pdfUrl = this.resumeUrl
      if (!pdfUrl) {
        console.error('PDF URL为空')
        this.fallbackToImage()
        return
      }
      
      // 检查并拼接相对路径
      if (!pdfUrl.startsWith('http')) {
        // 确保拼接时只有一个斜杠
        const path = pdfUrl.startsWith('/') ? pdfUrl.substring(1) : pdfUrl
        const base = this.baseUrl.endsWith('/') ? this.baseUrl.slice(0, -1) : this.baseUrl
        pdfUrl = `${base}/${path}`
      }

      try {
        const token = localStorage.getItem('token')
        
        // 3. 直接下载PDF内容
        const response = await fetch(pdfUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/pdf'
          }
        })
        
        if (response.ok) {
          const blob = await response.blob()
          
          // 4. 检查是否为PDF并创建Blob URL
          if (blob.type === 'application/pdf') {
            this.pdfBlobUrl = URL.createObjectURL(blob)
            console.log('PDF Blob URL 创建成功:', this.pdfBlobUrl)
          } else {
            console.error('返回的内容不是PDF格式:', blob.type)
            this.fallbackToImage()
          }
        } else {
          console.error('下载PDF失败:', response.status, response.statusText)
          this.fallbackToImage()
        }
      } catch (error) {
        console.error('加载PDF内容失败:', error)
        this.fallbackToImage()
      }
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

    // 在新窗口打开PDF
    openPdfInNewWindow() {
      if (this.pdfBlobUrl) {
        window.open(this.pdfBlobUrl, '_blank')
      } else {
        this.downloadPdf()
      }
    },

    // 下载PDF (逻辑保持不变，因为它需要构造完整的下载URL)
    async downloadPdf() {
      try {
        const token = localStorage.getItem('token')
        let pdfUrl = this.resumeUrl
        
        if (pdfUrl && !pdfUrl.startsWith('http')) {
          if (pdfUrl.startsWith('/')) {
            pdfUrl = this.baseUrl + pdfUrl
          } else {
            pdfUrl = this.baseUrl + '/' + pdfUrl
          }
        }
        
        if (pdfUrl) {
          const response = await fetch(pdfUrl, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
          
          if (response.ok) {
            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `${this.currentCandidate.candidate_name}_简历.pdf`
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            window.URL.revokeObjectURL(url)
          } else {
            console.error('下载PDF失败:', response.status)
            alert('下载简历失败')
          }
        }
      } catch (error) {
        console.error('下载PDF失败:', error)
        alert('下载简历失败')
      }
    },

    // 备用方案：显示图片占位符，同时清理 Blob URL
    fallbackToImage() {
      if (this.pdfBlobUrl) {
        URL.revokeObjectURL(this.pdfBlobUrl)
      }
      this.pdfBlobUrl = null
    },

    async updateStatus(newStatus) {
      try {
        const token = localStorage.getItem('token')
        
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

    getStatusText(status) {
      const statusMap = {
        '面试邀请': '发送面试通知',
        '拒绝': '拒绝',
        '候选人': '列为候选人',
        '通过': '通过',
        '已投递': '取消候选'
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
  box-sizing: border-box;
}

.breadcrumb {
  background: white;
  padding: 20px 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  font-size: 20px;
  box-sizing: border-box;
  width: calc(100vw - 320px - 80px); 
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
  /* 关键修改：确保没有冲突的高度限制 */
  height: auto; 
  min-height: 0;
}

/* 简历查看器 */
.resume-viewer {
  flex: 1;
  min-width: 0;
  height: auto; 
}

/* 核心修改：让容器拥有固定的高度，并允许内容溢出滚动 */
.resume-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  padding: 0;
  text-align: center;
  display: flex;
  align-items: flex-start; 
  justify-content: center;
  
  /* 关键修改 1: 设置明确的高度 */
  height: calc(100vh - 200px); 
  
  /* 关键修改 2: 设置最大高度和最小高度 */
  max-height: calc(100vh - 200px); 
  min-height: 600px; 
  
  width: 100%;

  /* 启用垂直滚动条 */
  overflow-y: auto; 
  overflow-x: hidden;
}

.pdf-viewer {
  width: 100%;
  /* 关键修改：高度继承自 .resume-container 的固定高度 */
  height: 100%; 
}

.pdf-viewer iframe {
  width: 100%;
  height: 100%;
}

.pdf-placeholder {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  min-height: 600px; 
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

.btn-cancel {
  background: #cc8e58;
  color: white;
}

.btn-cancel:hover {
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
    min-height: 500px; /* 调整最小高度，防止在小屏幕上过小 */
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
    height: calc(100vh - 200px); /* 确保高度设置 */
    min-height: 1000px; 
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