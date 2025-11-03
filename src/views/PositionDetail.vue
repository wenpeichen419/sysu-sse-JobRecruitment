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
            <button 
              v-if="positionStatus === 'published'" 
              class="offline-btn"
              @click="handleOffline"
            >
              下线岗位
            </button>
            <button 
              v-else-if="positionStatus === 'draft'" 
              class="delete-draft-btn"
              @click="handleDeleteDraft"
            >
              删除草稿
            </button>
            
            <button 
              class="edit-btn"
              @click="handleEdit"
            >
              {{ positionStatus === 'published' ? '修改' : '继续完善' }}
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
                    :key="tag" 
                    class="tag"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>
              
              <!-- 薪资、地点、类型 -->
              <div class="main-info-group">
                <div class="info-item-main">
                  <div class="info-content">
                    <div class="info-label">薪资范围</div>
                    <div class="info-value">{{ positionData.salaryRange }}</div>
                  </div>
                </div>
                <div class="info-item-main">
                  <div class="info-content">
                    <div class="info-label">工作地点</div>
                    <div class="info-value">{{ positionData.location }}</div>
                  </div>
                </div>
                <div class="info-item-main">
                  <div class="info-content">
                    <div class="info-label">招聘类型</div>
                    <div class="info-value">{{ positionData.category }}</div>
                  </div>
                </div>
              </div>

              <!-- 详细信息 - 前三行一排，后两行一排 -->
              <div class="details-group-below">
                <!-- 前三行 -->
                <div class="details-row first-row">
                  <div class="info-item-detail">
                    <span class="detail-label">职能类别：</span>
                    <span class="detail-value">{{ positionData.functionCategory }}</span>
                  </div>
                  <div class="info-item-detail">
                    <span class="detail-label">部门：</span>
                    <span class="detail-value">{{ positionData.department }}</span>
                  </div>
                  <div class="info-item-detail">
                    <span class="detail-label">招聘人数：</span>
                    <span class="detail-value">{{ positionData.recruitCount }}人</span>
                  </div>
                </div>
                
                <!-- 后两行 -->
                <div class="details-row second-row">
                  <div class="info-item-detail">
                    <span class="detail-label">要求到岗：</span>
                    <span class="detail-value">{{ positionData.deadline }}</span>
                  </div>
                  <div class="info-item-detail">
                    <span class="detail-label">招聘截止：</span>
                    <span class="detail-value">{{ positionData.recruitDeadline }}</span>
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
            <p>{{ positionData.description }}</p>
            <ul v-if="positionData.descriptionItems && positionData.descriptionItems.length">
              <li v-for="(item, index) in positionData.descriptionItems" :key="index">
                {{ item }}
              </li>
            </ul>
          </div>
        </div>

        <!-- 岗位要求 -->
        <div class="detail-section full-width-section" id="requirement-section" ref="requirementSection">
          <div class="section-header">
            <h3 class="section-title">岗位要求</h3>
          </div>
          
          <div class="requirement-content">
            <ul v-if="positionData.requirements && positionData.requirements.length">
              <li v-for="(req, index) in positionData.requirements" :key="index">
                {{ req }}
              </li>
            </ul>
          </div>
        </div>

        <!-- 加分项 -->
        <div class="detail-section full-width-section" id="bonus-section" ref="bonusSection">
          <div class="section-header">
            <h3 class="section-title">加分项</h3>
          </div>
          
          <div class="bonus-content">
            <ul v-if="positionData.bonus && positionData.bonus.length">
              <li v-for="(bonus, index) in positionData.bonus" :key="index">
                {{ bonus }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
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
      positionStatus: 'published', // 'published' 或 'draft'
      positionData: {
        title: '推荐算法工程师',
        tags: ['AI', '算法', '机器学习', 'Python'],
        salaryRange: '8500-9499',
        location: '广东省广州市天河区上渡路136号',
        category: '校招',
        functionCategory: '算法',
        department: 'xx部门',
        recruitCount: 3,
        deadline: '2025-11-11',
        recruitDeadline: '2025-10-11',
        description: '作为推荐算法方向的研究工程师，你可以：',
        descriptionItems: [
          '负责推荐系统中具体推荐业务的召回、排序等模型算法及策略的设计与优化；',
          '深入理解业务场景，通过对数据的敏锐洞察挖掘产品潜在价值和需求，针对现有业务场景特点优化推荐策略和模型，不断提升用户体验和业务指标；',
          '基于大规模深度神经网络模型和机器学习系统，探索业界前沿推荐技术的研发工作，通过技术创新推动产品成长，包含但不限于推荐多模态大模型、图神经网络、多任务学习、超长序列建模、强化学习等技术方向。'
        ],
        requirements: [
          '本科及以上学历，计算机、数学、人工智能等相关专业；',
          '扎实的编程能力和算法功能，熟练掌握Python/C++/Java等至少一种编程语言；',
          '扎实的机器学习/深度学习理论基础，熟练掌握Tensorflow/Pytorch等至少一种主流深度学习框架，了解Hadoop/Spark/Flink等大数据平台工具的使用；',
          '优秀的逻辑思维能力，优秀的分析问题与解决问题的能力，对解决具有挑战性的问题充满激情；',
          '善于沟通，工作积极主动，责任心强，自驱力强，能持续学习，具备良好的团队协作能力。'
        ],
        bonus: [
          '有推荐系统相关项目经验者优先',
          '在相关领域发表过论文或获得过竞赛奖项者优先'
        ]
      }
    }
  },
  mounted() {
    console.log('加载岗位详情，ID:', this.id)
    this.setupScrollSpy()
    // 模拟根据ID获取岗位状态
    this.getPositionStatus()
  },
  methods: {
    // 根据ID获取岗位状态（模拟）
    getPositionStatus() {
      // 这里应该调用API获取岗位状态
      // 模拟：根据ID判断状态
      if (this.id % 2 === 0) {
        this.positionStatus = 'published'
      } else {
        this.positionStatus = 'draft'
      }
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
    handleOffline() {
      if (confirm('确定要下线该岗位吗？下线后将不再对外展示。')) {
        // 调用API下线岗位
        console.log('下线岗位:', this.id)
        alert('岗位已下线')
        this.positionStatus = 'offline'
      }
    },

    // 删除草稿
    handleDeleteDraft() {
      if (confirm('确定要删除该草稿吗？删除后将无法恢复。')) {
        // 调用API删除草稿
        console.log('删除草稿:', this.id)
        alert('草稿已删除')
        this.$router.push('/position-manage')
      }
    },

    // 编辑/继续完善
    handleEdit() {
      // 准备传递给PositionForm的数据
      const formData = {
        positionName: this.positionData.title,
        category: this.positionData.category,
        department: this.positionData.department,
        recruitCount: this.positionData.recruitCount,
        location: this.positionData.location,
        salaryRange: this.positionData.salaryRange,
        deadline: this.positionData.deadline,
        recruitDeadline: this.positionData.recruitDeadline,
        tags: this.positionData.tags,
        description: this.positionData.description + '\n' + 
                    this.positionData.descriptionItems.join('\n'),
        requirements: this.positionData.requirements.join('\n'),
        bonus: this.positionData.bonus ? this.positionData.bonus.join('\n') : '',
        positionId: this.id,
        isDraft: this.positionStatus === 'draft'
      }

      // 跳转到PositionForm并传递数据
      this.$router.push({
        path: '/position-form',
        query: {
          editData: JSON.stringify(formData),
          positionId: this.id
        }
      })
    }
  }
}
</script>

