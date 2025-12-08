<template>
  <div class="student-page">
    <!-- 顶部轮播：全宽 -->
    <div class="banner">
      <div class="slides" :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
        <div class="slide">
          <img src="@/assets/campus.png" alt="banner" class="banner-img" />
        </div>
        <div class="slide">
          <div class="text-slide">
            <h3>求职中心</h3>
            <p>近期活动 / 岗位热度 / 日程记录</p>
          </div>
        </div>
      </div>

      <div class="banner-controls">
        <button class="control-btn" @click="prevSlide">‹</button>
        <div class="indicators">
          <span
            v-for="i in totalSlides"
            :key="i"
            class="indicator"
            :class="{ active: currentSlide === i - 1 }"
            @click="currentSlide = i - 1"
          ></span>
        </div>
        <button class="control-btn" @click="nextSlide">›</button>
      </div>
    </div>

    <!-- 页面主体内容 -->
    <div class="container">
      <div class="grid">
        <!-- 左：求职日历 -->
        <div class="card card-calendar">

          <div class="card-head">
            <h3>求职日历</h3>
            <span class="muted">{{ selectedDate }}</span>
          </div>
          <StudentCalendar v-model="selectedDate" :events-map="eventsMap" />
        </div>

        <!-- 中：近期求职活动（整行可点） -->
        <div class="card">
          <div class="card-head">
            <h3>近期求职活动</h3>
            <a class="more" @click="goActivities">more ></a>
          </div>

          <ul class="event-list" v-if="upcomingEvents.length">
            <li
              v-for="e in upcomingEvents"
              :key="e.id || e.title + e.date + e.place"
              class="event-item"
              @click="goActivity(e.id)"
            >
              <!-- 左侧小圆点 -->
              <span class="event-dot"></span>

              <!-- 文本区域 -->
              <div class="event-main">
                <div class="event-title">{{ e.title }}</div>
                <div class="event-sub">
                  {{ e.date }} · {{ e.place || '地点待定' }}
                </div>
              </div>

              <!-- 右侧小箭头（纯展示）-->
              <span class="event-arrow">›</span>
            </li>
          </ul>

          <div class="empty" v-else>这一天暂无活动</div>
        </div>

        <!-- 右：岗位热度排行榜（整行可点） -->
        <div class="card">
          <div class="card-head">
            <h3>岗位热度排行榜</h3>
            <span class="more" @click="goJobCenter">more ></span>
          </div>

          <ol class="rank">
            <li
              v-for="(p, i) in hotPositions"
              :key="p.id"
              class="rank-item"
              @click="viewPosition(p)"
            >
              <span class="no">{{ i + 1 }}</span>
              <div class="info">
                <div class="name">{{ p.name }}</div>
                <div class="sub">{{ p.company }} · {{ p.city }}</div>
              </div>
              <span class="rank-arrow">›</span>
            </li>
          </ol>
        </div>
      </div>

      <!-- 底部：招聘信息（四类） -->
      <div class="section-recruit">
        <RecruitmentPanel
          :enterprise="recruitEnterprise"
          :institution="recruitInstitution"
          :internship="recruitInternship"
          :campus="recruitCampus"
          @more="goRecruitMore"
        />
      </div>

      <!-- 常用链接 -->
      <div class="section-links">
        <UsefulLinks />
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import StudentCalendar from '@/components/StudentCalendar.vue'
import RecruitmentPanel from '@/components/student/RecruitmentPanel.vue'
import UsefulLinks from '@/components/student/UsefulLinks.vue'

