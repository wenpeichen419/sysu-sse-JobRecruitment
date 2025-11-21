<template>
  <div class="page">
    <!-- 面包屑： 首页 / 活动列表 -->
    <div class="breadcrumb">
      <router-link :to="{ name: 'StudentHome' }" class="link">首页</router-link>
      <span class="sep"> / </span>
      <span class="current">活动列表</span>
    </div>

    <!-- 顶部筛选 -->
    <div class="toolbar">
      <div class="tab-area">
        <!-- 大类：全部 / 企业宣讲 / 招聘活动 -->
        <div class="tabs">
          <button
            v-for="t in mainTabs"
            :key="t.key"
            class="tab"
            :class="{ active: activeMain === t.key }"
            @click="switchMain(t.key)"
          >
            {{ t.label }}
          </button>
        </div>

        <!-- 招聘活动子类：企业 / 事业单位 / 实习 -->
        <div class="sub-tabs" v-if="activeMain === 'recruit'">
          <button
            v-for="t in recruitTabs"
            :key="t.key"
            class="tab sub-tab"
            :class="{ active: activeSub === t.key }"
            @click="switchSub(t.key)"
          >
            {{ t.label }}
          </button>
        </div>
      </div>

      <!-- 搜索 -->
      <div class="search">
        <input v-model="keyword" placeholder="搜索标题/地点..." />
        <button @click="doSearch">搜索</button>
      </div>
    </div>

    <!-- 列表 -->
    <div class="list">
      <div
        v-for="a in shown"
        :key="a.key"
        class="row"
        @click="goDetail(a)"
      >
        <div class="datebox">
          <div class="d">{{ split(a.date).day }}</div>
          <div class="ym">
            {{ split(a.date).year }}.{{ split(a.date).month }}
          </div>
        </div>
        <div class="body">
          <div class="title">
            <span v-if="a.kind === 'job'" class="tag-job">岗位</span>
            <span v-else class="tag-event">活动</span>
            {{ a.title }}
          </div>
          <div class="meta">{{ a.place }}</div>
          <div class="summary">{{ a.summary }}</div>
        </div>
        <div class="arrow">›</div>
      </div>

      <div v-if="shown.length === 0" class="empty">暂无相关活动</div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

// 把日期字符串拆成年 / 月 / 日
function splitYMD(str) {
  if (!str) return { year: '', month: '', day: '' }
  const d = new Date(str)
  if (Number.isNaN(d.getTime())) return { year: '', month: '', day: '' }
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return { year: y, month: m, day }
}

export default {
  name: 'ActivityList',
  data() {
    const initTab = this.$route.query.tab || 'all'

    let activeMain = 'all'          // all / talk / recruit
    let activeSub = 'allRecruit'    // allRecruit / enterprise / institution / internship

    if (initTab === 'talk') {
      activeMain = 'talk'
    } else if (initTab === 'recruit') {
      activeMain = 'recruit'
      activeSub = 'allRecruit'
    } else if (['enterprise', 'institution', 'internship'].includes(initTab)) {
      activeMain = 'recruit'
      activeSub = initTab
    }

    return {
      mainTabs: [
        { key: 'all',     label: '全部活动' },
        { key: 'talk',    label: '企业宣讲' },
        { key: 'recruit', label: '招聘活动' }
      ],
      recruitTabs: [
        { key: 'allRecruit', label: '全部招聘' },
        { key: 'enterprise', label: '企业招聘' },
        { key: 'institution', label: '事业单位招聘' },
        { key: 'internship', label: '实习招聘' }
      ],

      activeMain,
      activeSub,
      keyword: this.$route.query.q || '',

      // 真正显示用的数据（events + jobs 合在一起）
      data: []
    }
  },
  computed: {
    filtered() {
      let list = this.data

      // 按大类过滤
      if (this.activeMain === 'talk') {
        // 企业宣讲
        list = list.filter(a => a.category === 'talk')
      } else if (this.activeMain === 'recruit') {
        const recruitCats = ['enterprise', 'institution', 'internship']
        list = list.filter(a => recruitCats.includes(a.category))

        if (this.activeSub !== 'allRecruit') {
          list = list.filter(a => a.category === this.activeSub)
        }
      }
      // activeMain === 'all' 时不过滤类型

      // 关键字搜索
      if (this.keyword.trim()) {
        const kw = this.keyword.toLowerCase()
        list = list.filter(a =>
          (a.title || '').toLowerCase().includes(kw) ||
          (a.place || '').toLowerCase().includes(kw)
        )
      }

      // 按日期倒序（最近的在前面）
      return list.slice().sort((a, b) => new Date(b.date) - new Date(a.date))
    },
    shown() {
      return this.filtered
    }
  },
  created() {
    // 页面加载时一起拉数据
    this.fetchAll()
  },
  methods: {
    split: splitYMD,

    async fetchAll() {
      try {
        const [eventsRes, jobsRes] = await Promise.all([
          axios.get('/events/upcoming'),
          axios.get('/jobs/recent')
        ])

        // 1) events 表 → 活动
        const eventsData = eventsRes.data?.data || {}
        const events = (eventsData.events || []).map(e => {
          // 根据 event_type 映射到 category
          let category = 'enterprise'
          if (e.event_type === 'lecture') category = 'talk'
          else if (e.event_type === 'internship') category = 'internship'
          else if (e.event_type === 'enterprise') category = 'enterprise'
          // 如果以后有事业单位招聘，可以在后端加一个类型，然后这里映射为 institution

          return {
            key: `event-${e.id}`,
            id: e.id,
            kind: 'event',
            category,                                // talk / enterprise / internship ...
            title: e.event_title,
            date: e.event_start_time,                // datetime，前端只取年月日
            place: e.event_location,
            summary: e.event_description || ''
          }
        })

        // 2) jobs 表 → 岗位
        const jobsData = jobsRes.data?.data || {}
        const jobs = (jobsData.job_postings || []).map(j => {
          const category = j.category || 'enterprise'  // 暂时默认企业招聘
          return {
            key: `job-${j.job_id}`,
            id: j.job_id,
            kind: 'job',
            category,                                   // enterprise / institution / internship
            title: j.job_title,
            date: j.posted_at,                          // "2025-11-20T20:36:17Z"
            place: j.location || '',
            summary: j.summary || ''
          }
        })

        this.data = [...events, ...jobs]
      } catch (err) {
        console.error('获取活动列表失败', err)
      }
    },

    // 统一同步路由 query（tab + q）
    syncRoute() {
      let tab = 'all'
      if (this.activeMain === 'talk') {
        tab = 'talk'
      } else if (this.activeMain === 'recruit') {
        tab = this.activeSub === 'allRecruit' ? 'recruit' : this.activeSub
      }

      this.$router.replace({
        name: 'ActivityList',
        query: {
          tab,
          q: this.keyword || undefined
        }
      })
    },

    switchMain(key) {
      this.activeMain = key
      if (key !== 'recruit') {
        this.activeSub = 'allRecruit'
      }
      this.syncRoute()
    },

    switchSub(key) {
      this.activeMain = 'recruit'
      this.activeSub = key
      this.syncRoute()
    },

    doSearch() {
      this.syncRoute()
    },

    // 根据类型跳不同详情页
    goDetail(a) {
      if (a.kind === 'job') {
        // 岗位 → JobDetail
        this.$router.push({ name: 'JobDetail', params: { id: a.id } })
      } else {
        // 活动 → ActivityDetail
        this.$router.push({ name: 'ActivityDetail', params: { id: a.id } })
      }
    }
  }
}
</script>

