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
          <img v-if="candidate.avatar" :src="candidate.avatar" alt="头像">
          <div v-else class="sidebar-avatar-placeholder">
            {{ candidate.name.charAt(0) }}
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
  methods: {
    viewCandidateResume(candidate) {
      this.$emit('candidate-selected', candidate)
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

.sidebar-avatar-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #325e21, #4a7c2f);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
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