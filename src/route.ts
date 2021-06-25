export const FeRoutes = [
  {
    fetch: __isBrowser__
      ? () => import(/* webpackChunkName: "detail-id-fetch" */ '@/pages/detail/fetch')
      : require('@/pages/detail/fetch').default,
    path: '/detail/:id',
    component: __isBrowser__
      ? () => import(/* webpackChunkName: "detail-id" */ '@/pages/detail/render$id.vue')
      : require('@/pages/detail/render$id.vue').default,
    webpackChunkName: 'detail-id',
  },
  {
    fetch: __isBrowser__
      ? () => import(/* webpackChunkName: "index-fetch" */ '@/pages/index/fetch')
      : require('@/pages/index/fetch.ts').default,
    path: '/index',
    component: __isBrowser__
      ? () => import(/* webpackChunkName: "index" */ '@/pages/index/render.vue')
      : require('@/pages/index/render.vue').default,
    webpackChunkName: 'index',
  },
];

