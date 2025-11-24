<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-box">
        <div class="login-header">
          <h2>用户登录</h2>
        </div>
        
        <div class="role-tabs">
          <button 
            :class="['tab-btn', { active: userRole === 'student' }]"
            @click="userRole = 'student'"
          >
            学生
          </button>
          <button 
            :class="['tab-btn', { active: userRole === 'hr' }]"
            @click="userRole = 'hr'"
          >
            企业
          </button>
        </div>

        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <input
              v-model="form.email"
              type="email"
              placeholder="注册邮箱"
              required
              class="form-input"
            >
          </div>

          <div class="form-group">
            <input
              v-model="form.password"
              type="password"
              placeholder="密码"
              required
              class="form-input"
            >
          </div>

          <button type="submit" class="login-btn" :disabled="loading">
            {{ loading ? '登录中...' : '登录' }}
          </button>
        </form>

        <div class="login-links">
          <router-link to="/forgot-password" class="link">忘记密码？</router-link>
          <span> | </span>
          <router-link to="/register-page" class="link">去注册</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginPage',
  data() {
    return {
      userRole: 'student', // student or hr
      form: {
        email: '',
        password: ''
      },
      loading: false
    }
  },
  methods: {
    async handleLogin() {
      this.loading = true
      try {
        const response = await fetch('http://localhost:8080/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: this.form.email,
            password: this.form.password
          })
        })

        const data = await response.json()

        if (data.code === 200) {
          // 保存token和用户信息
          localStorage.setItem('token', data.data.token)
          localStorage.setItem('userInfo', JSON.stringify(data.data.user_info))
          
          // 根据用户角色跳转到不同页面
          if (data.data.user_info.role === 'student') {
            this.$router.push('/')
          } else {
            this.$router.push('/enterprise-home')
          }
          
          this.$message.success('登录成功')
        } else {
          this.$message.error(data.message || '登录失败')
        }
      } catch (error) {
        console.error('登录失败:', error)
        this.$message.error('登录失败，请检查网络连接')
      } finally {
        this.loading = false
      }
    }
  },
  mounted() {
    // 如果已登录，直接跳转到对应页面
    const token = localStorage.getItem('token')
    const userInfo = localStorage.getItem('userInfo')
    
    if (token && userInfo) {
      const user = JSON.parse(userInfo)
      if (user.role === 'student') {
        this.$router.push('/')
      } else {
        this.$router.push('/enterprise-home')
      }
    }
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: url('@/assets/login_bg.png') no-repeat center center;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-container {
  width: 100%;
  max-width: 500px;
  padding: 20px;
}

.login-box {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 40px 30px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header h2 {
  color: #2a5e23;
  font-size: 32px;
  font-weight: bold;
}

.role-tabs {
  display: flex;
  margin-bottom: 30px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 8px;
  padding: 4px;
}

.tab-btn {
  flex: 1;
  padding: 12px;
  border: none;
  background: transparent;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.tab-btn.active {
  background: #2a5e23;
  color: white;
}

.login-form {
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-input {
  width: 100%;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  background: rgba(255, 255, 255, 0.8);
  transition: border-color 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #2a5e23;
}

.login-btn {
  width: 100%;
  padding: 15px;
  background: #2a5e23;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s ease;
}

.login-btn:hover:not(:disabled) {
  background: #1e4a1a;
}

.login-btn:disabled {
  background: #cccccc;
  cursor: not-allowed;
}

.login-links {
  text-align: center;
  color: #666;
}

.login-links .link {
  color: #2a5e23;
  text-decoration: none;
  margin: 0 5px;
}

.login-links .link:hover {
  text-decoration: underline;
}
</style>