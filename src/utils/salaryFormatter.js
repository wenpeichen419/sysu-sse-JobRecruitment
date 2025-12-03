/**
 * 薪资格式化工具函数
 */

/**
 * 将薪资数字转换为以k为单位的显示格式
 * @param {number} salary 薪资数字（可能是原始数字或已经是k单位的数字）
 * @returns {string} 以k为单位的薪资字符串
 */
export function formatSalaryToK(salary) {
  if (!salary && salary !== 0) return '';
  
  const salaryNum = Number(salary);
  if (isNaN(salaryNum)) return '';
  
  // 如果数字 >= 1000，说明是原始薪资（如20000），需要除以1000
  // 如果数字 < 1000，说明已经是k单位的数字（如20），直接使用
  if (salaryNum >= 1000) {
    return Math.floor(salaryNum / 1000) + 'k';
  } else {
    return salaryNum + 'k';
  }
}

/**
 * 将薪资范围字符串转换为以k为单位的显示格式
 * 支持格式：
 * - "20-25" → "20k-25k"（后端已返回k单位）
 * - "20000-25000" → "20k-25k"（原始薪资）
 * - "30及以上" → "30k及以上"
 * - "面议" → "面议"
 * @param {string} salaryRange 薪资范围字符串
 * @param {string} workNature 工作性质（"校招"或"实习"），可选参数
 * @returns {string} 以k为单位的薪资范围字符串
 */
export function formatSalaryRangeToK(salaryRange, workNature = '') {
  // 处理空值、null、undefined、"0"、"0-0"
  if (!salaryRange || salaryRange === '' || salaryRange === '0' || salaryRange === '0-0') {
    return '面议';
  }
  
  // 如果已经包含"面议"，直接返回
  if (salaryRange.includes('面议')) {
    return '面议';
  }
  
  // 处理"及以上"格式（如"30及以上"）
  if (salaryRange.includes('及以上')) {
    const salary = parseInt(salaryRange);
    if (!isNaN(salary) && salary > 0) {
      // 实习岗位不加k，校招加k
      if (workNature === '实习') {
        return salary + '及以上';
      } else {
        return formatSalaryToK(salary) + '及以上';
      }
    }
    return '面议';
  }
  
  // 处理范围格式（如"20-25"或"20000-25000"）
  const parts = salaryRange.split('-');
  if (parts.length === 2) {
    const minSalary = parseInt(parts[0].trim());
    const maxSalary = parseInt(parts[1].trim());
    
    // 如果都是0，显示面议
    if (minSalary === 0 && maxSalary === 0) {
      return '面议';
    }
    
    // 确保都是有效数字且大于0
    if (!isNaN(minSalary) && !isNaN(maxSalary) && minSalary > 0 && maxSalary > 0) {
      // 实习岗位：直接显示数字（日薪）
      if (workNature === '实习') {
        return minSalary + '-' + maxSalary;
      }
      // 校招岗位：加k单位（年薪）
      else {
        return formatSalaryToK(minSalary) + '-' + formatSalaryToK(maxSalary);
      }
    }
  } else if (parts.length === 1) {
    // 处理单个薪资数字（如"30"）
    const salary = parseInt(parts[0].trim());
    if (!isNaN(salary) && salary > 0) {
      // 实习岗位不加k，校招加k
      if (workNature === '实习') {
        return String(salary);
      } else {
        return formatSalaryToK(salary);
      }
    }
  }
  
  // 默认返回面议，处理所有其他无效情况
  return '面议';
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