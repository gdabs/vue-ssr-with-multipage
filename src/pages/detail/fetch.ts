import request from '@/utils/request';

export default async ({ store, router }) => {
  const { data } = await request.post({url: `/api/detail/${router.params.id}`});
  await store.dispatch('detailStore/initialData', { payload: { data } })
};
