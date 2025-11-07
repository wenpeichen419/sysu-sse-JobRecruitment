<template>
  <div class="profile-page">
    <!-- 面包屑导航 -->
    <div class="breadcrumb">
      <span class="crumb-item" @click="goBack">学生中心</span>
      <span class="separator"> > </span>
      <span class="crumb-item current">修改信息</span>
    </div>

    <div class="profile-container">
      <!-- 左侧导航栏 -->
      <div class="sidebar">
        <h3 class="sidebar-title">编辑信息</h3>
        <ul class="nav-list">
          <li 
            v-for="nav in navItems" 
            :key="nav.id"
            :class="{ active: currentSection === nav.id }"
            @click="scrollToSection(nav.id)"
          >
            <span class="nav-icon">{{ nav.icon }}</span>
            <span class="nav-text">{{ nav.label }}</span>
          </li>
        </ul>
      </div>

      <!-- 右侧内容区 -->
      <div class="content-area">
        <!-- 个人头像 -->
        <div class="section-card" id="avatar">
          <h3 class="section-title">个人头像</h3>
          <div class="avatar-upload">
            <div class="avatar-item">
              <div class="avatar-label">当前头像</div>
              <img :src="avatarUrl" alt="头像" class="avatar-preview" />
            </div>
            <div class="avatar-item">
              <div class="avatar-label">上传新头像</div>
              <button class="upload-btn" @click="handleAvatarUpload">
                <span class="upload-icon">📷</span>
                <span class="upload-text">点击选择图片</span>
              </button>
              <input 
                type="file" 
                ref="avatarInput" 
                accept="image/*" 
                @change="onAvatarChange"
                style="display: none;"
              />
            </div>
          </div>
        </div>

        <!-- 基本信息 -->
        <div class="section-card" id="basic">
          <h3 class="section-title">基本信息</h3>
          <div class="form-grid">
            <div class="form-item">
              <label>姓名</label>
              <input type="text" v-model="formData.name" />
            </div>
            <div class="form-item">
              <label>出生年月</label>
              <input type="text" v-model="formData.birthday" placeholder="选择年月" />
            </div>
            <div class="form-item">
              <label>性别</label>
              <select v-model="formData.gender">
                <option value="">请选择</option>
                <option value="male">男</option>
                <option value="female">女</option>
              </select>
            </div>
            <div class="form-item">
              <label>求职状态</label>
              <select v-model="formData.jobStatus">
                <option value="">请选择</option>
                <option value="active">求职中</option>
                <option value="inactive">暂不求职</option>
              </select>
            </div>
            <div class="form-item">
              <label>邮箱</label>
              <input type="email" v-model="formData.email" />
            </div>
            <div class="form-item">
              <label>电话</label>
              <input type="tel" v-model="formData.phone" />
            </div>
          </div>
        </div>

        <!-- 教育经历 -->
        <div class="section-card" id="education">
          <h3 class="section-title">教育经历</h3>
          <div class="form-grid">
            <div class="form-item">
              <label>学校名称</label>
              <input type="text" v-model="formData.school" />
            </div>
            <div class="form-item">
              <label>层次</label>
              <select v-model="formData.degree">
                <option value="">请选择</option>
                <option value="bachelor">本科</option>
                <option value="master">硕士</option>
                <option value="doctor">博士</option>
              </select>
            </div>
            <div class="form-item">
              <label>入学日期</label>
              <input type="text" v-model="formData.admissionDate" />
            </div>
            <div class="form-item">
              <label>毕业日期</label>
              <input type="text" v-model="formData.graduationDate" />
            </div>
            <div class="form-item">
              <label>专业</label>
              <input type="text" v-model="formData.major" />
            </div>
            <div class="form-item">
              <label>专业排名</label>
              <input type="text" v-model="formData.ranking" />
            </div>
          </div>
        </div>

        <!-- 期望岗位 -->
        <div class="section-card" id="job">
          <h3 class="section-title">期望岗位</h3>
          <div class="form-grid">
            <div class="form-item">
              <label>期望岗位</label>
              <input type="text" v-model="formData.desiredPosition" />
            </div>
            <div class="form-item">
              <label>期望薪资</label>
              <input type="text" v-model="formData.expectedSalary" />
            </div>
          </div>
        </div>

        <!-- 能力标签 -->
        <div class="section-card" id="tags">
          <h3 class="section-title">能力标签</h3>
          <div class="tags-selector">
            <select v-model="newTag" class="tag-select">
              <option value="">+ 标签</option>
              <option v-for="tag in availableTags" :key="tag" :value="tag">{{ tag }}</option>
            </select>
          </div>
          <div class="selected-tags">
            <span class="tag-label">已选择标签:</span>
            <div class="tags-list">
              <span 
                v-for="(tag, index) in formData.tags" 
                :key="index" 
                class="tag"
              >
                {{ tag }}
                <span class="tag-remove" @click="removeTag(index)">×</span>
              </span>
            </div>
          </div>
        </div>

        <!-- 底部按钮 -->
        <div class="form-actions">
          <button class="btn-cancel" @click="cancelEdit">取消修改</button>
          <button class="btn-submit" @click="submitForm">提交修改</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import mockStudent from '@/data/mockStudentData'

