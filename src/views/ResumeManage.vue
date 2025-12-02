<template>
  <div class="resume-page">
    <!-- 顶部面包屑与操作 -->
    <div class="breadcrumb-wrapper">
      <div class="breadcrumb">
        <router-link to="/student-home" class="breadcrumb-link">主页</router-link>
        <span class="breadcrumb-separator">></span>
        <span class="breadcrumb-current">简历编辑器</span>

        <div class="edit-actions">
          <button class="btn ghost" @click="clearAll">清空</button>
          <template v-if="!editing">
            <button class="btn" @click="startEdit">编辑</button>
          </template>
          <template v-else>
            <button class="btn ghost" @click="cancelEdit">取消</button>
            <button class="btn primary" @click="saveResume">确认</button>
          </template>
        </div>
      </div>
    </div>

    <div class="layout">
      <!-- 左侧目录 -->
      <aside class="left-sidebar fixed-sidebar">
        <div class="sidebar-title">简历目录</div>
        <div class="title-divider"></div>
        <div
          v-for="s in sections"
          :key="s.id"
          class="sidebar-item"
          :class="{ active: activeSection === s.id }"
          @click="scrollTo(s.id)"
        >
          {{ s.name }}
        </div>
      </aside>
<!-- 中间内容 -->
<main class="center-content">
  <!-- 个人信息 -->
  <section id="profile" ref="profile" class="card">
    <h3 class="section-title">个人信息</h3>
    <div class="grid-3">
      <div class="field">
        <label>姓名</label>
        <input v-model="form.profile.name"
               :disabled="isLocked('profile.name') || !editing" />
      </div>

      <div class="field">
        <label>出生年月</label>
        <input v-model="form.profile.birthday"
               :disabled="isLocked('profile.birthday') || !editing"
               placeholder="YYYY-MM" />
      </div>

      <div class="field">
        <label>邮箱</label>
        <input v-model="form.profile.email"
               :disabled="isLocked('profile.email') || !editing" />
      </div>

      <div class="field">
  <label>性别</label>
  <select v-model="form.profile.gender"
          :disabled="isLocked('profile.gender') || !editing">
    <option value="">请选择</option>
    <option>男</option><option>女</option><option>其他</option>
  </select>
</div>

<div class="field">
  <label>求职状态</label>
  <select v-model="form.profile.status"
          :disabled="isLocked('profile.status') || !editing">
    <option>实习</option><option>校招</option><option>社招</option>
  </select>
</div>


      <div class="field">
        <label>电话</label>
        <input v-model="form.profile.phone"
               :disabled="isLocked('profile.phone') || !editing"
               @blur="validatePhone" />
        <span v-if="phoneError" class="error-text">{{ phoneError }}</span>
      </div>
    </div>
  </section>

  <!-- 技能 -->
  <section id="skills" ref="skills" class="card">
    <h3 class="section-title">技能掌握</h3>
    <textarea v-model="form.skills" :disabled="!editing"
              class="textarea" placeholder="编辑个人优势、熟练技术栈等..."></textarea>
  </section>

 <!-- 工作经历 -->
 <section id="work" ref="work" class="card">
    <div class="card-head">
      <h3 class="section-title">工作经历</h3>
      <button v-if="editing" class="link-add" @click="addWork">+ 添加</button>
    </div>

    <div
      v-for="(w,i) in form.work"
      :key="i"
      class="block"
      :class="{ 'block-confirmed': w._confirmed }"
    >
      <div class="grid-3">
        <div class="field">
          <label>公司名称</label>
          <input
            v-model="w.company"
            :disabled="!editing"
            @input="w._confirmed = false"
          />
        </div>

        <div class="field">
          <label>职位名称</label>
          <input
            v-model="w.title"
            :disabled="!editing"
            @input="w._confirmed = false"
          />
        </div>

        <div class="field">
          <label>在职时间</label>
          <div class="inline">
            <el-date-picker
              v-model="w.start"
              type="month"
              placeholder="开始年月"
              format="YYYY-MM"
              value-format="YYYY-MM"
              :disabled="!editing"
              @change="w._confirmed = false"
            />

            <span class="to">至</span>

            <el-date-picker
              v-model="w.end"
              type="month"
              placeholder="结束年月"
              format="YYYY-MM"
              value-format="YYYY-MM"
              :disabled="!editing"
              @change="w._confirmed = false"
            />
          </div>
        </div>
      </div>

      <div class="field mt8">
        <label>工作内容</label>
        <textarea
          v-model="w.content"
          :disabled="!editing"
          class="textarea small"
          @input="w._confirmed = false"
        ></textarea>
      </div>

      <!-- 底部按钮区域 -->
      <div v-if="editing" class="block-footer">
        <button
          class="pill-btn"
          :class="{ 'pill-disabled': w._confirmed }"
          :disabled="w._confirmed"
          @click="confirmWork(i, w)"
        >
          {{ w._confirmed ? '已确认' : '确定' }}
        </button>

        <button class="pill-btn pill-danger" @click="removeWork(i, w)">
          删除该经历
        </button>
      </div>
    </div>
  </section>

  <!-- 项目经历 -->
  <section id="projects" ref="projects" class="card">
    <div class="card-head">
      <h3 class="section-title">项目经历</h3>
      <button v-if="editing" class="link-add" @click="addProject">+ 添加</button>
    </div>

    <div
      v-for="(p,i) in form.projects"
      :key="i"
      class="block"
      :class="{ 'block-confirmed': p._confirmed }"
    >
      <div class="grid-3">
        <div class="field">
          <label>项目名称</label>
          <input
            v-model="p.name"
            :disabled="!editing"
            @input="p._confirmed = false"
          />
        </div>

        <div class="field">
          <label>项目角色</label>
          <input
            v-model="p.role"
            :disabled="!editing"
            @input="p._confirmed = false"
          />
        </div>

        <div class="field">
          <label>项目时间</label>
          <div class="inline">
            <el-date-picker
              v-model="p.start"
              type="month"
              placeholder="开始年月"
              format="YYYY-MM"
              value-format="YYYY-MM"
              :disabled="!editing"
              @change="p._confirmed = false"
            />

            <span class="to">至</span>

            <el-date-picker
              v-model="p.end"
              type="month"
              placeholder="结束年月"
              format="YYYY-MM"
              value-format="YYYY-MM"
              :disabled="!editing"
              @change="p._confirmed = false"
            />
          </div>
        </div>
      </div>

      <div class="field mt8">
        <label>项目描述</label>
        <textarea
          v-model="p.desc"
          :disabled="!editing"
          class="textarea small"
          @input="p._confirmed = false"
        ></textarea>
      </div>

      <div v-if="editing" class="block-footer">
        <button
          class="pill-btn"
          :class="{ 'pill-disabled': p._confirmed }"
          :disabled="p._confirmed"
          @click="confirmProject(i, p)"
        >
          {{ p._confirmed ? '已确认' : '确定' }}
        </button>

        <button class="pill-btn pill-danger" @click="removeProject(i, p)">
          删除该项目
        </button>
      </div>
    </div>
  </section>

  <!-- 教育经历（仅第 1 条锁定） -->
  <section id="edu" ref="edu" class="card">
    <div class="card-head">
      <h3 class="section-title">教育经历</h3>
         <!-- 教育经历只读，不允许新增 -->
    <!-- <button v-if="editing" class="link-add" @click="addEdu">+ 添加</button> -->

    </div>
    <div v-for="(e,i) in form.education" :key="i" class="block">
      <div class="grid-3">
        <div class="field">
          <label>学校名称</label>
          <input v-model="e.school" :disabled="true" />
        </div>
        <div class="field">
          <label>专业</label>
          <input v-model="e.major" :disabled="true" />
        </div>
        <div class="field">
          <label>专业排名</label>
          <input v-model="e.rank" :disabled="true" placeholder="可选" />
                
        </div>
      </div>
      <div class="field mt8">
        <label>时间段</label>
        <div class="inline">
          <el-date-picker
  v-model="e.start"
  type="month"
  placeholder="开始年月"
  format="YYYY-MM"
  value-format="YYYY-MM"
  :disabled="true"
