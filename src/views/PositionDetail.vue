<template>
  <div class="position-detail-page">
    <!-- 面包屑导航 -->
    <div class="breadcrumb-wrapper">
      <div class="breadcrumb">
        <router-link to="/position-manage" class="breadcrumb-link">岗位管理</router-link>
        <span class="breadcrumb-separator">></span>
        <span class="breadcrumb-current">岗位详情</span>
      </div>
    </div>

    <div class="detail-layout">
      <!-- 左侧导航 - 固定位置 -->
      <div class="left-sidebar fixed-sidebar">
        <div class="sidebar-title">岗位详情</div>
        <div class="title-divider"></div>
        <div 
          v-for="section in sections" 
          :key="section.id"
          class="sidebar-item"
          :class="{ active: activeSection === section.id }"
          @click="scrollToSection(section.id)"
        >
          {{ section.name }}
        </div>
      </div>

      <!-- 右侧内容区域 - 充满剩余空间 -->
      <div class="right-content full-width">
        <!-- 基本信息区域（包含操作按钮） -->
        <div class="basic-info-section full-width-section" id="basic-section" ref="basicSection">
          <!-- 操作按钮放在右上角 -->
          <div class="action-buttons-top">
            <!-- 草稿状态 -->
            <button 
              v-if="positionStatus === 1" 
              class="delete-draft-btn"
              @click="handleDeleteDraft"
            >
              删除草稿
            </button>
            
            <!-- 已发布状态 -->
            <button 
              v-if="positionStatus === 20" 
              class="offline-btn"
              @click="handleOffline"
            >
              下线岗位
            </button>
            
            <!-- 编辑按钮 - 不同状态显示不同文字 -->
            <button 
              class="edit-btn"
              @click="handleEdit"
            >
              {{ getEditButtonText() }}
            </button>
          </div>

          <!-- 主要内容区域 -->
          <div class="main-content-area">
            <!-- 左侧：岗位信息 -->
            <div class="left-info-group">
              <!-- 岗位标题和标签 -->
              <div class="position-header">
                <h1 class="position-title">{{ positionData.title }}</h1>
                <div class="position-tags">
                  <span 
                    v-for="tag in positionData.tags" 
                    :key="tag.tag_id" 
                    class="tag"
                  >
                    {{ tag.tag_name }}
                  </span>
                </div>
              </div>
              
              <!-- 薪资、地点、类型 -->
              <div class="main-info-group">
                <div class="info-item-main">
                  <div class="info-content">
                    <div class="info-label">薪资范围</div>
                    <div class="info-value">{{ positionData.min_salary }}k - {{ positionData.max_salary }}k</div>
                  </div>
                </div>
                <div class="info-item-main">
                  <div class="info-content">
                    <div class="info-label">工作地点</div>
                    <div class="info-value">{{ getFullWorkAddress() }}</div>
                  </div>
                </div>
                <div class="info-item-main">
                  <div class="info-content">
                    <div class="info-label">招聘类型</div>
                    <div class="info-value">{{ getWorkNatureText(positionData.work_nature) }}</div>
                  </div>
                </div>
              </div>

              <!-- 详细信息 - 前三行一排，后两行一排 -->
              <div class="details-group-below">
                <!-- 前三行 -->
                <div class="details-row first-row">
                  <div class="info-item-detail">
                    <span class="detail-label">部门：</span>
                    <span class="detail-value">{{ positionData.department }}</span>
                  </div>
                  <div class="info-item-detail">
                    <span class="detail-label">招聘人数：</span>
                    <span class="detail-value">{{ positionData.headcount }}人</span>
                  </div>
                  <div class="info-item-detail">
                    <span class="detail-label">学历要求：</span>
                    <span class="detail-value">{{ getDegreeText(positionData.required_degree) }}</span>
                  </div>
                </div>
                
                <!-- 后两行 -->
                <div class="details-row second-row">
                  <div class="info-item-detail">
                    <span class="detail-label">岗位类别：</span>
                    <span class="detail-value">{{ getPositionTypeText(positionData.type) }}</span>
                  </div>
                  <div class="info-item-detail">
                    <span class="detail-label">要求到岗：</span>
                    <span class="detail-value">{{ formatDate(positionData.required_start_date) }}</span>
                  </div>
                  <div class="info-item-detail">
                    <span class="detail-label">招聘截止：</span>
                    <span class="detail-value">{{ formatDate(positionData.deadline) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 岗位描述 -->
        <div class="detail-section full-width-section" id="description-section" ref="descriptionSection">
          <div class="section-header">
            <h3 class="section-title">岗位描述</h3>
          </div>
          
          <div class="description-content">
            <div v-html="formatText(positionData.description)"></div>
          </div>
        </div>

        <!-- 岗位要求 -->
        <div class="detail-section full-width-section" id="requirement-section" ref="requirementSection">
          <div class="section-header">
            <h3 class="section-title">岗位要求</h3>
          </div>
          
          <div class="requirement-content">
            <div v-html="formatText(positionData.tech_requirements)"></div>
          </div>
        </div>

        <!-- 加分项 -->
        <div class="detail-section full-width-section" id="bonus-section" ref="bonusSection">
          <div class="section-header">
            <h3 class="section-title">加分项</h3>
          </div>
          
          <div class="bonus-content">
            <div v-html="formatText(positionData.bonus_points)"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ElMessage, ElMessageBox } from 'element-plus'

export default {
  name: 'PositionDetail',
  props: {
    id: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      activeSection: 'basic',
      sections: [
        { id: 'basic', name: '基本信息' },
        { id: 'description', name: '岗位描述' },
        { id: 'requirement', name: '岗位要求' },
        { id: 'bonus', name: '加分项' }
      ],
      positionStatus: 0,
      positionData: {
        title: '',
        tags: [],
        min_salary: 0,
        max_salary: 0,
        province_id: null,
        city_id: null,
        address_detail: '',
        work_nature: '',
        department: '',
        headcount: 0,
        type: null,
        required_degree: 0,
        required_start_date: '',
        deadline: '',
        description: '',
        tech_requirements: '',
        bonus_points: ''
      },
      provinceList: [],
      cityList: []
    }
  },
  mounted() {
    console.log('加载岗位详情，ID:', this.id)
    this.fetchPositionDetail()
    this.fetchLocations()
    this.setupScrollSpy()
  },
  methods: {
    async fetchPositionDetail() {
      try {
        const token = 'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiaHIiLCJpZCI6Miwic3ViIjoiY2hlbndwMjhAbWFpbDIuc3lzdS5lZHUuY24iLCJpYXQiOjE3NjM4OTE1MjUsImV4cCI6MTc2Mzk3NzkyNX0.gHZ5sW6CFoq_VxuqxvKEcEDvtLTpi8F02Qpz950AsaQ'
        
        const response = await fetch(`http://localhost:8080/api/hr/jobs/${this.id}`, {
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
        
        if (data.code === 200 && data.data) {
          const jobDetails = data.data.job_details
          this.positionData = {
            ...jobDetails
          }
          this.positionStatus = jobDetails.status
        }
      } catch (error) {
        console.error('获取岗位详情失败:', error)
        ElMessage.error('获取岗位详情失败')
      }
    },

    async fetchLocations() {
      try {
        const token = 'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiaHIiLCJpZCI6Miwic3ViIjoiY2hlbndwMjhAbWFpbDIuc3lzdS5lZHUuY24iLCJpYXQiOjE3NjM4OTE1MjUsImV4cCI6MTc2Mzk3NzkyNX0.gHZ5sW6CFoq_VxuqxvKEcEDvtLTpi8F02Qpz950AsaQ'
        
        const response = await fetch('http://localhost:8080/api/locations', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
        
        const data = await response.json()
        if (data.code === 200) {
          this.provinceList = data.data || []
        }
      } catch (error) {
        console.error('获取省市数据失败:', error)
      }
    },

    getWorkNatureText(workNature) {
      const natureMap = {
        1: '实习',
        2: '全职'
      }
      return natureMap[workNature] || '全职'
    },

    getPositionTypeText(type) {
      const typeMap = {
        1: '产品',
        2: '开发',
        3: '测试',
        4: '算法'
      }
      return typeMap[type] || '未知类型'
    },

    getDegreeText(degree) {
      const degreeMap = {
        0: '本科以上',
        1: '硕士以上',
        2: '博士以上'
      }
      return degreeMap[degree] || '本科以上'
    },

    getFullWorkAddress() {
  let address = ''
  
  // 查找省份名称
  if (this.positionData.province_id && this.provinceList.length > 0) {
    const province = this.provinceList.find(p => p.province_id === this.positionData.province_id)
    if (province) {
      address += province.name
      
      // 查找城市名称
      if (this.positionData.city_id && province.cities) {
        const city = province.cities.find(c => c.city_id === this.positionData.city_id)
        if (city) {
          address += city.name
        }
      }
    }
  }
  
  // 添加详细地址
  if (this.positionData.address_detail) {
    if (address) {
      address += this.positionData.address_detail
    } else {
      address = this.positionData.address_detail
    }
  }
  
  return address || '未设置工作地点'
},

    formatDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleDateString('zh-CN')
    },

    formatText(text) {
      if (!text) return ''
      // 将换行符转换为HTML换行
      return text.replace(/\n/g, '<br>')
    },

    getEditButtonText() {
      const statusMap = {
        1: '继续完善', // 草稿
        10: '申请修改', // 待审核
        20: '申请修改', // 已发布
        30: '重新修改' // 审核未通过
      }
      return statusMap[this.positionStatus] || '编辑'
    },

    // 滚动到指定区域
    scrollToSection(sectionId) {
      this.activeSection = sectionId
      const element = this.$refs[`${sectionId}Section`]
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        })
        
        // 添加高亮效果
        element.classList.add('highlight')
        setTimeout(() => {
          element.classList.remove('highlight')
        }, 2000)
      }
    },
    
    setupScrollSpy() {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.id.replace('-section', '')
            this.activeSection = sectionId
          }
        })
      }, {
        threshold: 0.5
      })

      // 观察所有章节
      Object.values(this.$refs).forEach(ref => {
        if (ref) observer.observe(ref)
      })
    },

    // 下线岗位
    async handleOffline() {
      try {
        await ElMessageBox.confirm('确定要下线该岗位吗？下线后将不再对外展示。', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })

        const token = 'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiaHIiLCJpZCI6Miwic3ViIjoiY2hlbndwMjhAbWFpbDIuc3lzdS5lZHUuY24iLCJpYXQiOjE3NjM4OTE1MjUsImV4cCI6MTc2Mzk3NzkyNX0.gHZ5sW6CFoq_VxuqxvKEcEDvtLTpi8F02Qpz950AsaQ'
        
        const response = await fetch(`http://localhost:8080/api/hr/jobs/${this.id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            status: 40 // 下线状态
          })
        })
        
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
        
        const data = await response.json()
        if (data.code === 200) {
          ElMessage.success('岗位已下线')
          this.positionStatus = 40
        } else {
          throw new Error(data.message || '下线失败')
        }
      } catch (error) {
        if (error !== 'cancel') {
          console.error('下线岗位失败:', error)
          ElMessage.error('下线岗位失败：' + error.message)
        }
      }
    },

    // 删除草稿
    async handleDeleteDraft() {
      try {
        await ElMessageBox.confirm('确定要删除该草稿吗？删除后将无法恢复。', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })

        const token = 'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiaHIiLCJpZCI6Miwic3ViIjoiY2hlbndwMjhAbWFpbDIuc3lzdS5lZHUuY24iLCJpYXQiOjE3NjM4OTE1MjUsImV4cCI6MTc2Mzk3NzkyNX0.gHZ5sW6CFoq_VxuqxvKEcEDvtLTpi8F02Qpz950AsaQ'
        
        const response = await fetch(`http://localhost:8080/api/hr/jobs/${this.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
        
        const data = await response.json()
        if (data.code === 200) {
          ElMessage.success('草稿已删除')
          this.$router.push('/position-manage')
        } else {
          throw new Error(data.message || '删除失败')
        }
      } catch (error) {
        if (error !== 'cancel') {
          console.error('删除草稿失败:', error)
          ElMessage.error('删除草稿失败：' + error.message)
        }
      }
    },

    // 编辑/继续完善
    handleEdit() {
      // 跳转到PositionForm并传递岗位ID，在PositionForm中处理数据回显
      this.$router.push({
        path: '/position-form',
        query: {
          positionId: this.id,
          isEdit: true
        }
      })
    }
  }
}
</script>

