import fs from 'fs';
import { join } from 'path';
import webpackMock from 'mocker-api';
import { IConfig } from '@/interface';
import { getCwd, getUserConfig } from './cwd';

const cwd = getCwd();
const mockEntrys = fs.readdirSync(join(cwd, './mock'));
const mockFiles = mockEntrys.map(item => join(cwd, `./mock/${item}`));

const loadConfig = (): IConfig => {
  const userConfig = getUserConfig();

  const stream = false;
  type ClientLogLevel = 'error';

  const publicPath = '/';

  const moduleFileExtensions = [
    '.web.mjs',
    '.mjs',
    '.web.js',
    '.js',
    '.web.ts',
    '.ts',
    '.web.tsx',
    '.tsx',
    '.json',
    '.web.jsx',
    '.jsx',
    '.vue',
    '.css',
  ];

  const isDev = process.env.NODE_ENV !== 'production';

  const fePort = userConfig.fePort ?? 8888;

  let https = userConfig.https ? userConfig.https : !!process.env.HTTPS;

  if (
    !(
      (typeof https === 'boolean' && https) ||
      (typeof https === 'object' && Object.keys(https).length !== 0)
    )
  ) {
    https = false;
  }

  const serverPort = process.env.SERVER_PORT ?? 3000;

  const host = '0.0.0.0';

  const clientLogLevel: ClientLogLevel = 'error';

  const useHash = !isDev; // 生产环境默认生成hash

  const whiteList: RegExp[] = [];


  const webpackStatsOption = {
    assets: true, // 添加资源信息
    cachedAssets: false, // 显示缓存的资源（将其设置为 `false` 则仅显示输出的文件）
    children: false, // 添加 children 信息
    chunks: false, // 添加 chunk 信息（设置为 `false` 能允许较少的冗长输出）
    colors: true, // 以不同颜色区分构建信息
    modules: false, // 添加构建模块信息
    warnings: false,
    entrypoints: false,
  };

  const corejs = false;
  const getOutput = () => ({
    clientOutPut: join(cwd, './dist/client'),
    serverOutPut: join(cwd, './dist/server'),
  });

  const cssModulesWhiteList = [/antd/, /swiper/];
  const webpackDevServerConfig = Object.assign(
    {
      stats: webpackStatsOption,
      disableInfo: true, // 关闭webpack-dev-server 自带的server Info信息
      disableHostCheck: true,
      publicPath: publicPath,
      hotOnly: true,
      host,
      sockPort: fePort,
      hot: true,
      port: fePort,
      https,
      clientLogLevel: clientLogLevel,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
      },
      before(app) {
        webpackMock(app, mockFiles);
      },
    },
    userConfig.webpackDevServerConfig
  );

  const chainBaseConfig = () => {
    // 覆盖默认webpack配置
  };
  const chainClientConfig = () => {
    // 覆盖默认 client webpack配置
  };
  const chainServerConfig = () => {
    // 覆盖默认 server webpack配置
  };
  const config = Object.assign(
    {},
    {
      chainBaseConfig,
      chainServerConfig,
      chainClientConfig,
      cwd,
      isDev,
      publicPath,
      useHash,
      host,
      moduleFileExtensions,
      fePort,
      serverPort,
      getOutput,
      webpackStatsOption,
      whiteList,
      cssModulesWhiteList,
      stream,
      corejs,
      https,
    },
    userConfig
  );

  isDev && (config.webpackDevServerConfig = webpackDevServerConfig); // 防止把整个 webpackDevServerConfig 全量覆盖了

  return config;
};

export { loadConfig };
