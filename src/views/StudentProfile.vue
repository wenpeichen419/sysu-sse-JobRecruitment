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
        <div class="sidebar-title">编辑信息</div>
        <div class="title-divider"></div>
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
              <label><span class="required-star">*</span>姓名</label>
              <input type="text" v-model="formData.name" placeholder="请输入姓名" />
            </div>
            <div class="form-item">
              <label><span class="required-star">*</span>学号</label>
              <input type="text" v-model="formData.studentId" placeholder="请输入学号" />
            </div>
            <div class="form-item">
              <label><span class="required-star">*</span>出生年月</label>
              <input type="date" v-model="formData.birthday" />
            </div>
            <div class="form-item">
              <label><span class="required-star">*</span>性别</label>
              <select v-model.number="formData.gender">
                <option :value="null">请选择</option>
                <option :value="0">男</option>
                <option :value="1">女</option>
              </select>
            </div>
            <div class="form-item">
              <label><span class="required-star">*</span>求职状态</label>
              <select v-model="formData.jobStatus">
                <option :value="null">请选择</option>
                <option value="在校-暂不考虑">在校-暂不考虑</option>
                <option value="在校-寻求实习">在校-寻求实习</option>
                <option value="应届-寻求实习">应届-寻求实习</option>
                <option value="应届-寻求校招">应届-寻求校招</option>
              </select>
            </div>
            <div class="form-item">
              <label>邮箱</label>
              <input type="email" v-model="formData.email" placeholder="请输入邮箱" />
            </div>
            <div class="form-item">
              <label><span class="required-star">*</span>电话</label>
              <input type="tel" v-model="formData.phone" placeholder="请输入电话" />
            </div>
          </div>
        </div>

        <!-- 教育经历 -->
        <div class="section-card" id="education">
          <div class="section-header">
            <h3 class="section-title">教育经历</h3>
            <button class="btn-add-education" @click="addEducation">
              <span class="add-icon">+</span> 添加教育经历
            </button>
          </div>
          
          <div 
            v-for="(edu, index) in formData.educations" 
            :key="index"
            class="education-block"
          >
            <div class="education-header">
              <span class="education-number">教育经历 {{ index + 1 }}</span>
              <button 
                v-if="formData.educations.length > 1" 
                class="btn-remove-education" 
                @click="removeEducation(index)"
              >
                删除
              </button>
            </div>
            
            <div class="form-grid">
              <div class="form-item">
                <label>学校名称</label>
                <input type="text" v-model="edu.school" placeholder="请输入学校名称" />
              </div>
              <div class="form-item">
                <label>层次</label>
                <select v-model="edu.degree">
                  <option value="">请选择</option>
                  <option value="本科">本科</option>
                  <option value="硕士">硕士</option>
                  <option value="博士">博士</option>
                </select>
              </div>
              <div class="form-item">
                <label>入学日期</label>
                <input type="date" v-model="edu.startDate" />
              </div>
              <div class="form-item">
                <label>毕业日期</label>
                <input type="date" v-model="edu.endDate" />
              </div>
              <div class="form-item">
                <label>专业</label>
                <input type="text" v-model="edu.major" placeholder="请输入专业" />
              </div>
              <div class="form-item">
                <label>专业排名</label>
                <input type="text" v-model="edu.ranking" placeholder="如：Top 5%" />
              </div>
            </div>
          </div>
        </div>

        <!-- 期望岗位 -->
        <div class="section-card" id="job">
          <h3 class="section-title">期望岗位</h3>
          <div class="form-grid">
            <div class="form-item full-width">
              <label>期望岗位</label>
              <input type="text" v-model="formData.desiredPosition" placeholder="请输入期望岗位" />
            </div>
            <div class="form-item">
              <label>期望最低薪资</label>
              <input 
                type="number" 
                v-model.number="formData.expectedMinSalary" 
                placeholder="请输入最低薪资"
              />
              <span class="salary-hint">校招 k/月 | 实习 元/天</span>
            </div>
            <div class="form-item">
              <label>期望最高薪资</label>
              <input 
                type="number" 
                v-model.number="formData.expectedMaxSalary" 
                placeholder="请输入最高薪资"
              />
              <span class="salary-hint">校招 k/月 | 实习 元/天</span>
            </div>
          </div>
        </div>

        <!-- 能力标签 -->
        <div class="section-card" id="tags">
          <h3 class="section-title">能力标签</h3>
          <div class="tags-selector">
            <select v-model="selectedCategory" class="tag-select" @change="onCategoryChange">
              <option value="">选择标签分类</option>
              <option v-for="category in tagCategories" :key="category.category_id" :value="category.category_id">
                {{ category.category_name }}
              </option>
            </select>
            <select v-model="newTag" class="tag-select" :disabled="!selectedCategory">
              <option value="">选择具体标签</option>
              <option v-for="tag in currentCategoryTags" :key="tag.tag_id" :value="tag.tag_id">
                {{ tag.tag_name }}
              </option>
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
                {{ tag.name }}
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
// ✅ 导入API方法
import { getEditProfile, updateProfile, uploadAvatar } from '@/api'
import { getAvailableTags } from '@/api/tags'
import { loadImageWithAuth, revokeBlobUrls } from '@/utils/imageLoader'
// ✅ 导入默认头像
import defaultAvatar from '@/assets/default-avatar.png'

