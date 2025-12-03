<template>
  <div class="page">
    <!-- 统一面包屑： 首页 / 活动列表 / 活动详情 -->
    <ZyBreadcrumb
      :items="[
        { label: '首页', to: '/student-home' },
        { label: '活动列表', to: { name: 'ActivityList' } },
        { label: '活动详情' }
      ]"
    />

    <!-- 内容主体：让出面包屑的高度 -->
    <div class="page-body">
      <div class="card">
        <div v-if="loading">正在加载活动信息...</div>

        <div v-else>
          <!-- 标题 -->
          <h1 class="title">{{ activity.title }}</h1>

          <!-- 时间 / 地点 / 面向对象 -->
          <div
            class="meta"
            v-if="activity.date || activity.place || activity.targetAudience"
          >
            <span v-if="activity.date">
              {{ split(activity.date).year }}-{{ split(activity.date).month }}-{{ split(activity.date).day }}
            </span>

            <span class="dot" v-if="activity.date && activity.place">·</span>
            <span v-if="activity.place">{{ activity.place }}</span>

            <span class="dot" v-if="activity.targetAudience">·</span>
            <span v-if="activity.targetAudience">
              面向：{{ activity.targetAudience }}
            </span>
          </div>

          <!-- 内容（这里用 event_summary） -->
          <div class="content">
            <p v-for="(line, i) in activity.content" :key="i">
              {{ line }}
            </p>
            <p v-if="!activity.content.length">暂无详细介绍</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import ZyBreadcrumb from '@/components/common/ZyBreadcrumb.vue'

// 带 baseURL + token 的 axios 实例
const api = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 10000
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (err) => Promise.reject(err)
)

export default {
  name: 'ActivityDetail',
  components: { ZyBreadcrumb },
  // 路由里用 :id 传过来的
  props: {
    id: {
      type: [String, Number],
      required: true
    }
  },
  data () {
    return {
      loading: true,
      activity: {
        title: '活动不存在',
        date: '',
        place: '',
        targetAudience: '',
        content: [] // 这里放 event_summary 文本
      }
    }
  },
  mounted () {
    this.fetchActivity()
  },
  methods: {
    async fetchActivity () {
      try {
        // 接口：GET /events/{event_id}
        const res = await api.get(`/events/${this.id}`)
        const raw = res.data?.data || {}

        const summary = raw.event_summary || ''

        this.activity = {
          title: raw.event_title || '活动不存在',
          // "2025-10-27 19:00:00" → "2025-10-27"
          date: raw.event_start_time ? raw.event_start_time.slice(0, 10) : '',
          place: raw.event_location || '',
          targetAudience: raw.event_target_audience || '',
          // 后端只有一个 summary，就当成一段内容展示
          content: summary ? [summary] : []
        }
      } catch (e) {
        console.error('获取活动详情失败', e)
      } finally {
        this.loading = false
      }
    },
    // 简单拆分 YYYY-MM-DD
    split (dateStr) {
      if (!dateStr) return { year: '', month: '', day: '' }
      const [year, month, day] = dateStr.split('-')
      return { year, month, day }
    }
  }
}
</script>

<style scoped>
.page{
  padding:30px;
  background:#f5f6f7;
  min-height:100vh;
}

/* 把内容整体往下挪，避免被固定面包屑挡住 */
.page-body{
  padding-top:85px;
}

.card{
  background:#fff;
  border-radius:12px;
  padding:26px;
}
.title{
  margin:0 0 8px;
  font-size:26px;
}
.meta{
  color:#8aa39a;
  font-size:14px;
  margin-top:6px;
}
.meta .dot{
  margin:0 6px;
}
.content{
  margin-top:18px;
  line-height:1.9;
  font-size:16px;
  color:#444;
}
.content p{
  margin:0 0 10px;
}
</style>
