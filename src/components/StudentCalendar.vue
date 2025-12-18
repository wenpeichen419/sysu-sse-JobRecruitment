<template>
  <div class="calendar">
    <div class="cal-head">
      <button class="nav" @click="prevMonth">«</button>
      <div class="ym">{{ year }} 年 {{ month + 1 }} 月</div>
      <button class="nav" @click="nextMonth">»</button>
    </div>

    <div class="week-row">
      <span v-for="w in weeks" :key="w">{{ w }}</span>
    </div>

    <div class="grid">
      <div
        v-for="cell in cells"
        :key="cell.key"
        class="cell"
        :class="{
          dim: !cell.inMonth,
          today: cell.isToday,
          selected: selected === cell.dateStr
        }"
        @mouseenter="hover = cell.dateStr"
        @mouseleave="hover = ''"
        @click="select(cell.dateStr)"
      >
        <div class="dnum">{{ cell.day }}</div>

        <!-- 有事件则显示一个小圆点 -->
        <div v-if="eventsMap[cell.dateStr]?.length" class="dot"></div>

        <!-- 悬浮提示 -->
<div
  class="popover"
  :class="cell.row >= 3 ? 'to-top' : 'to-bottom'"
  v-if="hover === cell.dateStr"
  @mouseenter="hover = cell.dateStr"
  @mouseleave="hover = ''"
>

          <div class="p-title">{{ cell.dateStr }} 活动</div>
          <div v-if="eventsMap[cell.dateStr]?.length">
            <!-- ⭐ 每条活动可以点击跳转 -->
            <div
              class="p-item"
              v-for="(e, i) in eventsMap[cell.dateStr]"
              :key="i"
              @click.stop="goEvent(e)"
            >
              <span class="p-dot"></span>
              <span class="p-txt">
                {{ e.time || '时间待定' }} · {{ e.title }} · {{ e.place || '地点待定' }}
              </span>
            </div>
          </div>
          <div v-else class="p-empty">暂无安排</div>
        </div>
      </div>
    </div>

    <div class="cal-foot">
      <button class="today-btn" @click="goToday">回到今天</button>
    </div>
  </div>
</template>

