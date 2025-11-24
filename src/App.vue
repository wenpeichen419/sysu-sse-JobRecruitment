<template>
  <div id="app">
    <!-- 学生端导航（根据路由 meta 切换） -->
    <StudentNavbar v-if="layout === 'student'" />

    <!-- 企业端导航（默认） -->
    <nav v-else-if="layout === 'enterprise'" class="navbar">
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
        <router-link to="/enterprise-info" class="user-link">
          {{ companyName }}
        </router-link>
        <button class="logout-btn" @click="handleLogout" title="退出登录">
          <img src="@/assets/退出登录.png" alt="退出登录" class="logout-icon" />
        </button>
      </div>
    </nav>

    <!-- 无导航栏布局（用于登录页面） -->
    <nav v-else-if="layout === 'none'" class="navbar simple-navbar">
      <div class="logo-section">
        <img
          src="@/assets/campus_logo.png"
          alt="中山大学软件工程学院"
          class="logo-image"
        />
        <span class="system-name"> | 求职招聘系统</span>
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
        { path: '/enterprise-home', text: '主页' },
        { path: '/position-manage', text: '岗位管理' },
        { path: '/talent-pool', text: '人才库' }
      ],
      // 添加 companyName 属性
      companyName: '字节跳动' // 默认值
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
      if (this.layout === 'none') return '0px'
      return this.layout === 'student' ? '105px' : '105px'
    }
  },
  methods: {
    // 获取公司信息 - 使用 fetch 并添加鉴权
    async fetchCompanyProfile() {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          console.log('未找到token，跳过获取公司信息')
          return
        }
        
        const response = await fetch('http://localhost:8080/hr/company/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        
        if (data.code === 200 && data.data) {
          this.companyName = data.data.company_name
          console.log('公司名称更新为:', this.companyName)
        }
      } catch (error) {
        console.error('获取公司信息失败:', error)
      }
    },
    
    // 退出登录
    handleLogout() {
      // 清除本地存储的token和用户信息
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
      
      // 跳转到登录页面
      this.$router.push('/login-page')
    }
  },
  mounted() {
    console.log('App mounted, 当前路由:', this.$route.path)
    console.log('当前布局:', this.layout)
    // 如果是企业端布局且有token，才调用接口
    if (this.layout === 'enterprise' && localStorage.getItem('token')) {
      console.log('mounted中调用fetchCompanyProfile')
      this.fetchCompanyProfile()
    }
  },
  watch: {
    // 监听路由变化，当切换到企业端时获取公司信息
    '$route'(to) {
      console.log('路由变化到:', to.path)
      const toLayout = to.meta && to.meta.layout ? to.meta.layout : 'enterprise'
      console.log('新路由布局:', toLayout)
      if (toLayout === 'enterprise' && localStorage.getItem('token')) {
        console.log('路由监听中调用fetchCompanyProfile')
        this.fetchCompanyProfile()
      }
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

.simple-navbar {
  justify-content: flex-start;
}

.system-name {
  color: white;
  font-size: 36px;
  margin-left: 10px;
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
  gap: 15px;
}

.user-greeting {
  color: white;
  font-size: 20px;
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

.logout-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.logout-icon {
  width: 24px;
  height: 24px;
  object-fit: contain;
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