const WebpackChain = require('webpack-chain');
const buildClient = async argv => {
  const { startServerBuild, startClientBuild } = await import('./utils');
  const { getClientWebpack, getServerWebpack } = await import('./webpack');
  const serverConfigChain = new WebpackChain();
  const clientConfigChain = new WebpackChain();
  await Promise.all([
    startServerBuild(getServerWebpack(serverConfigChain)),
    startClientBuild(getClientWebpack(clientConfigChain)),
  ]);
};

export default buildClient;
