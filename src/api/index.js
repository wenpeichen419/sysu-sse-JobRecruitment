/**
 * API统一导出文件
 * 方便在组件中导入使用
 */

// 岗位相关API
export * from './job'

// 学生相关API
export * from './student'

// 活动相关API
export * from './activity'

// 企业相关API
export * from './company'

// 标签相关API
export * from './tags'

// 导出axios实例,供特殊需求使用
export { default as request } from './config'

