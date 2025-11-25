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
 * @param {Object} params - 密码数据
 * @param {string} params.oldPassword - 原密码
 * @param {string} params.newPassword - 新密码
 * @returns {Promise}
 */
export function changePassword(params) {
  return request({
    url: '/api/student/me/change-password',
    method: 'put',
    params: {
      old_password: params.oldPassword,
      new_password: params.newPassword
    }
  })
}

/**
 * 获取学生欢迎信息
 * @returns {Promise} 返回欢迎信息
 */
export function getWelcomeInfo() {
  return request({
    url: '/api/student/me/welcome',
    method: 'get'
  })
}

/**
 * 获取学生简历预览
 * @returns {Promise} 返回简历预览信息
 */
export function getResumePreview() {
  return request({
    url: '/api/student/me/resume-preview',
    method: 'get'
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
    url: '/api/student/me/avatar',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

/**
 * 获取学生个人档案（编辑用）
 * @returns {Promise} 返回个人档案信息
 */
export function getEditProfile() {
  return request({
    url: '/api/student/me/edit-profile',
    method: 'get'
  })
}

/**
 * 更新学生个人档案
 * @param {Object} data - 档案数据
 * @returns {Promise}
 */
export function updateProfile(data) {
  return request({
    url: '/profile-center/profiles/me/base',
    method: 'put',
    data
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

