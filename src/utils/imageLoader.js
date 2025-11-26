/**
 * 统一的带认证图片加载工具函数
 * 用于加载需要token验证的图片资源
 * 
 * 使用说明：
 * 1. 如果图片加载失败，会在控制台输出详细的错误信息
 * 2. 可以传入 defaultImage 作为加载失败时的备用图片
 * 3. 函数会自动处理 token 认证、CORS、blob URL 创建等
 */

/**
 * 获取正确的BaseURL用于图片请求
 * @param {string} baseURL - 原始基础URL
 * @returns {string} 正确的BaseURL
 */
function getImageBaseURL(baseURL) {
  // 在开发环境中，可能需要特殊处理以确保图片请求发送到正确的后端服务器
  // 检查是否在浏览器环境中
  if (typeof window !== 'undefined') {
    // 获取当前页面的origin
    const currentOrigin = window.location.origin;
    
    // 如果baseURL与当前页面origin相同，但我们需要请求后端服务器上的图片
    // 则使用默认的后端地址（通常与API服务器相同）
    if (currentOrigin === baseURL) {
      // 检查是否定义了API_BASE_URL环境变量
      if (process.env.VUE_APP_API_BASE_URL) {
        return process.env.VUE_APP_API_BASE_URL;
      }
      
      // 默认情况下，使用API配置中的baseURL
      // 注意：这里我们假设API配置文件导出了baseURL
      try {
        // 动态导入API配置获取baseURL
        const apiConfig = require('../api/config.js');
        if (apiConfig.default && apiConfig.default.defaults && apiConfig.default.defaults.baseURL) {
          return apiConfig.default.defaults.baseURL;
        }
      } catch (e) {
        console.warn('无法获取API配置中的baseURL，使用默认值');
      }
      
      // 如果是开发环境，默认后端地址为localhost:8080
      if (process.env.NODE_ENV === 'development') {
        return 'http://localhost:8080';
      }
    }
  }
  
  // 其他情况直接返回原始baseURL
  return baseURL;
}

/**
 * 加载需要认证的图片
 * @param {string} imagePath - 图片路径
 * @param {string} baseURL - 基础URL
 * @param {string} defaultImage - 默认图片URL（可选）
 * @returns {Promise<string>} 返回blob URL或默认图片URL
 */
