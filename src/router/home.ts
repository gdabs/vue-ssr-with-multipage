export default {
  entry: 'home',
  path: '/home',
  fetch: require('@/pages/home/fetch').default,
  component: require('@/pages/home/render.vue').default,
};