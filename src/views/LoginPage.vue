<template>
  <div class="login-page">
    <!-- 消息提示组件 -->
    <div v-if="showMessage" :class="['message-tip', messageType]">
      {{ messageText }}
    </div>
    
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
      loading: false,
      // 消息提示相关数据
      showMessage: false,
      messageText: '',
      messageType: 'success' // 'success' 或 'error'
    }
  },
  methods: {
    async handleLogin() {
      this.loading = true
      // 先隐藏可能存在的旧消息
      this.showMessage = false
      
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
          
          // 显示成功消息（自动消失）
          this.showMessageTip('登录成功', 'success')
          
          // 延迟跳转，让用户看到成功消息
          setTimeout(() => {
            // 根据用户角色跳转到不同页面
            if (data.data.user_info.role === 'student') {
              this.$router.push('/student-home')
            } else {
              this.$router.push('/enterprise-home')
            }
          }, 1500)
          
        } else {
          // 显示错误消息
          this.showMessageTip(data.message || '登录失败', 'error')
        }
      } catch (error) {
        console.error('登录失败:', error)
        this.showMessageTip('登录失败，请检查网络连接', 'error')
      } finally {
        this.loading = false
      }
    },
    
    // 显示消息提示
    showMessageTip(text, type = 'success') {
      this.messageText = text
      this.messageType = type
      this.showMessage = true
      
      // 3秒后自动隐藏
      setTimeout(() => {
        this.showMessage = false
      }, 3000)
    }
  },
  mounted() {
    // 如果已登录，直接跳转到对应页面
    const token = localStorage.getItem('token')
    const userInfo = localStorage.getItem('userInfo')
    
    if (token && userInfo) {
      const user = JSON.parse(userInfo)
      if (user.role === 'student') {
        this.$router.push('/student-home')
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

/* 消息提示样式 */
.message-tip {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 24px;
  border-radius: 8px;
  color: white;
  font-weight: 500;
  z-index: 9999;
  animation: slideIn 0.3s ease;
  max-width: 80%;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10px); /* 添加毛玻璃效果 */
}

/* 成功消息 - 使用半透明白色背景 + 绿色边框 */
.message-tip.success {
  background: rgba(82, 196, 26, 0.7); /* 原色 90% 透明度 */
}

/* 错误消息 - 使用半透明白色背景 + 红色边框 */
.message-tip.error {
  background: rgba(255, 77, 79, 0.7); /* 原色 90% 透明度 */
}

@keyframes slideIn {
  from {
    transform: translateX(-50%) translateY(-30px);
    opacity: 0;
  }
  to {
    transform: translateX(-50%) translateY(0);
    opacity: 1;
  }
}

/* 响应式调整 */
@media (max-width: 768px) {
  .message-tip {
    top: 10px;
    padding: 10px 16px;
    font-size: 14px;
    max-width: 90%;
  }
  
  .login-box {
    padding: 30px 20px;
    margin: 0 15px;
  }
  
  .login-header h2 {
    font-size: 28px;
  }
}
</style>