<template>
    <div class="page">
      <!-- 面包屑： 首页 / 活动列表 -->
      <div class="breadcrumb">
        <router-link to="/student-home" class="link">首页</router-link>
        <span class="sep"> / </span>
        <span class="current">活动列表</span>
      </div>
  
      <!-- 顶部筛选：全部 / 企业 / 事业单位 / 实习 + 搜索 -->
      <div class="toolbar">
        <div class="tabs">
          <button
            v-for="t in tabs"
            :key="t.key"
            class="tab"
            :class="{ active: activeTab === t.key }"
            @click="switchTab(t.key)"
          >{{ t.label }}</button>
        </div>
  
        <div class="search">
          <input v-model="keyword" placeholder="搜索标题/地点..." />
          <button @click="doSearch">搜索</button>
        </div>
      </div>
  
      <!-- 列表 -->
      <div class="list">
        <div
          v-for="a in shown"
          :key="a.id"
          class="row"
          @click="goDetail(a.id)"
        >
          <div class="datebox">
            <div class="d">{{ split(a.date).day }}</div>
            <div class="ym">{{ split(a.date).year }}.{{ split(a.date).month }}</div>
          </div>
          <div class="body">
            <div class="title">{{ a.title }}</div>
            <div class="meta">{{ a.place }}</div>
            <div class="summary">{{ a.summary }}</div>
          </div>
          <div class="arrow">›</div>
        </div>
  
        <div v-if="shown.length === 0" class="empty">暂无相关活动</div>
      </div>
    </div>
  </template>
  
  <script>
  import { activities, splitYMD } from '@/data/activities.mock'
  
  export default {
    name: 'ActivityList',
    data() {
      const initTab = this.$route.query.tab || 'all'
      return {
        tabs: [
          { key: 'all',         label: '全部' },
          { key: 'enterprise',  label: '企业招聘' },
          { key: 'institution', label: '事业单位招聘' },
          { key: 'internship',  label: '实习招聘' }
        ],
        activeTab: ['all','enterprise','institution','internship'].includes(initTab) ? initTab : 'all',
        keyword: this.$route.query.q || '',
        data: activities.slice().sort((a,b)=> new Date(b.date)-new Date(a.date))
      }
    },
    computed: {
      filtered() {
        let list = this.data
        if (this.activeTab !== 'all') {
          list = list.filter(a => a.category === this.activeTab)
        }
        if (this.keyword.trim()) {
          const kw = this.keyword.toLowerCase()
          list = list.filter(a =>
            a.title.toLowerCase().includes(kw) ||
            (a.place||'').toLowerCase().includes(kw)
          )
        }
        return list
      },
      shown() {
        return this.filtered
      }
    },
    methods: {
      split: splitYMD,
      switchTab(key) {
        this.activeTab = key
        this.$router.replace({ name: 'ActivityList', query: { tab: key, q: this.keyword || undefined } })
      },
      doSearch() {
        this.$router.replace({ name: 'ActivityList', query: { tab: this.activeTab, q: this.keyword || undefined } })
      },
      goDetail(id) {
        this.$router.push({ name: 'ActivityDetail', params: { id } })
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
  
  .toolbar{
    background:#fff; border-radius:10px; padding:16px; display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;
  }
  .tabs{ display:flex; gap:6px; }
  .tab{ border:none; background:transparent; padding:10px 14px; border-radius:6px; cursor:pointer; font-weight:600; color:#666; }
  .tab.active{ color:#1b8f59; background:#eaf6ef; }
  
  .search{ display:flex; gap:8px; }
  .search input{ width:260px; padding:10px 12px; border:1px solid #e2e2e2; border-radius:6px; }
  .search button{ padding:10px 16px; border:none; border-radius:6px; background:#2a5e23; color:#fff; cursor:pointer; }
  
  .list{ background:#fff; border-radius:10px; padding:6px 6px 2px; }
  .row{
    display:flex; gap:16px; align-items:center; padding:16px; border-radius:10px; margin:8px 0;
    cursor:pointer; transition:.15s;
  }
  .row:hover{ background:#f8faf9; }
  .datebox{ width:68px; min-width:68px; border-right:1px solid #eee; text-align:center; padding-right:10px; color:#666; }
  .datebox .d{ font-size:22px; font-weight:800; line-height:1; }
  .datebox .ym{ font-size:12px; }
  .body{ flex:1; min-width:0; }
  .title{ font-weight:700; font-size:18px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; color:#163a24; }
  .meta{ font-size:13px; color:#8aa39a; margin-top:4px; }
  .summary{ font-size:14px; color:#555; margin-top:6px; }
  .arrow{ color:#96a0a5; font-size:22px; padding:0 6px; }
  .empty{ text-align:center; color:#999; padding:48px 0; }
  </style>
  