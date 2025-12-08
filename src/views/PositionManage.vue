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
              @input="handleSearch"
            >
          </div>
          <div class="filter-item">
            <label>发布状态</label>
            <select v-model="filters.publishStatus" class="filter-select" @change="handleSearch">
              <option value="">请选择</option>
              <option value="draft">草稿</option>
              <option value="pending">审核中</option>
              <option value="approved">已发布</option>
              <option value="rejected">审核未通过</option>
              <option value="closed">已下线</option>
            </select>
          </div>
          <button class="search-btn" @click="handleSearch">搜索</button>
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
            :key="position.job_id"
            class="table-row"
            @click="goToPositionDetail(position.job_id)"
          >
            <div class="table-col">{{ position.title }}</div>
            <div class="table-col">
              <span :class="['status-tag', position.status]">
                {{ getStatusText(position.status) }}
              </span>
              <span 
                v-if="position.status === 'rejected'" 
                class="audit-detail-link"
                @click.stop="showAuditDetail(position.job_id)"
              >
                >>查看审核详情
              </span>
            </div>
            <div class="table-col">{{ formatDate(position.updated_at) }}</div>
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <div class="pagination" v-if="totalPages > 1">
        <span class="page-info">共 {{ totalItems }} 条数据</span>
        
        <div class="page-controls">
          <button 
            class="page-btn" 
            :class="{ active: currentPage === 1 }"
            @click="changePage(1)"
          >1</button>
          
          <button 
            v-for="page in middlePages" 
            :key="page"
            class="page-btn"
            :class="{ active: currentPage === page }"
            @click="changePage(page)"
          >{{ page }}</button>

          <span v-if="showEllipsis" class="ellipsis">...</span>
          
          <button 
            class="page-btn"
            :class="{ active: currentPage === totalPages }"
            @click="changePage(totalPages)"
          >{{ totalPages }}</button>

          <button 
            class="page-next" 
            :disabled="currentPage >= totalPages"
            @click="changePage(currentPage + 1)"
          >›</button>
        </div>
      </div>
    </div>

        <!-- 审核详情弹窗 -->
    <div v-if="showAuditModal" class="modal-overlay" @click="closeAuditModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <div class="header-title">
            <span class="reject-icon">❌</span>
            <h3>审核拒绝</h3>
          </div>
          <button class="modal-close" @click="closeAuditModal">×</button>
        </div>
        <div class="modal-body">
          <div class="audit-detail-table">
            <!-- 审核人联系方式行 -->
            <div class="table-row">
              <div class="table-cell label-cell">
                <span class="label-text">审核人联系方式</span>
              </div>
              <div class="table-cell value-cell">
                <span class="value-text">{{ auditDetail.operator_contact || '暂无联系方式' }}</span>
              </div>
            </div>
            
            <!-- 审核时间行 -->
            <div class="table-row">
              <div class="table-cell label-cell">
                <span class="label-text">审核时间</span>
              </div>
              <div class="table-cell value-cell time-cell">
                <span class="value-text">{{ auditDetail.audit_time || '暂无时间' }}</span>
              </div>
            </div>
            
            <!-- 拒绝原因行 - 自适应高度 -->
            <div class="table-row reason-row">
              <div class="table-cell label-cell">
                <span class="label-text">审核备注/拒绝原因</span>
              </div>
              <div class="table-cell value-cell reason-cell">
                <div class="reason-content">{{ auditDetail.remark || '暂无原因' }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="modal-confirm-btn" @click="closeAuditModal">确认</button>
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
        publishStatus: ''
      },
      positions: [],
      // 分页相关
      currentPage: 1,
      pageSize: 10,
      totalItems: 0,
      totalPages: 0,
      loading: false,
      // 审核详情相关
      showAuditModal: false,
      auditDetail: {
        remark: '',
        audit_time: '',
        operator_contact: ''
      }
    }
  },
  computed: {
    // 中间的页码
    middlePages() {
      const pages = []
      const start = Math.max(2, this.currentPage - 1)
      const end = Math.min(this.totalPages - 1, this.currentPage + 1)
      
      for (let i = start; i <= end; i++) {
        if (i !== 1 && i !== this.totalPages) {
          pages.push(i)
        }
      }
      return pages
    },

    // 是否显示省略号
    showEllipsis() {
      return this.totalPages > 5 && this.currentPage < this.totalPages - 2
    }
  },
  mounted() {
    this.fetchPositions()
  },
  methods: {
    async fetchPositions() {
      if (this.loading) return;
      
      this.loading = true;
      try {
        const token = localStorage.getItem('token')
        
        // 构建查询参数 - 使用正确的参数名
        const params = new URLSearchParams({
          page: this.currentPage,
          pageSize: this.pageSize
        });

        // 添加搜索条件
        if (this.filters.positionName) {
          params.append('titleKeyword', this.filters.positionName);
        }
        if (this.filters.publishStatus) {
          params.append('status', this.filters.publishStatus);
        }

        console.log('请求参数:', params.toString());

        const response = await fetch(`http://localhost:8080/api/hr/jobs?${params}`, {
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
        console.log('接口返回数据:', data);
        
        if (data.code === 200 && data.data) {
          this.positions = data.data.job_list || []
          this.totalItems = data.data.pagination?.total_items || 0
          this.totalPages = data.data.pagination?.total_pages || 0
          this.currentPage = data.data.pagination?.current_page || 1
        } else {
          console.error('接口返回错误:', data.message)
        }
      } catch (error) {
        console.error('获取岗位列表失败:', error)
        // 可以添加用户提示
      } finally {
        this.loading = false;
      }
    },

    async showAuditDetail(jobId) {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch(`http://localhost:8080/api/hr/jobs/audit/${jobId}`, {
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
        console.log('审核详情接口返回:', data)
        
        if (data.code === 200 && data.data) {
          // 使用正确的字段映射
          this.auditDetail = {
            remark: data.data.remark,
            audit_time: data.data.audit_time,
            operator_contact: data.data.operator_contact || data.data.audit_phone // 兼容两种字段名
          }
          console.log('审核详情数据:', this.auditDetail)
          this.showAuditModal = true
        } else {
          console.error('获取审核详情失败:', data.message)
          // 可以添加错误提示
          this.auditDetail = {
            remark: '获取详情失败',
            audit_time: '',
            operator_contact: ''
          }
          this.showAuditModal = true
        }
      } catch (error) {
        console.error('获取审核详情失败:', error)
        this.auditDetail = {
          remark: '请求失败，请稍后重试',
          audit_time: '',
          operator_contact: ''
        }
        this.showAuditModal = true
      }
    },

    closeAuditModal() {
      this.showAuditModal = false
      this.auditDetail = {
        remark: '',
        audit_time: '',
        operator_contact: ''
      }
    },

    getStatusText(status) {
      const statusMap = {
        'draft': '草稿',
        'pending': '审核中',
        'approved': '已发布',
        'rejected': '审核未通过',
        'closed': '已下线'
      }
      return statusMap[status] || status
    },

    formatDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleDateString('zh-CN')
    },

    handleSearch() {
      console.log('开始搜索，关键词:', this.filters.positionName, '状态:', this.filters.publishStatus);
      this.currentPage = 1
      this.fetchPositions()
    },

    goToPositionDetail(positionId) {
      this.$router.push(`/position-detail/${positionId}`)
    },

    goToPostMethod() {
      this.$router.push('/post-method-choice')
    },

    // 切换页码
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page
        this.fetchPositions()
        // 滚动到顶部
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
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
  margin-left:450px;
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
  margin-bottom: 20px;
}

.table-header {
  display: flex;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  font-size: 28px;
  font-weight: bold;
  color: #333;
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
  font-size: 22px;
  text-align: center; 
  position: relative; /* 添加相对定位 */
}

/* 状态标签样式 - 保持原来的位置 */
.status-tag {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 20px;
  font-weight: bold;
  display: inline-block;
  /* 这里不再添加任何影响位置的样式 */
}

.status-tag.draft {
  background: #fff3e0;
  color: #ef6c00;
}

.status-tag.pending {
  background: #e3f2fd;
  color: #1976d2;
}

.status-tag.approved {
  background: #e8f5e8;
  color: #2e7d32;
}

.status-tag.rejected {
  background: #ffebee;
  color: #c62828;
}

.status-tag.closed {
  background: #f5f5f5;
  color: #757575;
}

/* 审核详情链接样式 - 使用绝对定位放在状态标签的右边 */
.audit-detail-link {
  color: #c62828 !important; /* 红色 */
  font-size: 18px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  text-decoration: none !important; /* 默认无下划线 */
  position: absolute; /* 绝对定位 */
  left: calc(50% + 70px); /* 从中心位置向右偏移50px */
  top: 50%; /* 垂直居中 */
  transform: translateY(-50%); /* 精确垂直居中 */
  white-space: nowrap; /* 防止换行 */
}

.audit-detail-link:hover {
  text-decoration: underline !important; /* hover时显示下划线 */
  color: #a71c1c !important; /* 鼠标悬浮时颜色变深 */
}

/* 弹窗样式 - 按照图片设计，简化版 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 600px;
  max-width: 90%;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  animation: modalFadeIn 0.3s ease;
  display: flex;
  flex-direction: column;
  max-height: 90vh;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.modal-header {
  background: #ffebee;
  padding: 20px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #ffcdd2;
  flex-shrink: 0;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.reject-icon {
  font-size: 24px;
}

.modal-header h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #c62828;
}

.modal-close {
  background: none;
  border: none;
  color: #c62828;
  font-size: 28px;
  cursor: pointer;
  line-height: 1;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s;
}

.modal-close:hover {
  background: rgba(198, 40, 40, 0.1);
}

.modal-body {
  padding: 24px;
  flex: 1;
  overflow-y: auto;
  min-height: 200px;
}

/* 表格样式 - 简化版 */
.audit-detail-table {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}

.table-row {
  display: flex;
  border-bottom: 1px solid #e0e0e0;
  min-height: 56px;
}

.table-row:last-child {
  border-bottom: none;
}

.table-cell {
  padding: 16px 20px;
  display: flex;
  align-items: flex-start;
}

.label-cell {
  background: #f5f5f5;
  width: 160px;
  min-width: 160px;
  border-right: 1px solid #e0e0e0;
  font-weight: 500;
  color: #333;
}

.value-cell {
  flex: 1;
  background: white;
  color: #666;
}

.label-text {
  font-size: 16px;
  font-weight: 500;
}

.value-text {
  font-size: 16px;
}

/* 特殊单元格样式 */
.time-cell {
  color: #1976d2;
  font-weight: 500;
}

/* 拒绝原因行 - 自适应高度 */
.reason-row {
  min-height: 120px;
}

.reason-cell {
  background: #fff;
  min-height: 100px;
  padding: 20px;
}

.reason-content {
  font-size: 16px;
  line-height: 1.6;
  color: #333;
  white-space: pre-wrap;
  word-break: break-word;
  width: 100%;
}

/* 弹窗主体内容自定义滚动条 */
.modal-body::-webkit-scrollbar {
  width: 8px;
}

.modal-body::-webkit-scrollbar-track {
  background: #f5f5f5;
  border-radius: 4px;
}

.modal-body::-webkit-scrollbar-thumb {
  background: #c62828;
  border-radius: 4px;
}

.modal-body::-webkit-scrollbar-thumb:hover {
  background: #b71c1c;
}

.modal-footer {
  padding: 20px 24px;
  border-top: 1px solid #e0e0e0;
  text-align: right;
  background: #fafafa;
  flex-shrink: 0;
}

.modal-confirm-btn {
  background: #c62828;
  color: white;
  border: none;
  padding: 10px 32px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.modal-confirm-btn:hover {
  background: #b71c1c;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(198, 40, 40, 0.2);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .modal-content {
    width: 95%;
  }
  
  .table-row {
    flex-direction: column;
    min-height: auto;
  }
  
  .label-cell {
    width: 100%;
    min-width: 100%;
    border-right: none;
    border-bottom: 1px solid #e0e0e0;
  }
  
  .value-cell {
    width: 100%;
  }
  
  .modal-header,
  .modal-body,
  .modal-footer {
    padding: 16px 20px;
  }
  
  .table-cell {
    padding: 12px 16px;
  }
  
  .reason-row {
    min-height: auto;
  }
  
  .reason-cell {
    min-height: 80px;
    padding: 16px;
  }
}

/* 分页样式 - 从JobCenter复制 */
.pagination {
  background: white;
  padding: 25px 35px;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.page-info {
  font-size: 18px;
  color: #666;
  font-weight: 500;
}

.page-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.page-btn {
  min-width: 45px;
  height: 45px;
  padding: 0 16px;
  border: 1.5px solid #d8d8d8;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 18px;
  transition: all 0.3s;
  font-weight: 500;
}

.page-btn:hover {
  border-color: #325e21;
  color: #325e21;
}

.page-btn.active {
  background: #325e21;
  color: white;
  border-color: #325e21;
}

.page-next {
  min-width: 45px;
  height: 45px;
  border: 1.5px solid #d8d8d8;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 24px;
  transition: all 0.3s;
  font-weight: 600;
}

.page-next:hover:not(:disabled) {
  border-color: #325e21;
  color: #325e21;
}

.page-next:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.ellipsis {
  padding: 0 8px;
  color: #999;
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
    position: relative;
  }
  
  .audit-detail-link {
    position: static; /* 在小屏幕上使用相对定位 */
    display: block; /* 块级元素，换行显示 */
    margin-top: 5px;
    left: auto;
    top: auto;
    transform: none;
  }

  .pagination {
    flex-direction: column;
    gap: 15px;
  }

  .modal-content {
    width: 95%;
  }
}
</style>