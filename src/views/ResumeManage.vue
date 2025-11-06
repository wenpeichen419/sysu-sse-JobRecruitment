<template>
  <div class="resume-page">
    <!-- 面包屑 + 顶部操作 -->
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
        <div v-for="s in sections" :key="s.id" class="sidebar-item"
             :class="{ active: activeSection === s.id }" @click="scrollTo(s.id)">
          {{ s.name }}
        </div>
      </aside>

      <!-- 中间内容 -->
      <main class="center-content">
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

        <section id="skills" ref="skills" class="card">
          <h3 class="section-title">技能掌握</h3>
          <textarea v-model="form.skills" :disabled="!editing" class="textarea" placeholder="编辑个人优势、熟练技术栈等..."></textarea>
        </section>

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

        <!-- 社团/竞赛 -->
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

      <!-- 右侧边栏 -->
      <aside class="right-sidebar fixed-sidebar">
        <div class="card small-card">
          <h3 class="section-title">附件管理</h3>
          <div class="file-list">
            <div class="file-item" v-for="(f,i) in form.files" :key="i">
              <div class="file-name">{{ f.name }}</div>
              <div class="file-meta">{{ f.size }} · 更新于 {{ f.updated }}</div>
              <div class="file-ops" v-if="editing">
                <button class="link-del" @click="form.files.splice(i,1)">删除</button>
              </div>
            </div>
          </div>
        </div>

        <div class="card small-card">
          <h3 class="section-title">设置</h3>
          <div class="field">
            <label>切换模版</label>
            <select v-model="form.template" :disabled="!editing">
              <option value="school">学校模板</option>
              <option value="default">默认模板</option>
              <option value="simple">极简黑白</option>
              <option value="tech">技术风</option>
            </select>
          </div>

          <div class="divider"></div>
          <button class="btn primary w-100" @click="openPreview">生成简历</button>
        </div>

        <div class="card small-card">
          <h3 class="section-title">简历列表</h3>
          <div v-if="!fileList.length" class="muted">暂无生成记录</div>
          <div v-for="f in fileList" :key="f.id" class="file-item">
            <div class="file-name">{{ f.fileName }}</div>
            <div class="file-meta">{{ (f.size/1024).toFixed(1) }}KB · {{ new Date(f.createdAt).toLocaleString() }}</div>
            <div class="ops">
              <button class="btn" @click="downloadFromList(f)">下载</button>
              <button class="link-del" @click="removeFromList(f)">删除</button>
            </div>
          </div>
        </div>
      </aside>
    </div>

    <!-- 预览弹窗 -->
    <el-dialog v-model="previewVisible" title="简历预览" width="960px" :close-on-click-modal="false">
      <div class="preview-toolbar">
        <label>选择模版：</label>
        <select v-model="previewTemplate">
          <option value="school">学校模板</option>
          <option value="default">默认模板</option>
          <option value="simple">极简黑白</option>
          <option value="tech">技术风</option>
        </select>
        <button class="btn ghost" @click="previewTemplate = form.template">与设置同步</button>
        <button class="btn primary" @click="exportPDF">导出 PDF</button>
      </div>

      <!-- 仅打印这块 -->
      <div id="printArea">
        <SchoolTemplate v-if="previewTemplate==='school'" :data="form" />
      </div>
    </el-dialog>

    <!-- 离屏导出挂载点 -->
    <teleport to="body">
      <div id="export-root" class="export-shadow" aria-hidden="true">
        <div id="printAreaExport" style="width:794px;">
          <SchoolTemplate v-if="previewTemplate==='school'" :data="form" />
        </div>
      </div>
    </teleport>
  </div>
</template>

<script>
import { ElMessage } from 'element-plus'
import SchoolTemplate from '@/components/templates/SchoolTemplate.vue'
import { listMeta, getPDF, deletePDF } from '@/utils/idb'

const STORAGE_KEY = 'resume_data_v1'
const TEMPLATE_KEY = 'resume_template_v1'

