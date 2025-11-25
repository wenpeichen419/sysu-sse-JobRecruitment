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
      <router-link
        v-for="(item, i) in activeList"
        :key="i"
        class="item"
        :to="linkTo(item)"
        @click.prevent="onClick(item)"
      >
        <div class="date">
          <div class="d">{{ split(item.date).day }}</div>
          <div class="ym">{{ split(item.date).year }}.{{ split(item.date).month }}</div>
        </div>
        <div class="title" :title="item.title">{{ item.title }}</div>
      </router-link>
    </div>
  </div>
</template>

<script>
//import { splitYMD } from '@/data/activities.mock'

export default {
  name: 'RecruitmentPanel',
  props: {
    // 期望元素里带 id/date/title
    enterprise:  { type: Array, default: () => [] },
    institution: { type: Array, default: () => [] },
    internship:  { type: Array, default: () => [] },
    campus:      { type: Array, default: () => [] }   // 新增：校园招聘
  },
  data() {
    return {
      activeTab: 'enterprise',
      tabs: [
        { key: 'enterprise',  label: '企业招聘' },
        { key: 'institution', label: '事业单位招聘' },
        { key: 'internship',  label: '实习招聘' },
        { key: 'campus',      label: '校园招聘' }      // 新增 tab
      ]
    }
  },
  computed: {
    activeList() {
      switch (this.activeTab) {
        case 'institution': return this.institution || []
        case 'internship':  return this.internship || []
        case 'campus':      return this.campus || []      // 新增分支
        default:            return this.enterprise || []
      }
    }
  },
  methods: {
    split: splitYMD,
    linkTo(item) {
      return item?.id
        ? { name: 'ActivityDetail', params: { id: item.id } }
        : { name: 'ActivityList' }
    },
    onClick(item) {
      // 有 id 走详情；没 id 跳列表（带当前 tab）
      if (item?.id) {
        this.$router.push({ name: 'ActivityDetail', params: { id: item.id } })
      } else {
        this.$router.push({ name: 'ActivityList', query: { tab: this.activeTab } })
      }
    }
  }
}
</script>

<style scoped>
.card{ background:#fff; border-radius:12px; box-shadow:0 2px 8px rgba(0,0,0,.08); padding:16px; }
.tabs{ display:flex; gap:0; border-bottom:1px solid #e9ecef; margin:0 -16px 12px; padding:0 16px; }
.tab{ border:none; background:transparent; padding:12px 18px; cursor:pointer; color:#666; font-weight:600; }
.tab.active{ color:#1b8f59; border-bottom:2px solid #1b8f59; }
.list{ display:grid; grid-template-columns: repeat(2, 1fr); gap:14px 24px; }
@media (max-width: 900px){ .list{ grid-template-columns: 1fr; } }
.item{ display:flex; align-items:center; gap:14px; background:#fff; border:1px solid #e5e7eb; border-radius:10px; padding:14px 16px; text-decoration:none; color:#333; transition: box-shadow .15s ease, transform .05s ease; }
.item:hover{ box-shadow:0 6px 16px rgba(0,0,0,.06); transform: translateY(-1px); }
.date{ width:64px; min-width:64px; height:54px; border-right:1px solid #eaeaea; display:flex; flex-direction:column; align-items:center; justify-content:center; color:#666; }
.date .d{ font-size:20px; font-weight:800; line-height:1; }
.date .ym{ font-size:12px; opacity:.8; }
.title{ flex:1; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; font-weight:600; }
</style>
