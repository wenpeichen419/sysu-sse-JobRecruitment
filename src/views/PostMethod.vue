<template>
  <div class="post-method-page">
    <!-- 面包屑导航 -->
    <div class="breadcrumb-wrapper">
      <div class="breadcrumb">
        <router-link to="/position-manage" class="breadcrumb-link">岗位管理</router-link>
        <span class="breadcrumb-separator">></span>
        <span class="breadcrumb-current">发布新岗</span>
      </div>
    </div>

    <div class="content-wrapper">
      <div class="form-section">
        <h1 class="page-title">发布新岗位</h1>
        <p class="page-description">请填写岗位信息，带 * 的为必填项</p>
        
        <div class="form-content">
          <div class="form-row">
            <div class="form-field">
              <label class="required">岗位名称</label>
              <input type="text" placeholder="请输入岗位名称" class="form-input">
            </div>
            <div class="form-field">
              <label class="required">职能类别</label>
              <select class="form-select">
                <option value="">请选择职能类别</option>
                <option value="algorithm">算法</option>
                <option value="development">开发</option>
                <option value="product">产品</option>
                <option value="operation">运营</option>
              </select>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-field">
              <label class="required">部门</label>
              <input type="text" placeholder="请输入部门名称" class="form-input">
            </div>
            <div class="form-field">
              <label class="required">招聘人数</label>
              <input type="number" placeholder="请输入招聘人数" class="form-input">
            </div>
          </div>
          
          <div class="form-field full-width">
            <label class="required">岗位描述</label>
            <textarea 
              placeholder="请输入岗位描述..." 
              rows="6" 
              class="form-textarea"
            ></textarea>
          </div>
          
          <div class="form-field full-width">
            <label class="required">岗位要求</label>
            <textarea 
              placeholder="请输入岗位要求..." 
              rows="6" 
              class="form-textarea"
            ></textarea>
          </div>
          
          <div class="form-actions">
            <button class="save-draft-btn">保存草稿</button>
            <button class="publish-btn">立即发布</button>
            <button class="cancel-btn" @click="goBack">取消</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PostMethod',
  methods: {
    goBack() {
      this.$router.push('/position-manage')
    }
  }
}
</script>

<style scoped>
.post-method-page {
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
}

.breadcrumb-link {
  color: #325e21;
  text-decoration: none;
  font-weight: 500;
}

.breadcrumb-link:hover {
  text-decoration: underline;
}

.breadcrumb-separator {
  margin: 0 10px;
  color: #666;
}

.breadcrumb-current {
  color: #666;
}

.content-wrapper {
  padding-top: 85px;
}

.form-section {
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.page-title {
  color: #325e21;
  margin: 0 0 10px 0;
  font-size: 32px;
  font-weight: bold;
}

.page-description {
  color: #666;
  margin: 0 0 30px 0;
  font-size: 16px;
}

.form-content {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.form-row {
  display: flex;
  gap: 30px;
}

.form-field {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-field.full-width {
  flex: 1 0 100%;
}

.form-field label {
  font-weight: 500;
  color: #333;
  font-size: 16px;
}

.form-field label.required::after {
  content: " *";
  color: #d32f2f;
}

.form-input,
.form-select,
.form-textarea {
  padding: 12px 16px;
  border: 1px solid #d8d8d8;
  border-radius: 6px;
  font-size: 16px;
  box-sizing: border-box;
  font-family: inherit;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #325e21;
}

.form-textarea {
  resize: vertical;
  min-height: 120px;
}

.form-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 30px;
  padding-top: 30px;
  border-top: 1px solid #f0f0f0;
}

.save-draft-btn,
.publish-btn,
.cancel-btn {
  padding: 12px 30px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.save-draft-btn {
  background: #ff9800;
  color: white;
}

.publish-btn {
  background: #325e21;
  color: white;
}

.cancel-btn {
  background: #6c757d;
  color: white;
}

.save-draft-btn:hover {
  background: #f57c00;
}

.publish-btn:hover {
  background: #2a4e1b;
}

.cancel-btn:hover {
  background: #5a6268;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
    gap: 20px;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .save-draft-btn,
  .publish-btn,
  .cancel-btn {
    width: 100%;
  }
}
</style>