<template>
  <div class="recruitment card">
    <!-- Tabs -->
    <div class="tabs">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        class="tab"
        :class="{ active: activeTab === tab.key }"
        @click="activeTab = tab.key"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- 列表（双列栅格） -->
    <div class="list">
      <div
        v-for="(item, i) in activeList"
        :key="i"
        class="item"
        @click="onClick(item)"
      >
        <div class="date">
          <div class="d">{{ split(item.date).day }}</div>
          <div class="ym">
            {{ split(item.date).year }}.{{ split(item.date).month }}
          </div>
        </div>
        <div class="title" :title="item.title">{{ item.title }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { splitYMD } from '@/data/activities.mock'

export default {
  name: 'RecruitmentPanel',
  props: {
    enterprise:  { type: Array, default: () => [] },
    institution: { type: Array, default: () => [] },
    internship:  { type: Array, default: () => [] },
    campus:      { type: Array, default: () => [] }
  },
  data() {
    return {
      activeTab: 'enterprise',
      tabs: [
        { key: 'enterprise',  label: '企业招聘' },
        { key: 'institution', label: '事业单位招聘' },
        { key: 'internship',  label: '实习招聘' },
        { key: 'campus',      label: '校园招聘' }
      ]
    }
  },
  computed: {
    activeList() {
      switch (this.activeTab) {
        case 'institution': return this.institution
        case 'internship':  return this.internship
        case 'campus':      return this.campus
        default:            return this.enterprise
      }
    }
  },
  methods: {
    split: splitYMD,

    /** 所有招聘岗位跳转岗位详情页 */
    onClick(item) {
      if (!item || !item.id) return
      window.location.href = `http://localhost:5306/job-detail/${item.id}`
    }
  }
}
</script>

<style scoped>
.card{
  background:#fff;
  border-radius:12px;
  box-shadow:0 2px 8px rgba(0,0,0,.08);
  padding:16px;
}

.tabs{
  display:flex;
  gap:0;
  border-bottom:1px solid #e9ecef;
  margin:0 -16px 12px;
  padding:0 16px;
}

.tab{
  border:none;
  background:transparent;
  padding:12px 18px;
  cursor:pointer;
  color:#666;
  font-weight:600;
}

.tab.active{
  color:#1b8f59;
  border-bottom:2px solid #1b8f59;
}

/* 双列栅格 */
.list{
  display:grid;
  grid-template-columns: repeat(2, 1fr);
  gap:14px 24px;
}
@media (max-width: 900px){
  .list{ grid-template-columns: 1fr; }
}

/* 每一行招聘卡片：和岗位热度/近期活动同款效果 */
.item{
  display:flex;
  align-items:center;
  gap:14px;
  padding:18px 24px;
  border-radius:12px;
  border:1px solid #f0f2f4;
  background:#fff;

  cursor:pointer;
  transition:all .18s ease-out;
}

.item:hover{
  background:#f6fbf8;                  /* 背景变浅 */
  box-shadow:0 4px 14px rgba(0,0,0,.06);/* 阴影 */
  transform:translateY(-1px);          /* 微微上浮 */
  border-color:transparent;
}

/* 左侧日期块 */
.date{
  width:64px;
  min-width:64px;
  height:54px;
  border-right:1px solid #eaeaea;
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  color:#666;
}
.date .d{
  font-size:20px;
  font-weight:800;
}
.date .ym{
  font-size:12px;
  opacity:.8;
}

/* 标题文字 */
.title{
  flex:1;
  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;
  font-weight:600;
}
</style>
