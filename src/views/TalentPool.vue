<template>
  <div class="talent-pool-page">
    <!-- 面包屑导航 -->
    <div class="breadcrumb-wrapper">
      <div class="breadcrumb">
        <span class="breadcrumb-current">人才库</span>
      </div>
    </div>

    <div class="content-wrapper">
      <!-- 筛选区 - 固定位置 -->
      <div class="filter-section fixed-filter">
        <div class="filter-row">
          <div class="filter-item">
            <label>职位名称</label>
            <input 
              type="text" 
              v-model="filters.positionName"
              placeholder="输入查询关键字"
              class="filter-input"
            >
          </div>
          <div class="filter-item">
            <label>招聘目标</label>
            <select v-model="filters.recruitTarget" class="filter-select">
              <option value="">请选择</option>
              <option value="intern">实习生</option>
              <option value="graduate">应届生</option>
            </select>
          </div>
          <button class="search-btn">筛选</button>
        </div>
      </div>

      <!-- 数据表格 -->
      <div class="table-section">
        <div class="table-header">
          <div class="table-col">职位名称</div>
          <div class="table-col">招聘目标</div>
          <div class="table-col">当前投递人数</div>
          <div class="table-col">未审核简历数</div>
        </div>
        <div class="table-body">
          <div 
            v-for="position in positions" 
            :key="position.id"
            class="table-row"
            @click="viewCandidates(position.id)"
          >
            <div class="table-col">{{ position.name }}</div>
            <div class="table-col">{{ position.recruitTargetText }}</div>
            <div class="table-col">{{ position.totalApplications }}人</div>
            <div class="table-col">{{ position.pendingReviews }}份</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TalentPool',
  data() {
    return {
      filters: {
        positionName: '',
        recruitTarget: ''
      },
      positions: [
        {
          id: 1,
          name: '官培士',
          totalApplications: 100,
          pendingReviews: 5,
          recruitTarget: 'graduate',
          recruitTargetText: '应届生'
        },
        {
          id: 2,
          name: '导航算法工程师',
          totalApplications: 85,
          pendingReviews: 12,
          recruitTarget: 'graduate',
          recruitTargetText: '应届生'
        },
        {
          id: 3,
          name: 'SLAM算法工程师',
          totalApplications: 76,
          pendingReviews: 8,
          recruitTarget: 'graduate',
          recruitTargetText: '应届生'
        },
        {
          id: 4,
          name: '运营培训生',
          totalApplications: 234,
          pendingReviews: 45,
          recruitTarget: 'intern',
          recruitTargetText: '实习生'
        },
        {
          id: 5,
          name: '技术培训生',
          totalApplications: 189,
          pendingReviews: 23,
          recruitTarget: 'intern',
          recruitTargetText: '实习生'
        },
        {
          id: 6,
          name: '财务培训生',
          totalApplications: 156,
          pendingReviews: 18,
          recruitTarget: 'intern',
          recruitTargetText: '实习生'
        },
        {
          id: 7,
          name: 'IT工程师',
          totalApplications: 98,
          pendingReviews: 6,
          recruitTarget: 'graduate',
          recruitTargetText: '应届生'
        },
        {
          id: 8,
          name: '设备工程师',
          totalApplications: 67,
          pendingReviews: 4,
          recruitTarget: 'graduate',
          recruitTargetText: '应届生'
        },
        {
          id: 9,
          name: '工艺工程师',
          totalApplications: 89,
          pendingReviews: 7,
          recruitTarget: 'graduate',
          recruitTargetText: '应届生'
        },
        {
          id: 10,
          name: '质量工程师',
          totalApplications: 78,
          pendingReviews: 5,
          recruitTarget: 'graduate',
          recruitTargetText: '应届生'
        },
        {
          id: 11,
          name: '工艺综合工程师',
          totalApplications: 65,
          pendingReviews: 3,
          recruitTarget: 'graduate',
          recruitTargetText: '应届生'
        },
        {
          id: 12,
          name: '技术研发工程师',
          totalApplications: 112,
          pendingReviews: 15,
          recruitTarget: 'graduate',
          recruitTargetText: '应届生'
        },
        {
          id: 13,
          name: '产品开发助理',
          totalApplications: 145,
          pendingReviews: 22,
          recruitTarget: 'intern',
          recruitTargetText: '实习生'
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
}

.breadcrumb-wrapper {
  position: fixed;
  top: 105px;
  left: 0;
  width: 100%;
  background: #f4f4f4;
  padding: 20px 30px;
  z-index: 1000;
  height: 115px;
}

.breadcrumb {
  background: white;
  padding: 20px 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  font-size: 20px;
  box-sizing: border-box;
  width: 97.3%;
  position: fixed;
  top: 130px;
}

.breadcrumb-current {
  color: #666;
}

.content-wrapper {
  padding-top: 85px;
}

/* 筛选区样式 */
.fixed-filter {
  background: white;
  padding: 25px 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  position: sticky;
  top: 220px;
  z-index: 999;
}

.filter-row {
  display: flex;
  align-items: center;
  gap: 120px;
  flex-wrap: wrap;
  margin-left: 450px;
}

.filter-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 20px;
}

.filter-item label {
  font-size: 22px;
  color: #333;
  font-weight: 500;
}

.filter-input, .filter-select {
  padding: 10px 12px;
  border: 1px solid #d8d8d8;
  border-radius: 6px;
  font-size: 22px;
  min-width: 150px;
}

.filter-input:focus, .filter-select:focus {
  outline: none;
  border-color: #325e21;
}

.search-btn {
  background: #325e21;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 22px;
  transition: background-color 0.3s ease;
  align-self: center;
  margin-left:100px;
}

.search-btn:hover {
  background: #2a4e1b;
}

/* 表格样式 */
.table-section {
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.table-header {
  display: flex;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.table-header .table-col {
  font-size: 26px !important; /* 表头字体调大 */
  font-weight: bold;
  color: #2a5e23;
}

.table-row {
  display: flex;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.table-row:hover {
  background: #f8f9fa;
}

.table-row:last-child {
  border-bottom: none;
}

.table-col {
  flex: 1;
  padding: 20px;
  text-align: left;
  font-size:22px;
  text-align: center;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .filter-row {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-input, .filter-select {
    min-width: auto;
  }
  
  .table-header, .table-row {
    flex-direction: column;
  }
  
  .table-col {
    padding: 12px 20px;
  }
}
</style>