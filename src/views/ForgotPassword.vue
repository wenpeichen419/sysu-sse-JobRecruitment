<template>
  <div class="forgot-password-page">
    <div class="forgot-password-container">
      <div class="forgot-password-box">
        <div class="forgot-password-header">
          <h2>找回密码</h2>
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

        <form @submit.prevent="handleResetPassword" class="forgot-password-form">
          <div class="form-group">
            <input
              v-model="form.email"
              type="email"
              :placeholder="userRole === 'student' ? '注册邮箱' : '注册邮箱（完整邮箱地址）'"
              required
              class="form-input"
            >
          </div>

          <div class="form-group">
            <input
              v-model="form.password"
              type="password"
              placeholder="新密码"
              required
              class="form-input"
            >
          </div>

          <div class="form-group">
            <input
              v-model="form.confirmPassword"
              type="password"
              placeholder="确认新密码"
              required
              class="form-input"
            >
          </div>

          <div class="form-group">
            <div class="verification-code-wrapper">
              <input
                v-model="form.verificationCode"
                type="text"
                placeholder="验证码"
                required
                class="form-input code-input"
              >
              <button 
                type="button" 
                class="send-code-btn"
                @click="sendVerificationCode"
                :disabled="codeSent"
              >
                {{ codeSent ? `${countdown}s后重新发送` : '发送验证码' }}
              </button>
            </div>
          </div>

          <button type="submit" class="reset-btn" :disabled="loading">
            {{ loading ? '重置中...' : '重置密码' }}
          </button>
        </form>

        <div class="forgot-password-links">
          <router-link to="/login-page" class="link">去登录</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ForgotPassword',
  data() {
    return {
      userRole: 'student', // student or hr
      form: {
        email: '',
        password: '',
        confirmPassword: '',
        verificationCode: ''
      },
      loading: false,
      codeSent: false,
      countdown: 60
    }
  },
  methods: {
    async handleResetPassword() {
      if (this.form.password !== this.form.confirmPassword) {
        this.$message.error('两次输入的密码不一致')
        return
      }

      this.loading = true
      try {
        // 处理邮箱格式
        let email = this.form.email
        if (this.userRole === 'student') {
          // 学生邮箱自动拼接后缀
          if (!email.includes('@')) {
            email = email + '@mail2.sysu.edu.cn'
          }
        }

        const response = await fetch('http://localhost:8080/auth/reset', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: email,
            password: this.form.password,
            verification_code: this.form.verificationCode
          })
        })

        const data = await response.json()

        if (data.code === 200) {
          this.$message.success('密码重置成功，请登录')
          this.$router.push('/login')
        } else {
          this.$message.error(data.message || '密码重置失败')
        }
      } catch (error) {
        console.error('密码重置失败:', error)
        this.$message.error('密码重置失败，请检查网络连接')
      } finally {
        this.loading = false
      }
    },

    sendVerificationCode() {
      // 模拟发送验证码
      this.codeSent = true
      this.startCountdown()
      this.$message.success('验证码已发送（模拟）')
    },

    startCountdown() {
      const timer = setInterval(() => {
        this.countdown--
        if (this.countdown <= 0) {
          clearInterval(timer)
          this.codeSent = false
          this.countdown = 60
        }
      }, 1000)
    }
  }
}
</script>

<style scoped>
.forgot-password-page {
  min-height: 100vh;
  background: url('@/assets/login_bg.png') no-repeat center center;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
}

.forgot-password-container {
  width: 100%;
  max-width: 500px;
  padding: 20px;
}

.forgot-password-box {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 40px 30px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.forgot-password-header {
  text-align: center;
  margin-bottom: 30px;
}

.forgot-password-header h2 {
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

.forgot-password-form {
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

.verification-code-wrapper {
  display: flex;
  gap: 10px;
}

.code-input {
  flex: 1;
}

.send-code-btn {
  padding: 15px 20px;
  background: #2a5e23;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  white-space: nowrap;
  transition: background 0.3s ease;
}

.send-code-btn:hover:not(:disabled) {
  background: #1e4a1a;
}

.send-code-btn:disabled {
  background: #cccccc;
  cursor: not-allowed;
}

.reset-btn {
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

.reset-btn:hover:not(:disabled) {
  background: #1e4a1a;
}

.reset-btn:disabled {
  background: #cccccc;
  cursor: not-allowed;
}

.forgot-password-links {
  text-align: center;
  color: #666;
}

.forgot-password-links .link {
  color: #2a5e23;
  text-decoration: none;
}

.forgot-password-links .link:hover {
  text-decoration: underline;
}
</style>