// 本地时间格式化成 YYYY-MM-DD
function formatDateLocal (d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

// 本文件内部 axios 实例
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
  name: 'StudentHome',
  components: {
    StudentCalendar,
    RecruitmentPanel,
    UsefulLinks
  },
  data () {
    const today = new Date()
    return {
      currentSlide: 0,
      totalSlides: 2,
      timer: null,

      selectedDate: formatDateLocal(today),

      allEvents: [],
      eventsMap: {},
      upcomingEvents: [],

      hotPositions: [],

      recruitEnterprise: [],
      recruitInstitution: [],
      recruitInternship: [],
      recruitCampus: []
    }
  },
  mounted () {
    this.timer = setInterval(this.nextSlide, 4000)

    this.fetchUpcomingEvents()
    this.fetchRankedJobs()
    this.fetchRecentJobs()
  },
  beforeUnmount () {
    clearInterval(this.timer)
  },
  watch: {
    selectedDate (newVal) {
      if (newVal) {
        this.showEventsOfDate(newVal)
      }
    }
  },
  methods: {
    nextSlide () {
      this.currentSlide = (this.currentSlide + 1) % this.totalSlides
    },
    prevSlide () {
      this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides
    },

    /* ------------ 接口 ------------ */
    async fetchUpcomingEvents () {
  try {
    // 一次性请求：日历 + 近期活动
    const [calendarRes, upcomingRes] = await Promise.all([
      api.get('/student/calendar'),
      api.get('/events/upcoming')
    ])

    /* ---------- 1. 把 /events/upcoming 做成索引：evt-<数字> ---------- */
    const rawEvents = upcomingRes.data?.data?.events || []

    // key: "evt-2" -> value: 对应 event
    const byCalendarKey = {}
    rawEvents.forEach(ev => {
      const numId = ev.event_id    // 2 / 1 / 3
      if (numId == null) return
      const key = `evt-${numId}`   // 和 /student/calendar 里的 event_id 对上
      byCalendarKey[key] = ev
    })

    /* ---------- 2. 用 /student/calendar 画日历，同时修正 id ---------- */
    const calendarData = calendarRes.data?.data || {}
    const dailyEvents = calendarData.daily_events || []

    const map = {}

    dailyEvents.forEach(day => {
      const date = day.event_date           // "2025-12-02"
      if (!date) return

      const summaries = day.event_summaries || []
      if (!summaries.length) return

      const arr = summaries.map(ev => {
        const summary = ev.summary || ''    // "20:00 - 字节跳动春季实习生招聘"

        // 拆出时间 + 标题
        let timeText = ''
        let titleText = summary
        const sepIndex = summary.indexOf(' - ')
        if (sepIndex !== -1) {
          timeText = summary.slice(0, sepIndex).trim()
          titleText = summary.slice(sepIndex + 3).trim()
        }

        const calKey = ev.event_id          // "evt-2" / "evt-1"
        const matched = byCalendarKey[calKey] || {}

        // 真实数字 id：优先用 /events/upcoming 的 event_id，兜底从 "evt-2" 里抽数字
        let realId = matched.event_id
        if (!realId && calKey) {
          const m = String(calKey).match(/(\d+)/)
          if (m) realId = Number(m[1])
        }

        return {
          id: realId,                       // ⭐ 这里就是 1 / 2 / 3 这样的数字
          title: titleText,
          time: timeText,
          place: matched.event_location || '',
          date
        }
      })

      map[date] = arr
    })

    // 给日历组件用：{ '2025-12-02': [ { id, title, time, place, date }, ... ] }
    this.eventsMap = map

    /* ---------- 3. 中间“近期求职活动”列表，直接用 /events/upcoming ---------- */
    this.allEvents = rawEvents.map(ev => ({
      id: ev.event_id,                                   // 2 / 1 / 3 数字
      title: ev.event_title,
      date: ev.event_start_time.slice(0, 10),           // "2025-12-02"
      place: ev.event_location
    }))

    // 默认：从今天开始往后 5 天的日历活动
    this.buildUpcomingForNextDays()
  } catch (err) {
    console.error('日历 / 近期求职活动获取失败', err)
  }
}

,

    async fetchRankedJobs () {
      try {
        const res = await api.get('/jobs/ranked')
        const list = res.data?.data?.ranked_jobs || []

        this.hotPositions = list.map((i) => ({
          id: i.job_id,
          name: i.job_title,
          company: i.company_name,
          city: i.location
        }))
      } catch (err) {
        console.error('岗位热度获取失败', err)
      }
    },

    async fetchRecentJobs () {
      try {
        const [entRes, instRes, internRes, campusRes] = await Promise.all([
          api.get('/jobs/recent', {
            params: { job_type_filter: '企业招聘', limit: 10 }
          }),
          api.get('/jobs/recent', {
            params: { job_type_filter: '事业单位招聘', limit: 10 }
          }),
          api.get('/jobs/recent', {
            params: { job_type_filter: '实习招聘', limit: 10 }
          }),
          api.get('/jobs/recent', {
            params: { job_type_filter: '校园招聘', limit: 10 }
          })
        ])

        const mapList = (res) =>
          (res.data?.data?.job_postings || []).map((item) => ({
            id: item.job_id,
            title: item.job_title,
            date: item.posted_at ? String(item.posted_at).slice(0, 10) : ''
          }))

        this.recruitEnterprise = mapList(entRes)
        this.recruitInstitution = mapList(instRes)
        this.recruitInternship = mapList(internRes)
        this.recruitCampus = mapList(campusRes)
      } catch (err) {
        console.error('近期招聘信息获取失败', err)
      }
    },

    /* ------------ 近期活动展示逻辑 ------------ */
    buildUpcomingForNextDays () {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const result = []
      for (let offset = 0; offset < 5; offset++) {
        const d = new Date(today)
        d.setDate(today.getDate() + offset)
        const dateStr = formatDateLocal(d)
        const arr = this.eventsMap[dateStr] || []
        arr.forEach((e) => {
          result.push({
            id: e.id,
            title: e.title,
            date: dateStr,
            place: e.place
          })
        })
      }
      this.upcomingEvents = result
    },

    showEventsOfDate (dateStr) {
      const arr = this.eventsMap[dateStr] || []
      if (arr.length === 0) {
        this.buildUpcomingForNextDays()
        return
      }
      this.upcomingEvents = arr.map((e) => ({
        id: e.id,
        title: e.title,
        date: dateStr,
        place: e.place
      }))
    },

    /* ------------ 路由跳转 ------------ */
    goActivities () {
      this.$router.push({ name: 'ActivityList', query: { tab: 'all' } })
    },
    goJobCenter () {
      this.$router.push({ name: 'JobCenter' })
    },
    goActivity (id) {
      if (!id) return
      // 使用 Vue Router 进行 SPA 内部跳转（假设路由名称为 ActivityDetail）
      this.$router.push({ name: 'ActivityDetail', params: { id: id } })
    },
    goRecruitMore () {
      this.$router.push({ name: 'ActivityList', query: { tab: 'recruit' } })
    },
    viewPosition (p) {
      if (!p) return
      this.$router.push({ name: 'JobDetail', params: { id: p.id } })
    }
  }
}
</script>

