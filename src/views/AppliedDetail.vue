<template>
  <div class="detail-page">
    <!-- 有数据时的内容 -->
    <div v-if="job">
      <!-- 面包屑 -->
      <div class="breadcrumb">
        <router-link class="crumb-link" to="/applied">投递情况</router-link>
        <span class="sep">></span>
        <span class="muted">{{ companyName }} - {{ jobTitle }}</span>
      </div>

      <!-- 头部信息栏 -->
      <div class="meta-card">
        <div class="row">
          <div class="meta-item">
            <span class="label">投递时间：</span>
            <b>{{ submittedAtText }}</b>
          </div>
          <div class="meta-item">
            <span class="label">状态更新时间：</span>
            <b>{{ updatedAtText }}</b>
          </div>
          <div class="meta-item right">
            <span class="label">投递岗位：</span>
            <b>{{ jobTitle }}</b>
          </div>
        </div>

        <!-- 状态横幅 -->
        <div class="state-banner" :class="bannerClass">
          <div class="state-left">
            <div class="state-title">
              当前状态：{{ stateTitle }}
            </div>
            <div class="state-desc">{{ stateDescription }}</div>
          </div>
          <div class="state-icon">
            <div v-if="job.status === '已投递'" class="ico paper">📄</div>
            <div v-else-if="job.status === '候选人'" class="ico mail">✉️</div>
            <div v-else-if="job.status === '面试邀请'" class="ico like">👍</div>
            <div v-else-if="job.status === 'Offer'" class="ico check">✅</div>
            <div v-else-if="job.status === '拒绝'" class="ico sad">🙁</div>
          </div>
        </div>
      </div>

      <!-- 进度条 -->
      <div class="step-card">
        <div class="step-line">
          <!-- 第一步：投递岗位 -->
          <div
            class="step-node"
            :class="{ done: step >= 1, danger: job.status === '拒绝' && step === 1 }"
          >
            <span class="check">
              {{ job.status === '拒绝' && step === 1 ? '✕' : '✓' }}
            </span>
            <div class="label">投递岗位</div>
          </div>

          <div
            class="step-bar"
            :class="{ done: step >= 2, danger: job.status === '拒绝' && step <= 2 }"
          ></div>

          <!-- 第二步：面试邀请 / 候选人 -->
          <div
            class="step-node"
            :class="{ done: step >= 2, danger: job.status === '拒绝' && step <= 2 }"
          >
            <span class="check">
              {{ job.status === '拒绝' && step <= 2 ? '✕' : '✓' }}
            </span>
            <div class="label">面试邀请</div>
          </div>

          <div class="step-bar" :class="{ done: step === 3 }"></div>

          <!-- 第三步：Offer -->
          <div class="step-node" :class="{ done: step === 3 }">
            <span class="check">✓</span>
            <div class="label">Offer</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 没数据时的兜底提示 -->
    <div v-else class="empty">
      暂未查询到该投递记录，请返回列表重试。
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'AppliedDetail',
  props: { id: [String, Number] },
  data() {
    return {
      job: null
    }
  },
  created() {
    const id = this.$route.params.id || this.id
    this.getJobDetail(id)
  },
  computed: {
    // 公司名称：兼容多种结构
    companyName() {
      if (!this.job) return ''
      return (
        this.job.company_name ||
        (this.job.company && this.job.company.name) ||
        ''
      )
    },
    // 职位名称：兼容多种结构
    jobTitle() {
      if (!this.job) return ''
      return (
        this.job.title ||
        (this.job.job && this.job.job.title) ||
        ''
      )
    },
    // 进度条所在步骤：1/2/3
    step() {
      if (!this.job) return 1
      const s = this.job.status
      if (s === '已投递') return 1
      if (s === '候选人' || s === '面试邀请') return 2
      if (s === 'Offer') return 3
      if (s === '拒绝') return 1
      return 1
    },
    // 状态标题
    stateTitle() {
      return this.job ? this.job.status : ''
    },
    // 状态描述：优先用后端的 status_detail，没有的话再兜底
    stateDescription() {
      if (!this.job) return ''
      if (this.job.status_detail) return this.job.status_detail

      const s = this.job.status
      if (s === '已投递') {
        return '您的简历已成功投递至企业，请耐心等待企业审核。'
      } else if (s === '候选人') {
        return '企业已将您加入候选人名单，后续如有匹配岗位会继续联系您。'
      } else if (s === '面试邀请') {
        return '您的简历已通过初筛，请留意平台及预留联系方式的面试通知。'
      } else if (s === 'Offer') {
        return '恭喜您已通过本次招聘流程，企业将与您沟通入职相关事宜。'
      } else if (s === '拒绝') {
        return '很遗憾，本次未能通过筛选，欢迎您继续关注其他岗位。'
      }
      return ''
    },
    // 横幅颜色 class 映射到 submitted/interview/passed/stopped
    bannerClass() {
      if (!this.job) return ''
      const s = this.job.status
      if (s === '已投递') return 'submitted'
      if (s === '候选人' || s === '面试邀请') return 'interview'
      if (s === 'Offer') return 'passed'
      if (s === '拒绝') return 'stopped'
      return ''
    },
    // 格式化后的时间（去掉 T，长度控制到秒）
    submittedAtText() {
      if (!this.job || !this.job.submitted_at) return ''
      return this.formatDateTime(this.job.submitted_at)
    },
    updatedAtText() {
      if (!this.job || !this.job.updated_at) return ''
      return this.formatDateTime(this.job.updated_at)
    }
  },
  methods: {
    async getJobDetail(jobId) {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      console.error('Token 不存在，请先登录')
      return
    }

    // 1. 复用列表接口
    const resp = await axios.get(
      'http://localhost:8080/position-center/delivery/list',
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    )

    const jobs = (resp.data && resp.data.data && resp.data.data.jobs) || []
    // 2. 按 job_id 匹配当前这条
    const record = jobs.find(
      x => String(x.job_id) === String(jobId)
    )

    console.log('详情匹配到的记录:', record)

    if (!record) {
      console.warn('未在投递列表中找到对应记录')
      this.job = null
      return
    }

    // 3. 把列表里的字段，组装成 AppliedDetail 目前用的结构
    this.job = {
      status: record.status_text || record.status,   // 列表有 status / status_text
      status_detail: null,                          // 后端没给就先留空，用兜底文案
      submitted_at: record.submitted_at,
      updated_at: record.updated_at || record.submitted_at,
      job: {
        id: record.job_id,
        title: record.title
      },
      company: {
        name: record.company_name
      }
    }
  } catch (error) {
    console.error('获取岗位详情失败', error)
    this.job = null
  }
},

    // 简单的时间格式化：2025-11-20T17:14:30 => 2025-11-20 17:14:30
    formatDateTime(str) {
      if (!str) return ''
      return str.replace('T', ' ').slice(0, 19)
    }
  }
}
</script>

