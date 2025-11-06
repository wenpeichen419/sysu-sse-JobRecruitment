<template>
  <div class="student-center-page">
    <!-- 面包屑导航 -->
    <div class="breadcrumb">
      <span class="crumb-item">学生中心</span>
    </div>

    <!-- 欢迎信息框 -->
    <div class="welcome-card">
      <div class="welcome-left">
        <div class="avatar-section">
          <img :src="studentInfo.avatar" alt="头像" class="avatar" />
        </div>
        <div class="user-info">
          <div class="user-header">
            <h2 class="user-name">您好，{{ studentInfo.name }}</h2>
          </div>
          <div class="user-details-grid">
            <div class="info-item">
              <span class="info-label">学校:</span>
              <span class="info-value">{{ studentInfo.school }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">专业:</span>
              <span class="info-value">{{ studentInfo.major }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">手机:</span>
              <span class="info-value">{{ studentInfo.phone }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">邮箱:</span>
              <span class="info-value">{{ studentInfo.email }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">上次登录:</span>
              <span class="info-value">{{ studentInfo.lastLogin }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="tags-section">
        <div class="tags-container">
          <span class="tags-label">能力标签:</span>
          <div class="tags-content">
            <span 
              v-for="(tag, index) in displayTags" 
              :key="index" 
              class="tag"
            >{{ tag }}</span>
            <a class="more-link" @click="goToTags">
              <span class="more-text">查看全部</span>
              <span class="more-arrow">›</span>
            </a>
          </div>
        </div>
      </div>

      <!-- 快捷操作按钮 - 放在右上角 -->
      <div class="quick-actions">
        <button class="action-btn edit-info" @click="goToEditInfo">
          <span class="btn-icon">✎</span>
          <span class="btn-text">编辑信息</span>
        </button>
        <button class="action-btn change-pwd" @click="showPasswordDialog = true">
          <span class="btn-icon">🔒</span>
          <span class="btn-text">修改密码</span>
        </button>
      </div>
    </div>

    <!-- 企业侧简历预览和功能按钮区 -->
    <div class="main-content-area">
      <!-- 企业侧简历预览 -->
      <div class="resume-preview-card">
        <div class="preview-header">
          <h3 class="preview-title">企业侧简历预览</h3>
          <span class="preview-subtitle">您的简历在企业HR眼中的展示如下</span>
        </div>
        
        <div class="resume-content">
          <div class="resume-left">
            <div class="resume-avatar-section">
              <img :src="studentInfo.avatar" alt="简历照片" class="resume-avatar" />
              <h2 class="resume-name">{{ studentInfo.name }}</h2>
              <div class="resume-basic-info">
                <span class="info-tag">{{ studentInfo.gender }}</span>
                <span class="info-separator">|</span>
                <span class="info-tag">{{ calculateAge(studentInfo.birthday) }}岁</span>
                <span class="info-separator">|</span>
                <span class="info-tag">{{ studentInfo.degree }}</span>
              </div>
            </div>
            
            <div class="resume-section">
              <h4 class="resume-section-title">期望职位</h4>
              <div class="resume-text">
                <div class="text-item">
                  <span class="item-label">岗位:</span>
                  <span class="item-value">{{ studentInfo.desiredPosition }}</span>
                </div>
                <div class="text-item">
                  <span class="item-label">期望薪资:</span>
                  <span class="item-value">{{ studentInfo.expectedSalary }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="resume-right">
            <div class="resume-section">
              <h4 class="resume-section-title">教育经历</h4>
              <div class="education-item">
                <div class="edu-school">{{ studentInfo.school }}</div>
                <div class="edu-time">{{ studentInfo.admissionDate }} 至 {{ studentInfo.graduationDate }}</div>
                <div class="edu-details">
                  <span class="edu-major">{{ studentInfo.major }}</span>
                  <span class="info-separator">|</span>
                  <span class="edu-degree">{{ studentInfo.degree }}</span>
                  <span class="info-separator">|</span>
                  <span class="edu-rank">专业排名: {{ studentInfo.ranking }}</span>
                </div>
              </div>
            </div>
            
            <div class="resume-section">
              <h4 class="resume-section-title">技能标签</h4>
              <div class="resume-tags">
                <span 
                  v-for="(tag, index) in studentInfo.tags.slice(0, 6)" 
                  :key="index" 
                  class="resume-tag"
                >{{ tag }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 功能卡片区 -->
      <div class="functions-grid">
        <div class="function-card" @click="goToResume">
          <div class="card-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
            <span class="icon">📄</span>
          </div>
          <div class="card-title">我的简历</div>
          <div class="card-desc">管理和编辑个人简历</div>
        </div>

        <div class="function-card" @click="goToFavorites">
          <div class="card-icon" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
            <span class="icon">⭐</span>
          </div>
          <div class="card-title">我的收藏</div>
          <div class="card-desc">查看收藏的岗位信息</div>
        </div>

        <div class="function-card" @click="goToApplications">
          <div class="card-icon" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);">
            <span class="icon">📊</span>
          </div>
          <div class="card-title">投递进度</div>
          <div class="card-desc">查看已投递的岗位状态</div>
        </div>
      </div>
    </div>

    <!-- 修改密码弹窗 -->
    <div class="dialog-overlay" v-if="showPasswordDialog" @click="showPasswordDialog = false">
      <div class="dialog-content" @click.stop>
        <h3 class="dialog-title">修改密码</h3>
        
        <div class="form-group">
          <label class="form-label">原密码</label>
          <input 
            type="password" 
            v-model="passwordForm.oldPassword" 
            class="form-input"
            placeholder="请输入原密码"
          />
        </div>

        <div class="form-group">
          <label class="form-label">新密码</label>
          <input 
            type="password" 
            v-model="passwordForm.newPassword" 
            class="form-input"
            placeholder="请输入新密码"
          />
        </div>

        <div class="form-group">
          <label class="form-label">确认密码</label>
          <input 
            type="password" 
            v-model="passwordForm.confirmPassword" 
            class="form-input"
            placeholder="请再次输入新密码"
          />
        </div>

        <div class="dialog-actions">
          <button class="btn-cancel" @click="cancelPasswordChange">取消修改</button>
          <button class="btn-submit" @click="submitPasswordChange">立即修改</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import mockStudent from '@/data/mockStudentData'

export default {
  name: 'StudentCenter',
  data() {
    return {
      showPasswordDialog: false,
      // 学生信息（使用模拟数据）
      studentInfo: mockStudent,
      // 密码表单
      passwordForm: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      }
    }
  },
  computed: {
    // 最多显示4个标签
    displayTags() {
      return this.studentInfo.tags.slice(0, 4)
    }
  },
  methods: {
    // 计算年龄
    calculateAge(birthday) {
      if (!birthday) return '--'
      const birthYear = parseInt(birthday.split('-')[0])
      const currentYear = new Date().getFullYear()
      return currentYear - birthYear
    },
    
    // 跳转到标签编辑（定位到能力标签部分）
    goToTags() {
      this.$router.push({ 
        name: 'StudentProfile', 
        hash: '#tags' 
      })
    },
    
    // 跳转到编辑信息
    goToEditInfo() {
      this.$router.push({ name: 'StudentProfile' })
    },
    
    // 跳转到简历管理
    goToResume() {
      this.$router.push({ name: 'ResumeManage' })
    },
    
    // 跳转到我的收藏
    goToFavorites() {
      this.$router.push({ name: 'MyFavorites' })
    },
    
    // 跳转到投递进度
    goToApplications() {
      this.$router.push({ name: 'MyApplications' })
    },
    
    // 取消修改密码
    cancelPasswordChange() {
      this.showPasswordDialog = false
      this.passwordForm = {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      }
    },
    
    // 提交密码修改
    submitPasswordChange() {
      // 验证
      if (!this.passwordForm.oldPassword) {
        alert('请输入原密码')
        return
      }
      if (!this.passwordForm.newPassword) {
        alert('请输入新密码')
        return
      }
      if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
        alert('两次输入的新密码不一致')
        return
      }
      if (this.passwordForm.newPassword.length < 6) {
        alert('新密码长度不能少于6位')
        return
      }
      
      // 这里应该调用API修改密码
      alert('密码修改成功！')
      this.cancelPasswordChange()
    }
  }
}
</script>

<style scoped>
.student-center-page {
  min-height: 100vh;
  background: #f0f0f0;
  padding: 20px 40px;
}

/* 面包屑导航 */
.breadcrumb {
  background: white;
  padding: 20px 30px;
  margin-bottom: 20px;
  border-radius: 10px;
  font-size: 18px;
  color: #666;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

/* 欢迎信息框 */
.welcome-card {
  background: white;
  padding: 40px;
  border-radius: 12px;
  margin-bottom: 30px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.08);
  position: relative;
}

.welcome-left {
  display: flex;
  gap: 30px;
  margin-bottom: 30px;
}

.avatar-section {
  flex-shrink: 0;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 3px solid #e8e8e8;
  object-fit: cover;
}

.user-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.user-header {
  display: flex;
  align-items: center;
  gap: 15px;
}

.user-name {
  font-size: 36px;
  font-weight: 700;
  color: #325e21;
  margin: 0;
}

.user-details-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 18px 50px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 17px;
}

.info-label {
  color: #666;
  font-weight: 500;
  min-width: 75px;
}

.info-value {
  color: #333;
  font-weight: 600;
}

/* 标签区域 */
.tags-section {
  padding-top: 25px;
  border-top: 2px solid #f0f0f0;
}

.tags-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.tags-label {
  font-size: 20px;
  font-weight: 600;
  color: #325e21;
}

.tags-content {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.tag {
  padding: 10px 20px;
  background: linear-gradient(135deg, #eef5ee 0%, #d4e7d4 100%);
  color: #325e21;
  border-radius: 20px;
  font-size: 16px;
  font-weight: 500;
  border: 1px solid #c3d6c0;
}

.more-link {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  background: linear-gradient(135deg, #325e21 0%, #4a7c35 100%);
  color: white;
  border-radius: 20px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  text-decoration: none;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(50, 94, 33, 0.2);
}

.more-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(50, 94, 33, 0.3);
}

.more-text {
  font-size: 16px;
}

.more-arrow {
  font-size: 20px;
  font-weight: 700;
}

/* 快捷操作按钮 */
.quick-actions {
  position: absolute;
  top: 35px;
  right: 40px;
  display: flex;
  gap: 18px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 32px;
  border-radius: 10px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.action-btn.edit-info {
  background: linear-gradient(135deg, #325e21 0%, #4a7c35 100%);
  color: white;
}

.action-btn.edit-info:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 18px rgba(50, 94, 33, 0.35);
}

.action-btn.change-pwd {
  background: white;
  color: #666;
  border: 2px solid #e0e0e0;
}

.action-btn.change-pwd:hover {
  border-color: #325e21;
  color: #325e21;
  background: #f8fdf8;
  transform: translateY(-3px);
  box-shadow: 0 6px 18px rgba(50, 94, 33, 0.15);
}

.btn-icon {
  font-size: 22px;
  line-height: 1;
}

.btn-text {
  font-size: 18px;
}

/* 主内容区域 - 简历预览和功能按钮并排 */
.main-content-area {
  display: flex;
  gap: 25px;
  margin-bottom: 30px;
  align-items: stretch;
}

/* 企业侧简历预览 */
.resume-preview-card {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.08);
  flex: 1;
  min-width: 0;
}

.preview-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #f0f0f0;
}

.preview-title {
  font-size: 26px;
  font-weight: 700;
  color: #325e21;
  margin: 0;
}

.preview-subtitle {
  font-size: 15px;
  color: #999;
  font-style: italic;
}

.resume-content {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 40px;
}

.resume-left {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.resume-avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 25px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px;
}

.resume-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 4px solid white;
  object-fit: cover;
  margin-bottom: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.resume-name {
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin: 0 0 10px 0;
}

.resume-basic-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  color: #666;
}

.info-tag {
  color: #666;
}

.info-separator {
  color: #ccc;
}

.resume-right {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.resume-section {
  padding: 20px;
  background: #f8f9fa;
  border-radius: 10px;
  border-left: 4px solid #325e21;
}

.resume-section-title {
  font-size: 20px;
  font-weight: 700;
  color: #325e21;
  margin: 0 0 15px 0;
}

.resume-text {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.text-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
}

.item-label {
  color: #666;
  font-weight: 600;
  min-width: 80px;
}

.item-value {
  color: #333;
  font-weight: 500;
}

.education-item {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.edu-school {
  font-size: 20px;
  font-weight: 700;
  color: #333;
}

.edu-time {
  font-size: 17px;
  color: #666;
  font-weight: 500;
}

.edu-details {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
}

.edu-major {
  color: #333;
  font-weight: 600;
}

.edu-degree {
  color: #666;
}

.edu-rank {
  color: #666;
}

.resume-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.resume-tag {
  padding: 8px 16px;
  background: white;
  color: #325e21;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 500;
  border: 1px solid #c3d6c0;
}

/* 功能卡片区 - 右侧垂直排列 */
.functions-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 280px;
  flex-shrink: 0;
}

.function-card {
  background: white;
  padding: 25px 20px;
  border-radius: 12px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.function-card:hover {
  transform: translateX(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.card-icon {
  width: 70px;
  height: 70px;
  margin-bottom: 15px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.card-icon .icon {
  font-size: 35px;
}

.card-title {
  font-size: 20px;
  font-weight: 700;
  color: #333;
  margin-bottom: 8px;
}

.card-desc {
  font-size: 14px;
  color: #999;
  line-height: 1.4;
}

/* 修改密码弹窗 */
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.dialog-content {
  background: white;
  border-radius: 12px;
  padding: 35px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.dialog-title {
  font-size: 26px;
  font-weight: 700;
  color: #333;
  margin: 0 0 30px 0;
  text-align: center;
}

.form-group {
  margin-bottom: 25px;
}

.form-label {
  display: block;
  font-size: 16px;
  font-weight: 600;
  color: #666;
  margin-bottom: 10px;
}

.form-input {
  width: 100%;
  padding: 14px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #325e21;
  background: #f8fdf8;
}

.dialog-actions {
  display: flex;
  gap: 15px;
  margin-top: 30px;
}

.btn-cancel,
.btn-submit {
  flex: 1;
  padding: 14px 20px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
}

.btn-cancel {
  background: #f5f5f5;
  color: #666;
}

.btn-cancel:hover {
  background: #e8e8e8;
}

.btn-submit {
  background: linear-gradient(135deg, #325e21 0%, #4a7c35 100%);
  color: white;
}

.btn-submit:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(50, 94, 33, 0.3);
}

/* 响应式 */
@media (max-width: 1200px) {
  .main-content-area {
    flex-direction: column;
  }
  
  .functions-grid {
    flex-direction: row;
    width: 100%;
  }
  
  .function-card {
    flex: 1;
  }
}

@media (max-width: 1024px) {
  .resume-content {
    grid-template-columns: 1fr;
  }
  
  .quick-actions {
    position: static;
    justify-content: flex-end;
    margin-top: 20px;
  }
}

@media (max-width: 768px) {
  .student-center-page {
    padding: 15px;
  }
  
  .welcome-card {
    padding: 25px;
  }
  
  .welcome-left {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .user-details-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .info-item {
    justify-content: center;
  }
  
  .tags-content {
    gap: 8px;
  }
  
  .tag {
    padding: 8px 16px;
    font-size: 14px;
  }
  
  .more-link {
    padding: 8px 16px;
    font-size: 14px;
  }
  
  .resume-preview-card {
    padding: 20px;
  }
  
  .functions-grid {
    flex-direction: column;
    width: 100%;
  }
  
  .function-card:hover {
    transform: translateY(-5px);
  }
  
  .quick-actions {
    flex-direction: column;
    width: 100%;
  }
  
  .action-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>

