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

    <!-- 加载状态 -->
    <div v-if="loading" class="loading">加载中...</div>

    <div v-else class="edit-layout">
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
      <div class="avatar-container">
        <img :src="getLogoUrl(enterpriseInfo.logo_url)" alt="企业头像" class="avatar-preview">
      </div>
    </div>
    <div class="upload-avatar">
      <h4>新头像</h4>
      <el-upload
        class="avatar-uploader"
        action="http://localhost:8080/upload/company-logo"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
        :on-error="handleAvatarError"
        :headers="uploadHeaders">
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
            v-model="enterpriseInfo.description"
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
              v-model="enterpriseInfo.company_address"
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
                  <option v-for="nature in options.natures" :key="nature" :value="nature">
                    {{ nature }}
                  </option>
                </select>
              </div>
              <div class="info-field">
                <label>企业行业</label>
                <select v-model="enterpriseInfo.industry">
                  <option value="">请选择</option>
                  <option v-for="industry in options.industries" :key="industry" :value="industry">
                    {{ industry }}
                  </option>
                </select>
              </div>
              <div class="info-field">
                <label>企业规模</label>
                <select v-model="enterpriseInfo.company_scale">
                  <option value="">请选择</option>
                  <option v-for="scale in options.scales" :key="scale" :value="scale">
                    {{ scale }}
                  </option>
                </select>
              </div>
            </div>
            <div class="info-row">
              <div class="info-field">
                <label>企业联系人</label>
                <input 
                  type="text" 
                  v-model="enterpriseInfo.contact_person_name"
                  placeholder="请输入联系人姓名"
                >
              </div>
              <div class="info-field">
                <label>联系电话</label>
                <input 
                  type="text" 
                  v-model="enterpriseInfo.contact_person_phone"
                  placeholder="请输入联系电话"
                  @blur="validatePhone"
                >
                <span v-if="phoneError" class="error-text">{{ phoneError }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 相关链接 -->
        <!-- 相关链接 -->
<div class="edit-section full-width-section" id="links-section" ref="linksSection">
  <div class="section-header">
    <h3 class="section-title">相关链接</h3>
  </div>
  <div class="links-edit">
    <div class="existing-links">
      <div 
        v-for="(link, index) in enterpriseInfo.external_links"
        :key="index"
        class="link-item"
      >
        <span class="link-label">{{ link.link_name }}</span>
        <span class="link-url">{{ link.link_url }}</span>
        <button class="edit-link-btn" @click="editLink(index)">编辑</button>
        <button class="delete-link-btn" @click="deleteLink(index)">删除</button>
      </div>
    </div>
    <div class="add-link">
      <button 
        v-if="!isAddingLink"
        class="add-link-btn"
        @click="toggleAddLink"
      >
        + 新增
      </button>
      <div v-if="isAddingLink" class="link-inputs">
        <input 
          type="text"
          v-model="newLink.link_name"
          placeholder="链接标识"
          class="link-label-input"
        >
        <input 
          type="text"
          v-model="newLink.link_url"
          placeholder="链接网址"
          class="link-url-input"
        >
      </div>
      <div v-if="isAddingLink" class="link-action-buttons">
        <button 
          class="confirm-link-btn"
          @click="confirmAddLink"
        >
          确定
        </button>
        <button 
          class="cancel-link-btn"
          @click="cancelAddLink"
        >
          取消
        </button>
      </div>
    </div>
  </div>
</div>

        <!-- 操作按钮 -->
        <div class="edit-section full-width-section action-section">
          <div class="action-buttons">
            <button class="cancel-btn" @click="cancelEdit">取消修改</button>
            <button class="submit-btn" @click="submitEdit" :disabled="submitting">
              {{ submitting ? '提交中...' : '提交修改' }}
            </button>
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
      loading: true,
      submitting: false,
      activeSection: 'avatar',
      uploadedLogoUrl: null,
      sections: [
        { id: 'avatar', name: '企业头像' },
        { id: 'intro', name: '企业介绍' },
        { id: 'address', name: '企业地址' },
        { id: 'basic-info', name: '基本信息' },
        { id: 'links', name: '相关链接' }
      ],
      enterpriseInfo: {
        company_name: '',
        description: '',
        logo_url: '',
        nature: '',
        industry: '',
        company_scale: '',
        contact_person_name: '',
        contact_person_phone: '',
        company_address: '',
        external_links: []
      },
      options: {
        industries: [],
        natures: [],
        scales: []
      },
      newAvatar: null,
      uploadHeaders: {
        'Authorization': ''
      },
      locationResults: [],
      phoneError: '',
      isAddingLink: false,
      newLink: {
        link_name: '',
        link_url: ''
      },
      editingLinkIndex: -1
    }
  },
  async mounted() {
    await this.fetchCompanyProfile()
    await this.fetchOptions()
    this.setupScrollSpy()
    this.setUploadHeaders()
  },
  methods: {
    setUploadHeaders() {
    const token = localStorage.getItem('token');
    if (token) {
      this.uploadHeaders.Authorization = `Bearer ${token}`;
    }
  },

    async fetchCompanyProfile() {
  try {
    this.loading = true
    const token = localStorage.getItem('token')
    
    const response = await fetch('http://localhost:8080/hr/company/profile', {
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
      this.enterpriseInfo = data.data
      console.log('企业信息加载成功:', this.enterpriseInfo)
      
      // 获取企业logo - 新增这部分
      if (this.enterpriseInfo.logo_url) {
        const logoUrl = await this.fetchCompanyLogo(this.enterpriseInfo.logo_url)
        this.enterpriseInfo.logo_url = logoUrl
      }
    } else {
      console.error('接口返回错误:', data.message)
    }
  } catch (error) {
    console.error('获取企业信息失败:', error)
    ElMessage.error('获取企业信息失败')
  } finally {
    this.loading = false
  }
},

    // 添加获取企业logo的方法
async fetchCompanyLogo(logoUrl) {
  try {
    const token = localStorage.getItem('token')
    
    let fullLogoUrl = logoUrl
    if (logoUrl.startsWith('/')) {
      fullLogoUrl = `http://localhost:8080${logoUrl}`
    }
    
    console.log('请求图片URL:', fullLogoUrl)
    
    const response = await fetch(fullLogoUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    })
    
    console.log('图片响应状态:', response.status)
    
    if (response.ok) {
      const blob = await response.blob()
      return URL.createObjectURL(blob)
    } else {
      console.error('获取企业logo失败，状态码:', response.status)
      return require('@/assets/BDance_logo.png')
    }
  } catch (error) {
    console.error('获取企业logo失败:', error)
    return require('@/assets/BDance_logo.png')
  }
},

    async fetchOptions() {
      try {
        const token = localStorage.getItem('token')
        
        const response = await fetch('http://localhost:8080/hr/company/options', {
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
          this.options = data.data
          console.log('选项数据加载成功:', this.options)
        } else {
          console.error('选项接口返回错误:', data.message)
        }
      } catch (error) {
        console.error('获取选项数据失败:', error)
        ElMessage.error('获取选项数据失败')
      }
    },

    getLogoUrl(logoUrl) {
  if (!logoUrl) {
    return require('@/assets/BDance_logo.png')
  }
  return logoUrl
},

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
  if (res.code === 200 && res.data) {
    // 只更新预览，不更新企业信息中的logo_url
    // this.enterpriseInfo.logo_url = res.data.url  // 删除这行
    this.newAvatar = URL.createObjectURL(file.raw);
    ElMessage.success('头像上传成功')
    console.log('新头像URL:', res.data.url)
    
    // 可以在这里保存新头像URL到临时变量，供提交时使用
    this.uploadedLogoUrl = res.data.url;
  } else {
    ElMessage.error('头像上传失败')
  }
},
    
    beforeAvatarUpload(file) {
      const isImage = file.type.startsWith('image/');
      const isLt2M = file.size / 1024 / 1024 < 2;
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

      if (!isImage) {
        ElMessage.error('上传文件只能是图片格式!');
        return false;
      }
      
      if (!allowedTypes.includes(file.type)) {
        ElMessage.error('上传头像图片只能是 JPG、PNG、GIF 或 WebP 格式!');
        return false;
      }
      
      if (!isLt2M) {
        ElMessage.error('上传头像图片大小不能超过 2MB!');
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
      this.enterpriseInfo.company_address = location.name;
      this.locationResults = [];
    },
    
    validatePhone() {
      const phoneRegex = /^1[3-9]\d{9}$/;
      if (!this.enterpriseInfo.contact_person_phone) {
        this.phoneError = '联系电话不能为空';
      } else if (!phoneRegex.test(this.enterpriseInfo.contact_person_phone)) {
        this.phoneError = '请输入正确的手机号码';
      } else {
        this.phoneError = '';
      }
    },
    
    toggleAddLink() {
      this.isAddingLink = true;
      this.newLink = { link_name: '', link_url: '' };
      this.editingLinkIndex = -1;
    },
    
    confirmAddLink() {
      if (this.newLink.link_name && this.newLink.link_url) {
        if (this.editingLinkIndex >= 0) {
          // 编辑现有链接
          this.enterpriseInfo.external_links[this.editingLinkIndex] = { ...this.newLink };
        } else {
          // 添加新链接
          this.enterpriseInfo.external_links.push({ ...this.newLink });
        }
        this.isAddingLink = false;
        this.newLink = { link_name: '', link_url: '' };
        this.editingLinkIndex = -1;
      } else {
        ElMessage.warning('请填写链接标识和链接网址');
      }
    },
    
    cancelAddLink() {
      this.isAddingLink = false;
      this.newLink = { link_name: '', link_url: '' };
      this.editingLinkIndex = -1;
    },
    
    editLink(index) {
      this.isAddingLink = true;
      this.newLink = { ...this.enterpriseInfo.external_links[index] };
      this.editingLinkIndex = index;
    },
    
    deleteLink(index) {
      if (confirm('确定要删除这个链接吗？')) {
        this.enterpriseInfo.external_links.splice(index, 1);
      }
    },
    
    async submitEdit() {
  this.validatePhone();
  if (this.phoneError) {
    ElMessage.error('请修正表单错误');
    return;
  }

  try {
    this.submitting = true;
    const token = localStorage.getItem('token')
    
    const submitData = {
      description: this.enterpriseInfo.description,
      company_address: this.enterpriseInfo.company_address,
      nature: this.enterpriseInfo.nature,
      industry: this.enterpriseInfo.industry,
      company_scale: this.enterpriseInfo.company_scale,
      contact_person_name: this.enterpriseInfo.contact_person_name,
      contact_person_phone: this.enterpriseInfo.contact_person_phone,
      external_links: this.enterpriseInfo.external_links
    }

    // 如果上传了新头像，添加到提交数据中
    if (this.uploadedLogoUrl) {
      submitData.logo_url = this.uploadedLogoUrl;
    }

    console.log('提交的数据:', submitData)

    const response = await fetch('http://localhost:8080/hr/company/profile', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(submitData)
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    
    if (data.code === 200) {
      ElMessage.success('修改已保存！');
      // 保存成功后，如果需要可以更新本地数据
      if (this.uploadedLogoUrl) {
        this.enterpriseInfo.logo_url = this.uploadedLogoUrl;
        this.uploadedLogoUrl = null; // 清空临时变量
      }
      this.$router.push('/enterprise-info');
    } else {
      ElMessage.error(data.message || '保存失败');
    }
  } catch (error) {
    console.error('提交修改失败:', error);
    ElMessage.error('提交修改失败，请重试');
  } finally {
    this.submitting = false;
  }
}
  }
}
</script>

<style scoped>
/* 加载状态样式 */
.loading {
  text-align: center;
  padding: 50px;
  font-size: 18px;
  color: #666;
}

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
  padding: 20px 30px;
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
  min-width: 0;
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

.current-avatar
{
  flex: 1;
  object-fit: contain;
}

.current-avatar .avatar-container {
  width: 150px;
  height: 150px;
  border-radius: 8px;
  border: 2px solid #e9ecef;
  background-color: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

/* 当前头像的图片使用和上传预览完全相同的样式 */
.current-avatar .avatar-container img {
  width: 150px;
  height: 150px;
  object-fit: contain; /* 确保也是 contain */
  border-radius: 8px;
  border: 2px solid #e9ecef;
  background-color: #f8f9fa; /* 确保有背景色 */
}

.upload-avatar {
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
  object-fit: contain;
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
  font-size: 18px;
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
  font-size: 20px;
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
  font-size: 20px;
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

.link-inputs {
  display: flex;
  gap: 15px;
  margin-top: 15px;
  margin-bottom: 15px;
}

.link-label-input,
.link-url-input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #d8d8d8;
  border-radius: 6px;
  font-size: 20px;
  box-sizing: border-box;
}

.link-label-input:focus,
.link-url-input:focus {
  outline: none;
  border-color: #325e21;
}

.link-action-buttons {
  display: flex;
  gap: 15px;
}

.confirm-link-btn,
.cancel-link-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 20px;
  transition: background-color 0.3s ease;
  white-space: nowrap;
}

.confirm-link-btn {
  background: #28a745;
  color: white;
}

.confirm-link-btn:hover {
  background: #218838;
}

.cancel-link-btn {
  background: #6c757d;
  color: white;
}

.cancel-link-btn:hover {
  background: #5a6268;
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

.submit-btn:hover:not(:disabled) {
  background: #2a4e1b;
}

.submit-btn:disabled {
  background: #cccccc;
  cursor: not-allowed;
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