export default {
  name: 'StudentProfile',
  data() {
    return {
      currentSection: 'avatar',
      avatarUrl: defaultAvatar,  // 初始使用默认头像
      pendingAvatarFile: null,  // 待上传的头像文件
      loading: false,
      baseURL: 'http://localhost:8080',
      
      // 左侧导航项
      navItems: [
        { id: 'avatar', label: '个人头像' },
        { id: 'basic', label: '基本信息'},
        { id: 'education', label: '教育经历'},
        { id: 'job', label: '期望岗位'},
        { id: 'tags', label: '能力标签'}
      ],
      
      // ✅ 中文到数字的映射
      genderMap: {
        '男': 0,
        '女': 1
      },
      jobStatusMap: {
        '在校-暂不考虑': 0,
        '在校-寻求实习': 1,
        '寻求实习': 1,  // 兼容后端可能的简写
        '应届-寻求实习': 2,
        '应届-寻求校招': 3
      },
      degreeMap: {
        '本科': 0,
        '硕士': 1,
        '博士': 2
      },
      
      // ✅ 数字到中文的反向映射（提交时使用）
      genderReverseMap: {
        0: '男',
        1: '女'
      },
      jobStatusReverseMap: {
        0: '在校-暂不考虑',
        1: '在校-寻求实习',
        2: '应届-寻求实习',
        3: '应届-寻求校招'
      },
      degreeReverseMap: {
        0: '本科',
        1: '硕士',
        2: '博士'
      },
      
      // ✅ 表单数据（从API获取）
      formData: {
        name: '',
        studentId: '',
        birthday: '',
        gender: null,
        jobStatus: null,
        email: '',
        phone: '',
        educations: [
          {
            school: '',
            degree: '',
            startDate: '',
            endDate: '',
            major: '',
            ranking: ''
          }
        ],
        desiredPosition: '',
        expectedMinSalary: 0,
        expectedMaxSalary: 0,
        tags: []  // 改为存储对象数组 { id, name }
      },
      
      // ✅ 标签相关数据
      tagCategories: [],  // 标签分类列表
      selectedCategory: '',  // 当前选中的分类
      currentCategoryTags: [],  // 当前分类下的标签
      newTag: ''  // 新选择的标签ID
    }
  },
  async mounted() {
    // ✅ 加载数据
    await this.loadProfileData()
    await this.loadAvailableTags()
    
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
    
    // ✅ 释放 blob URL，避免内存泄漏
    if (this.avatarUrl && this.avatarUrl.startsWith('blob:')) {
      revokeBlobUrls([this.avatarUrl])
    }
    
    // 清空待上传的头像文件
    this.pendingAvatarFile = null
  },
  watch: {
    // ✅ 监听新标签选择
    newTag(tagId) {
      console.log('【选择了标签ID】', tagId)
      
      if (tagId) {
        // 检查是否已经添加
        if (this.formData.tags.some(tag => tag.id === tagId)) {
          console.log('【标签已存在，跳过】')
          this.newTag = ''
          return
        }
        
        // 找到标签名称
        console.log('【从以下标签中查找】', this.currentCategoryTags)
        const tag = this.currentCategoryTags.find(t => t.tag_id === tagId)
        console.log('【找到的标签】', tag)
        
        if (tag) {
          const newTagObj = {
            id: tag.tag_id,
            name: tag.tag_name || tag.name || '未命名'
          }
          console.log('【添加标签对象】', newTagObj)
          this.formData.tags.push(newTagObj)
          console.log('【当前所有标签】', this.formData.tags)
        }
        
        this.newTag = ''
      }
    }
  },
  methods: {

    
    // ✅ 加载个人档案数据
    async loadProfileData() {
      try {
        this.loading = true
        const data = await getEditProfile()
        
        console.log('【加载个人档案】', data)
        
        // 映射数据到表单
        // ✅ 加载头像（带token验证），如果没有头像URL则使用默认头像
        if (data.avatar_url) {
          try {
            // 🔧 修复：传入 defaultAvatar 作为默认图片，确保加载失败时返回默认头像而不是空字符串
            this.avatarUrl = await loadImageWithAuth(data.avatar_url, this.baseURL, defaultAvatar)
            // 🔧 如果返回空字符串，说明加载失败，使用默认头像
            if (!this.avatarUrl || this.avatarUrl === '') {
              this.avatarUrl = defaultAvatar
            }
          } catch (error) {
            console.warn('【头像加载失败，使用默认头像】', error)
            this.avatarUrl = defaultAvatar
          }
        } else {
          this.avatarUrl = defaultAvatar
        }
        
        // ✅ 处理枚举字段
        // 性别：中文字符串 → 数字（用于前端下拉框）
        const gender = data.basic_info?.gender != null ? this.genderMap[data.basic_info.gender] ?? null : null
        // 求职状态：后端返回的已经是字符串，直接使用
        const jobStatus = data.basic_info?.job_seeking_status || null
        
        // ✅ 处理日期格式：如果是 "yyyy-MM" 格式，补充 "-01"
        const formatDate = (dateStr) => {
          if (!dateStr) return ''
          // 如果是 yyyy-MM 格式，补充 -01
          if (/^\d{4}-\d{2}$/.test(dateStr)) {
            return `${dateStr}-01`
          }
          return dateStr
        }
        
        // ✅ 处理教育经历数组
        let educations = []
        if (data.primary_education && Array.isArray(data.primary_education) && data.primary_education.length > 0) {
          educations = data.primary_education.map(edu => ({
            id: edu.id || null, // 保存教育经历ID（后端新增）
            school: edu.school_name || '',
            degree: edu.degree_level || '',
            startDate: formatDate(edu.start_date),
            endDate: formatDate(edu.end_date),
            major: edu.major || '',
            ranking: edu.major_rank || ''
          }))
        } else {
          // 如果没有教育经历，提供一个空模板
          educations = [{
            id: null, // 新增的没有ID
            school: '',
            degree: '',
            startDate: '',
            endDate: '',
            major: '',
            ranking: ''
          }]
        }
        
        console.log('【教育经历数组】', educations)
        
        // ✅ 打印标签原始数据
        console.log('【原始标签数据】', data.personal_tags)
        
        this.formData = {
          name: data.basic_info?.full_name || '',
          studentId: data.basic_info?.student_id || '',
          birthday: formatDate(data.basic_info?.date_of_birth),
          gender: gender,
          jobStatus: jobStatus,
          email: data.basic_info?.email || '',
          phone: data.basic_info?.phone_number || '',
          educations: educations,
          desiredPosition: data.expected_job?.expected_position || '',
          expectedMinSalary: data.expected_job?.expected_min_salary || 0,
          expectedMaxSalary: data.expected_job?.expected_max_salary || 0,
          tags: (data.personal_tags || []).map(tag => {
            console.log('【处理标签】', tag)
            return {
              id: tag.tag_id,
              name: tag.tag_name || tag.name || '未命名标签'
            }
          })
        }
        
        console.log('【转换后的formData】', this.formData)
        console.log('【转换后的标签列表】', this.formData.tags)
        
      } catch (error) {
        console.error('【加载个人档案失败】', error)
        alert('加载个人信息失败，请刷新页面重试')
      } finally {
        this.loading = false
      }
    },
    
    // ✅ 加载可用标签（分组）
    async loadAvailableTags() {
      try {
        const data = await getAvailableTags()
        console.log('【加载可用标签-完整响应】', data)
        
        // 保存分组标签数据
        this.tagCategories = data.grouped_tags || data.tags || data || []
        
        console.log('【标签分类列表】', this.tagCategories)
        console.log('【标签分类数量】', this.tagCategories.length)
        
        if (this.tagCategories.length > 0) {
          console.log('【第一个分类示例】', this.tagCategories[0])
        }
        
      } catch (error) {
        console.error('【加载可用标签失败】', error)
        console.warn('⚠️ 标签加载失败，使用本地标签列表作为备用')
        
        // ⚠️ 降级方案：使用本地标签列表（如果后端接口不可用）
        this.tagCategories = [
          {
            category_id: 1,
            category_name: '编程语言',
            tags: [
              { tag_id: 1, tag_name: 'Java' },
              { tag_id: 2, tag_name: 'Python' },
              { tag_id: 3, tag_name: 'C++' },
              { tag_id: 4, tag_name: 'JavaScript' }
            ]
          },
          {
            category_id: 2,
            category_name: '技术框架/库',
            tags: [
              { tag_id: 5, tag_name: 'React' },
              { tag_id: 6, tag_name: 'Vue' },
              { tag_id: 7, tag_name: 'Spring Boot' }
            ]
          }
        ]
      }
    },
    
    // ✅ 分类变化时更新可选标签
    onCategoryChange() {
      console.log('【选择的分类ID】', this.selectedCategory)
      console.log('【所有分类】', this.tagCategories)
      
      const category = this.tagCategories.find(cat => cat.category_id === this.selectedCategory)
      console.log('【找到的分类】', category)
      
      this.currentCategoryTags = category ? category.tags : []
      console.log('【当前分类下的标签】', this.currentCategoryTags)
      
      this.newTag = ''
    },
    
    // 触发文件选择
    handleAvatarUpload() {
      this.$refs.avatarInput.click()
    },
    
    // ✅ 处理头像文件变化（只做本地预览，不上传）
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
        
        // 保存待上传的文件
        this.pendingAvatarFile = file
        
        // ✅ 释放旧的 blob URL
        if (this.avatarUrl && this.avatarUrl.startsWith('blob:')) {
          URL.revokeObjectURL(this.avatarUrl)
        }
        
        // 创建本地预览
        this.avatarUrl = URL.createObjectURL(file)
        console.log('【头像已选择，等待提交】')
        
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
    
    // ✅ 移除标签
    removeTag(index) {
      this.formData.tags.splice(index, 1)
    },
    
    // ✅ 添加教育经历
    addEducation() {
      this.formData.educations.push({
        id: null, // 新增的教育经历没有ID
        school: '',
        degree: '',
        startDate: '',
        endDate: '',
        major: '',
        ranking: ''
      })
    },
    
    // ✅ 删除教育经历
    removeEducation(index) {
      if (this.formData.educations.length > 1) {
        this.formData.educations.splice(index, 1)
      } else {
        alert('至少需要保留一条教育经历')
      }
    },
    
    // ✅ 验证必填字段
    validateForm() {
      // 验证姓名
      if (!this.formData.name || !this.formData.name.trim()) {
        alert('请填写姓名')
        return false
      }
      
      // 验证学号
      if (!this.formData.studentId || !this.formData.studentId.trim()) {
        alert('请填写学号')
        return false
      }
      
      // 验证出生日期
      if (!this.formData.birthday) {
        alert('请选择出生日期')
        return false
      }
      
      // 验证性别
      if (this.formData.gender === null || this.formData.gender === undefined) {
        alert('请选择性别')
        return false
      }
      
      // 验证求职状态
      if (this.formData.jobStatus === null || this.formData.jobStatus === undefined) {
        alert('请选择求职状态')
        return false
      }
      
      // 验证电话
      if (!this.formData.phone || !this.formData.phone.trim()) {
        alert('请填写电话')
        return false
      }
      
      // 验证电话格式
      const phoneRegex = /^1[3-9]\d{9}$/
      if (!phoneRegex.test(this.formData.phone)) {
        alert('请输入正确的手机号码')
        return false
      }
      
      return true
    },
    
    // 返回
    goBack() {
      this.$router.push({ name: 'StudentCenter' })
    },
    
    // 取消编辑
    cancelEdit() {
      // 清空待上传的头像文件
      this.pendingAvatarFile = null
      this.$router.push({ name: 'StudentCenter' })
    },
    
    // ✅ 提交表单（调用真实API）
    async submitForm() {
      // ✅ 先验证必填字段
      if (!this.validateForm()) {
        return
      }
      
      try {
        this.loading = true
        
        // ✅ 如果有待上传的头像，先上传头像
        if (this.pendingAvatarFile) {
          try {
            console.log('【开始上传头像】')
            const formData = new FormData()
            formData.append('avatar_file', this.pendingAvatarFile)
            
            const data = await uploadAvatar(formData)
            console.log('【头像上传成功】', data.new_avatar_url)
            
            // 清空待上传的文件
            this.pendingAvatarFile = null
          } catch (error) {
            console.error('【头像上传失败】', error)
            alert('头像上传失败，请重试')
            this.loading = false
            return
          }
        }
        
        // ✅ 处理日期格式：所有日期都使用完整的 yyyy-MM-dd 格式提交
        const formatDateForSubmit = (dateStr) => {
          if (!dateStr) return ''
          // 直接返回完整格式，后端需要 yyyy-MM-dd 格式
          return dateStr
        }
        
        // ✅ 组织成后端需要的数据格式
        const payload = {
          basic_info: {
            full_name: this.formData.name,
            gender: this.formData.gender != null ? this.genderReverseMap[this.formData.gender] : '',
            date_of_birth: formatDateForSubmit(this.formData.birthday), // 生日使用完整格式 yyyy-MM-dd
            job_seeking_status: this.formData.jobStatus || '', // 求职状态直接使用字符串
            email: this.formData.email || '',
            phone_number: this.formData.phone,
            student_id: this.formData.studentId
          },
          primary_education: this.formData.educations.map(edu => {
            const eduData = {
              school_name: edu.school || '',
              degree_level: edu.degree || '',
              major: edu.major || '',
              start_date: formatDateForSubmit(edu.startDate) || '',
              end_date: formatDateForSubmit(edu.endDate) || '',
              major_rank: edu.ranking || ''
            }
            // 如果有ID，说明是更新现有记录
            if (edu.id) {
              eduData.id = edu.id
            }
            return eduData
          }),
          expected_job: {
            expected_position: this.formData.desiredPosition || '',
            expected_min_salary: parseInt(this.formData.expectedMinSalary) || 0,
            expected_max_salary: parseInt(this.formData.expectedMaxSalary) || 0
          },
          personal_tag_ids: this.formData.tags.map(tag => tag.id)
        }
        
        console.log('【提交个人档案 - 完整数据】', JSON.stringify(payload, null, 2))
        console.log('【基本信息】', payload.basic_info)
        console.log('【教育经历】', payload.primary_education)
        console.log('【期望岗位】', payload.expected_job)
        console.log('【标签IDs】', payload.personal_tag_ids)
        
        // ✅ 调用API更新档案
        await updateProfile(payload)
        
        alert('个人信息更新成功！')
        this.$router.push({ name: 'StudentCenter' })
        
      } catch (error) {
        console.error('【更新个人档案失败】', error)
        alert('更新失败，请重试')
      } finally {
        this.loading = false
      }
    }

  }
}
</script>

