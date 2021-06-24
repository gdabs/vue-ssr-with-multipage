import * as Vue from 'vue';
import { h, createSSRApp } from 'vue';
import { getManifest } from './utils/manifest';
import { findRoute } from './utils/findRoute';
import { logGreen } from './utils/log';
import serialize from 'serialize-javascript';
import { createRouter, createStore } from './utils/create';
import { FeRoutes } from '@/route';
import layoutFetch from '@/layout/fetch';
import Layout from '@/layout/index.vue';
import App from '@/layout/App.vue';
import { IConfig, IServerFeRouteItem, ISSRContext } from '@/interface';

const serverRender = async (ctx: ISSRContext, config: IConfig) => {
  // eslint-disable-next-line
  global.window = global.window ?? { ...global.window }; // 防止覆盖上层应用自己定义的 window 对象
  global.__VUE_PROD_DEVTOOLS__ = global.__VUE_PROD_DEVTOOLS__ ?? false;
  const router = createRouter();
  let path = ctx.request.path; // 这里取 pathname 不能够包含 queyString
  const store = createStore();
  const { cssOrder, jsOrder, dynamic, mode, customeHeadScript } = config;
  const routeItem = findRoute<IServerFeRouteItem>(FeRoutes, path);

  let dynamicCssOrder = cssOrder;
  if (dynamic) {
    dynamicCssOrder = cssOrder.concat([`${routeItem.webpackChunkName}.css`]);
  }

  const manifest = await getManifest();

  if (!routeItem) {
    throw new Error(`With request url ${path} Component is Not Found`);
  }
  const isCsr = !!(mode === 'csr' || ctx.request.query?.csr);

  if (isCsr) {
    logGreen(`Current path ${path} use csr render mode`);
  }

  const { fetch } = routeItem;
  router.push(path);
  await router.isReady();

  let layoutFetchData = {};
  let fetchData = {};

  if (!isCsr) {
    // csr 下不需要服务端获取数据
    if (layoutFetch) {
      layoutFetchData = await layoutFetch({ store, router: router.currentRoute.value }, ctx);
    }
    if (fetch) {
      fetchData = await fetch({ store, router: router.currentRoute.value }, ctx);
    }
  }

  const combineAysncData = Object.assign({}, layoutFetchData ?? {}, fetchData ?? {});
  const asyncData = {
    value: combineAysncData,
  };

  const injectCss: Vue.VNode[] = [];
  dynamicCssOrder.forEach(css => {
    if (manifest[css]) {
      injectCss.push(
        h('link', {
          rel: 'stylesheet',
          href: manifest[css],
        })
      );
    }
  });

  const injectScript = jsOrder.map(js =>
    h('script', {
      src: manifest[js],
    })
  );
  const state = Object.assign({}, store.state ?? {}, asyncData.value);

  const app = createSSRApp({
    render: function () {
      return h(
        Layout,
        { ctx, config },
        {

          customeHeadScript: () =>
            customeHeadScript?.map(item =>
              h(
                'script',
                Object.assign({}, item.describe, {
                  innerHTML: item.content,
                })
              )
            ),

          children: isCsr
            ? () =>
                h('div', {
                  id: 'app',
                })
            : () => h(App, { asyncData, fetchData: combineAysncData }),

          initialData: !isCsr
            ? () =>
                h('script', {
                  innerHTML: `window.__USE_SSR__=true; window.__INITIAL_DATA__ =${serialize(
                    state
                  )};`,
                })
            : () => {},

          cssInject: () => injectCss,

          jsInject: () => injectScript,
        }
      );
    },
  });

  app.use(router);
  app.use(store);
  await router.isReady();

  window.__VUE_APP__ = app;
  return app;
};

export default serverRender;
