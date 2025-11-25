<template>
  <div class="page school" id="school-a4">
    <!-- 顶部横幅 -->
    <div class="banner">
      <img class="logo" src="@/assets/campus_logo.png" alt="logo" />
      <div class="title">
        <div class="school-cn">中山大学</div>
        <div class="dept">软件工程学院</div>
        <div class="dept-en">SCHOOL OF SOFTWARE ENGINEERING</div>
      </div>
      <div class="avatar">
        <img v-if="avatarUrl" :src="avatarUrl" alt="avatar" />
      </div>
    </div>

    <!-- 个人信息 -->
    <Section title="个人信息">
      <table class="kv">
        <tbody>
          <tr>
            <td class="k">姓 名</td><td>{{ d.profile.name || '-' }}</td>
            <td class="k">邮 箱</td><td>{{ d.profile.email || '-' }}</td>
          </tr>
          <tr>
            <td class="k">出生年月</td><td>{{ d.profile.birthday || '-' }}</td>
            <td class="k">电 话</td><td>{{ d.profile.phone || '-' }}</td>
          </tr>
          <tr>
            <td class="k">求职状态</td><td>{{ d.profile.status || '-' }}</td>
            <td class="k">层 次</td><td>{{ d.profile.degree || '-' }}</td>
          </tr>
        </tbody>
      </table>
    </Section>

    <!-- 工作经历 -->
    <Section title="工作经历" v-if="d.work?.length">
      <div v-for="(w,i) in d.work" :key="i" class="block">
        <div class="meta">
          <div><span class="label">公司名称</span>{{ w.company || '-' }}</div>
          <div><span class="label">职位名称</span>{{ w.title || '-' }}</div>
          <div class="right"><span class="label">在职时间</span>{{ range(w.start, w.end) }}</div>
        </div>
        <div class="desc">{{ w.content }}</div>
      </div>
    </Section>

    <!-- 项目经历 -->
    <Section title="项目经历" v-if="d.projects?.length">
      <div v-for="(p,i) in d.projects" :key="i" class="block">
        <div class="meta">
          <div><span class="label">项目名称</span>{{ p.name || '-' }}</div>
          <div><span class="label">项目角色</span>{{ p.role || '-' }}</div>
          <div class="right"><span class="label">项目时间</span>{{ range(p.start, p.end) }}</div>
        </div>
        <div class="desc">{{ p.desc }}</div>
      </div>
    </Section>

    <!-- 社团/组织经历 -->
    <Section title="社团/组织经历" v-if="d.orgs?.length">
      <div v-for="(o,i) in d.orgs" :key="i" class="block">
        <div class="meta">
          <div><span class="label">组织名称</span>{{ o.name || '-' }}</div>
          <div><span class="label">担任角色</span>{{ o.role || '-' }}</div>
          <div class="right"><span class="label">时间段</span>{{ range(o.start, o.end) }}</div>
        </div>
        <div class="desc">{{ o.desc }}</div>
      </div>
    </Section>

    <!-- 竞赛经历 -->
    <Section title="竞赛经历" v-if="d.competitions?.length">
      <div v-for="(c,i) in d.competitions" :key="i" class="block">
        <div class="meta">
          <div><span class="label">竞赛名称</span>{{ c.name || '-' }}</div>
          <div><span class="label">担任角色</span>{{ c.role || '-' }}</div>
          <div class="right"><span class="label">获奖时间</span>{{ c.time || '-' }}</div>
        </div>
        <div v-if="c.award" class="desc"><span class="label">获得奖项</span>{{ c.award }}</div>
      </div>
    </Section>

    <!-- 技能掌握 -->
    <Section title="技能掌握" v-if="skillsAsList.length || d.skills">
      <ul v-if="skillsAsList.length" class="bullets">
        <li v-for="(s,idx) in skillsAsList" :key="idx">{{ s }}</li>
      </ul>
      <div v-else class="desc">{{ d.skills }}</div>
    </Section>
  </div>
</template>

