/**
 * 活动相关的API接口
 */

import request from './config'

/**
 * 获取活动列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.page_size - 每页数量
 * @param {string} params.type - 活动类型
 * @returns {Promise} 返回活动列表
 */
export function getActivityList(params) {
  return request({
    url: '/activities',
    method: 'get',
    params
  })
}

/**
 * 获取活动详情
 * @param {number} activityId - 活动ID
 * @returns {Promise} 返回活动详情
 */
export function getActivityDetail(activityId) {
  return request({
    url: `/activities/${activityId}`,
    method: 'get'
  })
}

/**
 * 报名活动
 * @param {number} activityId - 活动ID
 * @returns {Promise}
 */
export function applyActivity(activityId) {
  return request({
    url: `/activities/${activityId}/apply`,
    method: 'post'
  })
}