const PROFILE_KEY = 'student_profile_v1';

export default {
  name: 'StudentProfile',
  data() {
    return {
      currentSection: 'avatar',
      avatarUrl: mockStudent.avatar,
      newTag: '',
      
      // 左侧导航项
      navItems: [
        { id: 'avatar', label: '个人头像', icon: '👤' },
        { id: 'basic', label: '基本信息', icon: '📝' },
        { id: 'education', label: '教育经历', icon: '🎓' },
        { id: 'job', label: '期望岗位', icon: '💼' },
        { id: 'tags', label: '能力标签', icon: '🏷️' }
      ],
      
      // 表单数据（从模拟数据初始化）
      formData: {
        name: mockStudent.name,
        birthday: mockStudent.birthday,
        gender: mockStudent.gender === '男' ? 'male' : 'female',
        jobStatus: mockStudent.jobStatus === '求职中' ? 'active' : 'inactive',
        email: mockStudent.email,
        phone: mockStudent.phone,
        school: mockStudent.school,
        degree: mockStudent.degree === '本科' ? 'bachelor' : mockStudent.degree === '硕士' ? 'master' : 'doctor',
        admissionDate: mockStudent.admissionDate,
        graduationDate: mockStudent.graduationDate,
        major: mockStudent.major,
        ranking: mockStudent.ranking,
        desiredPosition: mockStudent.desiredPosition,
        expectedSalary: mockStudent.expectedSalary,
        tags: [...mockStudent.tags]
      },
      
      // 可选标签
      availableTags: [
        'AI', '算法', '机器学习', 'Python', 'Java', 'C++', 
        '前端开发', '后端开发', '数据分析', '深度学习', 
        'React', 'Vue', 'Node.js', 'Spring', 'MySQL', 
        'JavaScript', 'TypeScript', 'HTML/CSS', 'Git', 'Webpack'
      ]
    }
  },
  mounted() {
    // 如果URL有hash，滚动到对应位置
    if (this.$route.hash) {
      const sectionId = this.$route.hash.substring(1)
      this.$nextTick(() => {
        this.scrollToSection(sectionId)
      })
    }
    
    // 监听滚动事件，更新当前激活的导航项
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  watch: {
    newTag(val) {
      if (val && !this.formData.tags.includes(val)) {
        this.formData.tags.push(val)
        this.newTag = ''
      }
    }
  },
  methods: {
    // 触发文件选择
    handleAvatarUpload() {
      this.$refs.avatarInput.click()
    },
    
    // 处理头像文件变化
    onAvatarChange(event) {
      const file = event.target.files[0]
      if (file) {
        // 验证文件类型
        if (!file.type.startsWith('image/')) {
          alert('请选择图片文件')
          return
        }
        
        // 验证文件大小（限制5MB）
        if (file.size > 5 * 1024 * 1024) {
          alert('图片大小不能超过5MB')
          return
        }
        
        // 读取文件并预览
        const reader = new FileReader()
        reader.onload = (e) => {
          this.avatarUrl = e.target.result
          alert('头像上传成功！当前头像已更新')
          // 这里应该调用API上传到服务器
          // uploadAvatar(file).then(...)
        }
        reader.readAsDataURL(file)
        
        // 清空input，允许重复选择同一文件
        event.target.value = ''
      }
    },
    
    // 滚动到指定区域
    scrollToSection(sectionId) {
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        this.currentSection = sectionId
      }
    },
    
    // 处理滚动事件
    handleScroll() {
      const sections = this.navItems.map(item => item.id)
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i])
        if (section) {
          const rect = section.getBoundingClientRect()
          if (rect.top <= 150) {
            this.currentSection = sections[i]
            break
          }
        }
      }
    },
    
    // 移除标签
    removeTag(index) {
      this.formData.tags.splice(index, 1)
    },
    
    // 返回
    goBack() {
      this.$router.push({ name: 'StudentCenter' })
    },
    
    // 取消编辑
    cancelEdit() {
      this.$router.push({ name: 'StudentCenter' })
    },
    
    // 提交表单
    submitForm() {
  // 组织成规范字段（与你之前的字段规范一致）
  const payload = {
    full_name: this.formData.name,
    date_of_birth: this.formData.birthday,          // 建议 "YYYY-MM"
    email: this.formData.email,
    gender: this.formData.gender === 'male' ? '男' : (this.formData.gender === 'female' ? '女' : ''),
    job_seeking_status: this.formData.jobStatus === 'active' ? '求职中' : '暂不求职',
    phone_number: this.formData.phone,
    education: {
      school_name: this.formData.school,
      major: this.formData.major,
      major_rank: this.formData.ranking,
      start_date: this.formData.admissionDate,      // 建议 "YYYY.MM"
      end_date: this.formData.graduationDate,       // 建议 "YYYY.MM"
      degree: (()=>{
        if (this.formData.degree === 'bachelor') return '本科';
        if (this.formData.degree === 'master')   return '硕士';
        if (this.formData.degree === 'doctor')   return '博士';
        return '';
      })()
    }
  }

  // 1) 本地持久化（作为简历编辑器的同步源）
  localStorage.setItem(PROFILE_KEY, JSON.stringify(payload));

  // 2) 正常提示 & 返回
  alert('信息提交成功！已同步到简历编辑器的基础信息');
  this.$router.push({ name: 'StudentCenter' });
}

  }
}
</script>

