import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import CandidateList from '../views/CandidateList.vue'

const routes = [
  {
    path: '/',
    name: 'HomePage',
    component: HomePage
  },
  {
    path: '/position-manage',
    name: 'PositionManage',
    component: () => import('../views/PositionManage.vue')
  },
  {
    path: '/position-detail/:id',
    name: 'PositionDetail',
    component: () => import('../views/PositionDetail.vue'),
    props: true
  },
  {
    path: '/post-method',
    name: 'PostMethod',
    component: () => import('../views/PostMethod.vue')
  },
  {
    path: '/talent-pool',
    name: 'TalentPool',
    component: () => import('../views/TalentPool.vue')
  },
  {
    path: '/candidates/:positionId',
    name: 'CandidateList',
    component: CandidateList,
    props: true
  },
  {
    path: '/candidates/:positionId/resume/:candidateId',
    name: 'CandidateResume',
    component: () => import('../views/CandidateResume.vue'),
    props: true
  },
  {
    path: '/enterprise-info',
    name: 'EnterpriseInfo',
    component: () => import('../views/EnterpriseInfo.vue')
  },
  {
    path: '/enterprise-edit',
    name: 'EnterpriseEdit',
    component: () => import('../views/EnterpriseEdit.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router