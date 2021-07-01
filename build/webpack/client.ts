import webpack from 'webpack';
import { GenerateSW } from 'workbox-webpack-plugin';
import { loadConfig } from '../utils/loadConfig';
import { getClientEnvironment } from '../utils/env';
import * as WebpackChain from 'webpack-chain';
import { getBaseConfig } from './base';

const safePostCssParser = require('postcss-safe-parser');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const generateAnalysis = Boolean(process.env.GENERATE_ANALYSIS);
const loadModule = require.resolve;

const env = getClientEnvironment();

const getClientWebpack = (chain: WebpackChain) => {
  const { publicPath, isDev, chunkName, getOutput, useHash, chainClientConfig } = loadConfig();
  const shouldUseSourceMap = isDev || process.env.GENERATE_SOURCEMAP;
  const truePublicPath = isDev ? publicPath : `${publicPath}client/`;
  getBaseConfig(chain, false);

  chain.devtool(isDev ? 'cheap-module-source-map' : shouldUseSourceMap ? 'source-map' : false);
  chain
    .entry(chunkName)
    .add(loadModule('../../src/entry/client-entry'))
    .end()
    .output.path(getOutput().clientOutPut)
    .filename(useHash ? 'static/js/[name].[contenthash:8].js' : 'static/js/[name].js')
    .chunkFilename(
      useHash ? 'static/js/[name].[contenthash:8].chunk.js' : 'static/js/[name].chunk.js'
    )
    .publicPath(truePublicPath)
    .end();

  chain.optimization
    .runtimeChunk(true)
    .splitChunks({
      chunks: 'initial',
      name: false,
      cacheGroups: {
        vendors: {
          test: (module: any) => {
            return (
              module.resource &&
              /\.js$/.test(module.resource) &&
              module.resource.match('node_modules')
            );
          },
          name: 'vendor',
        },
      },
    })
    .when(!isDev, optimization => {
      optimization.minimizer('terser').use(loadModule('terser-webpack-plugin'), [
        {
          terserOptions: {
            parse: {
              ecma: 8,
            },
            compress: {
              ecma: 5,
              warnings: false,
              comparisons: false,
              inline: 2,
            },
            mangle: {
              safari10: true,
            },
            output: {
              ecma: 5,
              comments: false,
              ascii_only: true,
            },
          },
          extractComments: false,
          parallel: true,
          cache: true,
          sourceMap: shouldUseSourceMap,
        },
      ]);
      optimization.minimizer('optimize-css').use(loadModule('optimize-css-assets-webpack-plugin'), [
        {
          cssProcessorOptions: {
            parser: safePostCssParser,
            map: shouldUseSourceMap
              ? {
                  inline: false,
                  annotation: true,
                }
              : false,
          },
        },
      ]);
    });

  chain.plugin('define').use(webpack.DefinePlugin, [
    {
      ...env.stringified,
      __isBrowser__: true,
      // __VUE_OPTIONS_API__: false // 配置后与 vuex 集成有bug，暂时不打开
    },
  ]);

  chain.plugin('ignore').use(webpack.IgnorePlugin, [
    /^\.\/locale$/,
    /moment$/
  ]);

  chain.plugin('manifest').use(loadModule('webpack-manifest-plugin'), [
    {
      fileName: 'asset-manifest.json',
      publicPath: truePublicPath,
    },
  ]);

  !isDev && chain.plugin('serviceWorker').use(GenerateSW, [
    {
      clientsClaim: true,
      exclude: [/\.map$/, /asset-manifest\.json$/],
      navigateFallback: truePublicPath + '/index',
      offlineGoogleAnalytics: true,
      navigateFallbackDenylist: [
        // Exclude URLs starting with /_, as they're likely an API call
        new RegExp('^/_'),
        // Exclude any URLs whose last part seems to be a file extension
        // as they're likely a resource and not a SPA route.
        // URLs containing a "?" character won't be blacklisted as they're likely
        // a route with query params (e.g. auth callbacks).
        new RegExp('/[^/?]+\\.[^/]+$'),
      ],
    }
  ]);

  chain.when(generateAnalysis, chain => {
    chain.plugin('analyze').use(BundleAnalyzerPlugin);
  });

  chainClientConfig(chain); // 合并用户自定义配置

  return chain.toConfig();
};

export { getClientWebpack };
