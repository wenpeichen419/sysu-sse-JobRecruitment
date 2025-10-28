<template>
  <div class="talent-pool-page">
    <div class="page-header">
      <h1>人才库</h1>
      <div class="user-info">您好，字节跳动</div>
    </div>

    <div class="positions-table">
      <div class="table-header">
        <div class="header-item">职位名称</div>
        <div class="header-item">当前投递人数</div>
        <div class="header-item">未审核简历数</div>
      </div>

      <div 
        v-for="position in positions" 
        :key="position.id"
        class="table-row"
        @click="viewCandidates(position.id)"
      >
        <div class="row-item position-name">{{ position.name }}</div>
        <div class="row-item">{{ position.totalApplications }}人</div>
        <div class="row-item">{{ position.pendingReviews }}份</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TalentPool',
  data() {
    return {
      positions: [
        {
          id: 1,
          name: '官培士',
          totalApplications: 100,
          pendingReviews: 5
        },
        {
          id: 2,
          name: '导航算法工程师',
          totalApplications: 85,
          pendingReviews: 12
        },
        {
          id: 3,
          name: 'SLAM算法工程师',
          totalApplications: 76,
          pendingReviews: 8
        },
        {
          id: 4,
          name: '运营培训生',
          totalApplications: 234,
          pendingReviews: 45
        },
        {
          id: 5,
          name: '技术培训生',
          totalApplications: 189,
          pendingReviews: 23
        },
        {
          id: 6,
          name: '财务培训生',
          totalApplications: 156,
          pendingReviews: 18
        },
        {
          id: 7,
          name: 'IT工程师',
          totalApplications: 98,
          pendingReviews: 6
        },
        {
          id: 8,
          name: '设备工程师',
          totalApplications: 67,
          pendingReviews: 4
        },
        {
          id: 9,
          name: '工艺工程师',
          totalApplications: 89,
          pendingReviews: 7
        },
        {
          id: 10,
          name: '质量工程师',
          totalApplications: 78,
          pendingReviews: 5
        },
        {
          id: 11,
          name: '工艺综合工程师',
          totalApplications: 65,
          pendingReviews: 3
        },
        {
          id: 12,
          name: '技术研发工程师',
          totalApplications: 112,
          pendingReviews: 15
        },
        {
          id: 13,
          name: '产品开发助理',
          totalApplications: 145,
          pendingReviews: 22
        }
      ]
    }
  },
  methods: {
    viewCandidates(positionId) {
      this.$router.push(`/candidates/${positionId}`)
    }
  }
}
</script>

<style scoped>
.talent-pool-page {
  padding: 30px;
  background: #f5f5f5;
  min-height: calc(100vh - 105px);
  max-width: 1600px; /* 修改这个值来调整宽度 */
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  background: white;
  padding: 20px 30px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  /* 确保header也适应新宽度 */
  width: 100%;
}

.page-header h1 {
  color: #325e21;
  margin: 0;
  font-size: 32px;
}

.user-info {
  color: #666;
  font-size: 18px;
}

.positions-table {
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.table-header {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  background: #325e21;
  color: white;
  padding: 20px 30px;
  font-weight: bold;
  font-size: 26px;
  text-align: center;
}

.table-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  padding: 30px 30px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  transition: background-color 0.3s ease;
  text-align: center;
}

.table-row:hover {
  background-color: #f8f9fa;
}

.table-row:last-child {
  border-bottom: none;
}

.row-item {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
}

.position-name {
  color: #325e21;
  font-weight: bold;
  font-size: 22px;
  justify-content: center;
}

.header-item, .row-item {
  padding: 0 10px;
}
</style>