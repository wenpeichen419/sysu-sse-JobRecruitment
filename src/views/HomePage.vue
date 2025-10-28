<template>
  <div class="home-page">
    <!-- 左侧灰色矩形区域 -->
    <div class="left-panel">
      <div class="welcome-section">
        <h2>欢迎您，字节跳动！</h2>
        <a class="enterprise-link" @click="goToEnterpriseInfo">企业信息管理 ></a>
      </div>
      
      <div class="data-overview">
        <div class="overview-title">数据概览</div>
        <div class="divider"></div>
        
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-label">我发布的岗位总数</div>
            <div class="stat-value position-count">13</div>
          </div>
          
          <div class="stat-card">
            <div class="stat-label">岗位投递总人次</div>
            <div class="stat-value delivery-count">124</div>
          </div>
          
          <div class="stat-card urgent-card">
            <div class="stat-label urgent-label">*待审核简历数</div>
            <div class="stat-value urgent-count">16</div>
            <a class="process-link" @click="goToTalentPool">立刻处理 ></a>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 右侧轮播图区域 -->
    <div class="right-panel">
      <div class="carousel">
        <div class="carousel-container" :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
          <div class="carousel-slide">
            <img src="@/assets/campus.png" alt="校园图片" class="carousel-image">
          </div>
          <div class="carousel-slide">
            <div class="text-slide">
              <h3>软件工程</h3>
              <p>定制服务</p>
              <p>铸就未来</p>
            </div>
          </div>
        </div>
        
        <div class="carousel-controls">
          <button class="control-btn" @click="prevSlide">‹</button>
          <div class="indicators">
            <span 
              v-for="index in 2" 
              :key="index"
              class="indicator"
              :class="{ active: currentSlide === index - 1 }"
              @click="currentSlide = index - 1"
            ></span>
          </div>
          <button class="control-btn" @click="nextSlide">›</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
  data() {
    return {
      currentSlide: 0,
      totalSlides: 2,
      autoPlayInterval: null
    }
  },
  mounted() {
    this.startAutoPlay();
  },
  beforeUnmount() {
    this.stopAutoPlay();
  },
  methods: {
    startAutoPlay() {
      this.autoPlayInterval = setInterval(() => {
        this.nextSlide();
      }, 4000);
    },
    stopAutoPlay() {
      if (this.autoPlayInterval) {
        clearInterval(this.autoPlayInterval);
        this.autoPlayInterval = null;
      }
    },
    nextSlide() {
      this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
    },
    prevSlide() {
      this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
    },
    goToEnterpriseInfo() {
      this.$router.push('/enterprise-info');
    },
    goToTalentPool() {
      this.$router.push('/talent-pool');
    }
  }
}
</script>

<style scoped>
.home-page {
  display: flex;
  height: calc(100vh - 105px);
  margin: 0;
  padding: 0;
  background: white;
}

/* 左侧灰色矩形区域 */
.left-panel {
  width: 500px;
  background: #f0f0f0;
  padding: 40px 30px;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.welcome-section h2 {
  color: #333;
  margin-bottom: 15px;
  font-size: 38px;
  font-weight: bold;
  margin-top: 45px
}

.enterprise-link {
  color: #1d5e25;
  text-decoration: none;
  font-size: 24px;
  cursor: pointer;
  font-weight: 500;
  display: inline-block;
  margin-bottom: 80px;
}

.enterprise-link:hover {
  text-decoration: underline;
}

.data-overview {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-bottom: 40px;
}

.overview-title {
  color: #909090;
  font-size: 23px;
  margin-bottom: 15px;
  font-weight: 500;
}

.divider {
  height: 2px;
  background: #909090;
  margin-bottom: 40px;
  width: 100%;
}

.stats-grid {
  display: flex;
  flex-direction: column;
  gap: 50px;
  flex: 1;
  margin-top:60px;
}

.stat-card {
  background: white;
  padding:15px 25px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-height: 140px;
}

.stat-label {
  font-size: 22px;
  color: #333;
  margin-bottom: 15px;
  font-weight: 500;
}

.stat-value {
  font-size: 50px;
  font-weight: bold;
  line-height: 1;
}

.position-count {
  color: #1d5e25;
}

.delivery-count {
  color: #545454;
}

.urgent-card {
  border-left: 6px solid #8e0000;
}

.urgent-label {
  color: #8e0000;
  font-weight: bold;
}

.urgent-count {
  color: #8e0000;
}

.process-link {
  position: absolute;
  bottom: 25px;
  right: 30px;
  color: #919191;
  text-decoration: none;
  font-size: 18px;
  cursor: pointer;
  font-weight: 500;
}

.process-link:hover {
  text-decoration: underline;
  color: #666;
}

/* 右侧轮播图区域 */
.right-panel {
  flex: 1;
  background: #fafafa;
  margin: 0;
  padding: 0;
  height: 100%;
}

.carousel {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.carousel-container {
  display: flex;
  transition: transform 0.5s ease-in-out;
  height: 100%;
}

.carousel-slide {
  flex: 0 0 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.text-slide {
  text-align: center;
  color: #325e21;
  padding: 60px;
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.text-slide h3 {
  font-size: 48px;
  margin-bottom: 20px;
  font-weight: bold;
}

.text-slide p {
  font-size: 24px;
  color: #666;
  font-weight: 500;
  margin: 5px 0;
}

.carousel-controls {
  position: absolute;
  bottom: 30px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 30px;
}

.control-btn {
  background: rgba(255, 255, 255, 0.9);
  border: none;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  color: #333;
  font-weight: bold;
}

.control-btn:hover {
  background: rgba(255, 255, 255, 1);
  transform: scale(1.1);
}

.indicators {
  display: flex;
  gap: 12px;
}

.indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.3s ease;
}

.indicator.active {
  background: rgba(255, 255, 255, 1);
  transform: scale(1.2);
}

.indicator:hover {
  background: rgba(255, 255, 255, 0.8);
}
</style>