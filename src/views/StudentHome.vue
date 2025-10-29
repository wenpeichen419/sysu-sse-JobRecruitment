<template>
  <div class="student-page">
    <!-- 统一的左右边距容器，使海报与下方三列对齐 -->
    <div class="container">
      <!-- 顶部大海报（轮播） -->
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
          <StudentCalendar
            v-model="selectedDate"
            :events-map="eventsMap"
          />
        </div>

        <!-- 中：仅显示“今天”的活动 -->
        <div class="card">
          <div class="card-head">
            <h3>近期求职活动</h3>
            <a class="more" @click="goActivities">more ></a>
          </div>
          <ul class="timeline" v-if="todayEvents.length">
            <li v-for="(e, i) in todayEvents" :key="i">
              <div class="dot"></div>
              <div class="tl-content">
                <div class="title">{{ e.title }}</div>
                <div class="meta">{{ e.date }} · {{ e.place }}</div>
              </div>
            </li>
          </ul>
          <div class="empty" v-else>今天暂无活动</div>
        </div>

        <!-- 右：岗位热度排行榜 -->
        <div class="card">
          <div class="card-head">
            <h3>岗位热度排行榜</h3>
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
              <!-- 招聘信息（带 Tabs） -->
              <RecruitmentPanel
        :enterprise="recruitEnterprise"
        :institution="recruitInstitution"
        :internship="recruitInternship"
      />

      <!-- 常用链接 -->
      <UsefulLinks />
    </div>
  </div>
</template>

<script>
import StudentCalendar from '@/components/StudentCalendar.vue'
import RecruitmentPanel from '@/components/student/RecruitmentPanel.vue'
import UsefulLinks from '@/components/student/UsefulLinks.vue'
export default {
  name: 'StudentHome',
  components: { StudentCalendar , RecruitmentPanel, UsefulLinks },
  data() {
    return {
      // 轮播
      currentSlide: 0,
      totalSlides: 2,
      timer: null,

      // 选中的日期（供日历展示用）
      selectedDate: new Date().toISOString().slice(0, 10),

      // 假数据：日期 -> 活动列表
      eventsMap: {
        '2025-10-28': [
          { title: '企业宣讲会：字节跳动', time: '19:00', place: '东校区 A201' },
          { title: '算法岗面试模拟',       time: '20:30', place: '线上 Zoom' }
        ],
        '2025-10-29': [
          { title: '简历改稿工作坊',       time: '14:30', place: '学院楼 309' }
        ]
      },

      // 热度榜假数据
      hotPositions: [
        { id: 1, name: '前端开发工程师', company: '腾讯',     city: '深圳' },
        { id: 2, name: '算法工程师',     company: '阿里巴巴', city: '杭州' },
        { id: 3, name: '后端开发工程师', company: '字节跳动', city: '北京' },
        { id: 4, name: '测试工程师',     company: '美团',     city: '上海' },
        { id: 5, name: '数据分析师',     company: '小米',     city: '北京' },
      ],
      recruitEnterprise: [
        { title: '华润万象生活商业航道2026届校园招聘', date: '2025-10-27', url: '' },
        { title: '广汽研究院2026届校园招聘', date: '2025-10-27' },
        { title: '腾讯2026届校招宣讲-广州站', date: '2025-10-28' },
        { title: '阿里巴巴2026届校招宣讲-深圳站', date: '2025-10-29' }
      ],
      recruitInstitution: [
        { title: '广州市某事业单位专项招聘', date: '2025-10-27' },
        { title: '中山市某事业单位公开招聘', date: '2025-10-30' }
      ],
      recruitInternship: [
        { title: '字节跳动春季实习生招聘', date: '2025-10-28' },
        { title: '美团数据分析实习招聘', date: '2025-10-31' }
      ],
    }
  },
  computed: {
    todayStr() {
      return new Date().toISOString().slice(0, 10)
    },
    /** 中间栏只展示“今天”的活动 */
    todayEvents() {
      const list = this.eventsMap[this.todayStr] || []
      return list.map(e => ({
        title: e.title,
        date: `${this.todayStr}${e.time ? ' ' + e.time : ''}`,
        place: e.place
      }))
    }
  },
  mounted() {
    this.timer = setInterval(this.nextSlide, 4000)
  },
  beforeUnmount() {
    clearInterval(this.timer)
  },
  methods: {
    // 轮播
    nextSlide() { this.currentSlide = (this.currentSlide + 1) % this.totalSlides },
    prevSlide() { this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides },

    // 跳转
    viewPosition(p) {
      this.$router.push({ name: 'PositionDetail', params: { id: p.id } })
    },
    goActivities() {
      alert('活动列表页面待接入')
    }
  }
}
</script>

<style scoped>
/* 页面灰底，卡片/海报白底 */
.student-page{
  background:#f0f0f0;
  min-height:100vh;
  font-size: 16px;                 /* ← 学生端主页正文字号（与企业端接近） */
}

/* 统一左右边距容器（海报与三列对齐） */
.container{
  padding: 12px 24px 24px;
}
@media (min-width: 1440px){
  .container{ padding-left: 32px; padding-right: 32px; }
}

