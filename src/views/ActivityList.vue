<template>
  <div class="page">
    <!-- 面包屑： 首页 / 活动列表 -->
    <div class="breadcrumb">
      <router-link :to="{ name: 'StudentHome' }" class="link">首页</router-link>
      <span class="sep"> / </span>
      <span class="current">活动列表</span>
    </div>

    <!-- 顶部：搜索 -->
    <div class="toolbar">
      <div class="search">
        <input
          v-model="keyword"
          placeholder="搜索标题/地点..."
          @keyup.enter="doSearch"
        />
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
            {{ a.title }}
          </div>
          <div class="meta">{{ a.place }}</div>
          <div class="summary">{{ a.summary }}</div>
        </div>
        <div class="arrow">›</div>
      </div>

      <div v-if="shown.length === 0" class="empty">暂无相关活动</div>
    </div>

    <!-- 分页 -->
    <div
      v-if="shown.length > 0 && totalPages > 1"
      class="pagination"
    >
      <button
        :disabled="page === 1"
        @click="handlePrevPage"
      >
        上一页
      </button>

      <span class="info">
        第 {{ page }} / {{ totalPages }} 页，
        共 {{ total }} 条记录
      </span>

      <button
        :disabled="page === totalPages"
        @click="handleNextPage"
      >
        下一页
      </button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

// 单独建一个本文件内部用的 axios 实例，直接打到 8080
const api = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 10000
})

// 在这里统一加上 token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (err) => Promise.reject(err)
)

// 把日期字符串拆成年 / 月 / 日
function splitYMD (str) {
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
  data () {
    return {
      keyword: this.$route.query.q || '',
      data: [],       // 当前页活动列表
      total: 0,       // 总记录数
      page: 1,        // 当前页码
      pageSize: 10    // 每页数量
    }
  },
  computed: {
    // 当前页显示的数据（后端已经分页，这里直接用）
    shown () {
      return this.data || []
    },
    // 总页数
    totalPages () {
      if (!this.total || !this.pageSize) return 1
      return Math.ceil(this.total / this.pageSize)
    }
  },
  created () {
    // 页面加载时按分页接口拉取活动
    this.fetchPagedEvents()
  },
  methods: {
    split: splitYMD,

    // 分页接口：/events/list?page=1&pageSize=10&keyword=xxx
    async fetchPagedEvents () {
      try {
        const res = await api.get('/events/list', {
          params: {
            page: this.page,
            pageSize: this.pageSize,
            keyword: this.keyword || ''
          }
        })

        const data = res.data?.data || {}
        const events = data.events || []

        // 总数
        this.total = data.total || 0

        // 当前页数据
        this.data = events.map(e => ({
          key: `event-${e.event_id}`,
          id: e.event_id,
          title: e.event_title,
          date: e.event_start_time,
          place: e.event_location,
          summary: e.event_summary || ''
        }))
      } catch (err) {
        console.error('获取活动列表失败', err)
      }
    },

    // 搜索：重置到第一页再调接口
    doSearch () {
      this.page = 1
      this.fetchPagedEvents()
    },

    handlePrevPage () {
      if (this.page > 1) {
        this.page--
        this.fetchPagedEvents()
      }
    },

    handleNextPage () {
      if (this.page < this.totalPages) {
        this.page++
        this.fetchPagedEvents()
      }
    },

    // 活动详情
    goDetail (a) {
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
  font-size: 20px; 
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
  font-size: 16px;
}
.search button {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  background: #2a5e23;
  color: #fff;
  cursor: pointer;
  font-size: 16px;
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
  font-size: 20px;
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


/* 分页样式 */
.pagination {
  margin-top: 20px;
  padding: 10px;
  text-align: center;
}
.pagination button {
  padding: 8px 14px;
  margin: 0 8px;
  border-radius: 6px;
  border: 1px solid #d3d3d3;
  background: #fff;
  cursor: pointer;
  font-size: 14px;
}
.pagination button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
.pagination .info {
  font-size: 14px;
  color: #666;
}
</style>
