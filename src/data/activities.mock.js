// src/data/activities.mock.js
export const activities = [
    {
      id: 1001,
      category: 'enterprise',          // enterprise | institution | internship
      title: '华润万象生活商业航道2026届校园招聘',
      date: '2025-10-27',              // YYYY-MM-DD
      place: '南校区 A201 · 企业宣讲',
      summary: '商业航道2026届校招启动，多个城市多个岗位开放，欢迎投递。',
      content: [
        '【活动简介】商业航道2026届校园招聘启动，多城市多岗位开放。',
        '【时间地点】2025-10-27 19:00  南校区A201',
        '【面向对象】2026届毕业生'
      ],
      url: ''                          // 若有官网外链可填
    },
    {
      id: 1002,
      category: 'enterprise',
      title: '广汽研究院2026届校园招聘',
      date: '2025-10-27',
      place: '大学城活动中心 · 宣讲会',
      summary: '广汽研究院研发类岗位开放，校招正式启动。',
      content: [
        '【岗位方向】研发/测试/数据等',
        '【宣讲时间】2025-10-27 19:00'
      ],
      url: ''
    },
    {
      id: 1003,
      category: 'enterprise',
      title: '腾讯2026届校招宣讲-广州站',
      date: '2025-10-28',
      place: '东校区 报告厅 · 宣讲会',
      summary: '现场答疑、抽奖，欢迎参加。',
      content: [
        '【活动亮点】现场答疑、抽奖、简历投递通道讲解',
        '【时间地点】2025-10-28 19:00 东校区报告厅'
      ],
      url: ''
    },
    {
      id: 1004,
      category: 'enterprise',
      title: '阿里巴巴2026届校招宣讲·深圳站',
      date: '2025-10-29',
      place: '深圳会场 · 宣讲会',
      summary: '多技术/产品岗位开放。',
      content: [
        '【会议信息】深圳专场宣讲',
        '【时间】2025-10-29 19:00'
      ],
      url: ''
    },
    // ===== 可以继续补充 institution / internship 示例 =====
    {
      id: 2001,
      category: 'institution',
      title: '广州市某事业单位公开招聘',
      date: '2025-10-30',
      place: '市人才大厦',
      summary: '事业编制岗位公开招聘。',
      content: [
        '【岗位类型】事业编',
        '【报名方式】现场/线上'
      ],
      url: ''
    },
    {
      id: 3001,
      category: 'internship',
      title: '字节跳动春季实习生招聘',
      date: '2025-10-28',
      place: '线上投递',
      summary: '数据/算法/前端等多个方向开放实习名额。',
      content: [
        '【方向】前端/后端/数据/算法',
        '【投递通道】官网-校招实习'
      ],
      url: ''
    }
  ]
  
  // 小工具：把 YYYY-MM-DD 拆成 {year, month, day}
  export function splitYMD(isoDate) {
    const [y, m, d] = (isoDate || '').split('-').map(n => parseInt(n, 10))
    return {
      year: y || '',
      month: String(m || '').padStart(2, '0'),
      day: String(d || '').padStart(2, '0')
    }
  }
  