/* 顶部海报（保留白底与圆角），去掉左右 margin，用容器控制边距 */
.banner {
  position: relative;
  height: 420px;
  overflow: hidden;
  border-radius: 16px;
  margin: 12px 0 0;
  background: #ffffff;
}
.slides { display:flex; height:100%; transition: transform .5s ease-in-out; }
.slide { flex:0 0 100%; height:100%; display:flex; align-items:center; justify-content:center; }
.banner-img { width:100%; height:100%; object-fit:cover; }
.text-slide{
  width:100%; height:100%;
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  color:#325e21;
  display:flex; flex-direction:column; align-items:center; justify-content:center;
}
/* 主标题略收一点，跟企业端视觉一致 */
.text-slide h3{ font-size:48px; font-weight:800; margin-bottom:10px; } /* ← 52px -> 48px */
.text-slide p{ font-size:20px; color:#666; }

.banner-controls{
  position:absolute; bottom:18px; left:0; right:0;
  display:flex; justify-content:space-between; align-items:center; padding:0 16px;
}
.control-btn{
  background: rgba(255,255,255,.9);
  border:none; width:42px; height:42px; border-radius:50%;
  font-size:22px; cursor:pointer; display:flex; align-items:center; justify-content:center;
  transition: all .2s ease; color:#333; font-weight:bold;
}
.control-btn:hover{ background:#fff; transform: scale(1.06); }
.indicators{ display:flex; gap:10px; }
.indicator{ width:10px; height:10px; border-radius:50%; background: rgba(255,255,255,.6); cursor:pointer; }
.indicator.active{ background:#fff; transform: scale(1.2); }

/* 三列布局：由容器控制左右边距，这里不再额外 padding */
.grid{
  display:grid;
  grid-template-columns: 1fr 1.4fr 1fr;
  gap:16px;
  padding-top: 16px;
}
@media (max-width: 1100px){ .grid{ grid-template-columns:1fr; } }

.card{
  background:#fff;
  border-radius:12px;
  box-shadow: 0 2px 8px rgba(0,0,0,.08);
  padding:16px;
}
.card-head{ display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; }
.card-head h3{ margin:0; color:#325e21; font-size:22px; }  /* ← 卡片标题字号 */
.muted{ color:#8aa39a; font-size:14px; }

/* 时间轴 */
.timeline{ list-style:none; padding:0 0 0 18px; margin:0; position:relative; }
.timeline::before{ content:''; position:absolute; left:8px; top:0; bottom:0; width:2px; background:#e6f1ea; }
.timeline li{ position:relative; padding:12px 8px 12px 10px; }
.dot{ position:absolute; left:-1px; top:18px; width:10px; height:10px; border-radius:50%; background:#1d5e25; }
.tl-content .title{ font-weight:600; margin-bottom:4px; font-size:16px; } /* ← 标题字号 */
.tl-content .meta{ font-size:12px; color:#8aa39a; }
.empty{ color:#888; padding:8px; }

/* 热度榜 */
.rank{ list-style:none; margin:0; padding:0; }
.rank li{
  display:flex; align-items:center; gap:10px;
  padding:10px 8px; border-radius:10px;
}
.rank li:hover{ background:#f6fbf8; }
.no{ width:22px; height:22px; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; font-weight:700; border:1px solid #d7e8df; }
.info{ flex:1; }
.name{ font-weight:600; font-size:16px; } /* ← 职位名字号 */
.sub{ font-size:12px; color:#8aa39a; }
.ghost{
  border:none; background:#e7f5ef; color:#1d5e25; padding:6px 10px; border-radius:8px; cursor:pointer;
}

/* 组件之间的竖向间距 */
.container > .card + .card,
.container > .grid + .card,
.container > .grid + .recruitment,
.container > .recruitment + .useful {
  margin-top: 16px;
}

/* 整行区块的容器：与上面三列保持统一左右边距，由 .container 控制 */
.section-full{
  margin-top: 16px;
}

/* ---------- 招聘信息：整行更大 ---------- */
:deep(.recruitment.card){
  padding: 20px 24px;
}
:deep(.recruitment .tabs){
  margin: 0 -24px 14px;
  padding: 0 24px;
}
:deep(.recruitment .tab){
  padding: 14px 22px;
  font-size: 16px;                 /* ← tab 字号 */
}
:deep(.recruitment .list){
  grid-template-columns: repeat(2, 1fr);
  gap: 18px 28px;
}
:deep(.recruitment .item){
  padding: 16px 18px;
  border-radius: 12px;
}
:deep(.recruitment .date){
  width: 72px; min-width: 72px; height: 60px;
}
:deep(.recruitment .date .d){ font-size: 20px; }  /* ← 日期日 */
:deep(.recruitment .date .ym){ font-size: 12px; } /* ← 年月 */
:deep(.recruitment .title){
  font-size: 16px;
}

/* ---------- 常用链接：整行更大 + 绿色标题下划线 ---------- */
:deep(.useful.card){
  padding: 20px 24px;
}
:deep(.useful .head){
  margin: 0 0 12px;
  font-size: 20px;
  font-weight: 800;
  color: #1d5e25;
  position: relative;
  display: inline-block;
}
:deep(.useful .head::after){
  content: "";
  position: absolute;
  left: 0; right: 0; bottom: -6px;
  height: 6px;
  background: linear-gradient(90deg, #1d5e25, #c3d6c0);
  border-radius: 3px;
}

/* 链接区四等分，Logo 更大 */
:deep(.useful .links){
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}
@media (max-width: 1200px){
  :deep(.useful .links){ grid-template-columns: repeat(3, 1fr); }
}
@media (max-width: 900px){
  :deep(.useful .links){ grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 520px){
  :deep(.useful .links){ grid-template-columns: 1fr; }
}
:deep(.useful .link){
  height: 96px;
  border-radius: 12px;
}
:deep(.useful .link img){
  max-height: 68px;
}
</style>

