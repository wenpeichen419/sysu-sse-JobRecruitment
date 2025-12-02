<template>
  <div class="breadcrumb-wrapper">
    <div class="breadcrumb">
      <!-- 左侧：路径 -->
      <div class="breadcrumb-left">
        <template v-for="(item, index) in items" :key="index">
          <router-link
            v-if="item.to"
            :to="item.to"
            class="breadcrumb-link"
          >
            {{ item.label }}
          </router-link>
          <span v-else class="breadcrumb-current">
            {{ item.label }}
          </span>

          <span
            v-if="index < items.length - 1"
            class="breadcrumb-separator"
          >
            >
          </span>
        </template>
      </div>

      <!-- 右侧：操作按钮插槽（不写具体按钮） -->
      <div class="edit-actions">
        <slot name="actions"></slot>
      </div>
    </div>
  </div>
</template>

  <script>
  export default {
    name: 'ZyBreadcrumb',
    props: {
      // 例如：[{ label: '首页', to: '/student-home' }, { label: '简历编辑器' }]
      items: {
        type: Array,
        required: true
      }
    }
  }
  </script>
  
  <style scoped>
  .breadcrumb-wrapper{
    position:fixed;
    top:105px;
    left:0;
    width:100%;
    background:#f4f4f4;
    padding:20px 30px;
    z-index:1000;
    height:115px;
  }
  .breadcrumb{
    background:#fff;
    padding:20px 30px;
    box-shadow:0 2px 10px rgba(0,0,0,.1);
    font-size:20px;
    width:97.3%;
    position:fixed;
    display:flex;
    align-items:center;
    justify-content:space-between; /* 左右两边 */
  }
  .breadcrumb-left{
    display:flex;
    align-items:center;
    flex-wrap:wrap;
  }
  .breadcrumb-link{
    color:#325e21;
    text-decoration:none;
    font-weight:500;
    cursor:pointer;
  }
  .breadcrumb-link:hover{
    text-decoration:underline;
  }
  .breadcrumb-separator{
    margin:0 10px;
    color:#666;
  }
  .breadcrumb-current{
    color:#666;
  }
  .edit-actions{
    display:flex;
    gap:10px;
  }
  </style>
  