<style scoped>
.profile-page {
  min-height: calc(100vh - 105px);
  background: #f5f5f5;
  padding: 30px;
}

/* 面包屑导航 - 固定定位 */
.breadcrumb {
  position: fixed;
  top: 105px;
  left: 0;
  width: 100%;
  background: #f4f4f4;
  padding: 20px 30px 20px 60px; /* 上 右 下 左：增加左边距，让文字往右移动 */
  z-index: 1000;
  height: 115px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
}

.breadcrumb::after {
  content: '';
  position: absolute;
  top: 20px;
  left: 30px;
  right: 30px;
  bottom: 20px;
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: -1;
  border-radius: 0;
}

.crumb-item {
  color: #325e21;
  cursor: pointer;
  font-weight: 500;
  font-size: 20px;
  position: relative;
  z-index: 1;
}

.crumb-item:hover {
  text-decoration: underline;
}

.crumb-item.current {
  color: #666;
  cursor: default;
}

.crumb-item.current:hover {
  text-decoration: none;
}

.separator {
  margin: 0 10px;
  color: #666;
  font-size: 20px;
  position: relative;
  z-index: 1;
}

/* 主容器 */
.profile-container {
  display: flex;
  gap: 20px;
  align-items: flex-start;
  padding-top: 85px;
  width: 100%;
  position: relative;
}