<style scoped>
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
  /* 新增以下属性 */
  width: fit-content; /* 让宽度根据内容自适应 */
  margin-left: -20px; /* 确保靠左对齐 */
  padding: 0; /* 移除内边距 */
}

.info-item-main {
  padding: 25px 40px; /* 调整左右内边距，可以根据需要调整 */
  position: relative;
  text-align: left;
  /* 移除 flex: 1 或者改为 auto */
  flex: none; /* 不让它们自动拉伸 */
}

/* 分割线 */
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
  color: #cab156;
}

/* 详细信息组 - 放在下方 */
/* 详细信息组 - 放在下方 */
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
  flex: none; /* 改为 none 而不是 1 */
  width: 400px; /* 设置固定宽度，确保所有项目宽度一致 */
}

.detail-label {
  color: #346024;
  font-weight: 550;
  font-size: 24px;
  min-width: 120px; /* 设置标签的最小宽度 */
}

.detail-value {
  color: #333;
  font-weight: 500;
  font-size: 24px;
  margin-left: 10px;
}

/* 章节头部 */
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

/* 内容样式 */
.description-content, .requirement-content, .bonus-content {
  color: #333;
  line-height: 1.7;
}

.description-content p {
  margin-bottom: 20px;
  font-size: 20px;
  font-weight: 500;
}

.description-content ul, .requirement-content ul, .bonus-content ul {
  padding-left: 20px;
}

.description-content li, .requirement-content li, .bonus-content li {
  margin-bottom: 12px;
  font-size: 20px;
  color: #555;
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