<template>
    <div class="resume-page">
      <!-- 面包屑 -->
      <div class="breadcrumb-wrapper">
        <div class="breadcrumb">
          <router-link to="/student-home" class="breadcrumb-link">主页</router-link>
          <span class="breadcrumb-separator">></span>
          <span class="breadcrumb-current">简历管理</span>
  
          <div class="edit-actions">
            <button v-if="!editing" class="btn" @click="startEdit">编辑</button>
            <template v-else>
              <button class="btn ghost" @click="cancelEdit">取消</button>
              <button class="btn primary" @click="saveResume">确认</button>
            </template>
          </div>
        </div>
      </div>
  
      <div class="layout">
        <!-- 左侧目录（固定） -->
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
  
        <!-- 中间内容（滚动） -->
        <main class="center-content">
          <!-- 个人信息 -->
          <section id="profile" ref="profile" class="card">
            <h3 class="section-title">个人信息</h3>
            <div class="grid-3">
              <div class="field">
                <label>姓名</label>
                <input v-model="form.profile.name" :disabled="!editing" />
              </div>
              <div class="field">
                <label>出生年月</label>
                <input v-model="form.profile.birthday" :disabled="!editing" placeholder="YYYY-MM" />
              </div>
              <div class="field">
                <label>邮箱</label>
                <input v-model="form.profile.email" :disabled="!editing" />
              </div>
              <div class="field">
                <label>性别</label>
                <select v-model="form.profile.gender" :disabled="!editing">
                  <option value="">请选择</option>
                  <option>男</option><option>女</option><option>其他</option>
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
  
          <!-- 技能掌握 -->
          <section id="skills" ref="skills" class="card">
            <h3 class="section-title">技能掌握</h3>
            <textarea
              v-model="form.skills"
              :disabled="!editing"
              class="textarea"
              placeholder="编辑个人优势、熟练技术栈等..."
            ></textarea>
          </section>
  
          <!-- 工作经历 -->
          <section id="work" ref="work" class="card">
            <div class="card-head">
              <h3 class="section-title">工作经历</h3>
              <button v-if="editing" class="link-add" @click="addWork">+ 添加</button>
            </div>
            <div v-for="(w, i) in form.work" :key="i" class="block">
              <div class="grid-3">
                <div class="field"><label>公司名称</label><input v-model="w.company" :disabled="!editing" /></div>
                <div class="field"><label>职位名称</label><input v-model="w.title" :disabled="!editing" /></div>
                <div class="field">
                  <label>在职时间</label>
                  <div class="inline">
                    <input v-model="w.start" :disabled="!editing" placeholder="YYYY.MM" />
                    <span class="to">至</span>
                    <input v-model="w.end" :disabled="!editing" placeholder="YYYY.MM/今" />
                  </div>
                </div>
              </div>
              <div class="field mt8">
                <label>工作内容</label>
                <textarea v-model="w.content" :disabled="!editing" class="textarea small" placeholder="量化成果更加分…"></textarea>
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
                <div class="field"><label>项目名称</label><input v-model="p.name" :disabled="!editing" /></div>
                <div class="field"><label>项目角色</label><input v-model="p.role" :disabled="!editing" /></div>
                <div class="field">
                  <label>项目时间</label>
                  <div class="inline">
                    <input v-model="p.start" :disabled="!editing" placeholder="YYYY.MM" />
                    <span class="to">至</span>
                    <input v-model="p.end" :disabled="!editing" placeholder="YYYY.MM" />
                  </div>
                </div>
              </div>
              <div class="field mt8">
                <label>项目描述</label>
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
                <div class="field"><label>学校名称</label><input v-model="e.school" :disabled="!editing" /></div>
                <div class="field"><label>专业</label><input v-model="e.major" :disabled="!editing" /></div>
                <div class="field"><label>专业排名</label><input v-model="e.rank" :disabled="!editing" placeholder="可选" /></div>
              </div>
              <div class="field mt8">
                <label>时间段</label>
                <div class="inline">
                  <input v-model="e.start" :disabled="!editing" placeholder="YYYY.MM" />
                  <span class="to">至</span>
                  <input v-model="e.end" :disabled="!editing" placeholder="YYYY.MM/今" />
                </div>
              </div>
              <button v-if="editing" class="link-del" @click="form.education.splice(i,1)">删除该教育</button>
            </div>
          </section>
  
          <!-- 底部操作（中间栏） -->
          <section class="card action-card" v-if="editing">
            <div class="action-buttons">
              <button class="btn ghost" @click="cancelEdit">取消修改</button>
              <button class="btn primary" @click="saveResume">提交保存</button>
            </div>
          </section>
        </main>
  
        <!-- 右侧边栏（固定）：附件 + 设置 -->
        <aside class="right-sidebar fixed-sidebar">
          <!-- 附件管理 -->
          <div class="card small-card">
            <h3 class="section-title">附件管理</h3>
            <div class="file-list">
              <div class="file-item" v-for="(f, i) in form.files" :key="i">
                <div class="file-name">{{ f.name }}</div>
                <div class="file-meta">{{ f.size }} · 更新于{{ f.updated }}</div>
                <div class="file-ops" v-if="editing">
                  <button class="link-del" @click="form.files.splice(i,1)">删除</button>
                </div>
              </div>
            </div>
            <el-upload
              v-if="editing"
              class="upload"
              :show-file-list="false"
              :on-success="handleUploadSuccess"
              :before-upload="beforeUpload"
              action="/api/upload"
            >
              <button class="btn">上传PDF</button>
            </el-upload>
          </div>
  
          <!-- 设置 -->
          <div class="card small-card">
            <h3 class="section-title">设置</h3>
            <div class="field">
              <label>切换模版</label>
              <select v-model="form.template" :disabled="!editing">
                <option value="default">默认模版</option>
                <option value="simple">极简黑白</option>
                <option value="tech">技术风</option>
              </select>
            </div>
  
            <div class="field">
              <label>标签</label>
              <div class="tags">
                <span class="tag" v-for="(t,idx) in form.tags" :key="idx">
                  {{ t }} <i v-if="editing" class="x" @click="removeTag(idx)">×</i>
                </span>
              </div>
              <div v-if="editing" class="tag-add">
                <input v-model="newTag" placeholder="输入后回车" @keyup.enter="addTag" />
                <button class="btn" @click="addTag">添加</button>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </template>
  
  <script>
  import { ElMessage } from 'element-plus'
  
  export default {
    name: 'ResumeManage',
    data() {
      return {
        editing: false,
        phoneError: '',
        backup: null,
        activeSection: 'profile',
        sections: [
          { id: 'profile',  name: '个人信息' },
          { id: 'skills',   name: '技能掌握' },
          { id: 'work',     name: '工作经历' },
          { id: 'projects', name: '项目经历' },
          { id: 'edu',      name: '教育经历' }
        ],
        form: {
          profile: {
            name: '周鑫',
            birthday: '2003-06',
            email: 'zeal@example.com',
            gender: '男',
            status: '实习',
            phone: '13800138000'
          },
          skills:
            '熟悉 Vue3 / TypeScript / Element Plus；掌握 Node.js、Express、MongoDB；了解计算机网络与操作系统基础。',
          work: [
            {
              company: '某科技',
              title: '前端实习生',
              start: '2025.06',
              end: '2025.09',
              content: '参与企业招聘平台前端开发，完成简历模块与岗位模块重构。'
            }
          ],
          projects: [
            {
              name: '校园招聘平台',
              role: '前端负责人',
              start: '2025.03',
              end: '2025.06',
              desc: '基于 Vue3 + Element Plus，设计学生端与企业端，完成组件库封装、状态管理与路由。'
            }
          ],
          education: [
            { school: '中山大学', major: '软件工程', rank: '前10%', start: '2022.09', end: '2026.06' }
          ],
          files: [
            { name: '周鑫简历-前端.pdf', size: '66.5KB', updated: '2025.10.22 22:54' },
            { name: '周鑫简历-后端.pdf', size: '99.5KB', updated: '2025.10.22 23:00' }
          ],
          template: 'default',
          tags: ['前端', '校招', '实习中']
        },
        newTag: ''
      }
    },
    mounted() { this.setupScrollSpy() },
    methods: {
      // 编辑控制
      startEdit() { this.backup = JSON.parse(JSON.stringify(this.form)); this.editing = true },
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
        // TODO: 调用后端保存接口
        ElMessage.success('保存成功')
        this.editing = false
      },
  
      // 校验
      validatePhone() {
        const ok = /^1[3-9]\d{9}$/.test(this.form.profile.phone)
        this.phoneError = ok ? '' : '请输入正确的手机号码'
      },
  
      // 列表增删
      addWork() { this.form.work.push({ company:'', title:'', start:'', end:'', content:'' }) },
      addProject() { this.form.projects.push({ name:'', role:'', start:'', end:'', desc:'' }) },
      addEdu() { this.form.education.push({ school:'', major:'', rank:'', start:'', end:'' }) },
  
      // 标签
      addTag() {
        const t = this.newTag.trim()
        if (t) { this.form.tags.push(t); this.newTag = '' }
      },
      removeTag(i) { this.form.tags.splice(i,1) },
  
      // 上传
      beforeUpload(file) {
        const ok = file.type === 'application/pdf' && file.size/1024/1024 < 5
        if (!ok) ElMessage.error('仅支持小于5MB的 PDF')
        return ok
      },
      handleUploadSuccess(res, file) {
        this.form.files.unshift({
          name: file.name,
          size: (file.size/1024).toFixed(1)+'KB',
          updated: new Date().toLocaleString()
        })
        ElMessage.success('上传成功')
      },
  
      // 目录滚动/高亮
      scrollTo(id) {
        this.$refs[id]?.scrollIntoView({ behavior:'smooth', block:'start' })
      },
      setupScrollSpy() {
        const io = new IntersectionObserver((es)=>{
          es.forEach(e=>{ if(e.isIntersecting){ this.activeSection = e.target.id } })
        }, { threshold: 0.5 })
        Object.values(this.$refs).forEach(r => r && io.observe(r))
      }
    }
  }
  </script>
  
  <style scoped>
  /* 页面与面包屑（延续企业编辑页风格） */
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
  
  /* 三栏布局 */
  .layout{ display:flex; gap:20px; width:100%; align-items:flex-start; padding-top:85px; }
  
  /* 左侧目录固定 */
  .left-sidebar.fixed-sidebar{
    position: fixed;
    top: 220px;
    left: 30px;
    width: 280px;
    background:#fff;
    border-radius:10px;
    box-shadow:0 2px 10px rgba(0,0,0,.1);
    padding:30px;
    height: 1000px;
  }
  .sidebar-title{ font-size:30px; font-weight:bold; color:#333; margin-bottom:15px;}
  .title-divider{ height:1px; background:#d8d8d8; margin-bottom:20px; }
  .sidebar-item{ padding:15px 0; cursor:pointer; font-size:22px; color:#666; border-bottom:1px solid #f0f0f0; transition:.3s;}
  .sidebar-item:hover{ color:#325e21; background:#f8f9fa;}
  .sidebar-item.active{ color:#325e21; font-weight:bold; background:#f0f7f0;}
  
  /* 中间内容（让出左右栏空间） */
  .center-content{
    flex:1;
    display:flex;
    flex-direction:column;
    gap:20px;
    min-width:0;
    margin-left: 320px;   /* 左栏280 + 间距40 */
    margin-right: 400px;  /* 右栏360 + 间距40 */
  }
  
  /* 右侧边栏固定 */
  .right-sidebar.fixed-sidebar{
    position: fixed;
    top: 220px;
    right: 30px;
    width: 360px;
    display:flex;
    flex-direction:column;
    gap:20px;
  }
  
  /* 卡片与表单通用 */
  .card{ background:#fff; border-radius:10px; box-shadow:0 2px 10px rgba(0,0,0,.1); padding:40px; box-sizing:border-box; }
  .small-card{ padding:24px; }
  .card-head{ display:flex; align-items:center; justify-content:space-between; }
  .section-title{ color:#325e21; font-size:30px; font-weight:bold; border-left:4px solid #325e21; padding-left:12px; margin:0;}
  .grid-3{ display:grid; grid-template-columns: repeat(3, 1fr); gap:24px;}
  .field{ display:flex; flex-direction:column; gap:8px; font-size:18px;}
  .field label{ color:#333; }
  .field input, .field select{ padding:12px 16px; border:1px solid #d8d8d8; border-radius:6px; font-size:18px;}
  .field input:disabled, .field select:disabled, textarea:disabled{ background:#f7f7f7; color:#666;}
  .textarea{ width:100%; min-height:120px; padding:16px; border:1px solid #d8d8d8; border-radius:8px; font-size:18px; resize:vertical;}
  .textarea.small{ min-height:90px; }
  .inline{ display:flex; align-items:center; gap:8px;}
  .to{ color:#999; }
  .mt8{ margin-top:8px; }
  .block{ padding:16px; background:#f8f9fa; border-radius:8px; margin-top:16px; }
  .error-text{ color:#dc3545; font-size:14px; margin-top:2px; }
  
  /* 附件与标签 */
  .file-list{ display:flex; flex-direction:column; gap:14px;}
  .file-item{ background:#f8f9fa; border-radius:6px; padding:14px;}
  .file-name{ font-weight:600;}
  .file-meta{ color:#666; font-size:14px; margin-top:4px;}
  .tags{ display:flex; gap:10px; flex-wrap:wrap; margin-top:6px;}
  .tag{ background:#eef5ee; color:#325e21; padding:6px 10px; border-radius:16px; display:inline-flex; align-items:center; gap:6px;}
  .tag .x{ cursor:pointer; }
  .tag-add{ display:flex; gap:10px; margin-top:10px;}
  .tag-add input{ flex:1; padding:10px 12px; border:1px solid #d8d8d8; border-radius:6px; font-size:16px;}
  .upload{ margin-top:10px; }
  
  .action-card .action-buttons{ display:flex; justify-content:center; gap:20px; }
  
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
  