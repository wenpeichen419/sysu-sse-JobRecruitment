// src/api/application.js
import axios from 'axios'

/**
 * 获取学生已投递岗位列表
 * @returns {Promise<AxiosResponse>}
 */
export function getAppliedList() {
  return axios({
    url: '/student/applications', // 后端接口地址
    method: 'get'
  })
}

/**
 * 获取某个岗位的详细投递情况
 * @param {Number} id - 岗位ID
 * @returns {Promise<AxiosResponse>}
 */
export function getAppliedById(id) {
  return axios({
    url: `/student/applications/${id}`, // 根据岗位 ID 获取详细投递情况
    method: 'get'
  })
}

/**
 * 更新某个岗位的投递状态
 * @param {Number} id - 岗位ID
 * @param {String} status - 要更新的状态
 * @returns {Promise<AxiosResponse>}
 */
export function updateAppliedStatus(id, status) {
  return axios({
    url: `/student/applications/${id}`, // 更新指定岗位的投递状态
    method: 'put',
    data: { status } // 请求体发送状态
  })
}
