import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import CandidateList from '../views/CandidateList.vue'
import StudentHome from '@/views/StudentHome.vue'
import AppliedList from '@/views/AppliedList.vue'
import AppliedDetail from '@/views/AppliedDetail.vue'
import ActivityList from '@/views/ActivityList.vue'
import ActivityDetail from '@/views/ActivityDetail.vue'
const routes = [
  // 学生端路由
  {
    path: '/',
    name: 'StudentHome',
    component: StudentHome,
    meta: { layout: 'student' }
  },
  {
    path: '/resume-manage',
    name: 'ResumeManage',
    component: () => import('../views/ResumeManage.vue'),
    meta: { layout: 'student' }
  },
  {
    path: '/job-center',
    name: 'JobCenter',
    component: () => import('../views/JobCenter.vue'),
    meta: { layout: 'student' }
  },
  {
    path: '/job-detail/:id',
    name: 'JobDetail',
    component: () => import('../views/JobDetail.vue'),
    props: true,
    meta: { layout: 'student' }
  },
  {
    path: '/company-info/:id',
    name: 'CompanyInfo',
    component: () => import('../views/CompanyInfo.vue'),
    props: true,
    meta: { layout: 'student' }
  },
  {
    path: '/applied',
    name: 'AppliedList',
    component: AppliedList,
    meta: { layout: 'student' }
  },
  {
    path: '/applied/:id',
    name: 'AppliedDetail',
    component: AppliedDetail,
    props: true,
    meta: { layout: 'student' }
  },
  {
    path: '/student-center',
    name: 'StudentCenter',
    component: () => import('../views/StudentCenter.vue'),
    meta: { layout: 'student' }
  },
  {
    path: '/student-profile',
    name: 'StudentProfile',
    component: () => import('../views/StudentProfile.vue'),
    meta: { layout: 'student' }
  },
  {
    path: '/my-favorites',
    name: 'MyFavorites',
    component: () => import('../views/MyFavorites.vue'),
    meta: { layout: 'student' }
  },
  { path: '/activities', 
    name: 'ActivityList', 
    component: ActivityList ,
    meta: { layout: 'student' }
  },
  { path: '/activities/:id', 
    name: 'ActivityDetail', 
    component: ActivityDetail, 
    props: true ,
    meta: { layout: 'student' }
  },
  // 企业端路由
  {
    path: '/enterprise-home',
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