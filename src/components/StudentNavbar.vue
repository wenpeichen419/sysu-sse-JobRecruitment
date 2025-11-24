<template>
  <nav class="navbar-student">
    <!-- 左侧 logo 和院名 -->
    <div class="logo-section">
      <img v-if="logoUrl" :src="logoUrl" alt="中山大学软件工程学院" class="logo-image" />
    </div>

    <!-- 中间导航链接（和企业端一致的结构与样式） -->
    <ul class="nav-links">
      <li v-for="(link, idx) in navLinks" :key="idx">
        <router-link
          :to="link.path"
          :class="{ active: isActive(link) }"
        >
          {{ link.text }}
        </router-link>
      </li>
    </ul>

    <!-- 右侧用户信息 -->
    <div class="user-section">
      <span class="user-greeting">您好，</span>
      <router-link to="/student-center" class="user-link">{{ studentName }}</router-link>
    </div>
  </nav>
</template>

<script>
import mockStudent from '@/data/mockStudentData'

let url = ''
try {
  // 和企业端保持同一张 Logo；若没有此文件，不显示图片也不会报错
  url = require('@/assets/campus_logo.png')
} catch (e) {
  url = ''
}

export default {
  name: 'StudentNavbar',
  data() {
    return {
      logoUrl: url,
      studentName: mockStudent.name,
      // 与企业端一致的 Tab 布局，但路径为学生端页面
      navLinks: [
        { path: '/student-home', text: '首页', exact: true },
        { path: '/job-center',          text: '求职中心' },
        { path: '/resume-manage',       text: '简历管理' },
        { path: '/applied',     text: '投递情况' }
      ]
    }
  },
  methods: {
    // 高亮规则：exact 时严格相等；否则使用 startsWith（和企业端观感一致）
    isActive(link) {
      if (link.exact) {
        return this.$route.path === link.path
      }
      
      // 特殊处理：求职中心相关页面都高亮求职中心
      if (link.path === '/job-center') {
        return this.$route.path.startsWith('/job-center') || 
               this.$route.path.startsWith('/job-detail') || 
               this.$route.path.startsWith('/company-info')
      }
      
      // 特殊处理：投递情况相关页面都高亮投递情况
      if (link.path === '/applied') {
        return this.$route.path.startsWith('/applied')
      }
      
      return this.$route.path.startsWith(link.path)
    }
  }
}
</script>

<style scoped>
/* ===== 和企业端一致的样式（仅类名不同以避免冲突） ===== */
.navbar-student {
  background-color: #2a5e23;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 105px;                 /* 与企业端相同高度 */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: fixed;               /* 占据整行并固定顶部 */
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.logo-section {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  min-width: 280px; /* 固定Logo区域宽度，防止压缩 */
}

.logo-image {
  height: 80px;
  margin-right: 20px;
  display: block;
}

.nav-links {
  display: flex;
  list-style: none;
  flex: 1;
  justify-content: space-evenly; /* 均匀分布，所有间隔都相等 */
  margin: 0;
  padding: 0;
}

.nav-links li {
  margin: 0;
}

.nav-links a {
  color: white;
  text-decoration: none;
  font-weight: 600;
  font-size: 26px;
  padding: 10px 20px;
  border-radius: 6px;
  transition: all 0.3s ease;
  cursor: pointer;
  display: inline-block;
  white-space: nowrap; /* 防止文字换行 */
}

.nav-links a:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-links a.active {
  color: #cfb457;
}

.user-section {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  min-width: 200px; /* 固定用户区域宽度 */
  justify-content: flex-end;
}

.user-greeting {
  color: white;
  font-size: 22px;
  margin-right: 5px;
  font-weight: 500;
}

.user-link {
  color: #cc8e58;
  font-weight: 600;
  text-decoration: none;
  font-size: 22px;
  padding: 8px 12px;
  border-radius: 6px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.user-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #ecdcda;
}

/* 响应式（与企业端一致） */
@media (max-width: 768px) {
  .navbar-student {
    flex-direction: column;
    height: auto;
    padding: 15px;
  }
  .logo-section { margin-bottom: 15px; }
  .nav-links { margin-bottom: 15px; }
  .nav-links li { margin: 0 10px; }
}
</style>