/>

<span class="to">至</span>

<el-date-picker
  v-model="e.end"
  type="month"
  placeholder="结束年月"
  format="YYYY-MM"
  value-format="YYYY-MM"
  :disabled="true"
/>

</div>

      </div>

    </div>
  </section>

 <!-- 社团/组织 -->
 <section id="orgs" ref="orgs" class="card" v-if="form.orgs?.length || editing">
    <div class="card-head">
      <h3 class="section-title">社团 / 组织经历</h3>
      <button v-if="editing" class="link-add" @click="addOrg">+ 添加</button>
    </div>

    <div
      v-for="(o,i) in form.orgs"
      :key="i"
      class="block"
      :class="{ 'block-confirmed': o._confirmed }"
    >
      <div class="grid-3">
        <div class="field">
          <label>社团/组织名称</label>
          <input
            v-model="o.name"
            :disabled="!editing"
            @input="o._confirmed = false"
          />
        </div>

        <div class="field">
          <label>担任角色</label>
          <input
            v-model="o.role"
            :disabled="!editing"
            @input="o._confirmed = false"
          />
        </div>

        <div class="field">
          <label>时间段</label>
          <div class="inline">
            <el-date-picker
              v-model="o.start"
              type="month"
              placeholder="开始年月"
              format="YYYY-MM"
              value-format="YYYY-MM"
              :disabled="!editing"
              @change="o._confirmed = false"
            />

            <span class="to">至</span>

            <el-date-picker
              v-model="o.end"
              type="month"
              placeholder="结束年月"
              format="YYYY-MM"
              value-format="YYYY-MM"
              :disabled="!editing"
              @change="o._confirmed = false"
            />
          </div>
        </div>
      </div>

      <div class="field mt8">
        <label>经历描述</label>
        <textarea
          v-model="o.desc"
          :disabled="!editing"
          class="textarea small"
          @input="o._confirmed = false"
        ></textarea>
      </div>

      <div v-if="editing" class="block-footer">
        <button
          class="pill-btn"
          :class="{ 'pill-disabled': o._confirmed }"
          :disabled="o._confirmed"
          @click="confirmOrg(i, o)"
        >
          {{ o._confirmed ? '已确认' : '确定' }}
        </button>

        <button class="pill-btn pill-danger" @click="removeOrg(i, o)">
          删除该经历
        </button>
      </div>
    </div>
  </section>

  <!-- 竞赛 -->
  <section id="competitions" ref="competitions" class="card" v-if="form.competitions?.length || editing">
    <div class="card-head">
      <h3 class="section-title">竞赛经历</h3>
      <button v-if="editing" class="link-add" @click="addCompetition">+ 添加</button>
    </div>

    <div
      v-for="(c,i) in form.competitions"
      :key="i"
      class="block"
      :class="{ 'block-confirmed': c._confirmed }"
    >
      <div class="grid-3">
        <div class="field">
          <label>竞赛名称</label>
          <input
            v-model="c.name"
            :disabled="!editing"
            @input="c._confirmed = false"
          />
        </div>

        <div class="field">
          <label>担任角色</label>
          <input
            v-model="c.role"
            :disabled="!editing"
            @input="c._confirmed = false"
          />
        </div>

        <div class="field">
          <label>获得奖项</label>
          <input
            v-model="c.award"
            :disabled="!editing"
            placeholder="可选"
            @input="c._confirmed = false"
          />
        </div>
      </div>

      <div v-if="editing" class="block-footer">
        <button
          class="pill-btn"
          :class="{ 'pill-disabled': c._confirmed }"
          :disabled="c._confirmed"
          @click="confirmCompetition(i, c)"
        >
          {{ c._confirmed ? '已确认' : '确定' }}
        </button>

        <button class="pill-btn pill-danger" @click="removeCompetition(i, c)">
          删除该竞赛
        </button>
      </div>
    </div>
  </section>
</main>


      <!-- 右侧：设置 + 列表 -->
      <aside class="right-sidebar fixed-sidebar">
        <div class="card small-card">
          <h3 class="section-title">设置</h3>
          <div class="field">
            <label>切换模版</label>
            <select v-model="form.template" :disabled="true">
              <option value="school">学校模版</option>
            </select>
          </div>
          <div class="divider"></div>
          <button class="btn primary w-100" @click="openPreview">生成简历</button>
        </div>

        <div class="card small-card">
          <div class="list-head">
            <h3 class="section-title">我的简历</h3>
            <button class="icon-btn" @click="triggerUpload" title="上传本地 PDF 到列表">＋</button>
            <input ref="fileInput" type="file" accept="application/pdf" class="hidden-input" @change="importFromLocal" />
          </div>

          <div v-if="!fileList.length" class="empty-box">
            <div class="empty-icon">📄</div>
            <div class="empty-text">还没有生成的简历</div>
            <div class="empty-sub">点击「生成简历」或右上角「＋」上传 PDF</div>
          </div>

          <div v-else class="file-list">
            <div v-for="f in fileList" :key="f.id" class="file-row">
              <div class="file-left">
                <div class="file-icon">PDF</div>
                <div class="file-info">
                  <div class="file-title" :title="f.fileName">{{ f.fileName }}</div>
                  <div class="file-meta">{{ formatSize(f.size) }} · {{ formatTime(f.createdAt) }}</div>
                </div>
              </div>
              <div class="file-actions">
                <button class="btn light small" @click="downloadFromList(f)">下载</button>
                <button class="btn light danger small" @click="removeFromList(f)">删除</button>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>

    <!-- 预览 = 当前简历效果 -->
    <el-dialog v-model="previewVisible" title="简历预览" width="960px" :close-on-click-modal="false">
      <div class="preview-toolbar">
        <button class="btn" @click="exportPlainPDF">导出简历</button>
        <button class="btn ghost" @click="renderPlain('plain-preview')">刷新预览</button>
      </div>
      <div id="plain-preview" class="preview-paper" style="width:794px;"></div>
    </el-dialog>

    <!-- 离屏导出挂载点 -->
    <teleport to="body">
      <div id="export-root" class="export-shadow" aria-hidden="true">
        <div id="plain-print" style="width:794px;"></div>
      </div>
    </teleport>
  </div>
</template>

<script>
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { exportElementToPDF } from '@/utils/pdf'
import campusLogo from '@/assets/campus_logo.png'
import { ElDatePicker } from 'element-plus'

const STORAGE_KEY = 'resume_data_v1'

// ================= 接口前缀 & 路径 =================
const API_PREFIX = 'http://localhost:8080'

// 学生中心档案（含头像）
const API_STUDENT_PROFILE = `${API_PREFIX}/api/student/me/edit-profile`

// 简历草稿
const API_GET_DRAFT = `${API_PREFIX}/resume-center/resume_draft`

// skills
const API_SKILLS = `${API_PREFIX}/resume-center/resume_draft/skills`

// 工作经历
const API_WORK_ADD = `${API_PREFIX}/resume-center/resume_draft/work_experiences`
const API_WORK_EDIT = id => `${API_PREFIX}/resume-center/resume_draft/work_experiences/${id}`
const API_WORK_DEL = id => `${API_PREFIX}/resume-center/resume_draft/work_experiences/${id}`

// 项目经历
const API_PROJ_ADD = `${API_PREFIX}/resume-center/resume_draft/projects`
const API_PROJ_EDIT = id => `${API_PREFIX}/resume-center/resume_draft/projects/${id}`
const API_PROJ_DEL = id => `${API_PREFIX}/resume-center/resume_draft/projects/${id}`

