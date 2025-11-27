<!-- src/components/student/StudentCalendar.vue -->
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
          v-if="hover === cell.dateStr"
          @mouseenter="hover = cell.dateStr"
          @mouseleave="hover = ''"
        >
          <div class="p-title">{{ cell.dateStr }} 活动</div>
          <div v-if="eventsMap[cell.dateStr]?.length">
            <div class="p-item" v-for="(e,i) in eventsMap[cell.dateStr]" :key="i">
              <span class="p-dot"></span>
              <span class="p-txt">{{ e.time }} · {{ e.title }} · {{ e.place }}</span>
            </div>
          </div>
          <div v-else class="p-empty">暂无安排</div>
        </div>
      </div>
    </div>

    <div class="cal-foot">
      <button class="today-btn" @click="goToday">今天</button>
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
    /** { 'YYYY-MM-DD': [{title, time, place}] } */
    eventsMap: { type: Object, default: () => ({}) },
    value: { type: String, default: '' } // 选中的日期 YYYY-MM-DD
  },
  data() {
    const now = new Date()
    return {
      year: now.getFullYear(),
      month: now.getMonth(), // 0-11
      hover: '',
      // ✅ 初始选中日期改用本地日期格式
      selected: this.value || formatDateLocal(now),
      weeks: ['日','一','二','三','四','五','六']
    }
  },
  computed: {
    cells() {
      const first = new Date(this.year, this.month, 1)
      const start = new Date(first)
      start.setDate(first.getDate() - first.getDay()) // 从周日开始

      // ✅ 今天日期用本地时间
      const todayStr = formatDateLocal(new Date())
      const arr = []
      for (let i = 0; i < 42; i++) {
        const d = new Date(start)
        d.setDate(start.getDate() + i)
        const inMonth = d.getMonth() === this.month
        // ✅ 每个格子的 key 也用本地日期字符串
        const dateStr = formatDateLocal(d)
        arr.push({
          key: dateStr,
          dateStr,
          inMonth,
          day: d.getDate(),
          isToday: dateStr === todayStr
        })
      }
      return arr
    }
  },
  watch: {
    value(val) { this.selected = val }
  },
  methods: {
    select(dateStr) {
      this.selected = dateStr
      this.$emit('input', dateStr) // v-model 兼容
      this.$emit('change', dateStr)
    },
    prevMonth() {
      if (this.month === 0) {
        this.year--
        this.month = 11
      } else {
        this.month--
      }
    },
    nextMonth() {
      if (this.month === 11) {
        this.year++
        this.month = 0
      } else {
        this.month++
      }
    },
    goToday() {
      const now = new Date()
      this.year = now.getFullYear()
      this.month = now.getMonth()
      // ✅ 这里也用本地日期字符串
      this.select(formatDateLocal(now))
    }
  }
}
</script>

<style scoped>
.calendar { width: 100%; }
.cal-head{
  display:flex; justify-content:space-between; align-items:center;
  background:#1d5e25; color:#fff; border-radius:8px; padding:6px 10px; margin-bottom:8px;
}
.nav{
  background:transparent; border:none; color:#fff; font-size:16px; cursor:pointer;
}
.ym{ font-weight:600; }

.week-row{
  display:grid; grid-template-columns: repeat(7, 1fr);
  text-align:center; color:#325e21; margin-bottom:6px; font-weight:600;
}

.grid{
  display:grid; grid-template-columns: repeat(7, 1fr);
  gap:6px;
}
.cell{
  position:relative; min-height:70px; background:#fff; border-radius:8px;
  border:1px solid #e9ecef; padding:8px;
}
.cell.dim{ opacity:.45; }
.cell.today{ box-shadow: inset 0 0 0 2px #1d5e25; }
.cell.selected{ border-color:#1d5e25; }

.dnum{ font-weight:600; color:#333; }
.dot{
  position:absolute; right:8px; bottom:8px; width:8px; height:8px; border-radius:50%; background:#1d5e25;
}

/* 悬浮气泡 */
.popover{
  position:absolute; z-index:10; left:6px; top:36px; min-width:220px;
  background:#ffffff; border:1px solid #e9ecef; border-radius:8px; padding:10px;
  box-shadow:0 6px 20px rgba(0,0,0,.08);
}
.p-title{ font-weight:700; margin-bottom:6px; color:#325e21; }
.p-item{ display:flex; align-items:center; margin:6px 0; }
.p-dot{ width:6px; height:6px; border-radius:50%; background:#1d5e25; margin-right:8px; }
.p-txt{ font-size:12px; color:#333; }
.p-empty{ font-size:12px; color:#888; }

.cal-foot{ margin-top:8px; display:flex; justify-content:flex-end; }
.today-btn{
  border:none; background:#e7f5ef; color:#1d5e25; padding:6px 10px; border-radius:8px; cursor:pointer;
}
</style>
