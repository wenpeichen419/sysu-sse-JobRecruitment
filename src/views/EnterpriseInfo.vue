<template>
  <div class="enterprise-info-page">
    <!-- 面包屑导航 -->
    <div class="breadcrumb">
      <router-link to="/" class="breadcrumb-link">主页</router-link>
      <span class="breadcrumb-separator">></span>
      <span class="breadcrumb-current">企业信息管理</span>
    </div>

    <!-- 第一个矩形：企业头部信息 -->
    <div class="info-card enterprise-header-card">
      <div class="enterprise-basic">
        <div class="enterprise-avatar">
          <img src="@/assets/BDance_logo.png" alt="字节跳动" class="avatar-image">
        </div>
        <div class="enterprise-details">
          <h1 class="enterprise-name">字节跳动</h1>
          <div class="enterprise-stats">
            <div class="stat-item">
              <div class="stat-number">2个</div>
              <div class="stat-label">在招岗位数</div>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <div class="stat-number">70%</div>
              <div class="stat-label">简历处理率</div>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <div class="stat-number">2天前</div>
              <div class="stat-label">单位最近登录</div>
            </div>
          </div>
        </div>
      </div>
      <div class="button-group">
        <button class="edit-profile-btn" @click="goToEditProfile">
          修改简介
        </button>
        <button class="account-settings-btn" @click="showPasswordDialog = true">
          账号设置
        </button>
      </div>
      
    </div>
    
    <!-- 添加密码修改弹框 -->
<div v-if="showPasswordDialog" class="modal-overlay" @click="showPasswordDialog = false">
  <div class="modal-content" @click.stop>
    <div class="modal-header">
      <h2 class="modal-title">修改密码</h2>
      <button class="modal-close" @click="showPasswordDialog = false">×</button>
    </div>
    <div class="modal-body">
      <div class="input-group">
        <label for="oldPassword">原密码</label>
        <input 
          type="password" 
          id="oldPassword" 
          v-model="passwordForm.oldPassword" 
          placeholder="请输入原密码"
        >
      </div>
      <div class="input-group">
        <label for="newPassword">新密码</label>
        <input 
          type="password" 
          id="newPassword" 
          v-model="passwordForm.newPassword" 
          placeholder="请输入新密码"
        >
      </div>
      <div class="input-group">
        <label for="confirmPassword">确认密码</label>
        <input 
          type="password" 
          id="confirmPassword" 
          v-model="passwordForm.confirmPassword" 
          placeholder="请再次输入新密码"
        >
      </div>
    </div>
    <div class="modal-footer">
      <button class="cancel-btn" @click="showPasswordDialog = false">取消修改</button>
      <button class="confirm-btn" @click="confirmPasswordChange">确认修改</button>
    </div>
  </div>
</div>

    <!-- 第二个和第三个矩形并排 -->
    <div class="info-cards-row">
      <!-- 第二个矩形：企业介绍和地址 -->
      <div class="info-card content-left">
        <div class="info-section">
          <h3 class="section-title">企业介绍</h3>
          <div class="section-content">
            <p>字节跳动是一家成立于2012年3月的中国互联网科技公司，总部位于北京。公司致力于开发智能化的内容分发平台，通过人工智能技术为用户提供个性化的信息流服务。</p>
            <p>字节跳动的产品和服务已覆盖全球150个国家和地区，75个语种，曾在40多个国家和地区排在应用商店总榜前列。旗下产品包括今日头条、抖音、TikTok、西瓜视频、飞书等知名应用。</p>
          </div>
        </div>
        
        <div class="info-section">
          <h3 class="section-title">企业地址</h3>
          <div class="address-container">
            <div class="address-inner">
              <div class="address-text">
                <p>河北省秦皇岛市经济技术开发区龙海道185号</p>
              </div>
              <button class="view-map-btn" @click="openBaiduMap">
               <img src="@/assets/map_logo.png" alt="地图" class="map-logo">
                 <span class="btn-text">点击查看地图</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 第三个矩形：基本信息和相关链接 -->
      <div class="info-card content-right">
        <div class="info-section">
          <h3 class="section-title">基本信息</h3>
          <div class="basic-info-list">
            <div class="info-item">
              <span class="info-label">企业性质：</span>
              <span class="info-value">民营企业</span>
            </div>
            <div class="info-item">
              <span class="info-label">企业行业：</span>
              <span class="info-value">互联网科技</span>
            </div>
            <div class="info-item">
              <span class="info-label">企业规模：</span>
              <span class="info-value">100000人以上</span>
            </div>
            <div class="info-item">
              <span class="info-label">企业联系人：</span>
              <span class="info-value">张经理</span>
            </div>
            <div class="info-item">
              <span class="info-label">联系电话：</span>
              <span class="info-value">13800138000</span>
            </div>
          </div>
        </div>

        <div class="info-section">
          <h3 class="section-title">相关链接</h3>
          <div class="link-list">
            <a href="https://www.bytedance.com/zh/" target="_blank" class="external-link">
              企业官网
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EnterpriseInfo',
  data() {
    return {
      showPasswordDialog: false,
      passwordForm: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      }
    }
  },
  methods: {
    goToEditProfile() {
      // 暂时跳转到主页，后续可以修改为编辑页面
      this.$router.push('/enterprise-edit');
    },
    openBaiduMap() {
      // 使用百度地图API打开地址
      const address = encodeURIComponent('河北省秦皇岛市经济技术开发区龙海道185号');
      const url = `https://api.map.baidu.com/geocoder?address=${address}&output=html&src=yourCompanyName`;
      window.open(url, '_blank');
    },
    confirmPasswordChange() {
      // 这里添加密码修改的逻辑，后续调用接口
      console.log('修改密码:', this.passwordForm);
      // 调用API后关闭弹框
      this.showPasswordDialog = false;
      // 清空表单
      this.passwordForm = {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      };
    }
  }
}
</script>

