<template>
  <div class="my-favorites-page">
    <!-- 面包屑导航 -->
    <div class="breadcrumb">
      <span class="crumb-item" @click="goBack">学生中心</span>
      <span class="separator"> > </span>
      <span class="crumb-item current">我的收藏</span>
    </div>

    <!-- 岗位列表 -->
    <div class="job-list">
      <div 
        v-for="job in displayedJobs" 
        :key="job.id"
        class="job-item"
        @click="goToJobDetail(job.id)"
      >
        <!-- 公司Logo -->
        <div class="job-logo">
          <img :src="job.logo" :alt="job.company" />
        </div>

        <!-- 左侧岗位信息 -->
        <div class="job-left-info">
          <div class="job-title">{{ job.title }}</div>
          <div class="job-details">
            <span class="salary">{{ formatSalaryRangeToK(job.salary) }}</span>
            <span class="divider">|</span>
            <span class="location">{{ job.location }}</span>
            <span class="divider">|</span>
            <span class="type-tag">{{ job.type }}</span>
            <span class="divider">|</span>
            <span class="education-tag">{{ job.education }}</span>
          </div>
        </div>

        <!-- 右侧公司信息 -->
        <div class="job-right-info">
          <div class="company-name">{{ job.company }}</div>
          <div class="company-details">
            <span class="department">{{ job.department }}</span>
            <span class="divider">|</span>
            <span class="recruit-info">招聘人数 {{ job.recruitCount }}人</span>
          </div>
        </div>

        <!-- 收藏按钮 -->
        <div class="favorite-icon" @click.stop="toggleFavorite(job.id)">
          <span class="star active">★</span>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="displayedJobs.length === 0" class="empty-state">
        <p>暂无收藏的岗位</p>
      </div>
    </div>

    <!-- 分页 -->
    <div class="pagination" v-if="totalPages > 1">
      <span class="page-info">共 {{ totalJobs }} 条数据</span>
      
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
</template>

<script>
import { formatSalaryRangeToK } from '@/utils/salaryFormatter'

