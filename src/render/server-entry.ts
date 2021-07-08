import * as Vue from 'vue';
import { h, createSSRApp } from 'vue';
import serialize from 'serialize-javascript';
import { createStore } from 'vuex';
import stores from '@/store';
import layoutFetch from '@/layout/fetch';
import Layout from '@/layout/index.vue';
import { IConfig, RouteType, ISSRContext } from '@/interface';

const serverRender = async (ctx: ISSRContext, config: IConfig, manifest: { [key: string]: string; }, route: RouteType ) => {
  global.window = global.window ?? { ...global.window }; // 防止覆盖上层应用自己定义的 window 对象
  global.__VUE_PROD_DEVTOOLS__ = global.__VUE_PROD_DEVTOOLS__ ?? false;
  const store = createStore(stores || {});
  const { customeHeadScript } = config;
  const { entry: chunkName, component, fetch } = route;
  const jsOrder = [`runtime~${chunkName}.js`, 'vendor~default.js', 'vendor.js', `${chunkName}.js`];

  const cssOrder = ['vendor~default.css', `${chunkName}.css`];

  let layoutFetchData = {};
  let fetchData = {};

  if (layoutFetch) {
    layoutFetchData = await layoutFetch({ store }, ctx);
  }
  if (fetch) {
    fetchData = await fetch({ store }, ctx);
  }

  const combineAysncData = Object.assign({}, layoutFetchData ?? {}, fetchData ?? {});
  const asyncData = {
    value: combineAysncData,
  };

  const injectCss: Vue.VNode[] = [];
  cssOrder.forEach(css => {
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
          remInitial: () =>
            h('script', {
              innerHTML:
                "var w = document.documentElement.clientWidth / 3.75;document.getElementsByTagName('html')[0].style['font-size'] = w + 'px'",
            }),
          customeHeadScript: () =>
            customeHeadScript?.map(item =>
              h(
                'script',
                Object.assign({}, item.describe, {
                  innerHTML: item.content,
                })
              )
            ),

          children: () => h(component, { asyncData, fetchData: combineAysncData }),

          initialData: () =>
          h('script', {
            innerHTML: `window.__USE_SSR__=true; window.__INITIAL_DATA__ =${serialize(
              state
            )};`,
          }),

          cssInject: () => injectCss,

          jsInject: () => injectScript,
        }
      );
    },
  });

  app.use(store);

  return app;
};

export default serverRender;
