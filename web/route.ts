import * as store from '@/store/index.ts';
export const FeRoutes = [
  {
    fetch: __isBrowser__
      ? () => import(/* webpackChunkName: "detail-id-fetch" */ '@/pages/detail/fetch.ts')
      : require('@/pages/detail/fetch.ts').default,
    path: '/detail/:id',
    component: __isBrowser__
      ? () => import(/* webpackChunkName: "detail-id" */ '@/pages/detail/render$id.vue')
      : require('@/pages/detail/render$id.vue').default,
    webpackChunkName: 'detail-id',
  },
  {
    fetch: __isBrowser__
      ? () => import(/* webpackChunkName: "index-fetch" */ '@/pages/index/fetch.ts')
      : require('@/pages/index/fetch.ts').default,
    path: '/',
    component: __isBrowser__
      ? () => import(/* webpackChunkName: "index" */ '@/pages/index/render.vue')
      : require('@/pages/index/render.vue').default,
    webpackChunkName: 'index',
  },
];
export { default as Layout } from '@/components/layout/index.vue';
export { default as App } from '@/components/layout/App.vue';

export { store };