// 组织经历
const API_ORG_ADD = `${API_PREFIX}/resume-center/resume_draft/organizations`
const API_ORG_EDIT = id => `${API_PREFIX}/resume-center/resume_draft/organizations/${id}`
const API_ORG_DEL = id => `${API_PREFIX}/resume-center/resume_draft/organizations/${id}`

// 竞赛经历
const API_COMP_ADD = `${API_PREFIX}/resume-center/resume_draft/competitions`
const API_COMP_EDIT = id => `${API_PREFIX}/resume-center/resume_draft/competitions/${id}`
const API_COMP_DEL = id => `${API_PREFIX}/resume-center/resume_draft/competitions/${id}`

// 模板设置
const API_TEMPLATE = `${API_PREFIX}/resume-center/resume_draft/template`

// 简历文件
const API_GET_FILES = `${API_PREFIX}/resume-center/resume_files`
const API_UPLOAD_PDF = `${API_PREFIX}/resume-center/resume_files/upload`
const API_DELETE_PDF = id => `${API_PREFIX}/resume-center/resume_files/${id}`

// 统一取 token
function getAuthHeaders () {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export default {
  name: 'ResumeManage',
  components: { ElDatePicker },

  data () {
    return {
      editing: false,
      phoneError: '',
      backup: null,

      activeSection: 'profile',
      sections: [
        { id: 'profile', name: '个人信息' },
        { id: 'skills', name: '技能掌握' },
        { id: 'work', name: '工作经历' },
        { id: 'projects', name: '项目经历' },
        { id: 'edu', name: '教育经历' },
        { id: 'orgs', name: '社团/组织经历' },
        { id: 'competitions', name: '竞赛经历' }
      ],

      form: this.getDefaultForm(),
      previewVisible: false,
      exporting: false,
      fileList: [],
      campusLogo
    }
  },
  async mounted () {
  // 本地兜底
  const cached = localStorage.getItem(STORAGE_KEY)
  if (cached) {
    try {
      const parsed = JSON.parse(cached)
      this.form = Object.assign(this.getDefaultForm(), parsed)
    } catch {
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  this.form.template = 'school'

  // 1. 加载简历草稿
  await this.fetchResumeDraft()

  // 2. **这里必须有这一行**
  await this.fetchStudentAvatar()

  // 3. 简历文件列表
  this.fileList = await this.fetchResumeFiles()

  // 4. 滚动高亮
  this.setupScrollSpy()
}

,

  methods: {
    confirmWork (index, w) {
  if (!w.company?.trim() || !w.title?.trim()) {
    ElMessage.warning('请先填写「公司名称」和「职位名称」')
    return
  }
  w._confirmed = true
  ElMessage.success('该工作经历已确认')
},

confirmProject (index, p) {
  if (!p.name?.trim() || !p.role?.trim()) {
    ElMessage.warning('请先填写「项目名称」和「项目角色」')
    return
  }
  p._confirmed = true
  ElMessage.success('该项目经历已确认')
},

confirmOrg (index, o) {
  if (!o.name?.trim() || !o.role?.trim()) {
    ElMessage.warning('请先填写「社团/组织名称」和「担任角色」')
    return
  }
  o._confirmed = true
  ElMessage.success('该社团/组织经历已确认')
},

confirmCompetition (index, c) {
  if (!c.name?.trim() || !c.role?.trim()) {
    ElMessage.warning('请先填写「竞赛名称」和「担任角色」')
    return
  }
  c._confirmed = true
  ElMessage.success('该竞赛经历已确认')
},

    // ========= 保存前统一必填校验 =========
    checkRequiredFields () {
        // 0) 先检查是否有未确认的经历
        const hasUnconfirmed =
  [...this.form.work, ...this.form.projects, ...this.form.orgs, ...this.form.competitions]
    .some(item => item && item._confirmed !== true)


  if (hasUnconfirmed) {
    ElMessage.warning('存在未确认的经历，请先点击每条经历右下角的「确定」或删除')
    return false
  }
    // 1) 工作经历：公司名称、职位名称必填
    const workIdxNoCompany = this.form.work.findIndex(
      w => !w.company || !w.company.trim()
    )
    if (workIdxNoCompany !== -1) {
      ElMessage.warning(`请填写第 ${workIdxNoCompany + 1} 条工作经历的「公司名称」`)
      return false
    }

    const workIdxNoTitle = this.form.work.findIndex(
      w => !w.title || !w.title.trim()
    )
    if (workIdxNoTitle !== -1) {
      ElMessage.warning(`请填写第 ${workIdxNoTitle + 1} 条工作经历的「职位名称」`)
      return false
    }

    // 2) 项目经历：项目名称、项目角色必填
    const projIdxNoName = this.form.projects.findIndex(
      p => !p.name || !p.name.trim()
    )
    if (projIdxNoName !== -1) {
      ElMessage.warning(`请填写第 ${projIdxNoName + 1} 条项目经历的「项目名称」`)
      return false
    }

    const projIdxNoRole = this.form.projects.findIndex(
      p => !p.role || !p.role.trim()
    )
    if (projIdxNoRole !== -1) {
      ElMessage.warning(`请填写第 ${projIdxNoRole + 1} 条项目经历的「项目角色」`)
      return false
    }

    // 3) 社团 / 组织经历：社团/组织名称、担任角色必填
    const orgIdxNoName = this.form.orgs.findIndex(
      o => !o.name || !o.name.trim()
    )
    if (orgIdxNoName !== -1) {
      ElMessage.warning(`请填写第 ${orgIdxNoName + 1} 条社团/组织经历的「社团/组织名称」`)
      return false
    }

    const orgIdxNoRole = this.form.orgs.findIndex(
      o => !o.role || !o.role.trim()
    )
    if (orgIdxNoRole !== -1) {
      ElMessage.warning(`请填写第 ${orgIdxNoRole + 1} 条社团/组织经历的「担任角色」`)
      return false
    }

    // 4) 竞赛经历：竞赛名称、担任角色必填
    const compIdxNoName = this.form.competitions.findIndex(
      c => !c.name || !c.name.trim()
    )
    if (compIdxNoName !== -1) {
      ElMessage.warning(`请填写第 ${compIdxNoName + 1} 条竞赛经历的「竞赛名称」`)
      return false
    }

    const compIdxNoRole = this.form.competitions.findIndex(
      c => !c.role || !c.role.trim()
    )
    if (compIdxNoRole !== -1) {
      ElMessage.warning(`请填写第 ${compIdxNoRole + 1} 条竞赛经历的「担任角色」`)
      return false
    }

    return true
  },

  getDefaultForm () {
    return {
      profile: {
        name: '',          // full_name
        birthday: '',      // date_of_birth
        email: '',         // email
        gender: '',        // gender
        status: '校招',    // job_seeking_status
        phone: '',         // phone_number
        degree: '本科',    // 可由 degree_level 映射
        avatar: ''         // avatar_url
      },
      skills: '',          // skills_summary
      work: [],            // work_experiences
      projects: [],        // project_experiences
      education: [],       // education_experiences（只展示，不在这里保存）
      orgs: [],            // organization_experiences
      competitions: [],    // competition_experiences
      template: 'school'
    }
  },

  // 哪些字段被锁定（不能在这个页面改）
  isLocked (path) {
    const locked = new Set([
      'profile.name',
      'profile.birthday',
      'profile.gender',
      'profile.status',
      'profile.email',
      'profile.phone',
      'profile.degree',
      'edu.school',
      'edu.major',
      'edu.rank',
      'edu.start',
      'edu.end'
    ])
    return locked.has(path)
  },

  /* ========== 加载简历草稿 ========== */
  async fetchResumeDraft () {
    try {
      const res = await axios.get(API_GET_DRAFT, {
        headers: getAuthHeaders()
      })
      if (!res.data || res.data.code !== 200 || !res.data.data) return

      const d = res.data.data
      const f = this.getDefaultForm()

// profile
const p = d.profile || {}
f.profile.name = p.full_name || ''

// 日期直接用原来的（你后面渲染时已经是 YYYY-MM 了）
f.profile.birthday = p.date_of_birth || ''
f.profile.email = p.email || ''
f.profile.phone = p.phone_number || ''

// 1) 性别映射：兼容英文 / 中文
const genderMap = {
  male: '男',
  female: '女',
  other: '其他',
  男: '男',
  女: '女',
  其他: '其他'
}
f.profile.gender = genderMap[p.gender] || ''

// 2) 求职状态映射：各种长句子 → “实习 / 校招 / 社招”
let js = p.job_seeking_status || ''
if (js) {
  if (js.includes('实习')) {
    js = '实习'
  } else if (js.includes('校招')) {
    js = '校招'
  } else {
    js = '社招'
  }
}
f.profile.status = js || f.profile.status


      // ⭐ 先把 avatar_url 拼成完整地址（后面再拉回来转 base64）
      if (p.avatar_url) {
        const raw = p.avatar_url
        if (/^https?:\/\//.test(raw)) {
          f.profile.avatar = raw
        } else {
          f.profile.avatar = `${API_PREFIX}${raw.startsWith('/') ? '' : '/'}${raw}`
        }
      } else {
        f.profile.avatar = ''
      }

      // skills
      f.skills = d.skills_summary || ''

      // education（接口里是一个 education 对象）
      const edu = d.education || {}
      if (Object.keys(edu).length) {
        f.education = [{
          id: edu.id || null,
          school: edu.school_name || '',
          major: edu.major || '',
          rank: edu.major_rank || '',
          start: edu.start_date || '',
          end: edu.end_date || ''
        }]
      }

      // work_experiences
      f.work = (d.work_experiences || []).map(w => ({
        id: w.id || null,
        company: w.company_name || '',
        title: w.position_title || '',
        start: w.start_date || '',
        end: w.end_date || '',
        content: w.description || '',
        _confirmed: true
      }))

      // projects
      f.projects = (d.projects || []).map(pj => ({
        id: pj.id || null,
        name: pj.project_name || '',
        role: pj.role || '',
        start: pj.start_date || '',
        end: pj.end_date || '',
        desc: pj.description || '',
        link: pj.project_link || '',
        _confirmed: true
      }))

      // organizations
      f.orgs = (d.organizations || []).map(o => ({
        id: o.id || null,
        name: o.organization_name || '',
        role: o.role || '',
        start: o.start_date || '',
        end: o.end_date || '',
        desc: o.description || '',
        _confirmed: true
      }))

      // competitions
      f.competitions = (d.competitions || []).map(c => ({
        id: c.id || null,
        name: c.competition_name || '',
        role: c.role || '',
        award: c.award || '',
        time: c.date || '',
        _confirmed: true
      }))

      // ⭐ 关键：用带 token 的 axios 把头像拉回来，转成 base64，
      // 这样 <img> 就不用再去请求受保护的 /files/** 了
      if (f.profile.avatar) {
        try {
          const imgRes = await axios.get(f.profile.avatar, {
            headers: getAuthHeaders(),
            responseType: 'blob'
          })

          const dataUrl = await new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onloadend = () => resolve(reader.result)
            reader.onerror = reject
            reader.readAsDataURL(imgRes.data)
          })

          // 把 avatar 换成 base64
          f.profile.avatar = dataUrl
        } catch (err) {
          console.warn('头像加载失败，将不显示头像', err)
          f.profile.avatar = ''
        }
      }

      this.form = f
      this.persist()
    } catch (e) {
      console.error('加载简历草稿失败：', e)
    }
  },

// ========== 从学生中心档案同步头像 + 基本信息 ==========
async fetchStudentAvatar () {
  try {
    const res = await axios.get(API_STUDENT_PROFILE, {
      headers: getAuthHeaders()
    })

    console.log('【简历页-学生中心接口原始响应】', res.data)

    if (!res.data || res.data.code !== 200 || !res.data.data) {
      console.log('【简历页】学生中心接口 code 非 200 或 data 为空，跳过同步')
      return
    }

    const data = res.data.data
    const basic = data.basic_info || {}

    console.log('【简历页】basic_info = ', basic)

    // 1) 头像
    const raw = data.avatar_url
    if (raw) {
      let full = raw
      if (!/^https?:\/\//.test(raw)) {
        full = `${API_PREFIX}${raw.startsWith('/') ? '' : '/'}${raw}`
      }
      this.form.profile.avatar = full
    }

    // 小工具： yyyy-MM-dd -> yyyy-MM
    const normalizeMonth = (s) => {
      if (!s) return ''
      if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s.slice(0, 7)
      return s
    }

    // 2) 如果简历里这些字段还是空，就用学生中心的填上
    if (!this.form.profile.name && basic.full_name) {
      this.form.profile.name = basic.full_name
    }
    if (!this.form.profile.birthday && basic.date_of_birth) {
      this.form.profile.birthday = normalizeMonth(basic.date_of_birth)
    }
    if (!this.form.profile.email && basic.email) {
      this.form.profile.email = basic.email
    }
    if (!this.form.profile.phone && basic.phone_number) {
      this.form.profile.phone = basic.phone_number
    }

    // 3) 性别：后端是“男 / 女 / 其他”，和下拉框里的文案一致
    if (!this.form.profile.gender && basic.gender) {
      console.log('【简历页】同步性别：', basic.gender)
      this.form.profile.gender = basic.gender   // 比如 “男”
    }

    // 4) 求职状态：学生中心是一句中文，简历这边只有 “实习 / 校招 / 社招”
    if (!this.form.profile.status && basic.job_seeking_status) {
      const js = basic.job_seeking_status
      let mapped = ''

      if (js.includes('实习')) {
        mapped = '实习'
      } else if (js.includes('校招')) {
        mapped = '校招'
      } else {
        mapped = '社招'
      }
      console.log('【简历页】同步求职状态：', js, '=>', mapped)
      this.form.profile.status = mapped
    }

    console.log('【简历页】同步后的 form.profile = ', this.form.profile)

    this.persist()
  } catch (e) {
    console.error('【简历页】获取学生中心档案失败：', e)
  }
}


,

async saveResume () {
      // 手机号校验
      this.validatePhone()
      if (this.phoneError) return

      // ★ 统一必填校验：任何一类缺职位/角色就直接 return
      if (!this.checkRequiredFields()) {
        return
      }

      try {
        const headers = {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        }

        // 1. skills_summary
        await axios.put(
          API_SKILLS,
          { skills_summary: this.form.skills || '' },
          { headers }
        )

        // 2. 工作经历：有 id -> PUT；无 id -> POST
        for (const w of this.form.work) {
          const payload = {
            company_name: w.company,
            position_title: w.title,
            start_date: w.start,
            end_date: w.end,
            description: w.content
          }
          if (w.id) {
            await axios.put(API_WORK_EDIT(w.id), payload, { headers })
          } else {
            const res = await axios.post(API_WORK_ADD, payload, { headers })

            // 按统一返回：{ code, message, data:{ id } }
            if (res.data && res.data.code === 200 && res.data.data && res.data.data.id) {
              w.id = res.data.data.id
            } else {
              console.error('新增工作经历返回异常', res.data)
              const msg = res.data?.message || '新增工作经历失败'
              ElMessage.error(msg)
              throw new Error(msg)
            }
          }
        }

        // 3. 项目经历
        for (const p of this.form.projects) {
          const payload = {
            project_name: p.name,
            role: p.role,
            project_link: p.link || null,
            start_date: p.start,
            end_date: p.end,
            description: p.desc
          }
          if (p.id) {
            await axios.put(API_PROJ_EDIT(p.id), payload, { headers })
          } else {
            const res = await axios.post(API_PROJ_ADD, payload, { headers })
            if (res.data && res.data.code === 200 && res.data.data && res.data.data.id) {
              p.id = res.data.data.id
            }
          }
        }

        // 4. 组织经历
        for (const o of this.form.orgs) {
          const payload = {
            organization_name: o.name,
            role: o.role,
            start_date: o.start,
            end_date: o.end,
            description: o.desc
          }
          if (o.id) {
            await axios.put(API_ORG_EDIT(o.id), payload, { headers })
          } else {
            const res = await axios.post(API_ORG_ADD, payload, { headers })
            if (res.data && res.data.code === 200 && res.data.data && res.data.data.id) {
              o.id = res.data.data.id
            }
          }
        }

        // 5. 竞赛经历
        for (const c of this.form.competitions) {
          const payload = {
            competition_name: c.name,
            role: c.role,
            award: c.award,
            date: c.time
          }
          if (c.id) {
            await axios.put(API_COMP_EDIT(c.id), payload, { headers })
          } else {
            const res = await axios.post(API_COMP_ADD, payload, { headers })
            if (res.data && res.data.code === 200 && res.data.data && res.data.data.id) {
              c.id = res.data.data.id
            }
          }
        }

        // 6. 设置简历模板
        await axios.patch(
          API_TEMPLATE,
          { template: this.form.template },
          { headers }
        )

        this.persist()
        this.editing = false
        ElMessage.success('简历已保存')
      } catch (e) {
        console.error('保存简历失败：', e)
        // 上面已经弹过更具体的错误，这里兜底
        if (!e.message) {
          ElMessage.error('保存失败，请稍后重试')
        }
      }
    },

    /* ========== 简历文件列表 ========== */
    async fetchResumeFiles () {
      try {
        const res = await axios.get(API_GET_FILES, {
          headers: getAuthHeaders()
        })
        if (!res.data || res.data.code !== 200 || !Array.isArray(res.data.data)) {
          return []
        }
        return res.data.data.map(item => ({
          id: item.id,
          fileName: item.file_name,
          size: item.file_size,
          createdAt: item.uploaded_at,
          fileUrl: item.file_url,
          usage: item.usage,        // usage_type
          templateId: item.template_id
        }))
      } catch (e) {
        console.error('获取简历列表失败：', e)
        return []
      }
    },

    triggerUpload () {
      this.$refs.fileInput?.click()
    },

    async importFromLocal (e) {
      const file = e.target.files?.[0]
      e.target.value = ''
      if (!file) return
      if (file.type !== 'application/pdf') {
        ElMessage.warning('仅支持上传 PDF 文件')
        return
      }
      try {
        await this.uploadPdfFile(file, 'USER_UPLOAD')
        ElMessage.success('PDF 已上传')
        this.fileList = await this.fetchResumeFiles()
      } catch (err) {
        console.error(err)
        ElMessage.error('上传失败，请重试')
      }
    },

    async uploadPdfFile(file, usage = 'PDF_EXPORT') {
  try {
    // 后端如果既支持 query 里的 usage，也支持 formData 里的 usage，这样都能兼容
    const url = `${API_UPLOAD_PDF}?usage=${usage}`

    const form = new FormData()
    // 这个字段名很重要，默认先用 file，若后端用的是 pdf_file 之类的，就改成后端的名字
    form.append('file', file)
    form.append('usage', usage)

    const res = await axios.post(url, form, {
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'multipart/form-data'
      }
    })

    return res.data
  } catch (err) {
    console.error('上传 PDF 接口出错：', err.response || err)
    throw err
  }
}

,


    async downloadFromList (item) {
      if (!item.fileUrl) {
        ElMessage.warning('文件地址为空')
        return
      }
      window.open(item.fileUrl, '_blank')
    },

    async removeFromList (item) {
      if (!confirm('删除这份简历文件？')) return
      try {
        await axios.delete(API_DELETE_PDF(item.id), {
          headers: getAuthHeaders()
        })
        ElMessage.success('已删除')
        this.fileList = await this.fetchResumeFiles()
      } catch (e) {
        console.error('删除简历失败：', e)
        ElMessage.error('删除失败，请稍后重试')
      }
    },

    formatSize (bytes) {
      if (bytes === undefined || bytes === null) return '-'
      const kb = bytes / 1024
      return kb < 1024 ? `${kb.toFixed(1)}KB` : `${(kb / 1024).toFixed(2)}MB`
    },
    formatTime (ts) {
      try {
        return new Date(ts).toLocaleString()
      } catch {
        return '-'
      }
    },

    /* ========== 表单状态 ========== */
    persist () {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.form))
    },
    startEdit () {
      this.backup = JSON.parse(JSON.stringify(this.form))
      this.editing = true
    },
    cancelEdit () {
      if (!this.editing) return
      if (confirm('确定取消本次修改吗？')) {
        this.form = JSON.parse(JSON.stringify(this.backup))
        this.editing = false
        this.phoneError = ''
      }
    },
    clearAll () {
      if (!confirm('清空当前所有填写内容？此操作不可撤销。')) return
      this.form = this.getDefaultForm()
      this.persist()
      ElMessage.success('已清空')
    },
    validatePhone () {
      if (!this.form.profile.phone) {
        this.phoneError = ''
        return
      }
      this.phoneError =
        /^1[3-9]\d{9}$/.test(this.form.profile.phone) ? '' : '请输入正确的手机号码'
    },

    // 新增 / 删除各类经历
    addWork () {
  const last = this.form.work[this.form.work.length - 1]
  if (last && last._confirmed !== true) {
    ElMessage.warning('请先点击上一条工作经历右下角的「确定」或删除后再新增')
    return
  }
  this.form.work.push({
    id: null,
    company: '',
    title: '',
    start: '',
    end: '',
    content: '',
    _confirmed: false
  })
},
    async removeWork (index, w) {
      if (w.id) {
        try {
          await axios.delete(API_WORK_DEL(w.id), {
            headers: getAuthHeaders()
          })
        } catch (e) {
          console.error('删除工作经历失败：', e)
          ElMessage.error('删除失败，请稍后重试')
          return
        }
      }
      this.form.work.splice(index, 1)
    },

    addProject () {
  const last = this.form.projects[this.form.projects.length - 1]
  if (last && last._confirmed !== true) {
    ElMessage.warning('请先点击上一条项目经历右下角的「确定」或删除后再新增')
    return
  }
  this.form.projects.push({
    id: null,
    name: '',
    role: '',
    start: '',
    end: '',
    desc: '',
    link: '',
    _confirmed: false
  })
},
    async removeProject (index, p) {
      if (p.id) {
        try {
          await axios.delete(API_PROJ_DEL(p.id), {
            headers: getAuthHeaders()
          })
        } catch (e) {
          console.error('删除项目经历失败：', e)
          ElMessage.error('删除失败，请稍后重试')
          return
        }
      }
      this.form.projects.splice(index, 1)
    },

    addEdu () {
      this.form.education.push({
        id: null,
        school: '',
        major: '',
        rank: '',
        start: '',
        end: ''
      })
    },
    // 教育没有后端接口，这里只删前端
    removeEdu (index) {
      this.form.education.splice(index, 1)
    },

    addOrg () {
  const last = this.form.orgs[this.form.orgs.length - 1]
  if (last && last._confirmed !== true) {
    ElMessage.warning('请先点击上一条社团/组织经历右下角的「确定」或删除后再新增')
    return
  }
  this.form.orgs.push({
    id: null,
    name: '',
    role: '',
    start: '',
    end: '',
    desc: '',
    _confirmed: false
  })
},
    async removeOrg (index, o) {
      if (o.id) {
        try {
          await axios.delete(API_ORG_DEL(o.id), {
            headers: getAuthHeaders()
          })
        } catch (e) {
          console.error('删除组织经历失败：', e)
          ElMessage.error('删除失败，请稍后重试')
          return
        }
      }
      this.form.orgs.splice(index, 1)
    },

    addCompetition () {
  const last = this.form.competitions[this.form.competitions.length - 1]
  if (last && last._confirmed !== true) {
    ElMessage.warning('请先点击上一条竞赛经历右下角的「确定」或删除后再新增')
    return
  }
  this.form.competitions.push({
    id: null,
    name: '',
    role: '',
    award: '',
    time: '',
    _confirmed: false
  })
},
    async removeCompetition (index, c) {
      if (c.id) {
        try {
          await axios.delete(API_COMP_DEL(c.id), {
            headers: getAuthHeaders()
          })
        } catch (e) {
          console.error('删除竞赛经历失败：', e)
          ElMessage.error('删除失败，请稍后重试')
          return
        }
      }
      this.form.competitions.splice(index, 1)
    },

    scrollTo (id) {
      this.$refs[id]?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    },
    setupScrollSpy () {
      const io = new IntersectionObserver(
        entries => {
          entries.forEach(e => {
            if (e.isIntersecting) this.activeSection = e.target.id
          })
        },
        { threshold: 0.5 }
      )
      ;['profile', 'skills', 'work', 'projects', 'edu', 'orgs', 'competitions'].forEach(
        k => {
          const el = this.$refs[k]
          if (el) io.observe(el)
        }
      )
    },

    /* ========== 预览/导出（学校模版-纯文本） ========== */
    openPreview () {
      this.previewVisible = true
      this.$nextTick(() => this.renderPlain('plain-preview'))
    },

    renderPlain (targetId = 'plain-preview') {
      const el = document.getElementById(targetId)
      if (!el) {
        ElMessage.error('渲染容器缺失')
        return
      }
      el.innerHTML = ''

      const f = this.form || {}
      const esc = (s) =>
        String(s ?? '').replace(/[&<>"']/g, m => ({
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#39;'
        }[m]))
      const range = (a, b) => (a && b) ? `${a} - ${b}` : (a || b || '-')

      const skillsText = (f.skills || '').trim()
      const hasSkills = !!skillsText
      const hasWork = Array.isArray(f.work) && f.work.length > 0
      const hasProj = Array.isArray(f.projects) && f.projects.length > 0
      const hasEdu = Array.isArray(f.education) && f.education.length > 0
      const hasOrg = Array.isArray(f.orgs) && f.orgs.length > 0
      const hasComp = Array.isArray(f.competitions) && f.competitions.length > 0

      const infoItems = [
  ['姓 名', f.profile?.name],
  ['出生年月', f.profile?.birthday],
  ['邮 箱', f.profile?.email],
  ['电 话', f.profile?.phone],
  ['求职状态', f.profile?.status],
  ['层 次', f.profile?.degree]
].map(([k, v]) =>
  `<div class="info-item"><span class="k">${esc(k)}</span><span class="v">${esc(v || '-')}</span></div>`
).join('')

