// src/mock/applied.js
const LS_KEY = 'applied_jobs_v1'

const seed = [
  {
    id: 101,
    title: '推荐算法工程师',
    company: '百度在线网络技术（北京）有限公司',
    salary: '7000-8000',
    province: '广东省',
    city: '深圳',
    location: '广东省深圳市南山区',
    category: '算法',
    type: '校招/实习',
    department: 'xx部门',
    logo: require('@/assets/BDance_logo.png'),
    appliedAt: '2025-10-29',
    updatedAt: '2025-10-29',
    positionLabel: '后端开发',
    status: 'interview', // submitted | interview | passed | stopped
    note: '您的简历已被企业通过，请留意平台预留的联系方式，面试通知将发送至该处。'
  },
  {
    id: 102,
    title: '产品经理',
    company: '华为技术有限公司',
    salary: '7000-8000',
    province: '广东省',
    city: '深圳',
    location: '广东省深圳市南山区',
    category: '产品',
    type: '校招/实习',
    department: 'xx部门',
    logo: require('@/assets/BDance_logo.png'),
    appliedAt: '2025-10-29',
    updatedAt: '2025-10-29',
    positionLabel: '后端开发',
    status: 'submitted',
    note: '您的简历已投递到企业方，请耐心等待审核结果。'
  },
  {
    id: 103,
    title: '前端开发工程师',
    company: '腾讯科技（深圳）有限公司',
    salary: '8000-10000',
    province: '广东省',
    city: '深圳',
    location: '广东省深圳市南山区',
    category: '研发',
    type: '校招',
    department: '技术部',
    logo: require('@/assets/BDance_logo.png'),
    appliedAt: '2025-10-29',
    updatedAt: '2025-10-29',
    positionLabel: '后端开发',
    status: 'passed',
    note: '恭喜您顺利通过面试！企业方将就后续事宜与您联系，请保持通讯畅通。'
  },
  {
    id: 104,
    title: 'Python工程师',
    company: '网易（杭州）网络有限公司',
    salary: '10000-14000',
    province: '浙江省',
    city: '杭州',
    location: '浙江省杭州市滨江区',
    category: '研发',
    type: '校招',
    department: '技术部',
    logo: require('@/assets/BDance_logo.png'),
    appliedAt: '2025-10-29',
    updatedAt: '2025-10-29',
    positionLabel: '后端开发',
    status: 'stopped',
    note: '您的岗位申请流程已被企业方中止，感谢您的参与，请继续关注其他岗位！'
  }
]

function initIfNeeded() {
  if (!localStorage.getItem(LS_KEY)) {
    localStorage.setItem(LS_KEY, JSON.stringify(seed))
  }
}

export function listApplied() {
  initIfNeeded()
  return JSON.parse(localStorage.getItem(LS_KEY) || '[]')
}

export function getAppliedById(id) {
  return listApplied().find(x => String(x.id) === String(id))
}

export function updateAppliedStatus(id, status) {
  const arr = listApplied()
  const idx = arr.findIndex(x => String(x.id) === String(id))
  if (idx >= 0) {
    arr[idx].status = status
    arr[idx].updatedAt = new Date().toISOString().slice(0, 10)
    localStorage.setItem(LS_KEY, JSON.stringify(arr))
  }
}
