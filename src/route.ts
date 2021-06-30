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
      ? () => import(/* webpackChunkName: "home-fetch" */ '@/pages/home/fetch')
      : require('@/pages/home/fetch').default,
    path: '/home',
    component: __isBrowser__
      ? () => import(/* webpackChunkName: "home" */ '@/pages/home/render.vue')
      : require('@/pages/home/render.vue').default,
    webpackChunkName: 'home',
  },
];

