/**
 * 薪资格式化工具函数
 */

/**
 * 将薪资数字转换为以k为单位的显示格式
 * @param {number} salary 薪资数字
 * @returns {string} 以k为单位的薪资字符串
 */
export function formatSalaryToK(salary) {
  if (!salary) return '';
  // 将薪资除以1000并保留整数部分
  return Math.floor(salary / 1000) + 'k';
}

/**
 * 将薪资范围字符串（如"7000-8000"）转换为以k为单位的显示格式（如"7k-8k"）
 * @param {string} salaryRange 薪资范围字符串
 * @returns {string} 以k为单位的薪资范围字符串
 */
export function formatSalaryRangeToK(salaryRange) {
  if (!salaryRange) return '';
  
  // 如果是单个数字（如"15000及以上"）
  if (salaryRange.includes('及以上')) {
    const salary = parseInt(salaryRange);
    if (!isNaN(salary)) {
      return formatSalaryToK(salary) + '及以上';
    }
    return salaryRange;
  }
  
  // 处理范围格式（如"7000-8000"）
  const parts = salaryRange.split('-');
  if (parts.length === 2) {
    const minSalary = parseInt(parts[0]);
    const maxSalary = parseInt(parts[1]);
    
    if (!isNaN(minSalary) && !isNaN(maxSalary)) {
      return formatSalaryToK(minSalary) + '-' + formatSalaryToK(maxSalary);
    }
  } else if (parts.length === 1) {
    // 处理单个薪资数字
    const salary = parseInt(parts[0]);
    if (!isNaN(salary)) {
      return formatSalaryToK(salary);
    }
  }
  
  return salaryRange;
}

/**
 * 将以k为单位的薪资数字转换回原始数字格式
 * @param {string} kSalary 以k为单位的薪资字符串（如"7k"）
 * @returns {number} 原始薪资数字（如7000）
 */
export function convertKToSalary(kSalary) {
  if (!kSalary) return null;
  
  // 移除"k"字符并转换为数字
  const numberPart = kSalary.replace('k', '');
  const salary = parseInt(numberPart);
  
  if (!isNaN(salary)) {
    return salary * 1000;
  }
  
  return null;
}