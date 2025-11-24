<template>
  <div class="page">
    <!-- 面包屑： 首页 / 活动列表 -->
    <div class="breadcrumb">
      <router-link :to="{ name: 'StudentHome' }" class="link">首页</router-link>
      <span class="sep"> / </span>
      <span class="current">活动列表</span>
    </div>

    <!-- 顶部：只保留搜索 -->
    <div class="toolbar">
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
            <!-- 现在只有活动，可保留这个 tag 样式 -->
            <span class="tag-event">活动</span>
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
    return {
      keyword: this.$route.query.q || '',
      // 只存活动（events）
      data: []
    }
  },
  computed: {
    filtered() {
      let list = this.data || []

      // 关键字搜索（标题 / 地点）
      if (this.keyword.trim()) {
        const kw = this.keyword.toLowerCase()
        list = list.filter(a =>
          (a.title || '').toLowerCase().includes(kw) ||
          (a.place || '').toLowerCase().includes(kw)
        )
      }

      // 按日期倒序（最近的在前）
      return list.slice().sort((a, b) => new Date(b.date) - new Date(a.date))
    },
    shown() {
      return this.filtered
    }
  },
  created() {
    // 页面加载时拉全部活动
    this.fetchAll()
  },
  methods: {
    split: splitYMD,

    async fetchAll() {
      try {
        // 你现在的接口是 /events/upcoming，就继续用它
        const res = await axios.get('/events/upcoming')
        console.log('events 接口返回：', res.data)
        const events = res.data?.data?.events || []

        this.data = events.map(e => ({
          key: `event-${e.event_id}`,
          id: e.event_id,
          kind: 'event',
          title: e.event_title,
          date: e.event_start_time,
          place: e.event_location,
          // 后端目前没返回描述，就兜底一下
          summary: e.event_description || ''
        }))
      } catch (err) {
        console.error('获取活动列表失败', err)
      }
    },

    // 搜索按钮现在只是“触发一下”，实际筛选依赖 v-model 绑定的 keyword
    doSearch() {
      // 不需要额外逻辑，keyword 改变会自动触发 computed.filtered
    },

    // 活动详情
    goDetail(a) {
      this.$router.push({ name: 'ActivityDetail', params: { id: a.id } })
    }
  }
}
</script>

<style scoped>
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
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 16px;
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

/* 小标签：活动 */
.tag-event {
  display: inline-block;
  padding: 2px 6px;
  border-radius: 999px;
  font-size: 12px;
  background: #eaf6ef;
  color: #1b8f59;
}
</style>
