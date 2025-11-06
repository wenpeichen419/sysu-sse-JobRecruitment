<template>
    <div class="useful card">
      <h3 class="head">常用链接</h3>
      <div class="links">
        <a
          v-for="(l, i) in links"
          :key="i"
          class="link"
          :href="l.href"
          target="_blank"
          rel="noopener"
          :title="l.alt"
        >
          <img :src="l.src" :alt="l.alt" />
        </a>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'UsefulLinks',
    data() {
      return {
        links: [
          {
            src: require('@/assets/links/link-sysu-career.png'),
            alt: '中山大学就业信息网',
            href: 'https://career.sysu.edu.cn/'
          },
          {
            src: require('@/assets/links/link-chinaemployment.png'),
            alt: '中国就业网',
            href: 'http://www.mohrss.gov.cn/'
          },
          {
            src: require('@/assets/links/link-24365.png'),
            alt: '国家大学生就业服务平台 24365',
            href: 'https://24365.education.bjd.com.cn/'
          },
          {
            src: require('@/assets/links/link-chinatalent.png'),
            alt: '中国人才网',
            href: 'https://www.zgrczp.net/'
          }
        ]
      }
    }
  }
  </script>
  
  <style scoped>
  .card{
    background:#fff;
    border-radius:12px;
    box-shadow: 0 2px 8px rgba(0,0,0,.08);
    padding:16px;
  }
  .head{ margin:0 0 8px; color:#325e21; }
  
  .links{
    display:grid;
    grid-template-columns: repeat(4, 1fr);
    gap:12px;
  }
  @media (max-width: 1000px){ .links{ grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 520px){ .links{ grid-template-columns: 1fr; } }
  
  .link{
    display:flex; align-items:center; justify-content:center;
    background:#fff;
    border:1px solid #e6e6e6;
    border-radius:10px;
    padding:10px 12px;
    height:76px;
    transition: box-shadow .15s ease, transform .05s ease;
  }
  .link:hover{ box-shadow: 0 6px 16px rgba(0,0,0,.06); transform: translateY(-1px); }
  .link img{ max-width:100%; max-height:56px; object-fit:contain; }
  </style>
  