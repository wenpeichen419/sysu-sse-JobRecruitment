<template>
  <div id="app">
    <!-- 学生端导航（根据路由 meta 切换） -->
    <StudentNavbar v-if="layout === 'student'" />

    <!-- 企业端导航（默认） -->
    <nav v-else class="navbar">
      <!-- 左侧logo和院名 -->
      <div class="logo-section">
        <img
          src="@/assets/campus_logo.png"
          alt="中山大学软件工程学院"
          class="logo-image"
        />
      </div>

      <!-- 中间导航链接 -->
      <ul class="nav-links">
        <li v-for="(link, index) in navLinks" :key="index">
          <router-link
            :to="link.path"
            :class="{ active: $route.path === link.path }"
          >
            {{ link.text }}
          </router-link>
        </li>
      </ul>

      <!-- 右侧用户信息 -->
      <div class="user-section">
        <span class="user-greeting">您好，</span>
        <router-link to="/enterprise-info" class="user-link">字节跳动</router-link>
      </div>
    </nav>

    <!-- 页面内容 - 路由出口 -->
    <div class="main-content" :style="{ marginTop: contentTop }">
      <router-view />
    </div>
  </div>
</template>

<script>
import StudentNavbar from '@/components/StudentNavbar.vue'

export default {
  name: 'App',
  components: { StudentNavbar },
  data() {
    return {
      // 企业端导航链接
      navLinks: [
        { path: '/', text: '主页' },
        { path: '/position-manage', text: '岗位管理' },
        { path: '/talent-pool', text: '人才库' }
      ]
    }
  },
  computed: {
    // 使用路由 meta 切换布局；默认为 enterprise
    layout() {
      return this.$route.meta && this.$route.meta.layout
        ? this.$route.meta.layout
        : 'enterprise'
    },
    // 不同导航高度下，主内容需要的顶部外边距
    contentTop() {
      // 学生端 StudentNavbar企业端 105px
      return this.layout === 'student' ? '105px' : '105px'
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Microsoft YaHei", sans-serif;
}

body {
  background-color: #f5f5f5;
}

#app {
  min-height: 100vh;
}

/* ===== 企业端导航样式（保留原样） ===== */
.navbar {
  background-color: #2a5e23;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 105px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.logo-section {
  display: flex;
  align-items: center;
}

.logo-image {
  height: 80px;
  margin-right: 40px;
}

.nav-links {
  display: flex;
  list-style: none;
  flex: 1;
  justify-content: center;
}

.nav-links li {
  margin: 0 140px;
}

.nav-links a {
  color: white;
  text-decoration: none;
  font-weight: bold;
  font-size: 28px;
  padding: 8px 12px;
  border-radius: 4px;
  transition: all 0.3s ease;
  cursor: pointer;
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
}

.user-greeting {
  color: white;
  font-size: 20px;
  margin-right: 0px;
}

.user-link {
  color: #cc8e58;
  font-weight: bold;
  text-decoration: none;
  font-size: 20px;
  padding: 6px 10px;
  border-radius: 4px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.user-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #ecdcda;
}

/* 主内容区域：顶部外边距由 contentTop 计算提供 */
.main-content {
  min-height: calc(100vh - 70px);
  /* margin-top 在行内样式里按布局动态设置 */
}

/* 响应式设计（企业端导航时才生效） */
@media (max-width: 768px) {
  .navbar {
    flex-direction: column;
    height: auto;
    padding: 15px;
    position: fixed;
  }

  .logo-section {
    margin-bottom: 15px;
  }

  .nav-links {
    margin-bottom: 15px;
  }

  .nav-links li {
    margin: 0 10px;
  }
}
</style>
