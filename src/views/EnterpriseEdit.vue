<template>
  <div class="enterprise-edit-page">
    <!-- 面包屑导航 -->
    <div class="breadcrumb-wrapper">
    <div class="breadcrumb">
      <router-link to="/" class="breadcrumb-link">主页</router-link>
      <span class="breadcrumb-separator">></span>
      <router-link to="/enterprise-info" class="breadcrumb-link">企业信息管理</router-link>
      <span class="breadcrumb-separator">></span>
      <span class="breadcrumb-current">修改简介</span>
    </div>
    </div>
    <div class="edit-layout">
      <!-- 左侧导航 - 固定位置 -->
      <div class="left-sidebar fixed-sidebar">
        <div class="sidebar-title">修改简介</div>
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

      <!-- 右侧编辑区域 - 充满剩余空间 -->
      <div class="right-content full-width">
        <!-- 企业头像 -->
        <div class="edit-section full-width-section" id="avatar-section" ref="avatarSection">
          <div class="section-header">
            <h3 class="section-title">企业头像</h3>
          </div>
          <div class="avatar-edit">
            <div class="current-avatar">
              <h4>当前头像</h4>
              <img src="@/assets/BDance_logo.png" alt="企业头像" class="avatar-preview">
            </div>
            <div class="upload-avatar">
              <h4>新头像</h4>
              <el-upload
                class="avatar-uploader"
                action="/api/upload"  
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
                :on-error="handleAvatarError">
                <img v-if="newAvatar" :src="newAvatar" class="avatar-preview">
                <div v-else class="avatar-uploader-icon">
                  <el-icon><Plus /></el-icon>
                  <div>点击上传</div>
                </div>
              </el-upload>
            </div>
          </div>
        </div>

        <!-- 企业介绍 -->
        <div class="edit-section full-width-section" id="intro-section" ref="introSection">
          <div class="section-header">
            <h3 class="section-title">企业介绍</h3>
          </div>
          <textarea 
            v-model="enterpriseInfo.introduction"
            class="intro-textarea"
            placeholder="请输入企业介绍..."
            rows="10"
          ></textarea>
        </div>

        <!-- 企业地址 -->
        <div class="edit-section full-width-section" id="address-section" ref="addressSection">
          <div class="section-header">
            <h3 class="section-title">企业地址</h3>
          </div>
          <div class="address-edit">
            <input 
              type="text" 
              v-model="enterpriseInfo.address"
              class="address-input"
              placeholder="请输入企业地址"
            >
            <button class="search-location-btn" @click="searchLocation">
              搜索定位
            </button>
          </div>
          <div v-if="locationResults.length > 0" class="location-results">
            <div 
              v-for="result in locationResults"
              :key="result.id"
              class="location-item"
              @click="selectLocation(result)"
            >
              {{ result.name }}
            </div>
          </div>
        </div>

        <!-- 基本信息 -->
        <div class="edit-section full-width-section" id="basic-info-section" ref="basicInfoSection">
          <div class="section-header">
            <h3 class="section-title">基本信息</h3>
          </div>
          <div class="basic-info-edit">
            <div class="info-row">
              <div class="info-field">
                <label>企业性质</label>
                <select v-model="enterpriseInfo.nature">
                  <option value="">请选择</option>
                  <option value="民营企业">民营企业</option>
                  <option value="国有企业">国有企业</option>
                  <option value="外资企业">外资企业</option>
                  <option value="合资企业">合资企业</option>
                </select>
              </div>
              <div class="info-field">
                <label>企业行业</label>
                <select v-model="enterpriseInfo.industry">
                  <option value="">请选择</option>
                  <option value="互联网科技">互联网科技</option>
                  <option value="金融">金融</option>
                  <option value="制造业">制造业</option>
                  <option value="服务业">服务业</option>
                </select>
              </div>
              <div class="info-field">
                <label>企业规模</label>
                <select v-model="enterpriseInfo.scale">
                  <option value="">请选择</option>
                  <option value="1-50人">1-50人</option>
                  <option value="50-100人">50-100人</option>
                  <option value="100-500人">100-500人</option>
                  <option value="500-1000人">500-1000人</option>
                  <option value="1000人以上">1000人以上</option>
                </select>
              </div>
            </div>
            <div class="info-row">
              <div class="info-field">
                <label>企业联系人</label>
                <input 
                  type="text" 
                  v-model="enterpriseInfo.contactPerson"
                  placeholder="请输入联系人姓名"
                >
              </div>
              <div class="info-field">
                <label>联系电话</label>
                <input 
                  type="text" 
                  v-model="enterpriseInfo.contactPhone"
                  placeholder="请输入联系电话"
                  @blur="validatePhone"
                >
                <span v-if="phoneError" class="error-text">{{ phoneError }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 相关链接 -->
        <div class="edit-section full-width-section" id="links-section" ref="linksSection">
          <div class="section-header">
            <h3 class="section-title">相关链接</h3>
          </div>
          <div class="links-edit">
            <div class="existing-links">
              <div 
                v-for="(link, index) in enterpriseInfo.links"
                :key="index"
                class="link-item"
              >
                <span class="link-label">{{ link.label }}</span>
                <span class="link-url">{{ link.url }}</span>
                <button class="edit-link-btn" @click="editLink(index)">编辑</button>
                <button class="delete-link-btn" @click="deleteLink(index)">删除</button>
              </div>
            </div>
            <div class="add-link">
              <button 
                class="add-link-btn"
                :class="{ confirm: isAddingLink }"
                @click="toggleAddLink"
              >
                {{ isAddingLink ? '确认' : '+ 新增' }}
              </button>
              <div v-if="isAddingLink" class="link-inputs">
                <input 
                  type="text"
                  v-model="newLink.label"
                  placeholder="链接标识"
                  class="link-label-input"
                >
                <input 
                  type="text"
                  v-model="newLink.url"
                  placeholder="链接网址"
                  class="link-url-input"
                >
              </div>
            </div>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="edit-section full-width-section action-section">
          <div class="action-buttons">
            <button class="cancel-btn" @click="cancelEdit">取消修改</button>
            <button class="submit-btn" @click="submitEdit">提交修改</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'  
export default {
  name: 'EnterpriseEdit',
  components: {
    Plus
  },
  data() {
    return {
      activeSection: 'avatar',
      sections: [
        { id: 'avatar', name: '企业头像' },
        { id: 'intro', name: '企业介绍' },
        { id: 'address', name: '企业地址' },
        { id: 'basic-info', name: '基本信息' },
        { id: 'links', name: '相关链接' }
      ],
      enterpriseInfo: {
        introduction: `字节跳动是一家成立于2012年3月的中国互联网科技公司，总部位于北京。公司致力于开发智能化的内容分发平台，通过人工智能技术为用户提供个性化的信息流服务。

字节跳动的产品和服务已覆盖全球150个国家和地区，75个语种，曾在40多个国家和地区排在应用商店总榜前列。旗下产品包括今日头条、抖音、TikTok、西瓜视频、飞书等知名应用。`,
        address: '北京市海淀区北三环西路27号字节跳动大厦',
        nature: '民营企业',
        industry: '互联网科技',
        scale: '100000人以上',
        contactPerson: '张经理',
        contactPhone: '13800138000',
        links: [
          { label: '企业官网', url: 'https://www.bytedance.com/zh/' }
        ]
      },
      newAvatar: null,
      locationResults: [],
      phoneError: '',
      isAddingLink: false,
      newLink: {
        label: '',
        url: ''
      },
      editingLinkIndex: -1
    }
  },
  mounted() {
    this.setupScrollSpy();
  },
  methods: {
    scrollToSection(sectionId) {
      this.activeSection = sectionId;
      const element = this.$refs[`${sectionId}Section`];
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
        
        // 添加高亮效果
        element.classList.add('highlight');
        setTimeout(() => {
          element.classList.remove('highlight');
        }, 2000);
      }
    },
    
    setupScrollSpy() {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.id.replace('-section', '');
            this.activeSection = sectionId;
          }
        });
      }, {
        threshold: 0.5
      });

      // 观察所有章节
      Object.values(this.$refs).forEach(ref => {
        if (ref) observer.observe(ref);
      });
    },
    
    // Element Upload 组件方法
    handleAvatarSuccess(res, file) {
      // 上传成功后的处理
      this.newAvatar = URL.createObjectURL(file.raw);
      ElMessage.success('头像上传成功')
    },
    
    beforeAvatarUpload(file) {
      const isImage = file.type.startsWith('image/');
      const isLt2M = file.size / 1024 / 1024 < 2;
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

      if (!isImage) {
        this.$message.error('上传文件只能是图片格式!');
        return false;
      }
      
      if (!allowedTypes.includes(file.type)) {
        this.$message.error('上传头像图片只能是 JPG、PNG、GIF 或 WebP 格式!');
        return false;
      }
      
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
        return false;
      }
      
      return true;
    },
    
    handleAvatarError(err) {
      ElMessage.error('头像上传失败，请重试');
      console.error('Upload error:', err);
    },
    
    searchLocation() {
      // 模拟搜索位置结果
      this.locationResults = [
        { id: 1, name: '北京市海淀区北三环西路27号字节跳动大厦' },
        { id: 2, name: '北京市海淀区北三环西路27号' },
        { id: 3, name: '字节跳动大厦' }
      ];
    },
    
    selectLocation(location) {
      this.enterpriseInfo.address = location.name;
      this.locationResults = [];
    },
    
    validatePhone() {
      const phoneRegex = /^1[3-9]\d{9}$/;
      if (!this.enterpriseInfo.contactPhone) {
        this.phoneError = '联系电话不能为空';
      } else if (!phoneRegex.test(this.enterpriseInfo.contactPhone)) {
        this.phoneError = '请输入正确的手机号码';
      } else {
        this.phoneError = '';
      }
    },
    
    toggleAddLink() {
      if (this.isAddingLink) {
        this.confirmAddLink();
      } else {
        this.isAddingLink = true;
        this.newLink = { label: '', url: '' };
        this.editingLinkIndex = -1;
      }
    },
    
    confirmAddLink() {
      if (this.newLink.label && this.newLink.url) {
        if (this.editingLinkIndex >= 0) {
          // 编辑现有链接
          this.enterpriseInfo.links[this.editingLinkIndex] = { ...this.newLink };
        } else {
          // 添加新链接
          this.enterpriseInfo.links.push({ ...this.newLink });
        }
        this.isAddingLink = false;
        this.newLink = { label: '', url: '' };
        this.editingLinkIndex = -1;
      }
    },
    
    editLink(index) {
      this.isAddingLink = true;
      this.newLink = { ...this.enterpriseInfo.links[index] };
      this.editingLinkIndex = index;
    },
    
    deleteLink(index) {
      this.enterpriseInfo.links.splice(index, 1);
    },
    
    cancelEdit() {
      if (confirm('确定要取消修改吗？所有未保存的更改将会丢失。')) {
        this.$router.push('/enterprise-info');
      }
    },
    
    submitEdit() {
      this.validatePhone();
      if (!this.phoneError) {
        // 这里应该调用API保存数据
        console.log('提交企业信息:', this.enterpriseInfo);
        ElMessage.success('修改已保存！');
        this.$router.push('/enterprise-info');
      }
    }
  }
}
</script>

