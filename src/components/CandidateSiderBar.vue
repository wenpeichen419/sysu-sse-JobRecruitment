<template>
  <div class="candidate-sidebar">
    <div class="sidebar-header">
      <h3>候选名单</h3>
      <p>待决定面试通知</p>
    </div>
    <div class="sidebar-content">
      <div 
        v-for="candidate in candidates" 
        :key="candidate.id"
        class="sidebar-candidate"
        @click="viewCandidateResume(candidate)"
        :class="{ active: activeCandidateId === candidate.id }"
      >
        <div class="sidebar-avatar">
          <img 
            v-if="getSidebarAvatar(candidate)" 
            :src="getSidebarAvatar(candidate)" 
            :alt="candidate.name + '的头像'"
            @error="handleAvatarError($event, candidate)"
          >
          <div v-else class="sidebar-avatar-placeholder">
            {{ getFormattedName(candidate.name) }}
          </div>
        </div>
        <span class="sidebar-name">{{ candidate.name }}</span>
      </div>
      <div v-if="candidates.length === 0" class="empty-state">
        暂无候选人员
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CandidateSidebar',
  props: {
    candidates: {
      type: Array,
      default: () => []
    },
    activeCandidateId: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      sidebarAvatars: {} // 存储侧边栏头像
    }
  },
  watch: {
    candidates: {
      immediate: true,
      handler(newCandidates) {
        // 当候选人列表变化时，加载头像
        newCandidates.forEach(candidate => {
          if (candidate.avatar) {
            this.fetchSidebarAvatar(candidate);
          }
        });
      }
    }
  },
  methods: {
    viewCandidateResume(candidate) {
      this.$emit('candidate-selected', candidate)
    },
    
    // 新增：获取名字显示逻辑（优先后两个字）
    getFormattedName(name) {
      if (!name) return '?';
      const trimmedName = name.trim();
      // 如果名字小于等于2个字，直接显示全名；否则截取最后两个字
      return trimmedName.length <= 2 
        ? trimmedName 
        : trimmedName.substring(trimmedName.length - 2);
    },

    // 获取侧边栏候选人头像
    async fetchSidebarAvatar(candidate) {
      if (!candidate.avatar) return;
      
      try {
        const token = localStorage.getItem('token')
        
        let avatarUrl = candidate.avatar;
        if (avatarUrl.startsWith('/')) {
          avatarUrl = `http://localhost:8080${avatarUrl}`;
        }
        
        // 强制使用8080端口
        avatarUrl = avatarUrl.replace('localhost:5306', 'localhost:8080');
        avatarUrl = avatarUrl.replace(':5306/', ':8080/');
        
        console.log('侧边栏请求头像URL:', avatarUrl);
        
        const response = await fetch(avatarUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
        
        if (response.ok) {
          const blob = await response.blob();
          const avatarBlobUrl = URL.createObjectURL(blob);
          this.sidebarAvatars[candidate.id] = avatarBlobUrl;
          // 强制更新视图
          this.$forceUpdate();
        } else {
          console.error('获取侧边栏头像失败，状态码:', response.status);
        }
      } catch (error) {
        console.error('获取侧边栏头像失败:', error);
      }
    },

    // 获取侧边栏头像URL
    getSidebarAvatar(candidate) {
      if (this.sidebarAvatars[candidate.id]) {
        return this.sidebarAvatars[candidate.id];
      }
      return null; // 返回null显示占位符
    },

    // 头像加载失败处理
    handleAvatarError(event, candidate) {
      console.log('侧边栏头像加载失败，显示占位符');
      // 清空该候选人的头像缓存，让 v-else 生效
      this.sidebarAvatars[candidate.id] = null;
      this.$forceUpdate();
    }
  }
}
</script>

<style scoped>
.candidate-sidebar {
  width: 320px;
  height: 100vh;
  background: white;
  border-right: 1px solid #e9ecef;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 105px;
  z-index: 100;
}

.sidebar-header {
  padding: 25px 20px;
  border-bottom: 1px solid #e9ecef;
  background: #f8f9fa;
}

.sidebar-header h3 {
  margin: 0 0 5px 0;
  color: #325e21;
  font-size: 24px;
}

.sidebar-header p {
  margin: 0;
  color: #666;
  font-size: 18px;
}

.sidebar-content {
  flex: 1;
  overflow-y: auto;
  padding: 15px 0;
}

.sidebar-candidate {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-left: 3px solid transparent;
}

.sidebar-candidate:hover {
  background: #f8f9fa;
}

.sidebar-candidate.active {
  background: #f0f7ed;
  border-left-color: #325e21;
}

.sidebar-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 12px;
  flex-shrink: 0;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e9ecef;
}

.sidebar-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 修改点：优化文字显示样式 */
.sidebar-avatar-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #325e21, #4a7c2f);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px; /* 侧边栏较窄，调小字号显示两个字 */
  font-weight: bold;
}

.sidebar-name {
  color: #333;
  font-size: 18px;
  font-weight: 500;
}

.empty-state {
  text-align: center;
  color: #666;
  padding: 40px 20px;
  font-size: 14px;
}
</style>