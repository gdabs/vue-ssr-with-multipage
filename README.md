# 官方文档

## getting start

```env
$ .env # 通用环境变量
$ .env.development # development环境变量
$ .env.production # production环境变量

```config
$ config.js # 本地配置
$ config.prod.js # 生产环境配置
需要配置routes(提供path给node服务的router使用), 以及一些webpack配置
```

```bash
$ npm start # 本地开发模式运行，单进程 支持 前端 HMR 前端静态资源走本地 webpack 服务
$ npm run prod # 模拟生产环境运行，多进程，前端资源走静态目录
$ npm run stop # 生产环境停止服务
```