<style scoped>
.detail-page {
  min-height: 100vh;
  background: #f0f0f0;
  padding: 20px 40px;
}

.breadcrumb {
  background: #fff;
  padding: 18px 24px;
  border-radius: 10px;
  margin-bottom: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  font-size: 18px;
}

.crumb-link {
  color: #325e21;
  text-decoration: none;
  font-weight: 600;
}

.sep {
  margin: 0 8px;
  color: #aaa;
}

.muted {
  color: #666;
}

.meta-card {
  background: #fff;
  border-radius: 10px;
  padding: 22px 26px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

/* 头部信息：自动换行，不会太挤 */
.row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 32px;
  align-items: center;
  color: #555;
  margin-bottom: 16px;
}

.meta-item {
  font-size: 15px;
  display: flex;
  align-items: center;
}

.meta-item .label {
  color: #666;
}

.meta-item b {
  font-weight: 600;
}

.meta-item.right {
  margin-left: auto;
}

/* 状态横幅 */
.state-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 8px;
  padding: 22px 26px;
  background: #eaf7e7;
  border: 1px solid #dbeed8;
}

.state-banner.submitted {
  background: #eaf7e7;
}

.state-banner.interview {
  background: #eaf7e7;
}

.state-banner.passed {
  background: #eaf7e7;
}

.state-banner.stopped {
  background: #fdeaea;
  border-color: #f2cdcd;
}

.state-title {
  font-size: 26px;
  color: #2e7d32;
  font-weight: 800;
  margin-bottom: 8px;
}

.state-banner.stopped .state-title {
  color: #c62828;
}

.state-desc {
  color: #555;
  font-size: 16px;
}

.state-icon .ico {
  font-size: 56px;
  opacity: 0.85;
}

/* 进度条 */
.step-card {
  background: #fff;
  border-radius: 10px;
  padding: 28px;
  margin-top: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.step-line {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.step-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.step-node .check {
  width: 54px;
  height: 54px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 6px solid #d8ead3;
  background: #fff;
  font-size: 22px;
  color: #2e7d32;
  font-weight: 700;
}

.step-node.done .check {
  border-color: #2e7d32;
}

.step-node.danger .check {
  border-color: #e57373;
  color: #c62828;
}

.step-node .label {
  margin-top: 6px;
  color: #333;
  font-weight: 600;
}

.step-bar {
  flex: 1;
  height: 10px;
  border-radius: 5px;
  background: #e9ecef;
  margin: 0 16px;
}

.step-bar.done {
  background: #2e7d32;
}

.step-bar.danger {
  background: linear-gradient(90deg, #c62828 0%, #e57373 100%);
}

.empty {
  margin-top: 40px;
  text-align: center;
  color: #888;
  font-size: 16px;
}
</style>