<script>
// 使用本地时间格式化成 YYYY-MM-DD，避免 toISOString 带来的时区偏差
function formatDateLocal (d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export default {
  name: 'StudentCalendar',
  props: {
    /** { 'YYYY-MM-DD': [{ id, eventId, title, time, place, date }] } */
    eventsMap: { type: Object, default: () => ({}) },
    value: { type: String, default: '' } // 选中的日期 YYYY-MM-DD
  },
  data () {
    const now = new Date()
    return {
      year: now.getFullYear(),
      month: now.getMonth(), // 0-11
      hover: '',
      // 初始选中日期改用本地日期格式
      selected: this.value || formatDateLocal(now),
      weeks: ['日', '一', '二', '三', '四', '五', '六']
    }
  },
  computed: {
    cells () {
      const first = new Date(this.year, this.month, 1)
      const start = new Date(first)
      start.setDate(first.getDate() - first.getDay()) // 从周日开始

      const todayStr = formatDateLocal(new Date())
      const arr = []
      for (let i = 0; i < 42; i++) {
        const d = new Date(start)
        d.setDate(start.getDate() + i)
        const inMonth = d.getMonth() === this.month
        const dateStr = formatDateLocal(d)
        arr.push({
          key: dateStr,
          dateStr,
          inMonth,
          day: d.getDate(),
          isToday: dateStr === todayStr,
          row: Math.floor(i / 7)
        })
      }
      return arr
    }
  },
  watch: {
    value (val) { this.selected = val }
  },
  methods: {
    select (dateStr) {
      this.selected = dateStr
      this.$emit('input', dateStr) // v-model 兼容
      this.$emit('change', dateStr)
    },
    prevMonth () {
      if (this.month === 0) {
        this.year--
        this.month = 11
      } else {
        this.month--
      }
    },
    nextMonth () {
      if (this.month === 11) {
        this.year++
        this.month = 0
      } else {
        this.month++
      }
    },
    goToday () {
      const now = new Date()
      this.year = now.getFullYear()
      this.month = now.getMonth()
      this.select(formatDateLocal(now))
    },

    // ⭐ 点击气泡里的某条活动，跳转详情
    goEvent (e) {
  if (!e) return

  let id = e.id || e.eventId || e.event_id

  // 如果还是类似 "evt-2" 这种，抽出里面的数字
  if (id && typeof id === 'string') {
    const m = id.match(/(\d+)/)
    if (m) {
      id = Number(m[1])
    }
  }

  if (!id) return

  window.location.href = `http://localhost:5306/activities/${id}`
}

  }
}
</script>

<style scoped>
.calendar{
  width:100%;
  font-size:14px;
  color:#333;
  position: relative;
  overflow: visible;
}

/* 头部：白底 + 绿字，小圆按钮 */
.cal-head{
  display:flex;
  justify-content:space-between;
  align-items:center;
  margin-bottom:8px;
  color:#325e21;
}
.ym{
  font-weight:600;
}
.nav{
  border:none;
  background:#e7f5ef;
  color:#1d5e25;
  width:28px;
  height:28px;
  border-radius:999px;
  cursor:pointer;
  font-size:14px;
  display:flex;
  align-items:center;
  justify-content:center;
  transition:all .18s ease-out;
}
.nav:hover{
  background:#d7eddf;
  transform:translateY(-1px);
}

/* 星期栏 */
.week-row{
  display:grid;
  grid-template-columns: repeat(7, 1fr);
  text-align:center;
  color:#325e21;
  margin-bottom:8px;
  font-weight:600;
  background:#f6fbf8;
  border-radius:8px;
  padding:4px 0;
}

/* 日期网格：允许元素溢出 */
.grid{
  display:grid;
  grid-template-columns: repeat(7, 1fr);
  gap:6px;
  position: relative;
  overflow: visible;
}

.cell{
  position:relative;
  min-height:70px;
  background:#fff;
  border-radius:8px;
  border:1px solid transparent;
  padding:8px;
  transition:all .18s ease-out;
  cursor:pointer;
  overflow: visible;
  z-index: 0;
}
.cell.dim{
  opacity:.4;
}

/* 今天：外圈高亮 + 轻微阴影 */
.cell.today{
  border-color:#1d5e25;
  box-shadow:0 0 0 1px rgba(29,94,37,.35);
}

/* 选中：浅绿底 + 绿边框 */
.cell.selected{
  background:#f0f7f3;
  border-color:#1d5e25;
}

/* 悬浮效果 */
.cell:hover{
  background:#f6fbf8;
  box-shadow:0 4px 14px rgba(0,0,0,.06);
  transform:translateY(-1px);
  border-color:#d7e8df;
}

.dnum{
  font-weight:600;
  color:#333;
}

/* 有活动的小绿点 */
.dot{
  position:absolute;
  right:8px;
  bottom:8px;
  width:8px;
  height:8px;
  border-radius:50%;
  background:#1d5e25;
}

/* 悬浮卡片：位置在当前日期下方，居中对齐 */
.popover{
  position:absolute;
  z-index:999;
  left:50%;
  transform:translateX(-50%);
  min-width:220px;
  background:#ffffff;
  border:1px solid #e9ecef;
  border-radius:10px;
  padding:10px 12px;
  box-shadow:0 8px 22px rgba(0,0,0,.08);
}

/* 上半部分：向下弹（不影响下面太多） */
.popover.to-bottom{
  top:72px;
}

/* 下半部分：向上弹（避免盖住下一行日期格子） */
.popover.to-top{
  bottom:72px;
}
.p-title{
  font-weight:700;
  margin-bottom:6px;
  color:#325e21;
}

/* ⭐ 让气泡里的每一条可以点，看起来像链接 */
.p-item{
  display:flex;
  align-items:center;
  margin:6px 0;
  cursor:pointer;
}
.p-item:hover .p-txt{
  text-decoration:underline;
  color:#1d5e25;
}

.p-dot{
  width:6px;
  height:6px;
  border-radius:50%;
  background:#1d5e25;
  margin-right:8px;
}
.p-txt{
  font-size:12px;
  color:#333;
}
.p-empty{
  font-size:12px;
  color:#888;
}

/* 底部按钮 */
.cal-foot{
  margin-top:10px;
  display:flex;
  justify-content:flex-end;
}
.today-btn{
  border:none;
  background:#e7f5ef;
  color:#1d5e25;
  padding:6px 12px;
  border-radius:999px;
  cursor:pointer;
  font-size:13px;
  font-weight:500;
  transition:all .18s ease-out;
}
.today-btn:hover{
  background:#d7eddf;
  transform:translateY(-1px);
}

/* 让当前格子整体盖在其他格子上，popover 不会被挡住 */
.cell { z-index: 0; }
.cell:hover { z-index: 2000; }

</style>
