<template>
  <div class="position-manage-page">
    <!-- 面包屑导航 -->
    <div class="breadcrumb-wrapper">
      <div class="breadcrumb">
        <span class="breadcrumb-current">岗位管理</span>
      </div>
    </div>

    <div class="content-wrapper">
      <!-- 筛选区 - 固定位置 -->
      <div class="filter-section fixed-filter">
        <div class="filter-row">
          <div class="filter-item">
            <label>岗位名</label>
            <input 
              type="text" 
              v-model="filters.positionName"
              placeholder="输入查询关键字"
              class="filter-input"
            >
          </div>
          <div class="filter-item">
            <label>发布状态</label>
            <select v-model="filters.publishStatus" class="filter-select">
              <option value="">请选择</option>
              <option value="published">已发布</option>
              <option value="draft">草稿</option>
              <option value="closed">已下线</option>
            </select>
          </div>
          <div class="filter-item">
            <label>职能类别</label>
            <select v-model="filters.functionCategory" class="filter-select">
              <option value="">请选择</option>
              <option value="algorithm">算法</option>
              <option value="development">开发</option>
              <option value="product">产品</option>
              <option value="operation">运营</option>
            </select>
          </div>
          <button class="search-btn">搜索</button>
          <button class="publish-btn" @click="goToPostMethod">+ 发布新岗</button>
        </div>
      </div>

      <!-- 数据表格 -->
      <div class="table-section">
        <div class="table-header">
          <div class="table-col">职位名称</div>
          <div class="table-col">发布状态</div>
          <div class="table-col">最近修改日期</div>
        </div>
        <div class="table-body">
          <div 
            v-for="position in positions" 
            :key="position.id"
            class="table-row"
            @click="goToPositionDetail(position.id)"
          >
            <div class="table-col">{{ position.title }}</div>
            <div class="table-col">
              <span :class="['status-tag', position.status]">
                {{ position.statusText }}
              </span>
            </div>
            <div class="table-col">{{ position.updateDate }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PositionManage',
  data() {
    return {
      filters: {
        positionName: '',
        publishStatus: '',
        functionCategory: ''
      },
      positions: [
        {
          id: 1,
          title: '导航算法工程师',
          status: 'published',
          statusText: '已发布',
          updateDate: '2025-10-09'
        },
        {
          id: 2,
          title: '管培生',
          status: 'published',
          statusText: '已发布',
          updateDate: '2025-10-09'
        },
        {
          id: 3,
          title: 'SLAM算法工程师',
          status: 'published',
          statusText: '已发布',
          updateDate: '2025-10-09'
        },
        {
          id: 4,
          title: '运营培训生',
          status: 'draft',
          statusText: '草稿',
          updateDate: '2025-10-09'
        },
         {
          id: 5,
          title: '下线功能测试',
          status: 'closed',
          statusText: '已下线',
          updateDate: '2025-10-09'
        },
         {
          id: 6,
          title: '运营培训生',
          status: 'draft',
          statusText: '草稿',
          updateDate: '2025-10-09'
        },
         {
          id: 7,
          title: '运营培训生',
          status: 'draft',
          statusText: '草稿',
          updateDate: '2025-10-09'
        },
         {
          id: 8,
          title: '运营培训生',
          status: 'draft',
          statusText: '草稿',
          updateDate: '2025-10-09'
        },
         {
          id: 9,
          title: '运营培训生',
          status: 'draft',
          statusText: '草稿',
          updateDate: '2025-10-09'
        },
          {
          id: 10,
          title: '运营培训生',
          status: 'draft',
          statusText: '草稿',
          updateDate: '2025-10-09'
        },
          {
          id: 11,
          title: '运营培训生',
          status: 'draft',
          statusText: '草稿',
          updateDate: '2025-10-09'
        },
          {
          id: 12,
          title: '运营培训生',
          status: 'draft',
          statusText: '草稿',
          updateDate: '2025-10-09'
        },
          {
          id: 13,
          title: '运营培训生',
          status: 'draft',
          statusText: '草稿',
          updateDate: '2025-10-09'
        },
        {
          id: 14,
          title: '运营培训生',
          status: 'draft',
          statusText: '草稿',
          updateDate: '2025-10-09'
        }
      ]
    }
  },
  methods: {
    goToPositionDetail(positionId) {
      this.$router.push(`/position-detail/${positionId}`)
    },
    goToPostMethod() {
      // 跳转到发布模式选择页面
      this.$router.push('/post-method-choice')
    }
  }
}
</script>

<style scoped>
.position-manage-page {
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
  top:130px;
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
  margin-left:330px;
}

.filter-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 20px;
}

.filter-item label {
  font-size: 20px;
  color: #333;
  font-weight: 500;
}

.filter-input, .filter-select {
  padding: 10px 12px;
  border: 1px solid #d8d8d8;
  border-radius: 6px;
  font-size: 20px;
  min-width: 150px;
}

.filter-input:focus, .filter-select:focus {
  outline: none;
  border-color: #325e21;
}

.search-btn, .publish-btn {
  background: #325e21;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 20px;
  transition: background-color 0.3s ease;
  align-self: center;
}

.search-btn:hover, .publish-btn:hover {
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
  font-weight: bold;
  color: #333;
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
  font-size: 22px;
  text-align: center; 
}

.status-tag {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 20px;
  font-weight: bold;
}

.status-tag.published {
  background: #e8f5e8;
  color: #2e7d32;
}

.status-tag.draft {
  background: #fff3e0;
  color: #ef6c00;
}

.status-tag.closed {
  background: #fee3e3;
  color: #fc1e1e;
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