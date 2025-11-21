/**
 * 地区相关接口
 */
import request from './config'

/**
 * 获取省市列表
 * @returns {Promise} 返回省市数据
 */
export function getLocations() {
  return request({
    url: '/api/locations',
    method: 'get'
  })
}

