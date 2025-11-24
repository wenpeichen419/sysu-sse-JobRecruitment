<template>
  <div class="student-page">
    <div class="container">
      <!-- 顶部轮播 -->
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

      <!-- 三列主区 -->
      <div class="grid">
        <!-- 左：求职日历 -->
        <div class="card">
          <div class="card-head">
            <h3>求职日历</h3>
            <span class="muted">{{ selectedDate }}</span>
          </div>
          <StudentCalendar v-model="selectedDate" :events-map="eventsMap" />
        </div>

        <!-- 中：近期求职活动 -->
        <div class="card">
          <div class="card-head">
            <h3>近期求职活动</h3>
            <a class="more" @click="goActivities">more ></a>
          </div>

          <ul class="timeline" v-if="upcomingEvents.length">
            <li
              v-for="e in upcomingEvents"
              :key="e.id || e.title + e.date + e.place"
              @click="goActivity(e.id)"
            >
              <div class="dot"></div>
              <div class="tl-content">
                <div class="title">{{ e.title }}</div>
                <div class="meta">{{ e.date }} · {{ e.place }}</div>
              </div>
            </li>
          </ul>

          <div class="empty" v-else>这一天暂无活动</div>
        </div>

        <!-- 右：岗位热度排行榜 -->
        <div class="card">
          <div class="card-head">
            <h3>岗位热度排行榜</h3>
            <!-- more，跳到 /job-center -->
            <span class="more" @click="goJobCenter">more ></span>
          </div>

          <ol class="rank">
            <li v-for="(p, i) in hotPositions" :key="p.id">
              <span class="no">{{ i + 1 }}</span>
              <div class="info">
                <div class="name">{{ p.name }}</div>
                <div class="sub">{{ p.company }} · {{ p.city }}</div>
              </div>
              <button class="ghost" @click="viewPosition(p)">查看</button>
            </li>
          </ol>
        </div>
      </div>

      <!-- 底部：招聘信息（四类） -->
      <RecruitmentPanel
        :enterprise="recruitEnterprise"
        :institution="recruitInstitution"
        :internship="recruitInternship"
        :campus="recruitCampus"
        @more="goRecruitMore"
      />

      <!-- 常用链接 -->
      <UsefulLinks />
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import StudentCalendar from '@/components/StudentCalendar.vue'
import RecruitmentPanel from '@/components/student/RecruitmentPanel.vue'
import UsefulLinks from '@/components/student/UsefulLinks.vue'

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
    return {
      currentSlide: 0,
      totalSlides: 2,
      timer: null,

      // 日历当前选中的日期（默认：今天）
      selectedDate: new Date().toISOString().slice(0, 10),

      // 所有 upcoming 活动
      allEvents: [],
      // 求职日历数据：{ 'YYYY-MM-DD': [ { title,time,place,id,date }, ... ] }
      eventsMap: {},
      // 中间「近期求职活动」展示的数据
      upcomingEvents: [],

      // 右侧岗位热度
      hotPositions: [],

      // 底部四类招聘
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
    // 当日历选中的日期变化时，展示这一日的活动
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

    /* ---------------- 接口调用 ---------------- */

    // 1. 近期活动 + 日历
    async fetchUpcomingEvents () {
      try {
        const res = await api.get('/events/upcoming')
        const raw = res.data?.data?.events || []

        const list = raw.map((item) => {
          const title = item.title || item.event_title || ''
          const start = item.date || item.event_start_time || ''
          const dateStr = start ? String(start).slice(0, 10) : ''
          const place = item.location || item.event_location || ''
          return {
            id: item.id,
            title,
            date: dateStr,
            place
          }
        })

        this.allEvents = list

        // 构建日历数据
        const map = {}
        list.forEach((e) => {
          if (!e.date) return
          if (!map[e.date]) map[e.date] = []
          map[e.date].push({
            title: e.title,
            time: '',
            place: e.place,
            id: e.id,
            date: e.date
          })
        })
        this.eventsMap = map

        // 默认：今天起后 5 天
        this.buildUpcomingForNextDays()
      } catch (err) {
        console.error('近期求职活动获取失败', err)
      }
    },

    // 2. 岗位热度排行榜
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

    // 3. 底部四类招聘信息
    async fetchRecentJobs () {
      try {
        // 按 job_type_filter 分 4 次请求
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

    /* ---------------- 近期活动展示逻辑 ---------------- */

    // 默认：从今天开始往后 5 天内的所有活动
    buildUpcomingForNextDays () {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const result = []
      for (let offset = 0; offset < 5; offset++) {
        const d = new Date(today)
        d.setDate(today.getDate() + offset)
        const dateStr = d.toISOString().slice(0, 10)
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

    // 当用户在日历上选中某一天时，展示这一天的活动
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

    /* ---------------- 路由跳转 ---------------- */

    goActivities () {
      this.$router.push({ name: 'ActivityList', query: { tab: 'all' } })
    },

    goJobCenter () {
      this.$router.push({ name: 'JobCenter' })
    },

    goActivity (id) {
      if (!id) return
      this.$router.push({ name: 'ActivityDetail', params: { id } })
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
.student-page{
  background:#f0f0f0;
  min-height:100vh;
  font-size:16px;
}
.container{ padding:12px 24px 24px; }
@media (min-width:1440px){
  .container{ padding-left:32px; padding-right:32px; }
}
.banner{
  position:relative; height:420px; overflow:hidden; border-radius:0; margin:0; background:#fff;
}
.slides{ display:flex; height:100%; transition:transform .5s ease-in-out; }
.slide{ flex:0 0 100%; height:100%; display:flex; align-items:center; justify-content:center; }
.banner-img{ width:100%; height:100%; object-fit:cover; }
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
.grid{
  display:grid; grid-template-columns:1fr 1fr 1fr; gap:clamp(0px,2.5vw,36px); padding-top:20px;
}
@media (max-width:1100px){ .grid{ grid-template-columns:1fr; } }
.card{ background:#fff; border-radius:12px; box-shadow:0 2px 8px rgba(0,0,0,.08); padding:16px; }
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
.timeline{ list-style:none; padding:0 0 0 18px; margin:0; position:relative; }
.timeline::before{ content:''; position:absolute; left:8px; top:0; bottom:0; width:2px; background:#e6f1ea; }
.timeline li{
  position:relative; padding:12px 8px 12px 10px; cursor:pointer;
}
.timeline li:hover .title{ text-decoration:underline; }
.dot{ position:absolute; left:-1px; top:18px; width:10px; height:10px; border-radius:50%; background:#1d5e25; }
.tl-content .title{ font-weight:600; margin-bottom:4px; font-size:16px; }
.tl-content .meta{ font-size:12px; color:#8aa39a; }
.empty{ color:#888; padding:8px; }
.rank{ list-style:none; margin:0; padding:0; }
.rank li{ display:flex; align-items:center; gap:10px; padding:10px 8px; border-radius:10px; }
.rank li:hover{ background:#f6fbf8; }
.no{ width:22px; height:22px; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; font-weight:700; border:1px solid #d7e8df; }
.info{ flex:1; }
.name{ font-weight:600; font-size:16px; }
.sub{ font-size:12px; color:#8aa39a; }
.ghost{ border:none; background:#e7f5ef; color:#1d5e25; padding:6px 10px; border-radius:8px; cursor:pointer; }
</style>
