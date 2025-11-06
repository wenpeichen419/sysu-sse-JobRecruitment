// 学生个人信息模拟数据
export const mockStudent = {
  // 基本信息
  id: 'S2025001',
  name: '张三',
  gender: '男',
  birthday: '2003-05',
  phone: '13800138000',
  email: 'zhangsan@mail.sysu.edu.cn',
  avatar: require('@/assets/BDance_logo.png'), // 使用默认头像
  
  // 教育信息
  school: '中山大学',
  college: '软件工程学院',
  major: '软件工程',
  degree: '本科',
  admissionDate: '2021-09',
  graduationDate: '2025-06',
  ranking: '5/120',
  
  // 求职信息
  jobStatus: '求职中',
  desiredPosition: '前端开发工程师',
  expectedSalary: '8000-12000',
  
  // 能力标签
  tags: ['JavaScript', 'Vue', 'React', 'Node.js', 'TypeScript', 'HTML/CSS', 'Git', 'Webpack'],
  
  // 系统信息
  lastLogin: '2025-11-06 14:30:25',
  registerDate: '2024-09-01'
}

// 导出默认值
export default mockStudent

