<template>
    <div class="detail-page">
      <!-- 面包屑 -->
      <div class="breadcrumb">
        <router-link class="crumb-link" to="/applied">投递情况</router-link>
        <span class="sep">></span>
        <span class="muted">{{ job?.company }} - {{ job?.title }}</span>
      </div>
  
      <!-- 头部信息栏 -->
      <div class="meta-card">
        <div class="row">
          <div>投递时间：<b>{{ job?.appliedAt }}</b></div>
          <div>状态更新时间：<b>{{ job?.updatedAt }}</b></div>
          <div class="right">投递岗位：<b>{{ job?.positionLabel }}</b></div>
        </div>
  
        <!-- 状态横幅 -->
        <div class="state-banner" :class="job?.status">
          <div class="state-left">
            <div class="state-title">
              当前状态：{{ stateTitle }}
            </div>
            <div class="state-desc">{{ job?.note }}</div>
          </div>
          <div class="state-icon">
            <div v-if="job?.status==='submitted'" class="ico paper">📄</div>
            <div v-else-if="job?.status==='interview'" class="ico mail">✉️</div>
            <div v-else-if="job?.status==='passed'" class="ico like">👍</div>
            <div v-else class="ico sad">🙁</div>
          </div>
        </div>
      </div>
  
      <!-- 进度条 -->
      <div class="step-card">
        <div class="step-line">
          <div class="step-node" :class="{ done: step>=1, danger: job?.status==='stopped' && step===1 }">
            <span class="check">{{ job?.status==='stopped' && step===1 ? '✕' : '✓' }}</span>
            <div class="label">投递岗位</div>
          </div>
  
          <div class="step-bar" :class="{ done: step>=2, danger: job?.status==='stopped' }"></div>
  
          <div class="step-node" :class="{ done: step>=2, danger: job?.status==='stopped' }">
            <span class="check">{{ job?.status==='stopped' ? '✕' : '✓' }}</span>
            <div class="label">面试邀请</div>
          </div>
  
          <div class="step-bar" :class="{ done: step===3 }"></div>
  
          <div class="step-node" :class="{ done: step===3 }">
            <span class="check">✓</span>
            <div class="label">Offer</div>
          </div>
        </div>
      </div>
  
      <!-- 底部操作（可选：切换状态用于演示） -->
      <div class="ops">
        <button class="btn" @click="setStatus('submitted')">设为：已投递</button>
        <button class="btn" @click="setStatus('interview')">设为：已发面试</button>
        <button class="btn" @click="setStatus('passed')">设为：已通过</button>
        <button class="btn danger" @click="setStatus('stopped')">设为：流程中止</button>
      </div>
    </div>
  </template>
  
  <script>
  import { getAppliedById, updateAppliedStatus } from '@/mock/applied'
  
  export default {
    name: 'AppliedDetail',
    props: { id: [String, Number] },
    data() {
      return { job: null }
    },
    created() {
      const id = this.$route.params.id || this.id
      this.job = getAppliedById(id)
    },
    computed: {
      step() {
        // 1：投递岗位  2：面试邀请  3：Offer
        if (!this.job) return 1
        if (this.job.status === 'submitted') return 1
        if (this.job.status === 'interview') return 2
        if (this.job.status === 'passed') return 3
        if (this.job.status === 'stopped') return 2 // 在“面试邀请”处终止
        return 1
      },
      stateTitle() {
        const s = this.job?.status
        return s === 'submitted' ? '已投递简历'
          : s === 'interview' ? '已发送面试邀请'
          : s === 'passed' ? '已通过'
          : '流程已中止'
      }
    },
    methods: {
      setStatus(s) {
        if (!this.job) return
        updateAppliedStatus(this.job.id, s)
        this.job = { ...this.job, status: s, updatedAt: new Date().toISOString().slice(0,10) }
      }
    }
  }
  </script>
  
  <style scoped>
  .detail-page{min-height:100vh;background:#f0f0f0;padding:20px 40px}
  
  .breadcrumb{background:#fff;padding:18px 24px;border-radius:10px;margin-bottom:16px;box-shadow:0 2px 10px rgba(0,0,0,.08);font-size:18px}
  .crumb-link{color:#325e21;text-decoration:none;font-weight:600}
  .sep{margin:0 8px;color:#aaa}
  .muted{color:#666}
  
  .meta-card{background:#fff;border-radius:10px;padding:22px 26px;box-shadow:0 2px 12px rgba(0,0,0,.08)}
  .row{display:flex;gap:24px;align-items:center;color:#555;margin-bottom:16px}
  .row .right{margin-left:auto}
  
  .state-banner{display:flex;align-items:center;justify-content:space-between;border-radius:8px;padding:22px 26px;background:#eaf7e7;border:1px solid #dbeed8}
  .state-banner.submitted{background:#eaf7e7}
  .state-banner.interview{background:#eaf7e7}
  .state-banner.passed{background:#eaf7e7}
  .state-banner.stopped{background:#fdeaea;border-color:#f2cdcd}
  .state-title{font-size:26px;color:#2e7d32;font-weight:800;margin-bottom:8px}
  .state-banner.stopped .state-title{color:#c62828}
  .state-desc{color:#555;font-size:16px}
  .state-icon .ico{font-size:56px;opacity:.85}
  
  .step-card{background:#fff;border-radius:10px;padding:28px;margin-top:16px;box-shadow:0 2px 12px rgba(0,0,0,.08)}
  .step-line{display:flex;align-items:center;justify-content:space-between}
  .step-node{display:flex;flex-direction:column;align-items:center;gap:6px}
  .step-node .check{width:54px;height:54px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:6px solid #d8ead3;background:#fff;font-size:22px;color:#2e7d32;font-weight:700}
  .step-node.done .check{border-color:#2e7d32}
  .step-node.danger .check{border-color:#e57373;color:#c62828}
  .step-node .label{margin-top:6px;color:#333;font-weight:600}
  
  .step-bar{flex:1;height:10px;border-radius:5px;background:#e9ecef;margin:0 16px}
  .step-bar.done{background:#2e7d32}
  .step-bar.danger{background:linear-gradient(90deg,#c62828 0%,#e57373 100%)}
  
  .ops{margin-top:16px;display:flex;gap:10px}
  .btn{padding:10px 16px;border:none;border-radius:6px;background:#325e21;color:#fff;cursor:pointer}
  .btn.danger{background:#c62828}
  </style>
  