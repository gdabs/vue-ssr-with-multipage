import webpack from 'webpack';
import { loadConfig } from './loadConfig';
import { promisify } from 'util';

const WebpackDevServer = require('webpack-dev-server-ssr');
const webpackPromisify = promisify<webpack.Configuration, webpack.Stats>(webpack);

const startClientServer = async (webpackConfig: webpack.Configuration) => {
  const config = loadConfig();
  const { webpackDevServerConfig, fePort, host } = config;
  return await new Promise(resolve => {
    const compiler = webpack(webpackConfig);

    const server = new WebpackDevServer(compiler, webpackDevServerConfig);
    compiler.hooks.done.tap('DonePlugin', () => {
      resolve(undefined);
    });
    server.listen(fePort, host);
  });
};

const startClientBuild = async (webpackConfig: webpack.Configuration) => {
  const config = loadConfig();
  const { webpackStatsOption } = config;
  const stats = await webpackPromisify(webpackConfig);
  console.log(stats.toString(webpackStatsOption));
};

const startServerBuild = async (webpackConfig: webpack.Configuration) => {
  const { webpackStatsOption } = loadConfig();
  const stats = await webpackPromisify(webpackConfig);
  console.log(stats.toString(webpackStatsOption));
};

export { startClientServer, startClientBuild, startServerBuild };