<style scoped>
/* 你的原样式保持不变，只加了两个小 tag */
.page {
  padding: 20px 24px;
  background: #f5f6f7;
  min-height: 100vh;
}

.breadcrumb {
  background: #fff;
  padding: 14px 18px;
  border-radius: 10px;
  margin-bottom: 16px;
}
.link {
  color: #2a5e23;
  text-decoration: none;
}
.sep {
  color: #999;
  margin: 0 6px;
}
.current {
  color: #333;
  font-weight: 600;
}

.toolbar {
  background: #fff;
  border-radius: 10px;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.tab-area {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tabs {
  display: flex;
  gap: 6px;
}

.sub-tabs {
  display: flex;
  gap: 6px;
}

.tab {
  border: none;
  background: transparent;
  padding: 10px 14px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  color: #666;
  font-size: 14px;
}

.sub-tab {
  font-weight: 500;
  font-size: 13px;
}

.tab.active {
  color: #1b8f59;
  background: #eaf6ef;
}

.search {
  display: flex;
  gap: 8px;
}
.search input {
  width: 260px;
  padding: 10px 12px;
  border: 1px solid #e2e2e2;
  border-radius: 6px;
}
.search button {
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  background: #2a5e23;
  color: #fff;
  cursor: pointer;
}

.list {
  background: #fff;
  border-radius: 10px;
  padding: 6px 6px 2px;
}
.row {
  display: flex;
  gap: 16px;
  align-items: center;
  padding: 16px;
  border-radius: 10px;
  margin: 8px 0;
  cursor: pointer;
  transition: 0.15s;
}
.row:hover {
  background: #f8faf9;
}
.datebox {
  width: 68px;
  min-width: 68px;
  border-right: 1px solid #eee;
  text-align: center;
  padding-right: 10px;
  color: #666;
}
.datebox .d {
  font-size: 22px;
  font-weight: 800;
  line-height: 1;
}
.datebox .ym {
  font-size: 12px;
}
.body {
  flex: 1;
  min-width: 0;
}
.title {
  font-weight: 700;
  font-size: 18px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #163a24;
  display: flex;
  align-items: center;
  gap: 6px;
}
.meta {
  font-size: 13px;
  color: #8aa39a;
  margin-top: 4px;
}
.summary {
  font-size: 14px;
  color: #555;
  margin-top: 6px;
}
.arrow {
  color: #96a0a5;
  font-size: 22px;
  padding: 0 6px;
}
.empty {
  text-align: center;
  color: #999;
  padding: 48px 0;
}

/* 小标签：岗位 / 活动 */
.tag-job,
.tag-event {
  display: inline-block;
  padding: 2px 6px;
  border-radius: 999px;
  font-size: 12px;
}
.tag-job {
  background: #fff3cd;
  color: #856404;
}
.tag-event {
  background: #eaf6ef;
  color: #1b8f59;
}
</style>
