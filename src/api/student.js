/**
 * 学生相关的API接口
 */

import request from './config'

/**
 * 获取学生个人信息
 * @returns {Promise} 返回学生信息
 */
export function getStudentInfo() {
  return request({
    url: '/student-center/profile',
    method: 'get'
  })
}

/**
 * 更新学生个人信息
 * @param {Object} data - 学生信息数据
 * @returns {Promise}
 */
export function updateStudentInfo(data) {
  return request({
    url: '/student-center/profile',
    method: 'put',
    data
  })
}

/**
 * 修改密码
 * @param {Object} data - 密码数据
 * @param {string} data.oldPassword - 原密码
 * @param {string} data.newPassword - 新密码
 * @returns {Promise}
 */
export function changePassword(data) {
  return request({
    url: '/student-center/password',
    method: 'put',
    data
  })
}

/**
 * 获取学生简历信息
 * @returns {Promise} 返回简历信息
 */
export function getResume() {
  return request({
    url: '/student-center/resume',
    method: 'get'
  })
}

/**
 * 更新学生简历
 * @param {Object} data - 简历数据
 * @returns {Promise}
 */
export function updateResume(data) {
  return request({
    url: '/student-center/resume',
    method: 'put',
    data
  })
}

/**
 * 上传头像
 * @param {FormData} formData - 包含图片文件的FormData
 * @returns {Promise} 返回图片URL
 */
export function uploadAvatar(formData) {
  return request({
    url: '/student-center/avatar',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

/**
 * 学生登录
 * @param {Object} data - 登录数据
 * @param {string} data.username - 用户名
 * @param {string} data.password - 密码
 * @returns {Promise} 返回token等信息
 */
export function login(data) {
  return request({
    url: '/auth/student/login',
    method: 'post',
    data
  })
}

/**
 * 学生注册
 * @param {Object} data - 注册数据
 * @returns {Promise}
 */
export function register(data) {
  return request({
    url: '/auth/student/register',
    method: 'post',
    data
  })
}

/**
 * 退出登录
 * @returns {Promise}
 */
export function logout() {
  return request({
    url: '/auth/logout',
    method: 'post'
  })
}