export default {
  name: 'ResumeManage',
  components: { SchoolTemplate },
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
      newTag: '',

      // 预览/导出
      previewVisible: false,
      previewTemplate: 'school',
      exporting: false,

      // 本地简历文件列表（元信息）
      fileList: []
    }
  },
  async mounted() {
    const cached = localStorage.getItem(STORAGE_KEY)
    if (cached) {
      try {
        const parsed = JSON.parse(cached)
        this.form = Object.assign(this.getDefaultForm(), parsed)
      } catch (e) {
        console.error('Invalid cached resume JSON. Clearing cache.', e)
        localStorage.removeItem(STORAGE_KEY)
        this.form = this.getDefaultForm()
      }
    }
    const tpl = localStorage.getItem(TEMPLATE_KEY)
    if (tpl) this.form.template = tpl
    this.previewTemplate = this.form.template || 'school'

    this.fileList = await listMeta()
    this.setupScrollSpy()
  },
  methods: {
    getDefaultForm() {
      return {
        profile: { name: '', birthday: '', email: '', gender: '', status: '校招', phone: '', degree: '本科' },
        skills: '',
        work: [],
        projects: [],
        education: [],
        orgs: [],
        competitions: [],
        files: [],
        template: 'school',
        tags: []
      }
    },

    persist() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.form))
      localStorage.setItem(TEMPLATE_KEY, this.form.template || 'school')
    },

    startEdit() {
      this.backup = JSON.parse(JSON.stringify(this.form))
      this.editing = true
    },
    cancelEdit() {
      if (!this.editing) return
      if (confirm('确定取消本次修改吗？')) {
        this.form = JSON.parse(JSON.stringify(this.backup))
        this.editing = false
        this.phoneError = ''
      }
    },
    saveResume() {
      this.validatePhone()
      if (this.phoneError) return
      this.persist()
      this.editing = false
      ElMessage.success('已保存，下次打开仍保留')
    },
    clearAll() {
      if (!confirm('清空当前所有填写内容？此操作不可撤销。')) return
      this.form = this.getDefaultForm()
      this.persist()
      ElMessage.success('已清空')
    },

    validatePhone() {
      if (!this.form.profile.phone) { this.phoneError = ''; return }
      const ok = /^1[3-9]\d{9}$/.test(this.form.profile.phone)
      this.phoneError = ok ? '' : '请输入正确的手机号码'
    },

    addWork() { this.form.work.push({ company:'', title:'', start:'', end:'', content:'' }) },
    addProject() { this.form.projects.push({ name:'', role:'', start:'', end:'', desc:'' }) },
    addEdu() { this.form.education.push({ school:'', major:'', rank:'', start:'', end:'' }) },
    addOrg() { this.form.orgs.push({ name:'', role:'', start:'', end:'', desc:'' }) },
    addCompetition() { this.form.competitions.push({ name:'', role:'', award:'', time:'' }) },

    scrollTo(id) { this.$refs[id]?.scrollIntoView({ behavior:'smooth', block:'start' }) },
    setupScrollSpy() {
      const io = new IntersectionObserver((entries)=>{
        entries.forEach((entry)=>{ if(entry.isIntersecting) this.activeSection = entry.target.id })
      }, { threshold: 0.5 })
      ;['profile','skills','work','projects','edu','orgs','competitions'].forEach(k=>{
        const el = this.$refs[k]; if (el) io.observe(el)
      })
    },

    openPreview() {
      const t = this.form.template || 'school'
      if (t !== 'school') {
        this.previewTemplate = 'school'
        ElMessage.info('其他模板稍后接入，已使用“学校模板”预览')
      } else {
        this.previewTemplate = 'school'
      }
      this.previewVisible = true
    },

    async exportPDF () {
  // 只导出学校模板
  if (this.previewTemplate !== 'school') {
    this.previewTemplate = 'school'
  }
  this.form.template = this.previewTemplate
  this.persist()

  // 等待两帧，让导出节点把所有 v-if / 图片都完成布局
  await this.$nextTick()
  await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))

  const pageEl = document.querySelector('#printAreaExport #school-a4')
  if (!pageEl) {
    ElMessage.error('导出区域为空，请重试')
    this.exporting = false
    return
  }

  // 等图片加载，防止打印成空白框
  const imgs = Array.from(pageEl.querySelectorAll('img'))
  await Promise.all(imgs.map(img => img.complete ? null : new Promise(res => { img.onload = img.onerror = res })))

  // ---- 用隐藏 iframe 打印为 PDF ----
  const iframe = document.createElement('iframe')
  iframe.style.position = 'fixed'
  iframe.style.right = '0'
  iframe.style.bottom = '0'
  iframe.style.width = '0'
  iframe.style.height = '0'
  iframe.style.border = '0'
  document.body.appendChild(iframe)

  const doc = iframe.contentDocument || iframe.contentWindow.document

  // 复制样式（包含 scoped <style> 与全局样式）
  const cloneHeadStyles = () => {
    const head = doc.head
    Array.from(document.querySelectorAll('style, link[rel="stylesheet"]')).forEach(node => {
      head.appendChild(node.cloneNode(true))
    })
    // 基本打印样式：A4、边距、避免分区被截断
    const base = doc.createElement('style')
    base.textContent = `
      @page { size: A4; margin: 10mm; }
      html, body { background: #fff; }
      /* 你的模板根节点已经是 794px(=210mm@96dpi)，在打印里用 mm 更稳 */
      .page.school { width: 210mm; min-height: 297mm; margin: 0 auto; }
      .section { break-inside: avoid; page-break-inside: avoid; }
      .block { break-inside: avoid; page-break-inside: avoid; }
    `
    head.appendChild(base)
  }

  doc.open()
  doc.write('<!doctype html><html><head><meta charset="utf-8"></head><body></body></html>')
  cloneHeadStyles()
  // 把导出节点写入 iframe
  const wrapper = doc.createElement('div')
  wrapper.innerHTML = pageEl.outerHTML
  doc.body.appendChild(wrapper)
  doc.close()

  // 再等一次图片（复制后的文档）
  const imgs2 = Array.from(doc.images)
  await Promise.all(imgs2.map(img => img.complete ? null : new Promise(res => { img.onload = img.onerror = res })))

  // 触发打印（用户选择“另存为 PDF”即可）
  iframe.contentWindow.focus()
  iframe.contentWindow.print()

  // 收尾
  setTimeout(() => {
    document.body.removeChild(iframe)
    this.exporting = false
    this.previewVisible = false
    ElMessage.success('已打开系统打印对话框，选择“另存为 PDF”即可')
  }, 800)
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
    }
  }
}
</script>

