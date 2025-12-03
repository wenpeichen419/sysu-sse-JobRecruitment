<template> 
  <div class="job-center-page">
    <!-- 面包屑：跟简历页同款 -->
    <ZyBreadcrumb
  :items="[
    { label: '首页', to: '/student-home' },
    { label: '投递情况', to: '/applied' },
    { label: '已投递岗位' }
  ]"
>
  <template #actions>
    <button class="btn" @click="fetchJobs">
      刷新
    </button>
  </template>
</ZyBreadcrumb>

    <!-- ⭐ 内容区域整体包一层，给固定面包屑让出空间 -->
    <div class="job-center-body">
      <!-- 搜索栏 -->
      <div class="search-bar">
        <div class="search-group">
          <label>职位名称</label>
          <div class="search-input-wrapper">
            <input v-model="q.title" placeholder="输入职位名称" class="search-input" />
          </div>
        </div>

        <div class="search-group">
          <label>公司名称</label>
          <div class="search-input-wrapper">
            <input v-model="q.company" placeholder="输入公司名称" class="search-input" />
          </div>
        </div>

        <button class="search-btn" @click="handleSearch">搜索</button>
      </div>

      <!-- 列表 -->
      <div class="job-list">
        <div
          v-for="(item, index) in paged"
          :key="item.application_id || item.job_id || index"
          class="job-item"
          @click="toDetail(item.application_id)"
        >
          <!-- 公司 logo -->
          <div class="job-logo">
            <img
              :src="item.logo_url"
              :alt="item.company_name"
              @error="onLogoError"
            />
          </div>

          <div class="job-left-info">
            <div class="job-title">
              <span class="link">{{ item.title }}</span>
              <span
                class="status-chip"
                :class="statusClass(item.status)"
              >
                {{ statusText(item.status) }}
              </span>
            </div>
            <div class="job-details">
              <span class="salary">{{ formatSalary(item) }}</span>

              <span class="divider">|</span>
              <span class="location">{{ item.address }}</span>
              <span class="divider">|</span>
              <span class="type-tag">{{ item.work_nature }}</span>
            </div>
          </div>

          <div class="job-right-info">
            <div class="company-name">
              <span class="link">{{ item.company_name }}</span>
            </div>
            <div class="company-details">
              <span class="department">{{ item.department || '—' }}</span>
              <span class="divider">|</span>
              <span>投递时间 {{ formatDateTime(item.submitted_at) }}</span>
            </div>
          </div>
        </div>

        <div v-if="paged.length === 0" class="empty-state">暂无数据</div>
      </div>

      <!-- 分页 -->
      <div class="pagination" v-if="totalPages > 1">
        <span class="page-info">共 {{ filtered.length }} 条数据</span>
        <div class="page-controls">
          <button class="page-btn" :disabled="page === 1" @click="setPage(1)">1</button>
          <button
            v-for="p in middlePages"
            :key="p"
            class="page-btn"
            :class="{ active: page === p }"
            @click="setPage(p)"
          >
            {{ p }}
          </button>
          <span v-if="showEllipsis" class="ellipsis">…</span>
          <button
            class="page-btn"
            :class="{ active: page === totalPages }"
            @click="setPage(totalPages)"
          >
            {{ totalPages }}
          </button>
          <button class="page-next" :disabled="page >= totalPages" @click="setPage(page + 1)">›</button>
        </div>
      </div>
    </div>
    <!-- /job-center-body -->
  </div>
</template>

<script>
import axios from 'axios'
import ZyBreadcrumb from '@/components/common/ZyBreadcrumb.vue'

// 后端服务前缀
const API_PREFIX = 'http://localhost:8080'