/* 左侧导航栏 - 固定定位 */
.sidebar {
  position: fixed;
  top: 220px;
  left: 30px;
  width: 280px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 30px;
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
  padding: 15px 0;
  cursor: pointer;
  font-size: 22px;
  color: #666;
  border-bottom: 1px solid #f0f0f0;
  transition: all 0.3s;
}

.nav-list li:hover {
  color: #325e21;
  background: #f8f9fa;
}

.nav-list li.active {
  color: #325e21;
  font-weight: bold;
  background: #f0f7f0;
}

.nav-icon {
  display: none;
}

/* 右侧内容区 */
.content-area {
  flex: 1;
  min-width: 0;
  margin-left: 320px;
}

.section-card {
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 40px;
  box-sizing: border-box;
  margin-bottom: 20px;
  scroll-margin-top: 20px;
}

.section-title {
  color: #325e21;
  font-size: 30px;
  font-weight: bold;
  border-left: 4px solid #325e21;
  padding-left: 12px;
  margin: 0 0 25px 0;
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
  background: #325e21;
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
  font-size: 18px;
  font-weight: 600;
  color: #666;
}

.form-item.full-width {
  grid-column: 1 / -1;
}

.required-star {
  color: #f44336;
  margin-right: 4px;
  font-size: 18px;
}

