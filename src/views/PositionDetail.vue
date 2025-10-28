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

    <div class="content-wrapper">
      <!-- 岗位基本信息 -->
      <div class="basic-info-section">
        <div class="section-header">
          <h1 class="position-title">推荐算法工程师</h1>
          <div class="position-tags">
            <span class="tag">AI</span>
            <span class="tag">算法</span>
            <span class="tag">机器学习</span>
            <span class="tag">Python</span>
          </div>
        </div>
        
        <div class="position-meta">
          <div class="meta-item">
            <strong>8500-9499</strong>
          </div>
          <div class="meta-item">
            <strong>广东省广州市天河区</strong>
          </div>
          <div class="meta-item">
            <strong>校招</strong>
          </div>
        </div>

        <div class="position-details">
          <div class="detail-row">
            <span class="detail-label">职能类别：</span>
            <span class="detail-value">算法</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">部门：</span>
            <span class="detail-value">xx部门</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">招聘人数：</span>
            <span class="detail-value">3人</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">要求到岗时间：</span>
            <span class="detail-value">2025-11-11</span>
          </div>
        </div>
      </div>

      <!-- 职位详情 -->
      <div class="detail-section">
        <h2 class="section-title">职位详情</h2>
        
        <div class="description-section">
          <h3>岗位描述：</h3>
          <p>作为推荐算法方向的研究工程师，你可以：</p>
          <ul>
            <li>负责推荐系统中具体推荐业务的召回、排序等模型算法及策略的设计与优化；</li>
            <li>深入理解业务场景，通过对数据的敏锐洞察挖掘产品潜在价值和需求，针对现有业务场景特点优化推荐策略和模型，不断提升用户体验和业务指标；</li>
            <li>基于大规模深度神经网络模型和机器学习系统，探索业界前沿推荐技术的研发工作，通过技术创新推动产品成长，包含但不限于推荐多模态大模型、图神经网络、多任务学习、超长序列建模、强化学习等技术方向。</li>
          </ul>
        </div>

        <div class="requirement-section">
          <h3>岗位要求：</h3>
          <ul>
            <li>本科及以上学历，计算机、数学、人工智能等相关专业；</li>
            <li>扎实的编程能力和算法功能，熟练掌握Python/C++/Java等至少一种编程语言；</li>
            <li>扎实的机器学习/深度学习理论基础，熟练掌握Tensorflow/Pytorch等至少一种主流深度学习框架，了解Hadoop/Spark/Flink等大数据平台工具的使用；</li>
            <li>优秀的逻辑思维能力，优秀的分析问题与解决问题的能力，对解决具有挑战性的问题充满激情；</li>
            <li>善于沟通，工作积极主动，责任心强，自驱力强，能持续学习，具备良好的团队协作能力。</li>
          </ul>
        </div>

        <div class="bonus-section">
          <h3>加分项：</h3>
          <ul>
            <li>有推荐系统相关项目经验者优先</li>
            <li>在相关领域发表过论文或获得过竞赛奖项者优先</li>
          </ul>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="action-section">
        <button class="edit-btn">编辑岗位</button>
        <button class="publish-btn">发布岗位</button>
        <button class="back-btn" @click="goBack">返回列表</button>
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
  methods: {
    goBack() {
      this.$router.push('/position-manage')
    }
  },
  mounted() {
    console.log('加载岗位详情，ID:', this.id)
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

.content-wrapper {
  padding-top: 85px;
}

/* 基本信息区域 */
.basic-info-section {
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.section-header {
  margin-bottom: 25px;
}

.position-title {
  color: #325e21;
  margin: 0 0 15px 0;
  font-size: 32px;
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
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
}

.position-meta {
  display: flex;
  gap: 30px;
  margin-bottom: 25px;
  flex-wrap: wrap;
}

.meta-item {
  color: #666;
  font-size: 16px;
}

.meta-item strong {
  color: #333;
}

.position-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.detail-row {
  display: flex;
  align-items: center;
}

.detail-label {
  color: #666;
  min-width: 140px;
  font-weight: 500;
}

.detail-value {
  color: #333;
}

/* 详情区域 */
.detail-section {
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.section-title {
  color: #325e21;
  margin: 0 0 30px 0;
  font-size: 28px;
  font-weight: bold;
  border-left: 4px solid #325e21;
  padding-left: 12px;
}

.description-section,
.requirement-section,
.bonus-section {
  margin-bottom: 30px;
}

.description-section h3,
.requirement-section h3,
.bonus-section h3 {
  color: #333;
  margin: 0 0 15px 0;
  font-size: 20px;
}

.description-section p,
.requirement-section p,
.bonus-section p {
  color: #666;
  line-height: 1.6;
  margin-bottom: 15px;
}

.description-section ul,
.requirement-section ul,
.bonus-section ul {
  color: #666;
  line-height: 1.8;
  padding-left: 20px;
}

.description-section li,
.requirement-section li,
.bonus-section li {
  margin-bottom: 8px;
}

/* 操作按钮 */
.action-section {
  background: white;
  padding: 30px 40px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  gap: 15px;
  justify-content: center;
}

.edit-btn,
.publish-btn,
.back-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.edit-btn {
  background: #325e21;
  color: white;
}

.publish-btn {
  background: #1976d2;
  color: white;
}

.back-btn {
  background: #6c757d;
  color: white;
}

.edit-btn:hover {
  background: #2a4e1b;
}

.publish-btn:hover {
  background: #1565c0;
}

.back-btn:hover {
  background: #5a6268;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .position-meta {
    flex-direction: column;
    gap: 15px;
  }
  
  .detail-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
  
  .action-section {
    flex-direction: column;
  }
  
  .edit-btn,
  .publish-btn,
  .back-btn {
    width: 100%;
  }
}
</style>