<script>
export default {
  name: 'SchoolTemplate',
  props: {
    data: { type: Object, required: true },
    avatarUrl: { type: String, default: '' } // 可选头像
  },
  computed: {
    d(){ return this.data || {} },
    // 把“技能掌握”按换行/分号切成条目
    skillsAsList(){
      const raw = (this.d.skills || '').trim()
      if (!raw) return []
      return raw
        .split(/\r?\n|；|;/)
        .map(s => s.trim())
        .filter(Boolean)
    }
  },
  methods:{
    range(a,b){
      const x = a || ''
      const y = b || ''
      return (x && y) ? `${x} - ${y}` : (x || y || '-')
    }
  },
  components: {
    Section: {
      props: { title: String },
      template: `
        <div class="section" style="page-break-inside: avoid;">
          <div class="sec-title">{{ title }}</div>
          <div class="sec-body"><slot/></div>
        </div>`
    }
  }
}
</script>

<style scoped>
/* A4 画布 */
.page.school{
  width: 794px;              /* 210mm -> 794px @96dpi */
  min-height: 1123px;        /* 297mm -> 1123px */
  box-sizing: border-box;
  padding: 18px 22px 24px;
  color:#222;
  font-size: 14px;
  line-height: 1.7;
  font-family: "Microsoft YaHei","Noto Sans SC","PingFang SC",sans-serif;
  background:#fff;
}

/* 顶部横幅（不全宽） */
.banner{
  display:flex; align-items:center;
  background:#1d5e2a; color:#fff;
  padding:12px 16px; border-radius:8px;
  margin: 6px 4px 10px;      /* 左右留白，贴近示例 */
  position: relative;
}
.logo{ height:40px; margin-right:12px; }
.title{ display:flex; flex-direction:column; gap:2px; flex:1; }
.school-cn{ font-size:20px; font-weight:800; letter-spacing:1px; }
.dept{ font-size:16px; opacity:.95; }
.dept-en{ font-size:12px; opacity:.9; margin-top:2px; letter-spacing:.5px; }
.avatar{
  width:64px; height:64px; border-radius: 50% 0 0 50%;
  background:#e0e0e0; overflow:hidden;
  position: absolute; right: 10px; top: 8px;   /* 右上“露半圆”效果 */
}
.avatar img{ width:100%; height:100%; object-fit: cover; }

/* 分区标题 */
.section{ margin-top: 14px; }
.sec-title{
  color:#1d5e2a; font-weight:800; font-size:18px;
  padding:6px 10px; border-left:4px solid #1d5e2a;
  background:#f6fbf6; border-radius:2px;
}
.sec-body{ margin-top:10px; }

/* 个人信息表格 */
.kv{ width:100%; border-collapse:collapse; table-layout: fixed; }
.kv td{ border:1px solid #e6e6e6; padding:8px 10px; word-break: break-all; }
.kv .k{ width: 90px; color:#1d5e2a; background:#f9fcf9; font-weight:700; }

/* 列表块（工作/项目/社团/竞赛） */
.block{
  border:1px solid #e9ecef; border-radius:8px;
  padding:10px 12px; margin-top:10px; background:#fff;
  page-break-inside: avoid;
}
.meta{
  display:flex; align-items:center; gap:16px; flex-wrap:wrap;
  border-bottom:1px dashed #e6e6e6; padding-bottom:6px;
}
.meta .label{
  color:#1d5e2a; font-weight:700; margin-right:4px;
}
.meta .right{ margin-left:auto; }
.desc{ white-space: pre-wrap; margin-top:8px; }


/* 让打印导出保留颜色 */
.page.school, .page.school * {
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

/* 防止块被硬拆页 */
.block, .section {
  break-inside: avoid;
  page-break-inside: avoid;
}


/* 技能 - 小圆点列表 */
.bullets{ margin:0; padding-left: 18px; }
.bullets li{ margin:4px 0; }

/* 打印分页友好 */
.section{ page-break-inside: avoid; }
</style>

