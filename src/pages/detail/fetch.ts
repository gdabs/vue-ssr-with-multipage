import request from '@/utils/request';

export default async ({ store }) => {
  const { data } = await request.post({url: `/api/detail/cbba934b14f747049187`});
  await store.dispatch('detailStore/initialData', { payload: { data } })
};
