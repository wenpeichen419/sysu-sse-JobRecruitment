<template>
  <div class="page">
    <!-- 面包屑： 首页 / 活动列表 / 活动详情 -->
    <div class="breadcrumb">
      <router-link :to="{ name: 'StudentHome' }" class="link">首页</router-link>
      <span class="sep"> / </span>
      <router-link :to="{ name: 'ActivityList' }" class="link">活动列表</router-link>
      <span class="sep"> / </span>
      <span class="current">活动详情</span>
    </div>

    <div class="card">
      <div v-if="loading">正在加载活动信息...</div>
      <div v-else>
        <h1 class="title">{{ activity.title }}</h1>

        <div class="meta" v-if="activity.date || activity.place || activity.category">
          <span v-if="activity.date">
            {{ split(activity.date).year }}-{{ split(activity.date).month }}-{{ split(activity.date).day }}
          </span>
          <span class="dot" v-if="activity.date && activity.place">·</span>
          <span v-if="activity.place">{{ activity.place }}</span>
          <span class="dot" v-if="activity.category">·</span>
          <span v-if="activity.category">{{ dict[activity.category] || activity.category }}</span>
        </div>

        <div class="content">
          <p v-for="(line, i) in activity.content" :key="i">{{ line }}</p>
          <p v-if="!activity.content.length">暂无详细介绍</p>
        </div>

        <div v-if="activity.url" class="ext">
          <a :href="activity.url" target="_blank">官网链接</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

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
  props: { id: { type: [String, Number], required: true } },
  data() {
    return {
      loading: true,
      activity: {
        title: '活动不存在',
        date: '',
        place: '',
        category: '',
        content: [],
        url: ''
      },
      dict: {
        enterprise: '企业宣讲 / 招聘',
        internship: '实习招聘',
        lecture: '讲座 / 分享会'
      }
    }
  },
  mounted() {
    this.fetchActivity()
  },
  methods: {
    async fetchActivity() {
      try {
        const res = await api.get(`/events/${this.id}`)
        const raw = res.data?.data || {}

        this.activity = {
          title: raw.event_title || '活动不存在',
          date: (raw.event_start_time || '').slice(0, 10),
          place: raw.event_location || '',
          category: raw.event_type || '',
          content: (raw.event_description || '').split(/\r?\n/).filter(Boolean),
          url: raw.url || ''
        }
      } catch (e) {
        console.error('获取活动详情失败', e)
      } finally {
        this.loading = false
      }
    },
    split(dateStr) {
      if (!dateStr) return { year: '', month: '', day: '' }
      const [year, month, day] = dateStr.split('-')
      return { year, month, day }
    }
  }
}
</script>

<style scoped>
.page{ padding:20px 24px; background:#f5f6f7; min-height:100vh; }
.breadcrumb{ background:#fff; padding:14px 18px; border-radius:10px; margin-bottom:16px; }
.link{ color:#2a5e23; text-decoration:none; }
.sep{ color:#999; margin:0 6px; }
.current{ color:#333; font-weight:600; }

.card{ background:#fff; border-radius:12px; padding:26px; }
.title{ margin:0 0 8px; font-size:26px; }
.meta{ color:#8aa39a; font-size:14px; margin-top:6px; }
.meta .dot{ margin:0 6px; }
.content{ margin-top:18px; line-height:1.9; font-size:16px; color:#444; }
.content p{ margin:0 0 10px; }
.ext{ margin-top:16px; }
.ext a{ color:#2a5e23; }
</style>
