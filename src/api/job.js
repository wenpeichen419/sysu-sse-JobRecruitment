/**
 * 岗位相关的API接口
 */

import request from './config'

/**
 * 获取岗位列表
 * @param {Object} params - 查询参数
 * @param {string} params.province - 省份
 * @param {string} params.city - 城市
 * @param {string} params.work_nature - 工作性质(校招/实习)
 * @param {number} params.page - 页码,默认1
 * @param {number} params.page_size - 每页数量,默认10
 * @param {string} params.title - 职位名称
 * @param {string} params.company_name - 公司名称
 * @param {string} params.min_salary - 最低薪资
 * @param {string} params.max_salary - 最高薪资
 * @param {string} params.type - 职能类别/岗位类别
 * @returns {Promise} 返回岗位列表数据
 */
export function getJobList(params) {
  return request({
    url: '/position-center/jobs',
    method: 'get',
    params
  })
}

/**
 * 获取岗位详情
 * @param {number|string} jobId - 岗位ID
 * @returns {Promise} 返回岗位详细信息
 */
export function getJobDetail(jobId) {
  return request({
    url: `/position-center/jobs/${jobId}`,
    method: 'get'
  })
}

/**
 * 获取用户收藏的岗位列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.size - 每页数量
 * @returns {Promise} 返回收藏的岗位列表
 */
export function getFavoriteJobs(params) {
  return request({
    url: '/position-center/favorites',
    method: 'get',
    params
  })
}

/**
 * 收藏岗位
 * @param {number|string} jobId - 岗位ID
 * @returns {Promise}
 */
export function favoriteJob(jobId) {
  return request({
    url: `/position-center/favorites/${jobId}`,
    method: 'post'
  })
}

/**
 * 取消收藏岗位
 * @param {number|string} jobId - 岗位ID
 * @returns {Promise}
 */
export function unfavoriteJob(jobId) {
  return request({
    url: `/position-center/favorites/${jobId}`,
    method: 'delete'
  })
}

/**
 * 获取当前用户收藏状态（单岗位）
 * @param {number|string} jobId - 岗位ID
 * @returns {Promise}
 */
export function checkFavoriteStatus(jobId) {
  return request({
    url: `/position-center/favorites/status/${jobId}`,
    method: 'get'
  })
}

/**
 * 岗位投递接口
 * @param {Object} data - 投递数据 { job_id: integer, resume_id: string }
 * @returns {Promise}
 */
export function applyJob(data) {
  return request({
    url: '/position-center/applications',
    method: 'post',
    data
  })
}

/**
 * 获取简历列表（用于投递弹窗）
 * @returns {Promise} 返回简历文件列表
 */
export function getResumeFilesForApply() {
  return request({
    url: '/position-center/resume-files',
    method: 'get'
  })
}

/**
 * 上传 PDF 简历（用于投递弹窗）
 * @param {Object} data - { file: string(base64), usage: 'resume_pdf', template_id: integer|null }
 * @returns {Promise}
 */
export function uploadResumeForApply(data) {
  return request({
    url: '/position-center/resume_files/upload',
    method: 'post',
    data
  })
}

/**
 * 获取投递记录列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.page_size - 每页数量
 * @param {string} params.status - 状态筛选
 * @returns {Promise} 返回投递记录列表
 */
export function getApplicationList(params) {
  return request({
    url: '/student-center/applications',
    method: 'get',
    params
  })
}

/**
 * 获取投递详情
 * @param {number} applicationId - 投递记录ID
 * @returns {Promise} 返回投递详情
 */
export function getApplicationDetail(applicationId) {
  return request({
    url: `/student-center/applications/${applicationId}`,
    method: 'get'
  })
}
