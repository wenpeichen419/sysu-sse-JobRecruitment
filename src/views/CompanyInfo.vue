<template>
  <div class="company-info-page">
    <!-- 面包屑导航 -->
    <div class="breadcrumb">
      <span class="crumb-item" @click="goToJobCenter">求职中心</span>
      <span class="separator"> > </span>
      <span class="crumb-item" @click="goBack">职位详情</span>
      <span class="separator"> > </span>
      <span class="crumb-item current">企业信息详情</span>
    </div>

    <div class="content-wrapper">
      <!-- 左侧主内容区 -->
      <div class="main-content">
        <!-- 企业头部信息 -->
        <div class="company-header">
          <div class="company-logo">
            <img :src="companyInfo.logo" :alt="companyInfo.name" />
          </div>
          <div class="company-basic">
            <h1 class="company-name">{{ companyInfo.name }}</h1>
            <div class="company-stats">
              <div class="stat-item">
                <span class="stat-value">{{ companyInfo.openPositions }}</span>
                <span class="stat-label">个在招岗位</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">{{ companyInfo.progressRate }}%</span>
                <span class="stat-label">简历处理率</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">{{ companyInfo.daysAgo }}天前</span>
                <span class="stat-label">单位最近登录</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 企业介绍 -->
        <div class="section-card">
          <h2 class="section-title">企业介绍:</h2>
          <div class="section-content">
            <p v-for="(para, index) in companyInfo.introduction" :key="index">
              {{ para }}
            </p>
          </div>
        </div>

        <!-- 企业地址 -->
        <div class="section-card">
          <h2 class="section-title">企业地址:</h2>
          <div class="address-container">
            <div class="address-inner">
              <div class="address-text">
                <p>{{ companyInfo.address }}</p>
              </div>
              <button class="view-map-btn" @click="openBaiduMap">
                <img src="@/assets/map_logo.png" alt="地图" class="map-logo">
                <span class="btn-text">点击查看地图</span>
              </button>
            </div>
          </div>
        </div>

        <!-- 职位列表 -->
        <div class="section-card">
          <h2 class="section-title">职位名称</h2>
          <div class="job-list">
            <div 
              class="job-row" 
              v-for="job in companyInfo.positions" 
              :key="job.id"
              @click="goToJobDetail(job.id)"
            >
              <span class="job-name">{{ job.name }}</span>
              <span class="job-date">{{ job.publishDate }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧信息栏 -->
      <div class="sidebar">
        <!-- 基本信息卡片 -->
        <div class="info-card">
          <h3 class="info-title">基本信息</h3>
          <div class="info-item">
            <span class="info-label">企业性质:</span>
            <span class="info-value">{{ companyInfo.nature }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">企业行业:</span>
            <span class="info-value">{{ companyInfo.industry }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">企业规模:</span>
            <span class="info-value">{{ companyInfo.scale }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">企业联系人:</span>
            <span class="info-value">{{ companyInfo.contact }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">联系电话:</span>
            <span class="info-value">{{ companyInfo.phone }}</span>
          </div>
        </div>

        <!-- 相关链接 -->
        <div class="info-card">
          <h3 class="info-title">相关链接</h3>
          <a :href="companyInfo.website" target="_blank" class="link-item">
            企业官网
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CompanyInfo',
  data() {
    return {
      companyId: null,
      
      // 企业信息 (模拟数据)
      companyInfo: {
        name: '浙商银行股份有限公司',
        logo: require('@/assets/BDance_logo.png'),
        openPositions: 2,
        progressRate: 70,
        daysAgo: 2,
        nature: '民营企业',
        industry: '金融业',
        scale: '10000人以上',
        contact: '郑老师',
        phone: '0571-88265996',
        website: '#',
        address: '杭州市庆春路288号',
        introduction: [
          '浙商银行股份有限公司（简称"浙商银行"）是12家全国性股份制商业银行之一，于2004年8月18日正式开业，总部设在浙江杭州。2016年3月30日，在香港联交所上市，股票代码"2016.HK"；2019年11月26日，在上海证券交易所上市，股票代码"601916"，系全国第13家"A+H"上市银行。开业以来，浙商银行立足浙江，面向全国，稳健发展，已跻身全国城商业银行前列。效益良、风险完善的优质商业银行。'
        ],
        positions: [
          { id: 1, name: '算法工程师', publishDate: '2025-10-09' },
          { id: 2, name: '管培生', publishDate: '2025-10-09' },
          { id: 3, name: 'SLAM算法工程师', publishDate: '2025-10-09' },
          { id: 4, name: '运营培训生', publishDate: '2025-10-09' }
        ]
      }
    }
  },
  mounted() {
    // 获取路由参数中的企业ID
    this.companyId = this.$route.params.id
    
    // 这里应该根据企业ID加载对应的企业信息
    // this.loadCompanyInfo(this.companyId)
  },
  methods: {
    // 返回求职中心
    goToJobCenter() {
      this.$router.push({ name: 'JobCenter' })
    },
    
    // 返回岗位详情
    goBack() {
      this.$router.go(-1)
    },
    
    // 跳转到职位详情
    goToJobDetail(jobId) {
      this.$router.push({ name: 'JobDetail', params: { id: jobId } })
    },
    
    // 打开百度地图
    openBaiduMap() {
      // 使用百度地图API打开地址
      const address = encodeURIComponent(this.companyInfo.address);
      const url = `https://api.map.baidu.com/geocoder?address=${address}&output=html&src=webapp.baidu.openAPIdemo`;
      window.open(url, '_blank');
    }
  }
}
</script>

<style scoped>
.company-info-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 30px;
}

/* 面包屑导航 */
.breadcrumb {
  background: white;
  padding: 20px 30px;
  margin-bottom: 20px;
  border-radius: 10px;
  font-size: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.crumb-item {
  color: #666;
  cursor: pointer;
  transition: color 0.3s;
}

.crumb-item:hover {
  color: #2a5e23;
}

.crumb-item.current {
  color: #333;
  cursor: default;
}

.separator {
  margin: 0 8px;
  color: #999;
}

/* 内容布局 */
.content-wrapper {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.main-content {
  flex: 1;
  min-width: 0;
}

.sidebar {
  width: 320px;
  flex-shrink: 0;
}

/* 企业头部 */
.company-header {
  background: white;
  padding: 40px;
  margin-bottom: 20px;
  border-radius: 10px;
  display: flex;
  gap: 30px;
  align-items: flex-start;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.company-logo {
  width: 120px;
  height: 120px;
  flex-shrink: 0;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 10px;
  background: #fafafa;
}

.company-logo img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.company-basic {
  flex: 1;
}

.company-name {
  font-size: 30px;
  font-weight: bold;
  color: #333;
  margin: 0 0 25px 0;
}

.company-stats {
  display: flex;
  gap: 50px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #325e21;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 16px;
  color: #666;
  font-weight: 500;
}

/* 内容卡片 */
.section-card {
  background: white;
  padding: 40px;
  margin-bottom: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 30px;
  font-weight: bold;
  color: #325e21;
  margin: 0 0 20px 0;
  border-left: 4px solid #325e21;
  padding-left: 12px;
}

.section-content {
  font-size: 18px;
  line-height: 1.8;
  color: #555;
}

.section-content p {
  margin: 0 0 12px 0;
  text-indent: 2em;
}

.section-content p:last-child {
  margin-bottom: 0;
}

/* 地址容器样式 */
.address-container {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
}

.address-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.address-text {
  flex: 1;
  font-size: 18px;
  line-height: 1.8;
  color: #555;
}

.address-text p {
  margin: 0;
  text-indent: 0;
}

.view-map-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #325e21 0%, #4a7c35 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(50, 94, 33, 0.3);
}

.view-map-btn:hover {
  background: linear-gradient(135deg, #4a7c35 0%, #325e21 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(50, 94, 33, 0.4);
}

.view-map-btn:active {
  transform: translateY(0);
}

.map-logo {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

.btn-text {
  white-space: nowrap;
}

/* 职位列表 */
.job-list {
  border-top: 1px solid #f0f0f0;
}

.job-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: all 0.3s;
}

.job-row:hover {
  padding-left: 12px;
  color: #325e21;
}

.job-name {
  font-size: 18px;
  font-weight: 600;
}

.job-date {
  font-size: 16px;
  color: #999;
}

/* 侧边栏信息卡片 */
.info-card {
  background: white;
  padding: 30px;
  margin-bottom: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.info-title {
  font-size: 24px;
  font-weight: bold;
  color: #325e21;
  margin: 0 0 20px 0;
  padding-bottom: 12px;
  border-bottom: 2px solid #f0f0f0;
}

.info-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  font-size: 18px;
}

.info-item:last-child {
  margin-bottom: 0;
}

.info-label {
  color: #666;
}

.info-value {
  color: #333;
  font-weight: 500;
}

.link-item {
  display: block;
  color: #325e21;
  text-decoration: none;
  font-size: 18px;
  padding: 10px 0;
  transition: color 0.3s;
  font-weight: 500;
}

.link-item:hover {
  color: #1d4518;
  text-decoration: underline;
}

/* 响应式 */
@media (max-width: 1024px) {
  .content-wrapper {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .company-info-page {
    padding: 15px;
  }

  .company-header {
    flex-direction: column;
    padding: 20px;
  }

  .company-logo {
    width: 100px;
    height: 100px;
  }

  .company-stats {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }

  .stat-item {
    flex-direction: row;
    gap: 10px;
  }

  .section-card {
    padding: 20px;
  }

  .info-card {
    padding: 20px;
  }
}
</style>