export default {
  name: 'AppliedList',
  components: { ZyBreadcrumb },
  data () {
    return {
      raw: [],                // 原始数据（职位列表）
      q: { title: '', company: '' }, // 搜索条件
      page: 1,                // 当前页
      size: 5                 // 每页数据条数
    }
  },
  created () {
    this.fetchJobs()
  },
  computed: {
    filtered () {
      let arr = this.raw.slice()

      if (this.q.title.trim()) {
        const k = this.q.title.trim().toLowerCase()
        arr = arr.filter(x => (x.title || '').toLowerCase().includes(k))
      }

      if (this.q.company.trim()) {
        const k = this.q.company.trim().toLowerCase()
        arr = arr.filter(x => (x.company_name || '').toLowerCase().includes(k))
      }

      return arr
    },
    totalPages () {
      return Math.max(1, Math.ceil(this.filtered.length / this.size))
    },
    paged () {
      const start = (this.page - 1) * this.size
      return this.filtered.slice(start, start + this.size)
    },
    middlePages () {
      const res = []
      const start = Math.max(2, this.page - 1)
      const end = Math.min(this.totalPages - 1, this.page + 1)
      for (let i = start; i <= end; i++) res.push(i)
      return res
    },
    showEllipsis () {
      return this.totalPages > 5 && this.page < this.totalPages - 2
    }
  },
  methods: {
  
    formatSalary (item) {
    // 优先用后端给的 salary_range
    const raw = item.salary_range ?? item.salary ?? ''

    if (raw === null || raw === undefined || raw === '') return ''

    // 1) 如果已经带 k 了，直接用
    if (typeof raw === 'string' && /[kK]/.test(raw)) {
      return raw
    }

    // 2) 形如 "7-11"、"9 - 11" 这种，补上 k
    if (typeof raw === 'string') {
      const m = raw.match(/^\s*(\d+)\s*[-~]\s*(\d+)\s*$/)
      if (m) {
        return `${m[1]}k-${m[2]}k`
      }
      return raw    // 其他奇怪格式就原样返回
    }

    // 3) 如果有 min/max 字段（例如 7 和 11）
    const min = item.salary_min ?? item.min_salary
    const max = item.salary_max ?? item.max_salary
    if (min && max) {
      // 如果后端给的是 “7, 11” 这种单位就是 k：
      return `${min}k-${max}k`

      // ⚠ 如果后端给的是 “7000, 11000”，改成：
      // return `${min / 1000}k-${max / 1000}k`
    }

    // 4) 单个数字就当 xk
    if (typeof raw === 'number') {
      return `${raw}k`
    }

    return String(raw)
  },
      formatDateTime (str) {
      if (!str) return ''
      return str.replace('T', ' ').slice(0, 19)
    },
    onLogoError (e) {
      e.target.style.visibility = 'hidden'
    },
    async fetchJobs () {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          console.error('Token 不存在，请先登录')
          return
        }

        const response = await axios.get(
          `${API_PREFIX}/position-center/delivery/list`,
          { headers: { Authorization: `Bearer ${token}` } }
        )

        const jobs = (response.data &&
          response.data.data &&
          response.data.data.jobs) || []

        this.raw = jobs.map(j => {
          let logo = j.logo_url || ''

          if (logo && !/^https?:\/\//.test(logo)) {
            logo = `${API_PREFIX}${logo.startsWith('/') ? '' : '/'}${logo}`
          }

          return {
            ...j,
            logo_url: logo
          }
        })

        console.log('列表 jobs（统一后的）:', this.raw)
      } catch (error) {
        console.error('获取职位列表失败', error)
      }
    },
    statusText (status) {
      if (typeof status === 'string' && isNaN(Number(status))) {
        return status
      }

      const map = {
        10: '已投递',
        20: '候选人',
        30: '面试邀请',
        40: '通过',
        50: '拒绝'
      }

      const s = Number(status)
      return map[s] || '未知状态'
    },
    statusClass (status) {
      if (status === '已投递') return 'submitted'
      if (status === '候选人' || status === '面试邀请') return 'interview'
      if (status === 'Offer' || status === '通过') return 'passed'
      if (status === '拒绝') return 'stopped'

      const s = Number(status)
      if (s === 10) return 'submitted'
      if (s === 20 || s === 30) return 'interview'
      if (s === 40) return 'passed'
      if (s === 50) return 'stopped'

      return ''
    },
    handleSearch () {
      this.page = 1
    },
    setPage (p) {
      if (p >= 1 && p <= this.totalPages) {
        this.page = p
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    },
    toDetail (applicationId) {
      if (!applicationId) {
        console.warn('当前列表项没有 application_id：', applicationId)
        return
      }
      this.$router.push({
        name: 'AppliedDetail',
        params: { id: applicationId }
      })
    }
  }
}
</script>

<style scoped>
.job-center-page{
  min-height:100vh;
  background:#f5f5f5;   /* 可选：顺便和简历页保持一致 */
  padding:30px;         /* ⭐ 左右都改成 30px，和面包屑一致 */
}

.job-center-body{
  padding-top:100px;     /* 留出面包屑高度，这个保持不变 */
}

/* 下面这些保持不动即可 */
.search-bar{
  background:#fff;
  padding:30px 40px;
  margin-bottom:20px;
  border-radius:10px;
  display:flex;
  gap:24px;
  align-items:flex-end;
  justify-content:center;
  box-shadow:0 2px 10px rgba(0,0,0,.08);
}