<style scoped>
.profile-page {
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
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.crumb-item {
  color: #666;
  cursor: pointer;
  transition: color 0.3s;
}

.crumb-item:hover {
  color: #325e21;
}

.crumb-item.current {
  color: #333;
  cursor: default;
}

.separator {
  margin: 0 8px;
  color: #999;
}

/* 主容器 */
.profile-container {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

/* 左侧导航栏 */
.sidebar {
  width: 220px;
  background: white;
  border-radius: 12px;
  padding: 25px 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 20px;
}

.sidebar-title {
  font-size: 20px;
  font-weight: 700;
  color: #325e21;
  margin: 0 0 20px 25px;
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-list li {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 15px 25px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 16px;
  color: #666;
}

.nav-list li:hover {
  background: #f8fdf8;
  color: #325e21;
}

.nav-list li.active {
  background: linear-gradient(90deg, #eef5ee 0%, #d4e7d4 100%);
  color: #325e21;
  font-weight: 600;
  border-left: 4px solid #325e21;
}

.nav-icon {
  font-size: 20px;
}

/* 右侧内容区 */
.content-area {
  flex: 1;
  min-width: 0;
}

.section-card {
  background: white;
  padding: 35px;
  border-radius: 12px;
  margin-bottom: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  scroll-margin-top: 20px;
}

.section-title {
  font-size: 24px;
  font-weight: 700;
  color: #325e21;
  margin: 0 0 25px 0;
  padding-bottom: 15px;
  border-bottom: 2px solid #f0f0f0;
}

/* 头像上传 */
.avatar-upload {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 40px;
  padding: 20px 0;
  align-items: start;
}

.avatar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.avatar-label {
  font-size: 18px;
  font-weight: 600;
  color: #666;
  height: 27px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-preview {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 3px solid #e8e8e8;
  object-fit: cover;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.upload-btn {
  width: 150px;
  height: 150px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 20px;
  background: linear-gradient(135deg, #325e21 0%, #4a7c35 100%);
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(50, 94, 33, 0.25);
}

.upload-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 25px rgba(50, 94, 33, 0.4);
}

.upload-icon {
  font-size: 40px;
  line-height: 1;
}

.upload-text {
  font-size: 16px;
  line-height: 1.2;
}

.upload-hint {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.2;
}

/* 表单网格 */
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 25px;
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-item label {
  font-size: 16px;
  font-weight: 600;
  color: #666;
}

.form-item input,
.form-item select {
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s;
}

.form-item input:focus,
.form-item select:focus {
  outline: none;
  border-color: #325e21;
  background: #f8fdf8;
}

/* 标签选择器 */
.tags-selector {
  margin-bottom: 20px;
}

.tag-select {
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
  background: white;
}

.tag-select:focus {
  outline: none;
  border-color: #325e21;
}

.selected-tags {
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.tag-label {
  display: block;
  font-size: 16px;
  font-weight: 600;
  color: #666;
  margin-bottom: 15px;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.tag {
  padding: 8px 16px;
  background: linear-gradient(135deg, #eef5ee 0%, #d4e7d4 100%);
  color: #325e21;
  border-radius: 20px;
  font-size: 15px;
  font-weight: 500;
  border: 1px solid #c3d6c0;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.tag-remove {
  cursor: pointer;
  font-size: 20px;
  font-weight: 700;
  color: #999;
  transition: color 0.3s;
}

.tag-remove:hover {
  color: #f44336;
}

/* 底部按钮 */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  padding: 30px 35px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

.btn-cancel,
.btn-submit {
  padding: 14px 40px;
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
@media (max-width: 1024px) {
  .profile-container {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100%;
    position: static;
  }
  
  .nav-list {
    display: flex;
    overflow-x: auto;
  }
  
  .nav-list li {
    white-space: nowrap;
  }
}

@media (max-width: 768px) {
  .profile-page {
    padding: 15px;
  }
  
  .section-card {
    padding: 20px;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .avatar-upload {
    grid-template-columns: 1fr;
    gap: 30px;
  }
}
</style>

