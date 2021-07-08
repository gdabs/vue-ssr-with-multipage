export default {
  entry: 'detail',
  path: '/detail/:id',
  fetch: require('@/pages/detail/fetch').default,
  component: require('@/pages/detail/render$id.vue').default,
};