.search-group {
  display:flex;
  align-items:center;
  gap:10px;
  min-width:280px;
}

/* label 固定宽度，防止换行 */
.search-group label{
  font-size:18px;
  color:#333;
  font-weight:600;
  white-space:nowrap;
}

/* 输入框占满剩余空间 */
.search-input-wrapper{
  position:relative;
  flex:1;
}

.search-input{
  width:100%;
  padding:10px 14px;
  border:1px solid #d8d8d8;
  border-radius:6px;
  font-size:16px;
}
.search-input:focus{border-color:#325e21}

/* 按钮高度跟输入框对齐 */
.search-btn{
  height:44px;
  padding:0 26px;
  background:#325e21;
  color:#fff;
  border:none;
  border-radius:8px;
  font-size:16px;
  font-weight:600;
  box-shadow:0 2px 8px rgba(50,94,33,.3);
  cursor:pointer;
}

/* ===== 列表样式 ===== */
.job-list{
  background:#fff;
  padding:30px;
  border-radius:12px;
  margin-bottom:20px;
  box-shadow:0 2px 15px rgba(0,0,0,.08);
}
.job-item{
  display:flex;
  align-items:center;
  padding:22px 28px;
  border:1px solid #e8e8e8;
  border-radius:10px;
  position:relative;
  transition:.2s;
  margin-bottom:15px;
}
.job-item:hover{
  border-color:#325e21;
  box-shadow:0 4px 16px rgba(0,0,0,.15);
  transform:translateY(-1px);
}
.job-logo{
  width:96px;
  height:96px;
  margin-right:28px;
  flex-shrink:0;
  border:2px solid #eee;
  border-radius:12px;
  padding:8px;
  display:flex;
  align-items:center;
  justify-content:center;
  background:#fff;
}
.job-logo img{
  width:100%;
  height:100%;
  object-fit:contain;
}

.job-left-info{
  flex:1;
  display:flex;
  flex-direction:column;
  gap:10px;
}
.job-title{
  font-size:22px;
  font-weight:700;
  color:#325e21;
  display:flex;
  align-items:center;
  gap:10px;
}
.link{cursor:pointer;}
.status-chip{
  padding:4px 10px;
  border-radius:12px;
  font-size:12px;
  font-weight:700;
}
.status-chip.submitted{background:#eef6ee;color:#2e7d32;}
.status-chip.interview{background:#e6f2e6;color:#2e7d32;}
.status-chip.passed{background:#e8f5e9;color:#1b5e20;}
.status-chip.stopped{background:#fdecea;color:#c62828;}

.job-details{
  display:flex;
  gap:10px;
  font-size:16px;
  color:#666;
}
.salary{
  color:#ff6b35;
  font-weight:700;
}
.job-right-info{
  flex:1;
  display:flex;
  flex-direction:column;
  gap:8px;
  align-items:flex-end;
  text-align:right;
}
.company-name{
  font-size:18px;
  font-weight:700;
  color:#325e21;
}
.company-details{
  display:flex;
  gap:12px;
  font-size:16px;
  color:#666;
}

.empty-state{
  text-align:center;
  color:#999;
  padding:80px 20px;
}

.pagination{
  background:#fff;
  padding:18px 24px;
  border-radius:10px;
  display:flex;
  justify-content:space-between;
  align-items:center;
  box-shadow:0 2px 10px rgba(0,0,0,.08);
}
.page-info{
  font-size:16px;
  color:#666;
}
.page-controls{
  display:flex;
  gap:8px;
}
.page-btn,.page-next{
  min-width:40px;
  height:40px;
  border:1px solid #d8d8d8;
  border-radius:6px;
  background:#fff;
  cursor:pointer;
}
.page-btn.active{
  background:#325e21;
  color:#fff;
  border-color:#325e21;
}
.ellipsis{color:#999;}
/* ===== 面包屑下方操作条（复刻简历编辑器样式） ===== */
.breadcrumb-action-bar{
  position: fixed;
  top: 105px;            /* 与简历页面 breadcrumb-wrapper 完全一致 */
  right: 40px;           /* 挨着右侧边缘（你简历页是 30px，可自由调） */
  z-index: 1001;
  display: flex;
  align-items: center;
}

.btn{
  background:#325e21;
  color:#fff;
  border:none;
  padding:8px 16px;
  border-radius:6px;
  cursor:pointer;
  font-size:16px;
  font-weight:500;
  transition:.15s;
}
.btn:hover{
  background:#2a4e1b;
}


</style>
