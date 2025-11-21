<template>
  <div class="resume-page">
    <!-- 顶部面包屑与操作 -->
    <div class="breadcrumb-wrapper">
      <div class="breadcrumb">
        <router-link to="/student-home" class="breadcrumb-link">主页</router-link>
        <span class="breadcrumb-separator">></span>
        <span class="breadcrumb-current">简历管理</span>

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
            <div class="field"><label>姓名</label><input v-model="form.profile.name" :disabled="!editing" /></div>
            <div class="field"><label>出生年月</label><input v-model="form.profile.birthday" :disabled="!editing" placeholder="YYYY-MM" /></div>
            <div class="field"><label>邮箱</label><input v-model="form.profile.email" :disabled="!editing" /></div>
            <div class="field">
              <label>性别</label>
              <select v-model="form.profile.gender" :disabled="!editing">
                <option value="">请选择</option><option>男</option><option>女</option><option>其他</option>
              </select>
            </div>
            <div class="field">
              <label>求职状态</label>
              <select v-model="form.profile.status" :disabled="!editing">
                <option>实习</option><option>校招</option><option>社招</option>
              </select>
            </div>
            <div class="field">
              <label>电话</label>
              <input v-model="form.profile.phone" :disabled="!editing" @blur="validatePhone" />
              <span v-if="phoneError" class="error-text">{{ phoneError }}</span>
            </div>
          </div>
        </section>

        <!-- 技能 -->
        <section id="skills" ref="skills" class="card">
          <h3 class="section-title">技能掌握</h3>
          <textarea v-model="form.skills" :disabled="!editing" class="textarea" placeholder="编辑个人优势、熟练技术栈等..."></textarea>
        </section>

        <!-- 工作经历 -->
        <section id="work" ref="work" class="card">
          <div class="card-head">
            <h3 class="section-title">工作经历</h3>
            <button v-if="editing" class="link-add" @click="addWork">+ 添加</button>
          </div>
          <div v-for="(w,i) in form.work" :key="i" class="block">
            <div class="grid-3">
              <div class="field"><label>公司名称</label><input v-model="w.company" :disabled="!editing"/></div>
              <div class="field"><label>职位名称</label><input v-model="w.title" :disabled="!editing"/></div>
              <div class="field">
                <label>在职时间</label>
                <div class="inline">
                  <input v-model="w.start" :disabled="!editing" placeholder="YYYY.MM"/>
                  <span class="to">至</span>
                  <input v-model="w.end" :disabled="!editing" placeholder="YYYY.MM/今"/>
                </div>
              </div>
            </div>
            <div class="field mt8">
              <label>工作内容</label>
              <textarea v-model="w.content" :disabled="!editing" class="textarea small"></textarea>
            </div>
            <button v-if="editing" class="link-del" @click="form.work.splice(i,1)">删除该经历</button>
          </div>
        </section>

        <!-- 项目经历 -->
        <section id="projects" ref="projects" class="card">
          <div class="card-head">
            <h3 class="section-title">项目经历</h3>
            <button v-if="editing" class="link-add" @click="addProject">+ 添加</button>
          </div>
          <div v-for="(p,i) in form.projects" :key="i" class="block">
            <div class="grid-3">
              <div class="field"><label>项目名称</label><input v-model="p.name" :disabled="!editing"/></div>
              <div class="field"><label>项目角色</label><input v-model="p.role" :disabled="!editing"/></div>
              <div class="field">
                <label>项目时间</label>
                <div class="inline">
                  <input v-model="p.start" :disabled="!editing" placeholder="YYYY.MM"/>
                  <span class="to">至</span>
                  <input v-model="p.end" :disabled="!editing" placeholder="YYYY.MM"/>
                </div>
              </div>
            </div>
            <div class="field mt8"><label>项目描述</label>
              <textarea v-model="p.desc" :disabled="!editing" class="textarea small"></textarea>
            </div>
            <button v-if="editing" class="link-del" @click="form.projects.splice(i,1)">删除该项目</button>
          </div>
        </section>

        <!-- 教育经历 -->
        <section id="edu" ref="edu" class="card">
          <div class="card-head">
            <h3 class="section-title">教育经历</h3>
            <button v-if="editing" class="link-add" @click="addEdu">+ 添加</button>
          </div>
          <div v-for="(e,i) in form.education" :key="i" class="block">
            <div class="grid-3">
              <div class="field"><label>学校名称</label><input v-model="e.school" :disabled="!editing"/></div>
              <div class="field"><label>专业</label><input v-model="e.major" :disabled="!editing"/></div>
              <div class="field"><label>专业排名</label><input v-model="e.rank" :disabled="!editing" placeholder="可选"/></div>
            </div>
            <div class="field mt8">
              <label>时间段</label>
              <div class="inline">
                <input v-model="e.start" :disabled="!editing" placeholder="YYYY.MM"/>
                <span class="to">至</span>
                <input v-model="e.end" :disabled="!editing" placeholder="YYYY.MM/今"/>
              </div>
            </div>
            <button v-if="editing" class="link-del" @click="form.education.splice(i,1)">删除该教育</button>
          </div>
        </section>

        <!-- 社团/组织 -->
        <section id="orgs" ref="orgs" class="card" v-if="form.orgs?.length || editing">
          <div class="card-head">
            <h3 class="section-title">社团 / 组织经历</h3>
            <button v-if="editing" class="link-add" @click="addOrg">+ 添加</button>
          </div>
          <div v-for="(o,i) in form.orgs" :key="i" class="block">
            <div class="grid-3">
              <div class="field"><label>社团/组织名称</label><input v-model="o.name" :disabled="!editing"/></div>
              <div class="field"><label>担任角色</label><input v-model="o.role" :disabled="!editing"/></div>
              <div class="field">
                <label>时间段</label>
                <div class="inline">
                  <input v-model="o.start" :disabled="!editing" placeholder="YYYY.MM"/>
                  <span class="to">至</span>
                  <input v-model="o.end" :disabled="!editing" placeholder="YYYY.MM/今"/>
                </div>
              </div>
            </div>
            <div class="field mt8"><label>经历描述</label>
              <textarea v-model="o.desc" :disabled="!editing" class="textarea small"></textarea>
            </div>
            <button v-if="editing" class="link-del" @click="form.orgs.splice(i,1)">删除该经历</button>
          </div>
        </section>

        <!-- 竞赛 -->
        <section id="competitions" ref="competitions" class="card" v-if="form.competitions?.length || editing">
          <div class="card-head">
            <h3 class="section-title">竞赛经历</h3>
            <button v-if="editing" class="link-add" @click="addCompetition">+ 添加</button>
          </div>
          <div v-for="(c,i) in form.competitions" :key="i" class="block">
            <div class="grid-3">
              <div class="field"><label>竞赛名称</label><input v-model="c.name" :disabled="!editing"/></div>
              <div class="field"><label>担任角色</label><input v-model="c.role" :disabled="!editing"/></div>
              <div class="field"><label>获得奖项</label><input v-model="c.award" :disabled="!editing" placeholder="可选"/></div>
            </div>
            <div class="field mt8"><label>时间</label><input v-model="c.time" :disabled="!editing" placeholder="YYYY.MM"/></div>
            <button v-if="editing" class="link-del" @click="form.competitions.splice(i,1)">删除该竞赛</button>
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
            <h3 class="section-title">简历列表</h3>
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
import { ElMessage } from 'element-plus'
import { listMeta, getPDF, deletePDF, savePDF, saveMeta } from '@/utils/idb'
import { exportElementToPDF } from '@/utils/pdf'
import campusLogo from '@/assets/campus_logo.png'

