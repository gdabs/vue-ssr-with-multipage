# 官方文档

## getting start

```config
$ config.js # 本地配置
$ config.prod.js # 生产环境配置
```

```bash
$ npm start # 本地开发模式运行，单进程 支持 前端 HMR 前端静态资源走本地 webpack 服务
$ npm run prod # 模拟生产环境运行，多进程，前端资源走静态目录
$ npm run stop # 生产环境停止服务
```