<style scoped>
.enterprise-edit-page {
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
  padding: 20px 30px; /* 给白色面包屑留出边距 */
  z-index: 1000;
  height: 115px;
}

/* 面包屑导航 */
.breadcrumb {
  background: white;
  padding: 20px 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  font-size: 20px;
  box-sizing: border-box;
  width:97.3%;
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

/* 编辑布局 */
.edit-layout {
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
  height: 1000px;
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
  min-width: 0; /* 防止flex item溢出 */
  margin-left:300px;
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

.section-header {
  margin-bottom: 30px;
}

.section-title {
  color: #325e21;
  margin: 0;
  font-size: 30px;
  font-weight: bold;
  border-left: 4px solid #325e21;
  padding-left: 12px;
}

/* 企业头像编辑 */
.avatar-edit {
  display: flex;
  gap: 60px;
  align-items: flex-start;
  margin-left: 440px;
}

.current-avatar, .upload-avatar {
  flex: 1;
}

.current-avatar h4 {
  margin: 0 0 20px 0;
  font-size: 24px;
  color: #333;
  margin-left: 28px;
}

 .upload-avatar h4 {
  margin: 0 0 20px 0;
  font-size: 24px;
  color: #333;
  margin-left: 40px;
 }

.avatar-preview {
  width: 150px;
  height: 150px;
  border-radius: 8px;
  object-fit: cover;
  border: 2px solid #e9ecef;
}

/* Element Upload 组件样式 */
.avatar-uploader {
  width: 150px;
  height: 150px;
  border: 2px dashed #d8d8d8;
  border-radius: 8px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: border-color 0.3s ease;
}

.avatar-uploader:hover {
  border-color: #325e21;
}

.avatar-uploader-icon {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #8c939d;
  font-size: 16px;
  text-align: center;
}

.avatar-uploader-icon .el-icon-plus {
  font-size: 28px;
  margin-bottom: 8px;
}

/* 企业介绍编辑 */
.intro-textarea {
  width: 100%;
  padding: 20px;
  border: 1px solid #d8d8d8;
  border-radius: 8px;
  font-size: 20px;
  line-height: 1.25;
  resize: vertical;
  max-height: 250px;
  font-family: inherit;
  box-sizing: border-box;
}

.intro-textarea:focus {
  outline: none;
  border-color: #325e21;
}

/* 企业地址编辑 */
.address-edit {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.address-input {
  flex: 1;
  padding: 25px 20px;
  border: 1px solid #d8d8d8;
  border-radius: 6px;
  font-size: 20px;
  box-sizing: border-box;
}

.address-input:focus {
  outline: none;
  border-color: #325e21;
}

.search-location-btn {
  background: #325e21;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
  white-space: nowrap;
}

.search-location-btn:hover {
  background: #2a4e1b;
}

.location-results {
  border: 1px solid #e9ecef;
  border-radius: 6px;
  max-height: 200px;
  overflow-y: auto;
}

.location-item {
  padding: 12px 20px;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.3s ease;
}

.location-item:hover {
  background: #f8f9fa;
}

.location-item:last-child {
  border-bottom: none;
}

/* 基本信息编辑 */
.basic-info-edit {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.info-row {
  display: flex;
  gap: 30px;
}

.info-field {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-field label {
  font-weight: 500;
  color: #333;
  font-size: 20px;
}

.info-field select,
.info-field input {
  padding: 12px 16px;
  border: 1px solid #d8d8d8;
  border-radius: 6px;
  font-size: 20px;
  box-sizing: border-box;
}

.info-field select:focus,
.info-field input:focus {
  outline: none;
  border-color: #325e21;
}

.error-text {
  color: #dc3545;
  font-size: 14px;
  margin-top: 5px;
}

/* 相关链接编辑 */
.links-edit {
  display: flex;
  flex-direction: column;
  gap: 20px;
  font-size:18px;
}

.existing-links {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.link-item {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 6px;
  font-size:20px;
}

.link-label {
  font-weight: 500;
  color: #333;
  min-width: 100px;
}

.link-url {
  flex: 1;
  color: #666;
  word-break: break-all;
  font-size:20px;
}

.edit-link-btn,
.delete-link-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 18px;
  transition: background-color 0.3s ease;
  white-space: nowrap;
}

.edit-link-btn {
  background: #325e21;
  color: white;
}

.edit-link-btn:hover {
  background: #2a4e1b;
}

.delete-link-btn {
  background: #dc3545;
  color: white;
}

.delete-link-btn:hover {
  background: #c82333;
}

.add-link-btn {
  background: #325e21;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 20px;
  transition: background-color 0.3s ease;
}

.add-link-btn:hover {
  background: #2a4e1b;
}

.add-link-btn.confirm {
  background: #28a745;
}

.add-link-btn.confirm:hover {
  background: #218838;
}

.link-inputs {
  display: flex;
  gap: 15px;
  margin-top: 15px;
}

.link-label-input,
.link-url-input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #d8d8d8;
  border-radius: 6px;
  font-size: 16px;
  box-sizing: border-box;
}

.link-label-input:focus,
.link-url-input:focus {
  outline: none;
  border-color: #325e21;
}

/* 操作按钮 */
.action-section {
  margin-top: 20px;
}

.action-buttons {
  display: flex;
  gap: 20px;
  justify-content: center;
}

.cancel-btn,
.submit-btn {
  padding: 15px 40px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 18px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.cancel-btn {
  background: #6c757d;
  color: white;
}

.cancel-btn:hover {
  background: #5a6268;
}

.submit-btn {
  background: #325e21;
  color: white;
}

.submit-btn:hover {
  background: #2a4e1b;
}
/* 强制让上传区域的内容居中 */
:deep(.avatar-uploader .el-upload) {
  width: 100% !important;
  height: 100% !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

:deep(.avatar-uploader .el-upload:hover) {
  border-color: #325e21 !important;
}

.avatar-uploader-icon {
  width: 100% !important;
  height: 100% !important;
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  justify-content: center !important;
  color: #8c939d !important;
  font-size: 16px !important;
  text-align: center !important;
}

/* 确保图标和文字正确显示 */
.avatar-uploader-icon .el-icon {
  font-size: 28px !important;
  margin-bottom: 8px !important;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .edit-layout {
    flex-direction: column;
  }
  
  .fixed-sidebar {
    width: 100%;
    position: static;
  }
  
  .avatar-edit {
    flex-direction: column;
    gap: 30px;
  }
  
  .info-row {
    flex-direction: column;
    gap: 20px;
  }
  
  .action-buttons {
    flex-direction: column;
  }
}
</style>