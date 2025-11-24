<template>
  <div class="register-page">
    <div class="register-container">
      <div class="register-box">
        <div class="register-header">
          <h2>用户注册</h2>
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

        <form @submit.prevent="handleRegister" class="register-form">
          <div class="form-group">
            <div class="email-input-wrapper">
              <input
                v-model="form.email"
                type="text"  
                :placeholder="userRole === 'student' ? '注册邮箱（仅用户名）' : '注册邮箱（完整邮箱地址）'"
                required
                class="form-input"
                @blur="validateEmail"
              >
              <span v-if="userRole === 'student'" class="email-suffix">@mail2.sysu.edu.cn</span>
            </div>
            <div v-if="emailError" class="error-message">{{ emailError }}</div>
          
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

          <div class="form-group">
            <input
              v-model="form.confirmPassword"
              type="password"
              placeholder="确认密码"
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

          <!-- 修改禁用条件 -->
          <button type="submit" class="register-btn" :disabled="loading || !!emailError">
            {{ loading ? '注册中...' : '注册' }}
          </button>
        </form>

        <div class="register-links">
          <router-link to="/login-page" class="link">已有账号？登录</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RegisterPage',
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
      countdown: 60,
      emailError: ''
    }
  },
  watch: {
    // 监听用户角色变化时清空邮箱错误
    userRole() {
      this.emailError = ''
      this.form.email = '' // 清空邮箱输入
    },
    // 监听邮箱输入变化时实时验证
    'form.email'() {
      this.validateEmail()
    }
  },
  methods: {
    validateEmail() {
      console.log('validateEmail called, email:', this.form.email) // 调试日志
      
      if (!this.form.email.trim()) {
        this.emailError = '邮箱不能为空'
        return
      }

      if (this.userRole === 'student') {
        // 学生邮箱验证：只允许字母、数字、下划线、点号
        const studentEmailRegex = /^[a-zA-Z0-9_.-]+$/
        if (!studentEmailRegex.test(this.form.email)) {
          this.emailError = '学生邮箱只能包含字母、数字、下划线、点号和减号'
        } else {
          this.emailError = '' // 明确设置为空字符串
        }
      } else {
        // 企业邮箱验证：需要完整的邮箱格式
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(this.form.email)) {
          this.emailError = '请输入有效的邮箱地址'
        } else {
          this.emailError = '' // 明确设置为空字符串
        }
      }
      
      console.log('validateEmail result, emailError:', this.emailError) // 调试日志
    },

    async handleRegister() {
      console.log('handleRegister called') // 调试日志
      
      // 先验证邮箱
      this.validateEmail()
      if (this.emailError) {
        this.$message.error(this.emailError)
        return
      }

      if (this.form.password !== this.form.confirmPassword) {
        this.$message.error('两次输入的密码不一致')
        return
      }

      if (!this.form.verificationCode) {
        this.$message.error('请输入验证码')
        return
      }

      this.loading = true
      try {
        // 处理邮箱格式
        let email = this.form.email
        if (this.userRole === 'student') {
          // 学生邮箱自动拼接后缀
          email = email + '@mail2.sysu.edu.cn'
        }

        const response = await fetch('http://localhost:8080/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: email,
            password: this.form.password,
            verification_code: this.form.verificationCode,
            role: this.userRole
          })
        })

        const data = await response.json()

        if (data.code === 201) {
          this.$message.success('注册成功，请登录')
          this.$router.push('/login-page')
        } else {
          this.$message.error(data.message || '注册失败')
        }
      } catch (error) {
        console.error('注册失败:', error)
        this.$message.error('注册失败，请检查网络连接')
      } finally {
        this.loading = false
      }
    },

    sendVerificationCode() {
      // 先验证邮箱格式
      this.validateEmail()
      if (this.emailError) {
        this.$message.error(this.emailError)
        return
      }

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
  },
  mounted() {
    console.log('RegisterPage mounted') // 调试日志
  }
}
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  background: url('@/assets/login_bg.png') no-repeat center center;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
}

.register-container {
  width: 100%;
  max-width: 500px;
  padding: 20px;
}

.register-box {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 40px 30px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.register-header {
  text-align: center;
  margin-bottom: 30px;
}

.register-header h2 {
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

.register-form {
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

.email-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.email-suffix {
  position: absolute;
  right: 15px;
  color: #666;
  font-size: 14px;
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

.register-btn {
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

.register-btn:hover:not(:disabled) {
  background: #1e4a1a;
}

.register-btn:disabled {
  background: #cccccc;
  cursor: not-allowed;
  opacity: 0.6;
}

.register-links {
  text-align: center;
  color: #666;
}

.register-links .link {
  color: #2a5e23;
  text-decoration: none;
}

.register-links .link:hover {
  text-decoration: underline;
}

.error-message {
  color: #d63031;
  font-size: 12px;
  margin-top: 5px;
  text-align: left;
}
</style>