<style scoped>
/* 页面/面包屑/按钮 */
.resume-page{ padding:30px; background:#f5f5f5; min-height:calc(100vh - 105px);}
.breadcrumb-wrapper{ position:fixed; top:105px; left:0; width:100%; background:#f4f4f4; padding:20px 30px; z-index:1000; height:115px;}
.breadcrumb{ background:#fff; padding:20px 30px; box-shadow:0 2px 10px rgba(0,0,0,.1); font-size:20px; width:97.3%; position:fixed;}
.breadcrumb-link{ color:#325e21; text-decoration:none; font-weight:500;}
.breadcrumb-link:hover{text-decoration:underline;}
.breadcrumb-separator{ margin:0 10px; color:#666;}
.breadcrumb-current{ color:#666;}
.edit-actions{ float:right; display:flex; gap:10px; }
.btn{ background:#325e21; color:#fff; border:none; padding:8px 16px; border-radius:6px; cursor:pointer; font-size:16px;}
.btn:hover{ background:#2a4e1b;}
.btn.primary{ background:#325e21;}
.btn.ghost{ background:#6c757d;}
.btn.ghost:hover{ background:#5a6268;}
.link-add{ background:#325e21; color:#fff; border:none; padding:6px 12px; border-radius:4px; cursor:pointer; }
.link-del{ background:#dc3545; color:#fff; border:none; padding:6px 12px; border-radius:4px; cursor:pointer; }
.link-del:hover{ background:#c82333; }

/* ✅ 导出离屏容器：避免视口裁剪 */
.export-shadow{
  position: absolute;       /* 由 fixed 改为 absolute */
  left: -99999px;           /* 移出屏幕，不影响布局 */
  top: 0;
  width: 794px;             /* A4 宽度，和模板一致 */
  background: #fff;
  opacity: 0;               /* 不可见，但参与布局与测量 */
  pointer-events: none;
}
.export-shadow *{
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

/* 三栏布局 */
.layout{ display:flex; gap:20px; width:100%; align-items:flex-start; padding-top:85px; }
.left-sidebar.fixed-sidebar{
  position: fixed; top: 220px; left: 30px; width: 280px;
  background:#fff; border-radius:10px; box-shadow:0 2px 10px rgba(0,0,0,.1); padding:30px; height: 1000px;
}
.sidebar-title{ font-size:30px; font-weight:bold; color:#333; margin-bottom:15px;}
.title-divider{ height:1px; background:#d8d8d8; margin-bottom:20px; }
.sidebar-item{ padding:15px 0; cursor:pointer; font-size:22px; color:#666; border-bottom:1px solid #f0f0f0; transition:.3s;}
.sidebar-item:hover{ color:#325e21; background:#f8f9fa;}
.sidebar-item.active{ color:#325e21; font-weight:bold; background:#f0f7f0;}
.center-content{
  flex:1; display:flex; flex-direction:column; gap:20px; min-width:0;
  margin-left: 320px; margin-right: 400px;
}
.right-sidebar.fixed-sidebar{
  position: fixed; top: 220px; right: 30px; width: 360px;
  display:flex; flex-direction:column; gap:20px;
}
.small-card{ padding:24px; }
.divider{ height:1px; background:#eaeaea; margin:12px 0; }
.w-100{ width:100%; }

/* 卡片/表单 */
.card{ background:#fff; border-radius:10px; box-shadow:0 2px 10px rgba(0,0,0,.1); padding:40px; box-sizing:border-box; }
.card-head{ display:flex; align-items:center; justify-content:space-between; }
.section-title{ color:#325e21; font-size:30px; font-weight:bold; border-left:4px solid #325e21; padding-left:12px; margin:0;}
.grid-3{ display:grid; grid-template-columns: repeat(3, 1fr); gap:24px;}
.field{ display:flex; flex-direction:column; gap:8px; font-size:18px;}
.field input, .field select{ padding:12px 16px; border:1px solid #d8d8d8; border-radius:6px; font-size:18px;}
.textarea{ width:100%; min-height:120px; padding:16px; border:1px solid #d8d8d8; border-radius:8px; font-size:18px; resize:vertical;}
.textarea.small{ min-height:90px; }
.inline{ display:flex; align-items:center; gap:8px;}
.to{ color:#999; }
.mt8{ margin-top:8px; }
.block{ padding:16px; background:#f8f9fa; border-radius:8px; margin-top:16px; }
.error-text{ color:#dc3545; font-size:14px; margin-top:2px; }

/* 附件/列表 */
.file-list{ display:flex; flex-direction:column; gap:14px;}
.file-item{ background:#f8f9fa; border-radius:6px; padding:14px; margin-bottom:8px;}
.file-name{ font-weight:600;}
.file-meta{ color:#666; font-size:14px; margin-top:4px;}
.ops{ display:flex; gap:10px; margin-top:8px; }
.muted{ color:#999; }

/* 预览弹窗工具条 */
.preview-toolbar{ display:flex; gap:10px; align-items:center; margin-bottom:10px; }
.preview-toolbar select{ padding:6px 10px; border:1px solid #d8d8d8; border-radius:6px; }

/* 响应式 */
@media (max-width: 1200px){
  .center-content{ margin-right: 0; }
  .right-sidebar.fixed-sidebar{ position: static; width: 100%; }
}
@media (max-width: 992px){
  .grid-3{ grid-template-columns: 1fr; }
  .left-sidebar.fixed-sidebar{ position: static; width:100%; height:auto; margin-bottom:20px;}
  .center-content{ margin-left:0; }
}
</style>
