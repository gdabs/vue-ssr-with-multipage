const WebpackChain = require('webpack-chain');
const startClient = async argv => {
  const { startServerBuild, startClientServer } = await import('./utils');
  const { getServerWebpack, getClientWebpack } = await import('./webpack');
  const serverConfigChain = new WebpackChain();
  const clientConfigChain = new WebpackChain();
  await Promise.all([
    startServerBuild(getServerWebpack(serverConfigChain)),
    startClientServer(getClientWebpack(clientConfigChain)),
  ]);
};

export default startClient;
