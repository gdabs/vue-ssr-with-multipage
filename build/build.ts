const WebpackChain = require('webpack-chain');
const buildClient = async () => {
  const { startServerBuild, startClientBuild } = await import('./utils');
  const { getClientWebpack, getServerWebpack } = await import('./webpack');
  const serverConfigChain = new WebpackChain();
  const clientConfigChain = new WebpackChain();
  await Promise.all([
    startClientBuild(getClientWebpack(clientConfigChain)),
    startServerBuild(getServerWebpack(serverConfigChain)),
  ]);
};

export default buildClient;