export async function loadImageWithAuth(imagePath, baseURL, defaultImage = '') {
  // 如果图片路径为空，返回默认图片
  if (!imagePath) {
    console.warn('【图片路径为空】返回默认图片');
    return defaultImage;
  }
  
  // 获取正确的BaseURL用于图片请求
  const imageBaseURL = getImageBaseURL(baseURL);
  
  try {
    // 如果已经是完整URL（包含http），直接使用
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      console.log('【图片已是完整URL】', imagePath);
      return imagePath;
    }
    
    // 如果是blob URL，直接返回
    if (imagePath.startsWith('blob:')) {
      console.log('【图片已是blob URL】', imagePath);
      return imagePath;
    }
    
    // 🔧 修复：处理以/files开头的路径，这类路径应该直接指向后端服务器
    let fullUrl;
    if (imagePath.startsWith('/files/')) {
      // 对于以/files/开头的路径，直接使用imageBaseURL（通常是后端API地址）
      fullUrl = `${imageBaseURL}${imagePath}`;
    } else {
      // 拼接完整URL
      fullUrl = imagePath.startsWith('/') 
        ? `${imageBaseURL}${imagePath}` 
        : `${imageBaseURL}/${imagePath}`;
    }
    
    console.log('【开始加载图片】URL:', fullUrl);
    
    // 从 localStorage 获取 token
    const token = localStorage.getItem('token');
    console.log('【Token状态】', token ? '存在' : '不存在');
    
    // 构建请求头
    const headers = {};
    if (token) {
      headers['Authorization'] = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    }
    
    console.log('【发起图片请求】', { fullUrl, hasToken: !!token });
    
    // 发起请求
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: Object.keys(headers).length > 0 ? headers : undefined
    });
    
    console.log('【图片响应状态】', response.status, response.statusText);
    
    // 检查响应状态
    if (!response.ok) {
      console.error('【图片请求失败】状态码:', response.status);
      // 🔧 新增：提供更多关于失败原因的信息
      if (response.status === 404) {
        throw new Error(`图片未找到 (404) - 请确认文件路径是否正确`);
      } else if (response.status === 401 || response.status === 403) {
        throw new Error(`访问被拒绝 (${response.status}) - 可能缺少必要的权限或认证信息`);
      } else if (response.status >= 500) {
        throw new Error(`服务器错误 (${response.status}) - 请联系系统管理员`);
      } else {
        throw new Error(`HTTP ${response.status} - ${response.statusText}`);
      }
    }
    
    // 检查内容类型
    const contentType = response.headers.get('content-type');
    console.log('【响应Content-Type】', contentType);
    
    // 🔧 特殊处理：如果后端返回的是 JSON，说明这不是图片的直接响应
    if (contentType && contentType.includes('application/json')) {
      console.warn('⚠️【后端返回了JSON而不是图片】尝试解析...');
      const jsonData = await response.json();
      console.log('【JSON内容】', jsonData);
      
      // 如果JSON中包含真实的图片URL，尝试提取并重新加载
      if (jsonData.url || jsonData.file_url || jsonData.path) {
        const realImageUrl = jsonData.url || jsonData.file_url || jsonData.path;
        console.log('【从JSON中提取到真实图片URL】', realImageUrl);
        // 递归调用，加载真实的图片URL
        return loadImageWithAuth(realImageUrl, baseURL, defaultImage);
      }
      
      throw new Error('后端返回了JSON但没有找到图片URL字段');
    }
    
    // 放宽content-type检查：某些后端可能返回application/octet-stream或不设置content-type
    if (contentType && !contentType.startsWith('image/') && !contentType.startsWith('application/octet-stream')) {
      console.warn('【警告】响应类型可能不是图片:', contentType);
      // 不直接抛出错误，尝试继续处理
    }
    
    // 将响应转换为 blob
    const blob = await response.blob();
    console.log('【Blob信息】大小:', blob.size, 'bytes, 类型:', blob.type);
    
    // 验证 blob 大小
    if (blob.size === 0) {
      throw new Error('图片内容为空');
    }
    
    // 创建 blob URL
    const blobUrl = URL.createObjectURL(blob);
    console.log('✅【图片加载成功】Blob URL:', blobUrl.substring(0, 50) + '...');
    
    return blobUrl;
  } catch (error) {
    console.error('❌【图片加载失败】');
    console.error('  - 原始路径:', imagePath);
    console.error('  - 错误信息:', error.message);
    console.error('  - 错误堆栈:', error.stack);
    // 返回默认图片
    return defaultImage;
  }
}

/**
 * 批量加载图片
 * @param {Array} imagePaths - 图片路径数组
 * @param {string} baseURL - 基础URL
 * @param {string} defaultImage - 默认图片URL（可选）
 * @returns {Promise<Array>} 返回图片URL数组
 */
export async function loadImagesWithAuth(imagePaths, baseURL, defaultImage = '') {
  const loadImagePromises = imagePaths.map(path => loadImageWithAuth(path, baseURL, defaultImage));
  return Promise.allSettled(loadImagePromises).then(results => 
    results.map(result => 
      result.status === 'fulfilled' ? result.value : defaultImage
    )
  );
}

/**
 * 释放blob URL以避免内存泄漏
 * @param {string|Array} blobUrls - blob URL或blob URL数组
 */
export function revokeBlobUrls(blobUrls) {
  if (Array.isArray(blobUrls)) {
    blobUrls.forEach(url => {
      if (url && url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }
    });
  } else {
    if (blobUrls && blobUrls.startsWith('blob:')) {
      URL.revokeObjectURL(blobUrls);
    }
  }
}