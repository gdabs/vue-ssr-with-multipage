import request from '@/utils/request';

export default async ({ store, router }) => {
  const data = await request.post({ url: '/api/home' });
  await store.dispatch('indexStore/initialData', { payload: { data } });
};
