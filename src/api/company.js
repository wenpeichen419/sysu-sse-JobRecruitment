/**
 * 企业相关的API接口
 */

import request from './config'

/**
 * 获取企业详情
 * @param {number|string} companyId - 企业ID
 * @returns {Promise} 返回企业详细信息
 */
export function getCompanyDetail(companyId) {
  return request({
    url: `/company-center/detail/${companyId}`,
    method: 'get'
  })
}

/**
 * 获取企业列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.page_size - 每页数量
 * @returns {Promise} 返回企业列表
 */
export function getCompanyList(params) {
  return request({
    url: '/companies',
    method: 'get',
    params
  })
}