<style scoped>
/* 近期求职活动：整行可点，和岗位热度类似 */
.event-list{
  list-style:none;
  margin:0;
  padding:0;
}
.event-item{
  display:flex;
  align-items:center;
  gap:12px;
  padding:16px 20px;
  border-radius:10px;
  cursor:pointer;
  transition:all .18s ease-out;
}
.event-item + .event-item{
  margin-top:8px;
}
.event-item:hover{
  background:#f6fbf8;
  box-shadow:0 4px 14px rgba(0,0,0,.06);
  transform:translateY(-1px);
}
.event-dot{
  width:10px;
  height:10px;
  border-radius:50%;
  background:#1d5e25;
  flex-shrink:0;
}
.event-main{
  flex:1;
  display:flex;
  flex-direction:column;
}
.event-title{
  font-size:16px;
  font-weight:600;
  color:#222;
  margin-bottom:4px;
}
.event-sub{
  font-size:12px;
  color:#8aa39a;
}
.event-arrow{
  font-size:18px;
  color:#8aa39a;
  flex-shrink:0;
}

/* 顶部 banner */
.banner {
  width: 100vw !important;
  margin-left: calc(-50vw + 50%);
  margin-right: calc(-50vw + 50%);
  border-radius: 0 !important;
}
.banner-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.student-page{
  background:#f0f0f0;
  min-height:100vh;
  font-size:16px;
}
.container{ padding:24px 24px 24px; }
@media (min-width:1440px){
  .container{ padding-left:32px; padding-right:32px; }
}
.banner{
  position:relative; height:360px; overflow:hidden; border-radius:0; margin:0; background:#fff;
}
.slides{ display:flex; height:100%; transition:transform .5s ease-in-out; }
.slide{ flex:0 0 100%; height:100%; display:flex; align-items:center; justify-content:center; }
.text-slide{
  width:100%; height:100%;
  background:linear-gradient(135deg,#f8f9fa,#e9ecef); color:#325e21;
  display:flex; flex-direction:column; align-items:center; justify-content:center;
}
.text-slide h3{ font-size:48px; font-weight:800; margin-bottom:10px; }
.text-slide p{ font-size:20px; color:#666; }
.banner-controls{
  position:absolute; bottom:18px; left:0; right:0;
  display:flex; justify-content:space-between; align-items:center; padding:0 16px;
}
.control-btn{
  background:rgba(255,255,255,.9); border:none; width:42px; height:42px; border-radius:50%;
  font-size:22px; cursor:pointer; display:flex; align-items:center; justify-content:center;
  transition:all .2s ease; color:#333; font-weight:bold;
}
.control-btn:hover{ background:#fff; transform:scale(1.06); }
.indicators{ display:flex; gap:10px; }
.indicator{ width:10px; height:10px; border-radius:50%; background:rgba(255,255,255,.6); cursor:pointer; }
.indicator.active{ background:#fff; transform:scale(1.2); }

/* 三列布局 */
.grid{
  display:grid; grid-template-columns:1fr 1fr 1fr; gap:clamp(0px,2.5vw,36px); padding-top:20px; margin-bottom:32px;
}
@media (max-width:1100px){ .grid{ grid-template-columns:1fr; } }
.card{
  background:#fff;
  border-radius:12px;
  box-shadow:0 2px 8px rgba(0,0,0,.08);
  padding: 30px;
  position: relative;     /* 新增：给子元素的绝对定位一个参照 */
  overflow: visible;      /* ⭐ 关键：允许日历里的 popover 溢出显示 */
}

.card-head{ display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; }
.card-head h3{ margin:0; color:#325e21; font-size:22px; }
.more{
  font-size:14px;
  color:#8aa39a;
  cursor:pointer;
}
.more:hover{
  color:#2a5e23;
  text-decoration:underline;
}
.muted{ color:#8aa39a; font-size:14px; }

/* 岗位热度榜 */
.rank{
  list-style:none;
  margin:0;
  padding:0;
}
.rank-item{
  display:flex;
  align-items:center;
  gap:10px;
  padding:20px;
  border-radius:10px;
  cursor:pointer;
  transition:all .18s ease-out;
}
.rank-item + .rank-item{
  margin-top:8px;
}
.rank-item:hover{
  background:#f6fbf8;
  box-shadow:0 4px 14px rgba(0,0,0,.08);
  transform:translateY(-1px);
}
.no{
  width:22px;
  height:22px;
  border-radius:50%;
  display:inline-flex;
  align-items:center;
  justify-content:center;
  font-weight:700;
  border:1px solid #d7e8df;
}
.info{ flex:1; }
.name{ font-weight:600; font-size:16px; }
.sub{ font-size:12px; color:#8aa39a; }
.rank-arrow{
  font-size:18px;
  color:#8aa39a;
}
.rank-item:hover .rank-arrow{
  color:#325e21;
}

/* 底部模块间距 */
.section-recruit {
  margin-top: 16px;
  margin-bottom: 32px;
  min-height: 260px;
}
.section-links {
  margin-bottom: 16px;
}
/* 让求职日历这张卡片始终在这一行最上层，气泡不会被右边两张卡挡住 */
.card-calendar {
  position: relative;   /* 再强调一下有定位 */
  overflow: visible;    /* 允许子元素溢出 */
  z-index: 20;          /* 比其它卡高 */
}

</style>