export default {
  name: 'MyFavorites',
  data() {
    return {
      // 收藏的岗位ID列表
      favoriteJobIds: [],
      
      // 分页
      currentPage: 1,
      pageSize: 5,
      
      // 所有岗位数据（从JobCenter复用）
      allJobs: [
        {
          id: 1,
          title: '推荐算法工程师',
          company: '百度在线网络技术（北京）有限公司',
          category: '算法',
          department: 'xx部门',
          salary: '7000-8000',
          province: '广东省',
          city: '深圳',
          location: '广东省深圳市南山区',
          type: '校招',
          education: '本科',
          recruitCount: 5,
          logo: require('@/assets/BDance_logo.png')
        },
        {
          id: 2,
          title: '产品经理',
          company: '华为技术有限公司',
          category: '产品',
          department: '产品部',
          salary: '7000-8000',
          province: '广东省',
          city: '深圳',
          location: '广东省深圳市南山区',
          type: '实习',
          education: '本科',
          recruitCount: 3,
          logo: require('@/assets/BDance_logo.png')
        },
        {
          id: 3,
          title: '产品设计',
          company: '支付宝（中国）网络技术有限公司',
          category: '设计',
          department: '设计部',
          salary: '7000-8000',
          province: '广东省',
          city: '广州',
          location: '广东省广州市天河区',
          type: '校招',
          education: '本科',
          recruitCount: 5,
          logo: require('@/assets/BDance_logo.png')
        },
        {
          id: 4,
          title: '前端开发工程师',
          company: '腾讯科技（深圳）有限公司',
          category: '研发',
          department: '技术部',
          salary: '8000-10000',
          province: '广东省',
          city: '深圳',
          location: '广东省深圳市南山区',
          type: '校招',
          education: '硕士',
          recruitCount: 10,
          logo: require('@/assets/BDance_logo.png')
        },
        {
          id: 5,
          title: '算法工程师',
          company: '北京字节跳动科技有限公司',
          category: '算法',
          department: 'AI部门',
          salary: '15000-20000',
          province: '北京市',
          city: '海淀区',
          location: '北京市海淀区',
          type: '校招',
          education: '硕士',
          recruitCount: 8,
          logo: require('@/assets/BDance_logo.png')
        },
        {
          id: 6,
          title: 'Java后端开发',
          company: '阿里巴巴（中国）网络技术有限公司',
          category: '研发',
          department: '技术部',
          salary: '10000-15000',
          province: '浙江省',
          city: '杭州',
          location: '浙江省杭州市余杭区',
          type: '校招',
          education: '本科',
          recruitCount: 15,
          logo: require('@/assets/BDance_logo.png')
        },
        {
          id: 7,
          title: 'UI设计师',
          company: '美团网（北京）科技有限公司',
          category: '设计',
          department: '设计部',
          salary: '8000-12000',
          province: '北京市',
          city: '朝阳区',
          location: '北京市朝阳区',
          type: '校招',
          education: '本科',
          recruitCount: 4,
          logo: require('@/assets/BDance_logo.png')
        },
        {
          id: 8,
          title: '数据分析师',
          company: '京东集团股份有限公司',
          category: '算法',
          department: '数据部',
          salary: '9000-13000',
          province: '北京市',
          city: '朝阳区',
          location: '北京市朝阳区',
          type: '实习',
          education: '硕士',
          recruitCount: 6,
          logo: require('@/assets/BDance_logo.png')
        },
        {
          id: 9,
          title: '运营专员',
          company: '小红书科技有限公司',
          category: '运营',
          department: '运营部',
          salary: '7000-9000',
          province: '上海市',
          city: '浦东新区',
          location: '上海市浦东新区',
          type: '实习',
          education: '本科',
          recruitCount: 5,
          logo: require('@/assets/BDance_logo.png')
        },
        {
          id: 10,
          title: 'Python工程师',
          company: '网易（杭州）网络有限公司',
          category: '研发',
          department: '技术部',
          salary: '10000-14000',
          province: '浙江省',
          city: '杭州',
          location: '浙江省杭州市滨江区',
          type: '校招',
          education: '本科',
          recruitCount: 7,
          logo: require('@/assets/BDance_logo.png')
        }
      ]
    }
  },
  computed: {
    // 只显示收藏的岗位
    favoriteJobs() {
      return this.allJobs.filter(job => this.favoriteJobIds.includes(job.id))
    },
    
    // 总岗位数
    totalJobs() {
      return this.favoriteJobs.length
    },
    
    // 总页数
    totalPages() {
      return Math.ceil(this.totalJobs / this.pageSize)
    },
    
    // 当前页显示的岗位
    displayedJobs() {
      const start = (this.currentPage - 1) * this.pageSize
      const end = start + this.pageSize
      return this.favoriteJobs.slice(start, end)
    },

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
    // 从本地存储读取收藏列表
    const saved = localStorage.getItem('favoriteJobs')
    if (saved) {
      this.favoriteJobIds = JSON.parse(saved)
    }
  },
  methods: {
    // 返回
    goBack() {
      this.$router.push({ name: 'StudentCenter' })
    },
    
    // 格式化薪资显示
    formatSalaryRangeToK,
    
    // 取消收藏
    toggleFavorite(jobId) {
      const index = this.favoriteJobIds.indexOf(jobId)
      if (index > -1) {
        this.favoriteJobIds.splice(index, 1)
        localStorage.setItem('favoriteJobs', JSON.stringify(this.favoriteJobIds))
        
        // 如果当前页没有数据了，回到上一页
        if (this.displayedJobs.length === 0 && this.currentPage > 1) {
          this.currentPage--
        }
      }
    },
    
    // 跳转到岗位详情
    goToJobDetail(jobId) {
      this.$router.push({ name: 'JobDetail', params: { id: jobId } })
    },
    
    // 切换页码
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
  }
}
</script>

