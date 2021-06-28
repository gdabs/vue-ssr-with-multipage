import { ISSRContext, IndexData } from '@/interface';
interface IApiService {
  index: () => Promise<IndexData>;
}

export default async (
  { store, router },
  ctx?: ISSRContext<{
    apiService?: IApiService;
  }>
): Promise<any> => {
  const data = await window.fetch(`/api/home`);
  await store.dispatch('indexStore/initialData', { payload: data });
};
