/**
 * 标签相关的API接口
 */

import request from './config'

/**
 * 获取所有可用标签（按分类）
 * @returns {Promise} 返回分组的标签数据
 */
export function getAvailableTags() {
  return request({
    // 尝试使用 /api/tags/list（企业端路径）
    // 如果后端接口文档确认是 /api/tags/available，请改回
    url: '/api/tags',
    method: 'get'
  })
}