<style scoped>
/* 复用JobCenter的样式 */
.my-favorites-page {
  min-height: 100vh;
  background: #f0f0f0;
  padding: 20px 40px;
}

/* 面包屑导航 */
.breadcrumb {
  background: white;
  padding: 20px 30px;
  margin-bottom: 20px;
  border-radius: 10px;
  font-size: 18px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.crumb-item {
  color: #666;
  cursor: pointer;
  transition: color 0.3s;
}

.crumb-item:hover {
  color: #325e21;
}

.crumb-item.current {
  color: #333;
  cursor: default;
}

.separator {
  margin: 0 8px;
  color: #999;
}

/* 岗位列表 */
.job-list {
  background: white;
  padding: 30px;
  border-radius: 12px;
  margin-bottom: 20px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.08);
}

.job-item {
  display: flex;
  align-items: center;
  padding: 25px 30px;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  margin-bottom: 15px;
  background: white;
}

.job-item:hover {
  border-color: #325e21;
  box-shadow: 0 4px 16px rgba(50, 94, 33, 0.12);
  transform: translateY(-2px);
}

.job-item:last-child {
  margin-bottom: 0;
}

/* 公司Logo */
.job-logo {
  width: 110px;
  height: 110px;
  margin-right: 40px;
  flex-shrink: 0;
  border: 2px solid #e8e8e8;
  border-radius: 12px;
  padding: 10px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.job-logo img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* 左侧岗位信息 */
.job-left-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
}

.job-title {
  font-size: 25px;
  font-weight: 600;
  color: #325e21;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.job-details {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 18px;
  color: #666;
}

.salary {
  color: #ff6b35;
  font-weight: 600;
  font-size: 20px;
}

.location {
  color: #666;
}

.divider {
  color: #ddd;
}

.type-tag {
  color: #666;
}

.education-tag {
  color: #666;
}

/* 右侧公司信息 */
.job-right-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-end;
  text-align: right;
  min-width: 0;
  padding-right: 150px;
}

.company-name {
  font-size: 22px;
  font-weight: 600;
  color: #325e21;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
}

.company-details {
  display: flex;
  align-items: center;
  gap: 15px;
  font-size: 18px;
  color: #666;
}

.department {
  color: #666;
}

.recruit-info {
  color: #666;
}

/* 收藏图标 */
.favorite-icon {
  position: absolute;
  top: 15px;
  right: 15px;
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
  border: 2px solid #ff9800;
  box-shadow: 0 3px 10px rgba(255, 152, 0, 0.3);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;
}

.favorite-icon:hover {
  transform: translateY(-2px) scale(1.08);
  box-shadow: 0 4px 12px rgba(255, 152, 0, 0.4);
}

.star {
  font-size: 24px;
  color: #adb5bd;
  transition: all 0.3s ease;
  filter: none;
  line-height: 1;
}

.star.active {
  color: #ff9800;
  background: linear-gradient(135deg, #ffd54f 0%, #ff9800 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 0 8px rgba(255, 152, 0, 0.4));
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 80px 20px;
  color: #999;
  font-size: 18px;
}

/* 分页 */
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

/* 响应式 */
@media (max-width: 768px) {
  .my-favorites-page {
    padding: 15px;
  }

  .job-item {
    flex-wrap: wrap;
    padding: 20px 15px 15px;
  }

  .job-logo {
    width: 90px;
    height: 90px;
    margin-right: 20px;
  }

  .job-left-info {
    flex: 1;
    min-width: calc(100% - 110px);
  }

  .job-right-info {
    width: 100%;
    margin-top: 15px;
    padding-top: 15px;
    padding-right: 50px;
    border-top: 1px solid #f0f0f0;
    align-items: flex-start;
    text-align: left;
  }

  .favorite-icon {
    top: 10px;
    right: 10px;
  }

  .star {
    font-size: 24px;
  }
}
</style>

