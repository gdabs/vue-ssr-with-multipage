import { ISSRContext, IndexData } from '@/interface';
interface ApiDeatilservice {
  index: () => Promise<IndexData>
}

export default async ({ store, router }, ctx?: ISSRContext<{
  apiDeatilservice?: ApiDeatilservice
}>) => {
  const data = await window.fetch(`/api/detail/${router.params.id}`);
  await store.dispatch('detailStore/initialData', { payload: data })
}