const avatar = f.profile?.avatar || f.profile?.photo || ''

const infoHtml = `
  <div class="info-row">
    <div class="info-grid">${infoItems}</div>
    <div class="avatar">
      ${avatar ? `<img src="${esc(avatar)}" alt="avatar" crossorigin="anonymous">` : ''}
    </div>
  </div>
`

      const block = (title, html) => `
        <div class="p-sec">
          <div class="p-sec-title">${esc(title)}</div>
          <div class="p-sec-body">${html}</div>
        </div>`

      const workHtml = hasWork
        ? f.work.map(w => `
          <div class="p-card">
            <div class="meta">
              <div><span class="label">公司名称</span>${esc(w.company)}</div>
              <div><span class="label">职位名称</span>${esc(w.title)}</div>
              <div class="right"><span class="label">在职时间</span>${esc(range(w.start, w.end))}</div>
            </div>
            ${w.content ? `<div class="p-pre">${esc(w.content)}</div>` : ''}
          </div>`).join('')
        : ''

      const projHtml = hasProj
        ? f.projects.map(p => `
          <div class="p-card">
            <div class="meta">
              <div><span class="label">项目名称</span>${esc(p.name)}</div>
              <div><span class="label">项目角色</span>${esc(p.role)}</div>
              <div class="right"><span class="label">项目时间</span>${esc(range(p.start, p.end))}</div>
            </div>
            ${p.desc ? `<div class="p-pre">${esc(p.desc)}</div>` : ''}
          </div>`).join('')
        : ''

      const eduHtml = hasEdu
        ? f.education.map(e => `
          <div class="p-card">
            <div class="meta">
              <div><span class="label">学校名称</span>${esc(e.school)}</div>
              <div><span class="label">专业</span>${esc(e.major)}</div>
              <div class="right"><span class="label">时间段</span>${esc(range(e.start, e.end))}</div>
            </div>
            ${e.rank ? `<div class="p-pre"><span class="label">专业排名</span>${esc(e.rank)}</div>` : ''}
          </div>`).join('')
        : ''

      const orgHtml = hasOrg
        ? f.orgs.map(o => `
          <div class="p-card">
            <div class="meta">
              <div><span class="label">组织名称</span>${esc(o.name)}</div>
              <div><span class="label">担任角色</span>${esc(o.role)}</div>
              <div class="right"><span class="label">时间段</span>${esc(range(o.start, o.end))}</div>
            </div>
            ${o.desc ? `<div class="p-pre">${esc(o.desc)}</div>` : ''}
          </div>`).join('')
        : ''

      const compHtml = hasComp
        ? f.competitions.map(c => `
          <div class="p-card">
            <div class="meta">
              <div><span class="label">竞赛名称</span>${esc(c.name)}</div>
              <div><span class="label">担任角色</span>${esc(c.role)}</div>
              <div class="right"><span class="label">获奖时间</span>${esc(c.time || '-')}</div>
            </div>
            ${c.award ? `<div class="p-pre"><span class="label">获得奖项</span>${esc(c.award)}</div>` : ''}
          </div>`).join('')
        : ''

      el.innerHTML = `
        <div class="plain-a4">
          <div class="banner"><img class="logo" src="${this.campusLogo}" alt="logo"/></div>
          ${block('个人信息', infoHtml)}
          ${hasSkills ? block('技能掌握', `<div class="skills-text">${esc(skillsText)}</div>`) : ''}
          ${hasWork ? block('工作经历', workHtml) : ''}
          ${hasProj ? block('项目经历', projHtml) : ''}
          ${hasEdu ? block('教育经历', eduHtml) : ''}
          ${hasOrg ? block('社团/组织经历', orgHtml) : ''}
          ${hasComp ? block('竞赛经历', compHtml) : ''}
        </div>
      `

      // 样式只注入一次
      if (!document.getElementById('plain-style')) {
        const style = document.createElement('style')
        style.id = 'plain-style'
        style.textContent = `
          .plain-a4{ width:210mm; box-sizing:border-box; padding:0 6mm 6mm; color:#222;
            font:14px/1.7 "Microsoft YaHei","Noto Sans SC","PingFang SC",sans-serif; background:#fff; }
          .banner{ margin-left:-6mm; margin-right:-6mm; display:flex; align-items:center; background:#1d5e2a; color:#fff;
            padding:12px 16px; border-radius:0 0 8px 8px; }
          .banner .logo{ height:44px; }
          .p-sec{ margin-top:14px; page-break-inside:avoid; }
          .p-sec-title{ color:#1d5e2a; font-weight:800; font-size:18px; padding:6px 10px; border-left:4px solid #1d5e2a;
            background:#f6fbf6; border-radius:2px; }
          .p-sec-body{ margin-top:10px; }
          .info-row{ display:flex; align-items:flex-start; gap:10px; flex-wrap:nowrap; }
          .info-grid{ flex:1; display:grid; grid-template-columns: repeat(2, minmax(0,1fr)); column-gap:10px; row-gap:6px;
            background:#fff; border:1px solid #e6e6e6; border-radius:6px; padding:8px 10px; }
          .info-item{ display:flex; gap:6px; min-width:0; }
          .info-item .k{ color:#1d5e2a; font-weight:700; white-space:nowrap; }
          .info-item .v{ flex:1; min-width:0; word-break:break-all; }
          .avatar {
  flex: 0 0 20mm;   /* 设置头像的宽度为 35mm */
  width: 20mm;      /* 宽度设置为 35mm */
  height: 28mm;     /* 高度设置为 25mm */
  border-radius: 0; /* 取消圆形效果，改为矩形 */
  background: #e0e0e0; /* 背景色 */
  overflow: hidden;  /* 确保图片不会超出容器 */
}
/* 头像图片样式 */
.avatar img {
  width: 100%;       /* 让图片宽度填满容器 */
  height: 100%;      /* 让图片高度填满容器 */
  object-fit: cover; /* 保持图片的比例，覆盖整个容器 */
}
          .p-card{ border:1px solid #e9ecef; border-radius:8px; padding:10px 12px; margin-top:10px; background:#fff; }
          .meta{ display:flex; align-items:center; gap:10px; flex-wrap:wrap; border-bottom:1px dashed #e6e6e6; padding-bottom:6px; }
          .meta .label{ color:#1d5e2a; font-weight:700; margin-right:4px; }
          .meta .right{ margin-left:auto; max-width:35%; white-space:normal; text-align:right; padding-right:4px; }
          .p-pre{ white-space:pre-wrap; margin-top:8px; }
          .skills-text{ padding:8px 10px; border:1px solid #e6e6e6; border-radius:6px; background:#fff; }
          .plain-a4, .plain-a4 *{ -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .preview-paper{ margin:0 auto; background:#fff; box-shadow:0 2px 18px rgba(0,0,0,.08); }
        `
        document.body.appendChild(style)
      }
    },

    async exportPlainPDF () {
  // 先渲染到隐藏容器
  this.renderPlain('plain-print')

  let blob
  try {
    this.exporting = true
    await this.$nextTick()
    const root = document.getElementById('plain-print')
    const fileName = `简历_${this.form?.profile?.name || '未命名'}.pdf`

    // 生成 PDF blob
    blob = await exportElementToPDF(root, fileName)

    // 本地下载
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    a.click()
    URL.revokeObjectURL(url)

    ElMessage.success('PDF 已导出')
  } catch (e) {
    console.error(e)
    ElMessage.error('导出失败，请重试')
    this.exporting = false
    return
  }

  // 生成已经成功了，再单独尝试上传
  try {
    const fileName = `简历_${this.form?.profile?.name || '未命名'}.pdf`
    const file = new File([blob], fileName, { type: 'application/pdf' })
    await this.uploadPdfFile(file, 'PDF_EXPORT')
    this.fileList = await this.fetchResumeFiles()
    ElMessage.success('已同步到右侧“我的简历”')
  } catch (e) {
    console.error('上传 PDF 到服务器失败：', e)
    ElMessage.error('PDF 已导出，但上传服务器失败，可稍后重试')
  } finally {
    this.exporting = false
  }
},


  }
}
</script>


