const { defineConfig } = require('@vue/cli-service')
const path = require('path')

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src') // 确保 @ 指向 src 文件夹
      }
    }
  },

  devServer: {
    port: 8081,  // 前端端口
    proxy: {
      '/api': {
        target: 'http://localhost:8080',  // 后端 API 地址
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''  // 重写 API 路径
        }
      }
    }
  }
})