<style scoped>
.enterprise-info-page {
  padding: 30px;
  background: #f5f5f5;
  min-height: calc(100vh - 105px);
}

/* 面包屑导航 */
.breadcrumb {
  background: white;
  padding: 20px 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  font-size: 20px;
  position: fixed;
  width:97.2%
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

/* 通用信息卡片样式 */
.info-card {
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 40px;
  margin-top:90px;
}

/* 第一个矩形：企业头部信息 */
.enterprise-header-card {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.enterprise-basic {
  display: flex;
  align-items: flex-start;
  gap: 30px;
}

.enterprise-avatar {
  width: 120px;
  height: 120px;
  overflow: hidden;
  flex-shrink: 0;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.enterprise-details {
  flex: 1;
}

.enterprise-name {
  color: #333;
  margin: 0 0 25px 0;
  font-size:34px;
  font-weight: bold;
}

.enterprise-stats {
  display: flex;
  align-items: center;
  gap: 60px;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 28px;
  font-weight: bold;
  color: #1d5e25;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 20px;
  color: #666;
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: #d8d8d8;
}

/* 按钮组样式 */
.button-group {
  display: flex;
  gap: 60px;
  flex-shrink: 0;
}

.edit-profile-btn, .account-settings-btn {
  background: #1d5e25;
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 6px;
  font-size: 24px;
  font-weight: 540;
  cursor: pointer;
  transition: background-color 0.3s ease;
  flex-shrink: 0;
  width: 200px;
}

.edit-profile-btn:hover, .account-settings-btn:hover {
  background: #2a4e1b;
}

/* 第二和第三个矩形并排 */
.info-cards-row {
  display: grid;
  grid-template-columns: 3fr 1fr;
  gap: 20px; /* 控制两个矩形之间的缝隙 */
}

.content-left, .content-right {
  margin: 0; /* 移除之前的margin */
}

.info-section {
  margin-bottom: 40px;
}

.info-section:last-child {
  margin-bottom: 0;
}

.section-title {
  color: #325e21;
  margin: 0 0 20px 0;
  font-size: 28px;
  font-weight: bold;
  border-left: 4px solid #325e21;
  padding-left: 12px;
}

.section-content {
  color: #333;
  line-height: 1.6;
  font:26px;
}

.section-content p {
  margin: 0 0 15px 0;
  font-size:22px;
}

.section-content p:last-child {
  margin-bottom: 0;
}

/* 地址容器样式 - 新增部分 */
.address-container {
  background: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-top: 10px;
}

.address-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.address-text {
  flex: 1;
}

.address-text p {
  margin: 0;
  font-size: 22px;
  color: #333;
  line-height: 1.5;
}

.view-map-btn {
  background: #1d5e25;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 18px;
  font-weight: 540;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 55px;
  line-height: 1;
}

.view-map-btn:hover {
  background: #2a4e1b;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

/* 基本信息列表 */
.basic-info-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  font-size: 22px;
}

.info-label {
  color: #666;
  font-weight: 500;
  flex-shrink: 0;
  margin-right: 10px;
  font-size:22px;
}

.info-value {
  color: #333;
  text-align: left;
  flex: 1;
  font-size:22px;
}

/* 链接列表 */
.link-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.external-link {
  color: #345ace;
  text-decoration: none;
  font-weight: 500;
  padding: 8px 0;
  transition: color 0.3s ease;
  font-size:22px;
}

.external-link:hover {
  color: #459dff;
  text-decoration: underline;
}

/* 弹框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 600px;
  max-width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e8e8e8;
}

.modal-title {
  margin: 0;
  font-size: 24px;
  color: #333;
  font-weight: bold;
}

.modal-close {
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: #666;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-close:hover {
  color: #333;
}

.modal-body {
  padding: 24px;
}

.input-group {
  margin-bottom: 20px;
}

.input-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
  font-size: 18px;
}

.input-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid #d8d8d8;
  border-radius: 4px;
  font-size: 16px;
  box-sizing: border-box;
}

.input-group input:focus {
  outline: none;
  border-color: #1d5e25;
}

.modal-footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding: 20px 24px;
  border-top: 1px solid #e8e8e8;
}

.cancel-btn {
  background: #cccccc;
  color: #666;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.cancel-btn:hover {
  background: #b3b3b3;
}

.confirm-btn {
  background: #005e27;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.confirm-btn:hover {
  background: #004a1f;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .enterprise-header-card {
    flex-direction: column;
    gap: 20px;
  }
  
  .enterprise-basic {
    flex-direction: column;
    text-align: center;
  }
  
  .enterprise-stats {
    justify-content: center;
  }
  
  .info-cards-row {
    grid-template-columns: 1fr;
  }
  
  .address-inner {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .button-group {
    flex-direction: column;
    width: 100%;
  }
  
  .edit-profile-btn, .account-settings-btn {
    width: 100%;
  }
}
</style>