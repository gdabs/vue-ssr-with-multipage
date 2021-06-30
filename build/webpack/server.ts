import { join } from 'path';
import webpack from 'webpack';
import { loadConfig, getClientEnvironment, nodeExternals } from '../utils';
import * as WebpackChain from 'webpack-chain';
import { getBaseConfig } from './base';

const loadModule = require.resolve;

const env = getClientEnvironment();

const getServerWebpack = (chain: WebpackChain) => {
  const config = loadConfig();
  const { isDev, cwd, getOutput, chainServerConfig, whiteList, chunkName } = config;

  getBaseConfig(chain, true);
  chain.devtool(isDev ? 'eval-source-map' : false);
  chain.target('node');
  chain
    .entry(chunkName)
    .add(loadModule('../../src/entry/server-entry'))
    .end()
    .output.path(getOutput().serverOutPut)
    .filename('[name].server.js')
    .libraryTarget('commonjs')
    .end();

  const modulesDir = [join(cwd, './node_modules')];
  chain.externals(
    nodeExternals({
      whitelist: [
        /\.(css|less|sass|scss)$/,
        /vant.*?style/,
        /antd.*?(style)/,
        /ant-design-vue.*?(style)/,
      ].concat(whiteList || []),
      // externals Dir contains example/xxx/node_modules ssr/node_modules
      modulesDir,
    })
  );

  chain.when(isDev, () => {
    chain.watch(true);
  });

  chain.plugin('define').use(webpack.DefinePlugin, [
    {
      ...env.stringified,
      __isBrowser__: false,
    },
  ]);

  chainServerConfig(chain); // 合并用户自定义配置

  return chain.toConfig();
};

export { getServerWebpack };