<style scoped>
/* 页面/面包屑/按钮 */
.resume-page{ padding:30px; background:#f5f5f5; min-height:calc(100vh - 105px); }
.breadcrumb-wrapper{ position:fixed; top:105px; left:0; width:100%; background:#f4f4f4; padding:20px 30px; z-index:1000; height:115px; }
.breadcrumb{ background:#fff; padding:20px 30px; box-shadow:0 2px 10px rgba(0,0,0,.1); font-size:20px; width:97.3%; position:fixed; }
.breadcrumb-link{ color:#325e21; text-decoration:none; font-weight:500; }
.breadcrumb-link:hover{text-decoration:underline;}
.breadcrumb-separator{ margin:0 10px; color:#666; }
.breadcrumb-current{ color:#666; }
.edit-actions{ float:right; display:flex; gap:10px; }
.btn{ background:#325e21; color:#fff; border:none; padding:8px 16px; border-radius:6px; cursor:pointer; font-size:16px; }
.btn:hover{ background:#2a4e1b; }
.btn.primary{ background:#325e21; }
.btn.ghost{ background:#6c757d; }
.btn.ghost:hover{ background:#5a6268; }
.link-add{ background:#325e21; color:#fff; border:none; padding:6px 12px; border-radius:4px; cursor:pointer; }
.link-del{ background:#dc3545; color:#fff; border:none; padding:6px 12px; border-radius:4px; cursor:pointer; }
.link-del:hover{ background:#c82333; }

/* 导出离屏容器 */
.export-shadow{ position:absolute; left:-99999px; top:0; width:794px; background:#fff; opacity:0; pointer-events:none; }
.export-shadow *{ -webkit-print-color-adjust:exact; print-color-adjust:exact; }

/* 三栏布局 */
.layout{ display:flex; gap:20px; width:100%; align-items:flex-start; padding-top:85px; }
.left-sidebar.fixed-sidebar{
  position:fixed; top:220px; left:30px; width:280px;
  background:#fff; border-radius:10px; box-shadow:0 2px 10px rgba(0,0,0,.1); padding:30px; height:1000px;
}
.sidebar-title{ font-size:30px; font-weight:bold; color:#333; margin-bottom:15px; }
.title-divider{ height:1px; background:#d8d8d8; margin-bottom:20px; }
.sidebar-item{ padding:15px 0; cursor:pointer; font-size:22px; color:#666; border-bottom:1px solid #f0f0f0; transition:.3s; }
.sidebar-item:hover{ color:#325e21; background:#f8f9fa; }
.sidebar-item.active{ color:#325e21; font-weight:bold; background:#f0f7f0; }
.center-content{ flex:1; display:flex; flex-direction:column; gap:20px; min-width:0; margin-left:320px; margin-right:400px; }
.right-sidebar.fixed-sidebar{ position:fixed; top:220px; right:30px; width:360px; display:flex; flex-direction:column; gap:20px;max-height: calc(100vh - 240px); }
.small-card{ padding:18px; }
.divider{ height:1px; background:#eaeaea; margin:12px 0; }
.w-100{ width:100%; }
/* 第二张 small-card（“我的简历”）填满剩余空间 */
.right-sidebar .small-card:last-child{
  flex:1;                    /* 占满右侧剩余高度 */
  display:flex;
  flex-direction:column;
  min-height:0;              /* 允许内部元素压缩 */
}
/* 卡片/表单 */
.card{ background:#fff; border-radius:10px; box-shadow:0 2px 10px rgba(0,0,0,.1); padding:40px; box-sizing:border-box; }
.card-head{ display:flex; align-items:center; justify-content:space-between; }
.section-title{ color:#325e21; font-size:30px; font-weight:bold; border-left:4px solid #325e21; padding-left:12px; margin:0; }
.grid-3{ display:grid; grid-template-columns: repeat(3, 1fr); gap:24px; }
.field{ display:flex; flex-direction:column; gap:8px; font-size:18px; }
.field input, .field select{ padding:12px 16px; border:1px solid #d8d8d8; border-radius:6px; font-size:18px; }
.textarea{ width:100%; min-height:120px; padding:16px; border:1px solid #d8d8d8; border-radius:8px; font-size:18px; resize:vertical; }
.textarea.small{ min-height:90px; }
/* ===== 时间范围输入：更紧凑、同一行、不越界 ===== */

/* 时间范围容器：允许自动换行 */
.inline{
  display: flex;
  flex-wrap: wrap;       /* ★ 允许换行 */
  align-items: center;
  gap: 8px;
}

/* 中间的 “至” */
.inline .to{
  white-space: nowrap;
  padding: 0 4px;
  color: #666;
}

/* 两个日期选择器：自适应宽度，宽度不够就掉到下一行 */
.inline .el-date-editor{
  flex: 1 1 130px;       /* 基础宽度 130px，能缩能长 */
  min-width: 0;
}

/* 保持高度、圆角一致 */
.inline .el-input__wrapper{
  box-sizing: border-box;
  padding: 8px 10px;
  height: 38px;
  border-radius: 6px;
}

.inline .el-input__inner{
  font-size: 16px;
  line-height: 1.2;
}


/* 中间的 “至” 不要被压缩、也不要换行 */
.inline .to{
  white-space: nowrap;
  padding: 0 4px;
  color: #666;
}

/* 让两个日期选择器自适应缩放，不再用默认 220px 宽度 */
.inline .el-date-editor{
  flex: 1 1 0;
  width: 0;            /* 把宽度交给 flex 计算 */
}

/* 保持你之前设置的高度和圆角 */
.inline .el-input__wrapper{
  box-sizing: border-box;
  padding: 8px 10px;
  height: 38px;
  border-radius: 6px;
}
.inline .el-input__inner{
  font-size: 16px;
  line-height: 1.2;
}

.inline .el-date-picker,
.inline .el-input,
.inline .el-input__wrapper {
  width: 100%;
  height: 38px; /* 与你 input 高度一致 */
  font-size: 16px;
}

.inline .to{
  white-space: nowrap;
  padding: 0 4px;
  color: #666;
}

/* 压缩输入框尺寸（比普通表单小一号） */
.inline input{
  width: 100%;
  box-sizing: border-box;
  padding: 8px 10px;         /* 原来是 12px 16px */
  font-size: 16px;           /* 原来是 18px */
  line-height: 1.2;
  height: 38px;              /* 统一高度，显得更紧凑 */
  border-radius: 6px;
}

/* （保持第三列稍宽，给日期更从容） */
@media (min-width: 1100px){
  .grid-3{ grid-template-columns: 1fr 1fr 1.2fr; }
}

.mt8{ margin-top:8px; }
.block{
  padding:16px;
  background:#f8f9fa;
  border-radius:8px;
  margin-top:16px;
  border:1px solid transparent;
}

.block-footer{
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
/* 已确认的 block：淡绿色边框+背景 */
.block-confirmed{
  border-color:#cbe6cf;
  background:#f7fbf8;
}

/* 已确认按钮：浅绿+灰字，不再 hover */
.pill-disabled{
  background:#e9f2ea;
  color:#6c757d;
  cursor:default;
}
.pill-disabled:hover{
  background:#e9f2ea;
}

/* “已确认”小标签 */
.confirm-tag{
  margin-right:auto;
  font-size:13px;
  color:#2f6a3a;
  background:#e6f4ea;
  border-radius:999px;
  padding:2px 10px;
}

/* 方角按钮：风格跟右上角 + 添加 一致 */
.pill-btn{
  background:#325e21;
  color:#fff;
  border:none;
  padding:6px 16px;
  border-radius:4px;          /* ← 改成方角 */
  cursor:pointer;
  font-size:14px;
  transition:all .15s ease-out;
}

.pill-btn:hover{
  background:#2a4e1b;
}

/* 删除 = 浅红色边框按钮 */
.pill-btn.pill-danger{
  background:#fff5f5;
  color:#c0392b;
  border:1px solid #f3c4c4;
}
.pill-btn.pill-danger:hover{
  background:#ffeaea;
  border-radius:4px;          /* ← 改成方角 */
}


.card, .block{ overflow:hidden; }

/* 时间列稍宽一些 */
@media (min-width:1100px){ .grid-3{ grid-template-columns:1fr 1fr 1.2fr; } }

/* 预览弹窗工具条与纸张 */
.preview-toolbar{ display:flex; gap:10px; align-items:center; margin-bottom:10px; }
.preview-paper{ margin:0 auto; background:#fff; box-shadow:0 2px 18px rgba(0,0,0,.08); }

/* 右侧：我的简历（简约风） */
.list-head{ display:flex; align-items:center; justify-content:space-between; margin-bottom:8px; }
.icon-btn{
  width:32px; height:32px; line-height:32px; text-align:center;
  border-radius:8px; border:1px solid #dfe7df; background:#f6faf6; color:#2f6a3a;
  cursor:pointer; font-size:18px; padding:0; transition:.15s;
}
.icon-btn:hover{ background:#edf7ef; }
.hidden-input{ display:none; }

/* 右侧：我的简历（简约风） */
.file-list{
  flex:1;                    /* 占满卡片主体 */
  display:flex;
  flex-direction:column;
  overflow-y:auto;           /* ⭐ 关键：内部滚动 */
  padding-right:4px;         /* 给滚动条留点空间 */
}
.file-row{
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding:10px 0;
  gap: 12px;                /* 新增一点间距 */
}
.file-row + .file-row{ border-top:1px dashed #e6eae6; }
.file-left{
  display:flex;
  align-items:center;
  gap:10px;
  min-width:0;
  flex:1;                   /* ★ 左侧占满剩余空间，文字会被截断，而不是把按钮挤下去 */
}
/* 按钮区域固定在最右边，不被挤压 */
.file-actions{
  display:flex;
  gap:8px;
  flex-shrink:0;            /* ★ 不允许变窄、换行 */
}
.file-icon{
  flex:0 0 28px; width:28px; height:28px; border-radius:50%;
  display:flex; align-items:center; justify-content:center;
  background:#e7f3ea; color:#2c6e3f; font-weight:800; font-size:12px;
  border:1px solid #cfe8d6;
}
.file-info{ min-width:0; }
.file-title{
  font-weight:700;
  font-size:15px;
  color:#20361f;
  max-width: 100%;
  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;
}

.file-meta{ margin-top:2px; color:#6b776b; font-size:12px; }

.btn.light{ background:#f6faf6; color:#2f6a3a; border:1px solid #dfe7df; }
.btn.light:hover{ background:#edf7ef; }
.btn.light.danger{ color:#b43a3a; border-color:#f0d7d7; background:#fff7f7; }
.btn.light.danger:hover{ background:#ffecec; }
.btn.small{ padding:6px 10px; font-size:13px; border-radius:8px; }

/* 响应式 */
@media (max-width:1200px){
  .center-content{ margin-right:0; }
  .right-sidebar.fixed-sidebar{ position:static; width:100%; }
}
@media (max-width:992px){
  .grid-3{ grid-template-columns:1fr; }
  .left-sidebar.fixed-sidebar{ position:static; width:100%; height:auto; margin-bottom:20px; }
  .center-content{ margin-left:0; }
}

/* 只读视觉反馈（被禁用时的输入框更明显） */
.field input:disabled,
.field select:disabled,
.textarea:disabled{
  background: #f7f7f7;
  color: #777;
  cursor: not-allowed;
}

.card{
  background:#fff;
  border-radius:10px;
  box-shadow:0 2px 10px rgba(0,0,0,.1);
  padding:40px;
  box-sizing:border-box;
}

/* 新增：卡片里“单独存在的标题”与内容拉开一点 */
.card > .section-title{
  margin-bottom: 20px;
}

/* card-head 里那种标题（工作经历、项目经历…）整体和下面内容也拉开一点 */
.card-head{
  display:flex;
  align-items:center;
  justify-content:space-between;
  margin-bottom: 16px;          /* ★ 原来没有这行，补上 */
}
/* 让时间选择器在 .inline 里跟普通 input 对齐、同样大小 */
.inline .el-date-editor {
  width: 100%;          /* 填满这一列 */
}

/* 外层 wrapper：控制高度、圆角、内边距 */
.inline .el-input__wrapper {
  box-sizing: border-box;
  padding: 8px 10px;    /* 和你 .inline input 一样 */
  height: 38px;         /* 和你 .inline input 一样 */
  border-radius: 6px;   /* 和其它输入框统一 */
}

/* 内部文字大小保持一致 */
.inline .el-input__inner {
  font-size: 16px;
  line-height: 1.2;
}

</style>
