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
  const data = __isBrowser__
    ? await (await window.fetch('/api/index')).json()
    : await ctx?.apiService?.index();
  await store.dispatch('indexStore/initialData', { payload: data });
};
