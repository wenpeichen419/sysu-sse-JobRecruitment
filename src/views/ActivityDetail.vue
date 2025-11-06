<template>
    <div class="page">
      <!-- 面包屑： 首页 / 活动列表 / 活动详情 -->
      <div class="breadcrumb">
        <router-link to="/student-home" class="link">首页</router-link>
        <span class="sep"> / </span>
        <router-link to="/activities" class="link">活动列表</router-link>
        <span class="sep"> / </span>
        <span class="current">活动详情</span>
      </div>
  
      <div class="card">
        <h1 class="title">{{ a.title }}</h1>
        <div class="meta">
          <span>{{ split(a.date).year }}-{{ split(a.date).month }}-{{ split(a.date).day }}</span>
          <span class="dot">·</span>
          <span>{{ a.place }}</span>
          <span class="dot" v-if="a.category">·</span>
          <span v-if="a.category">{{ dict[a.category] }}</span>
        </div>
  
        <div class="content">
          <p v-for="(line,i) in a.content" :key="i">{{ line }}</p>
        </div>
  
        <div v-if="a.url" class="ext">
          <a :href="a.url" target="_blank">官网链接</a>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { activities, splitYMD } from '@/data/activities.mock'
  
  export default {
    name: 'ActivityDetail',
    props: { id: { type: [String, Number], required: true } },
    data() {
      return {
        dict: { enterprise: '企业招聘', institution: '事业单位招聘', internship: '实习招聘' }
      }
    },
    computed: {
      a() {
        const nid = parseInt(this.id, 10)
        return activities.find(x => x.id === nid) || { title: '活动不存在', date: '', place: '', content: [] }
      }
    },
    methods: { split: splitYMD }
  }
  </script>
  
  <style scoped>
  .page{ padding:20px 24px; background:#f5f6f7; min-height:100vh; }
  .breadcrumb{ background:#fff; padding:14px 18px; border-radius:10px; margin-bottom:16px; }
  .link{ color:#2a5e23; text-decoration:none; }
  .sep{ color:#999; margin:0 6px; }
  .current{ color:#333; font-weight:600; }
  
  .card{ background:#fff; border-radius:12px; padding:26px; }
  .title{ margin:0 0 8px; font-size:26px; }
  .meta{ color:#8aa39a; font-size:14px; }
  .meta .dot{ margin:0 6px; }
  .content{ margin-top:18px; line-height:1.9; font-size:16px; color:#444; }
  .content p{ margin:0 0 10px; }
  .ext{ margin-top:16px; }
  .ext a{ color:#2a5e23; }
  </style>
  