.form-item input,
.form-item select {
  padding: 12px 16px;
  border: 1px solid #d8d8d8;
  border-radius: 6px;
  font-size: 18px;
  transition: all 0.3s;
}

.form-item input:focus,
.form-item select:focus {
  outline: none;
  border-color: #325e21;
  background: #fff;
}

.salary-hint {
  font-size: 14px;
  color: #999;
  margin-top: 5px;
  font-style: italic;
}

/* 教育经历块样式 */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.btn-add-education {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: #325e21;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-add-education:hover {
  background: #2a4e1b;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(50, 94, 33, 0.3);
}

.add-icon {
  font-size: 20px;
  line-height: 1;
}

.education-block {
  padding: 25px;
  background: #f8f9fa;
  border-radius: 10px;
  margin-bottom: 20px;
  border-left: 4px solid #325e21;
}

.education-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.education-number {
  font-size: 20px;
  font-weight: 700;
  color: #325e21;
}

.btn-remove-education {
  padding: 6px 16px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-remove-education:hover {
  background: #c82333;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
}

/* 标签选择器 */
.tags-selector {
  margin-bottom: 20px;
  display: flex;
  gap: 15px;
}

.tag-select {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #d8d8d8;
  border-radius: 6px;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.3s;
  background: white;
}

.tag-select:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
  color: #999;
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
  padding: 40px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.btn-cancel,
.btn-submit {
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
}

.btn-cancel {
  background: #6c757d;
  color: #fff;
}

.btn-cancel:hover {
  background: #5a6268;
}

.btn-submit {
  background: #325e21;
  color: white;
}

.btn-submit:hover {
  background: #2a4e1b;
}

/* 响应式 */
@media (max-width: 1200px) {
  .content-area {
    margin-left: 0;
  }
}

@media (max-width: 992px) {
  .profile-container {
    flex-direction: column;
  }
  
  .sidebar {
    position: static;
    width: 100%;
    height: auto;
    margin-bottom: 20px;
  }
  
  .content-area {
    margin-left: 0;
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

