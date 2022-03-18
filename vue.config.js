module.exports = {
    configureWebpack: {},
    devServer: { // 环境配置
      host: '0.0.0.0',
      public: '30.11.244.37:8080', // 此处是自己电脑IP地址！
      port: '8080',
      https: false,
      disableHostCheck: true,
      open: false // 配置自动启动浏览器
    }
}