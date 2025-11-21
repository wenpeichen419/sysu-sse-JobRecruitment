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
        <a
          v-for="(item, i) in activeList"
          :key="i"
          class="item"
          :href="item.url || 'javascript:void(0)'"
          target="_blank"
          rel="noopener"
          :title="item.title"
        >
          <div class="date">
            <div class="d">{{ item.day }}</div>
            <div class="ym">{{ item.year }}.{{ item.month }}</div>
          </div>
          <div class="title">{{ item.title }}</div>
        </a>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'RecruitmentPanel',
    props: {
      enterprise:  { type: Array, default: () => [] }, // 企业招聘
      institution: { type: Array, default: () => [] }, // 事业单位招聘
      internship:  { type: Array, default: () => [] }  // 实习招聘
    },
    data() {
      return {
        activeTab: 'enterprise',
        tabs: [
          { key: 'enterprise',  label: '企业招聘' },
          { key: 'institution', label: '事业单位招聘' },
          { key: 'internship',  label: '实习招聘' }
        ]
      }
    },
    computed: {
      activeList() {
        switch (this.activeTab) {
          case 'institution': return this.normalize(this.institution)
          case 'internship':  return this.normalize(this.internship)
          default:            return this.normalize(this.enterprise)
        }
      }
    },
    methods: {
      normalize(list) {
        // 将 'YYYY-MM-DD' 拆成年月日，补齐显示字段
        return (list || []).map(x => {
          const [y, m, d] = (x.date || '').split('-').map(n => parseInt(n, 10))
          return {
            ...x,
            year: y || '',
            month: (m || '').toString().padStart(2, '0'),
            day: (d || '').toString().padStart(2, '0'),
            url: x.url || ''
          }
        })
      }
    }
  }
  </script>
  
  <style scoped>
  .card{
    background:#fff;
    border-radius:12px;
    box-shadow: 0 2px 8px rgba(0,0,0,.08);
    padding:16px;
  }
  
  /* 顶部 Tabs */
  .tabs{
    display:flex;
    gap:0;
    border-bottom:1px solid #e9ecef;
    margin: 0 -16px 12px;
    padding: 0 16px;
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
  
  /* 列表双列 */
  .list{
    display:grid;
    grid-template-columns: repeat(2, 1fr);
    gap:14px 24px;
  }
  @media (max-width: 900px){ .list{ grid-template-columns: 1fr; } }
  
  .item{
    display:flex; align-items:center; gap:14px;
    background:#fff;
    border:1px solid #e5e7eb;
    border-radius:10px;
    padding:14px 16px;
    text-decoration:none;
    color:#333;
    transition: box-shadow .15s ease, transform .05s ease;
  }
  .item:hover{ box-shadow:0 6px 16px rgba(0,0,0,.06); transform: translateY(-1px); }
  
  .date{
    width:64px; min-width:64px; height:54px;
    border-right:1px solid #eaeaea;
    display:flex; flex-direction:column; align-items:center; justify-content:center;
    color:#666;
  }
  .date .d{ font-size:20px; font-weight:800; line-height:1; }
  .date .ym{ font-size:12px; opacity:.8; }
  
  .title{
    flex:1; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
    font-weight:600;
  }
  </style>
  