import { createProxyMiddleware } from 'http-proxy-middleware'
import { IConfig } from '@/interface';

const koaConnect = require('koa2-connect')

function onProxyReq (proxyReq: any, req: any) {
  Object.keys(req.headers).forEach(function (key) {
    proxyReq.setHeader(key, req.headers[key])
  })
}

const getDevProxyMiddlewaresArr = async (config: IConfig) => {
  const { fePort, proxy, isDev, https } = config;
  const proxyMiddlewaresArr: any[] = []

  function registerProxy (proxy: any) {
    for (const path in proxy) {
      const options = proxy[path]
      const middleware = koaConnect(createProxyMiddleware(path, options))
      proxyMiddlewaresArr.push(middleware)
    }
  }
  proxy && registerProxy(proxy)
  if (isDev) {
    // Webpack 场景 在本地开发阶段代理 serverPort 的资源到 fePort
    // 例如 http://localhost:3000/static/js/page.chunk.js -> http://localhost:8888/static/js/page.chunk.js
    const remoteStaticServerOptions = {
      target: `${https ? 'https' : 'http'}://127.0.0.1:${fePort}`,
      changeOrigin: true,
      secure: false,
      onProxyReq,
      logLevel: 'warn'
    }

    const proxyPathMap = {
      '/static': remoteStaticServerOptions,
      '/sockjs-node': remoteStaticServerOptions,
      '/*.hot-update**': remoteStaticServerOptions,
      '/__webpack_dev_server__': remoteStaticServerOptions,
      '/asset-manifest': remoteStaticServerOptions
    }
    registerProxy(proxyPathMap)
  }

  return proxyMiddlewaresArr
}

const initialSSRDevProxy = async (app: any, config: IConfig) => {
  // 在本地开发阶段代理 serverPort 的资源到 fePort
  // 例如 http://localhost:3000/static/js/page.chunk.js -> http://localhost:8888/static/js/page.chunk.js
  const proxyMiddlewaresArr = await getDevProxyMiddlewaresArr(config)
  for (const middleware of proxyMiddlewaresArr) {
    app.use(middleware)
  }
}

export {
  getDevProxyMiddlewaresArr,
  initialSSRDevProxy
}