<style scoped>
/* 原有的样式保持不变，这里省略重复的CSS代码 */
.position-detail-page {
  padding: 30px;
  background: #f5f5f5;
  min-height: calc(100vh - 105px);
}

.breadcrumb-wrapper {
  position: fixed;
  top: 105px;
  left: 0;
  width: 100%;
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
  width: 97.3%;
  position: fixed;
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

/* 详情布局 */
.detail-layout {
  display: flex;
  gap: 20px;
  width: 100%;
  align-items: flex-start;
  padding-top: 85px;
}

/* 左侧边栏 - 固定位置 */
.fixed-sidebar {
  width: 280px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 30px;
  flex-shrink: 0;
  position: fixed;
  top: 220px;
  height: calc(100vh - 250px);
  overflow-y: auto;
}

.sidebar-title {
  font-size: 30px;
  font-weight: bold;
  color: #333;
  margin-bottom: 15px;
}

.title-divider {
  height: 1px;
  background: #d8d8d8;
  margin-bottom: 20px;
  width: 100%;
}

.sidebar-item {
  padding: 15px 0;
  cursor: pointer;
  font-size: 22px;
  color: #666;
  border-bottom: 1px solid #f0f0f0;
  transition: all 0.3s ease;
}

.sidebar-item:hover {
  color: #325e21;
  background: #f8f9fa;
}

.sidebar-item.active {
  color: #325e21;
  font-weight: bold;
  background: #f0f7f0;
}

/* 右侧内容 - 充满剩余空间 */
.full-width {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 0;
  margin-left: 300px;
}

.full-width-section {
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 40px;
  transition: all 0.3s ease;
  width: 100%;
  box-sizing: border-box;
}

.full-width-section.highlight {
  box-shadow: 0 0 0 3px #325e21;
}

/* 基本信息区域样式 */
.basic-info-section {
  position: relative;
  padding: 40px;
}

/* 顶部操作按钮 */
.action-buttons-top {
  position: absolute;
  top: 30px;
  right: 30px;
  display: flex;
  gap: 30px;
}

.offline-btn, .delete-draft-btn, .edit-btn {
  padding: 10px 30px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 22px;
  font-weight: 500;
  transition: all 0.3s ease;
  min-width: 100px;
}

.offline-btn {
  background: #dc3545;
  color: white;
}

.offline-btn:hover {
  background: #c82333;
}

.delete-draft-btn {
  background: #6c757d;
  color: white;
}

.delete-draft-btn:hover {
  background: #5a6268;
}

.edit-btn {
  background: #325e21;
  color: white;
}

.edit-btn:hover {
  background: #2a4e1b;
}

/* 主要内容区域 */
.main-content-area {
  display: flex;
  gap: 60px;
  align-items: flex-start;
}

/* 左侧信息组 */
.left-info-group {
  flex: 1;
  margin-top: 70px;
}

/* 岗位标题和标签 */
.position-header {
  margin-bottom: 30px;
  margin-top: -35px;
  margin-left: 20px;
}

.position-title {
  color: #325e21;
  margin: 0 0 20px 0;
  font-size: 36px;
  font-weight: bold;
}

.position-tags {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.tag {
  background: #e8f5e8;
  color: #325e21;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 18px;
  font-weight: 500;
}

/* 主要信息组 */
.main-info-group {
  display: flex;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 40px;
  width: fit-content;
  margin-left: -20px;
  padding: 0;
}

.info-item-main {
  padding: 25px 40px;
  position: relative;
  text-align: left;
  flex: none;
}

.info-item-main:not(:last-child)::after {
  content: '';
  position: absolute;
  right: 0;
  top: 25px;
  bottom: 25px;
  width: 1px;
  background: #d8d8d8;
}

.info-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.info-label {
  font-size: 26px;
  color: #333;
  margin-bottom: 8px;
  font-weight: 550;
}

.info-value {
  font-size: 24px;
  font-weight: bold;
  color: #ff6b35;
}

.details-group-below {
  width: 100%;
  margin-left: 20px;
}

.details-row {
  display: flex;
  gap: 10px;
  margin-bottom: 25px;
}

.details-row.first-row {
  justify-content: flex-start;
  gap: 0px;
}

.details-row.second-row {
  justify-content: flex-start;
  gap: 0px;
}

.info-item-detail {
  display: flex;
  align-items: center;
  padding: 12px 0;
  flex: none;
  width: 400px;
}

.detail-label {
  color: #346024;
  font-weight: 550;
  font-size: 24px;
  min-width: 120px;
}

.detail-value {
  color: #333;
  font-weight: 500;
  font-size: 24px;
  margin-left: 10px;
}

.section-header {
  margin-bottom: 25px;
}

.section-title {
  color: #325e21;
  margin: 0;
  font-size: 28px;
  font-weight: bold;
  border-left: 4px solid #325e21;
  padding-left: 12px;
}

.description-content, .requirement-content, .bonus-content {
  color: #333;
  line-height: 1.7;
  font-size: 20px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .detail-layout {
    flex-direction: column;
  }
  
  .fixed-sidebar {
    width: 100%;
    position: static;
    height: auto;
  }
  
  .full-width {
    margin-left: 0;
  }
  
  .action-buttons-top {
    position: static;
    justify-content: center;
    margin-bottom: 20px;
  }
  
  .main-content-area {
    flex-direction: column;
    gap: 30px;
  }
  
  .main-info-group {
    flex-direction: column;
  }
  
  .info-item-main:not(:last-child)::after {
    display: none;
  }
  
  .info-item-main:not(:last-child) {
    border-bottom: 1px solid #d8d8d8;
  }
  
  .details-row {
    flex-direction: column;
    gap: 15px;
  }
  
  .details-row.second-row {
    gap: 15px;
  }
  
  .info-item-detail {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
  
  .detail-label, .detail-value {
    text-align: left;
  }
}
</style>