const STORAGE_KEY = 'resume_data_v1'

export default {
  name: 'ResumeManage',
  data() {
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
  async mounted() {
    const cached = localStorage.getItem(STORAGE_KEY)
    if (cached) {
      try {
        const parsed = JSON.parse(cached)
        this.form = Object.assign(this.getDefaultForm(), parsed)
      } catch {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
    // 固定为学校模版
    this.form.template = 'school'
    this.fileList = await listMeta()
    this.setupScrollSpy()
  },
  methods: {
    getDefaultForm() {
      return {
        profile: { name: '', birthday: '', email: '', gender: '', status: '校招', phone: '', degree: '本科', avatar: '' },
        skills: '',
        work: [], projects: [], education: [], orgs: [], competitions: [],
        template: 'school'
      }
    },

    /* ========== 右侧列表：上传/下载/删除 ========== */
    triggerUpload() { this.$refs.fileInput?.click() },
    async importFromLocal(e) {
      try {
        const file = e.target.files?.[0]
        e.target.value = ''
        if (!file) return
        if (file.type !== 'application/pdf') { ElMessage.warning('仅支持上传 PDF 文件'); return }
        const arrayBuffer = await file.arrayBuffer()
        const blob = new Blob([arrayBuffer], { type: 'application/pdf' })
        const id = `${Date.now()}_${Math.random().toString(36).slice(2,8)}`
        await savePDF(id, blob)
        await saveMeta({ id, fileName: file.name, size: blob.size, createdAt: Date.now(), template: 'upload' })
        this.fileList = await listMeta()
        ElMessage.success('已加入简历列表')
      } catch (err) { console.error(err); ElMessage.error('上传失败，请重试') }
    },
    async downloadFromList(item) {
      const blob = await getPDF(item.id)
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = item.fileName
      a.click()
      URL.revokeObjectURL(a.href)
    },
    async removeFromList(item) {
      if (!confirm('删除这份简历文件？')) return
      await deletePDF(item.id)
      this.fileList = await listMeta()
    },
    formatSize(bytes) {
      if (bytes === undefined || bytes === null) return '-'
      const kb = bytes / 1024
      return kb < 1024 ? `${kb.toFixed(1)}KB` : `${(kb / 1024).toFixed(2)}MB`
    },
    formatTime(ts) { try { return new Date(ts).toLocaleString() } catch { return '-' } },

    /* ========== 表单与状态 ========== */
    persist() { localStorage.setItem(STORAGE_KEY, JSON.stringify(this.form)) },
    startEdit() { this.backup = JSON.parse(JSON.stringify(this.form)); this.editing = true },
    cancelEdit() {
      if (!this.editing) return
      if (confirm('确定取消本次修改吗？')) {
        this.form = JSON.parse(JSON.stringify(this.backup))
        this.editing = false; this.phoneError = ''
      }
    },
    saveResume() {
      this.validatePhone(); if (this.phoneError) return
      this.persist(); this.editing = false; ElMessage.success('已保存，下次打开仍保留')
    },
    clearAll() {
      if (!confirm('清空当前所有填写内容？此操作不可撤销。')) return
      this.form = this.getDefaultForm(); this.persist(); ElMessage.success('已清空')
    },
    validatePhone() {
      if (!this.form.profile.phone) { this.phoneError = ''; return }
      this.phoneError = /^1[3-9]\d{9}$/.test(this.form.profile.phone) ? '' : '请输入正确的手机号码'
    },
    addWork() { this.form.work.push({ company:'', title:'', start:'', end:'', content:'' }) },
    addProject() { this.form.projects.push({ name:'', role:'', start:'', end:'', desc:'' }) },
    addEdu() { this.form.education.push({ school:'', major:'', rank:'', start:'', end:'' }) },
    addOrg() { this.form.orgs.push({ name:'', role:'', start:'', end:'', desc:'' }) },
    addCompetition() { this.form.competitions.push({ name:'', role:'', award:'', time:'' }) },

    scrollTo(id) { this.$refs[id]?.scrollIntoView({ behavior:'smooth', block:'start' }) },
    setupScrollSpy() {
      const io = new IntersectionObserver(entries=>{
        entries.forEach(e=>{ if(e.isIntersecting) this.activeSection = e.target.id })
      }, { threshold: 0.5 })
      ;['profile','skills','work','projects','edu','orgs','competitions'].forEach(k=>{
        const el = this.$refs[k]; if (el) io.observe(el)
      })
    },

    /* ========== 预览/导出（学校模版-纯文本） ========== */
    openPreview() { this.previewVisible = true; this.$nextTick(()=> this.renderPlain('plain-preview')) },

    renderPlain(targetId = 'plain-preview') {
      const el = document.getElementById(targetId)
      if (!el) { ElMessage.error('渲染容器缺失'); return }
      el.innerHTML = ''

      const f = this.form || {}
      const esc = (s) => String(s ?? '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))
      const range = (a,b) => (a && b) ? `${a} - ${b}` : (a || b || '-')

      const skillsText = (f.skills || '').trim()
      const hasSkills = !!skillsText
      const hasWork = Array.isArray(f.work) && f.work.length > 0
      const hasProj = Array.isArray(f.projects) && f.projects.length > 0
      const hasEdu  = Array.isArray(f.education) && f.education.length > 0
      const hasOrg  = Array.isArray(f.orgs) && f.orgs.length > 0
      const hasComp = Array.isArray(f.competitions) && f.competitions.length > 0

      const infoItems = [
        ['姓 名', f.profile?.name], ['出生年月', f.profile?.birthday],
        ['邮 箱', f.profile?.email], ['电 话', f.profile?.phone],
        ['求职状态', f.profile?.status], ['层 次', f.profile?.degree],
      ].map(([k,v]) => `<div class="info-item"><span class="k">${esc(k)}</span><span class="v">${esc(v || '-')}</span></div>`).join('')

      const avatar = f.profile?.avatar || f.profile?.photo || ''
      const infoHtml = `
        <div class="info-row">
          <div class="info-grid">${infoItems}</div>
          <div class="avatar">${avatar ? `<img src="${esc(avatar)}" alt="avatar">` : ''}</div>
        </div>
      `
      const block = (title, html) => `
        <div class="p-sec">
          <div class="p-sec-title">${esc(title)}</div>
          <div class="p-sec-body">${html}</div>
        </div>`

      const workHtml = hasWork ? f.work.map(w => `
        <div class="p-card">
          <div class="meta">
            <div><span class="label">公司名称</span>${esc(w.company)}</div>
            <div><span class="label">职位名称</span>${esc(w.title)}</div>
            <div class="right"><span class="label">在职时间</span>${esc(range(w.start,w.end))}</div>
          </div>
          ${w.content ? `<div class="p-pre">${esc(w.content)}</div>` : ''}
        </div>`).join('') : ''

      const projHtml = hasProj ? f.projects.map(p => `
        <div class="p-card">
          <div class="meta">
            <div><span class="label">项目名称</span>${esc(p.name)}</div>
            <div><span class="label">项目角色</span>${esc(p.role)}</div>
            <div class="right"><span class="label">项目时间</span>${esc(range(p.start,p.end))}</div>
          </div>
          ${p.desc ? `<div class="p-pre">${esc(p.desc)}</div>` : ''}
        </div>`).join('') : ''

      const eduHtml = hasEdu ? f.education.map(e => `
        <div class="p-card">
          <div class="meta">
            <div><span class="label">学校名称</span>${esc(e.school)}</div>
            <div><span class="label">专业</span>${esc(e.major)}</div>
            <div class="right"><span class="label">时间段</span>${esc(range(e.start,e.end))}</div>
          </div>
          ${e.rank ? `<div class="p-pre"><span class="label">专业排名</span>${esc(e.rank)}</div>` : ''}
        </div>`).join('') : ''

      const orgHtml = hasOrg ? f.orgs.map(o => `
        <div class="p-card">
          <div class="meta">
            <div><span class="label">组织名称</span>${esc(o.name)}</div>
            <div><span class="label">担任角色</span>${esc(o.role)}</div>
            <div class="right"><span class="label">时间段</span>${esc(range(o.start,o.end))}</div>
          </div>
          ${o.desc ? `<div class="p-pre">${esc(o.desc)}</div>` : ''}
        </div>`).join('') : ''

      const compHtml = hasComp ? f.competitions.map(c => `
        <div class="p-card">
          <div class="meta">
            <div><span class="label">竞赛名称</span>${esc(c.name)}</div>
            <div><span class="label">担任角色</span>${esc(c.role)}</div>
            <div class="right"><span class="label">获奖时间</span>${esc(c.time || '-')}</div>
          </div>
          ${c.award ? `<div class="p-pre"><span class="label">获得奖项</span>${esc(c.award)}</div>` : ''}
        </div>`).join('') : ''

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

      // 注入一次样式
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
          .avatar{ flex:0 0 64px; width:64px; height:64px; border-radius:50%; background:#e0e0e0; overflow:hidden; }
          .avatar img{ width:100%; height:100%; object-fit:cover; }
          .p-card{ border:1px solid #e9ecef; border-radius:8px; padding:10px 12px; margin-top:10px; background:#fff; }
          .meta{ display:flex; align-items:center; gap:10px; flex-wrap:wrap; border-bottom:1px dashed #e6e6e6; padding-bottom:6px; }
          .meta .label{ color:#1d5e2a; font-weight:700; margin-right:4px; }
          .meta .right{ margin-left:auto; max-width:35%; white-space:normal; text-align:right; padding-right:4px; }
          .p-pre{ white-space:pre-wrap; margin-top:8px; }
          .skills-text{ padding:8px 10px; border:1px solid #e6e6e6; border-radius:6px; background:#fff; }
          .plain-a4, .plain-a4 *{ -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .preview-paper{ margin:0 auto; background:#fff; box-shadow:0 2px 18px rgba(0,0,0,.08); }
        `
        document.getElementById('export-root')?.appendChild(style)
      }
    },

    async exportPlainPDF () {
      this.renderPlain('plain-print')
      try {
        this.exporting = true
        await this.$nextTick()
        const root = document.getElementById('plain-print')
        const fileName = `简历_${this.form?.profile?.name || '未命名'}.pdf`
        const blob = await exportElementToPDF(root, fileName)

        const id = `${Date.now()}_${Math.random().toString(36).slice(2,8)}`
        await savePDF(id, blob)
        await saveMeta({ id, fileName, size: blob.size, createdAt: Date.now(), template: 'school', name: this.form?.profile?.name || '' })
        this.fileList = await listMeta()

        const url = URL.createObjectURL(blob)
        const a = document.createElement('a'); a.href = url; a.download = fileName; a.click()
        URL.revokeObjectURL(url)
        ElMessage.success('PDF 已导出并写入右侧“简历列表”。')
      } catch (e) { console.error(e); ElMessage.error('导出失败，请重试') }
      finally { this.exporting = false }
    }
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
.right-sidebar.fixed-sidebar{ position:fixed; top:220px; right:30px; width:360px; display:flex; flex-direction:column; gap:20px; }
.small-card{ padding:18px; }
.divider{ height:1px; background:#eaeaea; margin:12px 0; }
.w-100{ width:100%; }

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
.inline{
  display: grid;
  grid-template-columns: minmax(110px, 1fr) auto minmax(110px, 1fr); /* 左输入 | “至” | 右输入 */
  align-items: center;
  column-gap: 8px;
  /* 不自动换行，依靠 minmax 收缩保证不溢出 */
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
.block{ padding:16px; background:#f8f9fa; border-radius:8px; margin-top:16px; }
.card, .block{ overflow:hidden; }

/* 时间列稍宽一些 */
@media (min-width:1100px){ .grid-3{ grid-template-columns:1fr 1fr 1.2fr; } }

/* 预览弹窗工具条与纸张 */
.preview-toolbar{ display:flex; gap:10px; align-items:center; margin-bottom:10px; }
.preview-paper{ margin:0 auto; background:#fff; box-shadow:0 2px 18px rgba(0,0,0,.08); }

/* 右侧：简历列表（简约风） */
.list-head{ display:flex; align-items:center; justify-content:space-between; margin-bottom:8px; }
.icon-btn{
  width:32px; height:32px; line-height:32px; text-align:center;
  border-radius:8px; border:1px solid #dfe7df; background:#f6faf6; color:#2f6a3a;
  cursor:pointer; font-size:18px; padding:0; transition:.15s;
}
.icon-btn:hover{ background:#edf7ef; }
.hidden-input{ display:none; }

.file-list{ display:flex; flex-direction:column; }
.file-row{ display:flex; align-items:center; justify-content:space-between; padding:10px 0; }
.file-row + .file-row{ border-top:1px dashed #e6eae6; }
.file-left{ display:flex; align-items:center; gap:10px; min-width:0; }
.file-icon{
  flex:0 0 28px; width:28px; height:28px; border-radius:50%;
  display:flex; align-items:center; justify-content:center;
  background:#e7f3ea; color:#2c6e3f; font-weight:800; font-size:12px;
  border:1px solid #cfe8d6;
}
.file-info{ min-width:0; }
.file-title{ font-weight:700; font-size:15px; color:#20361f; max-width:220px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
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
</style>
