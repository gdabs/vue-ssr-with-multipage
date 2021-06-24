import { VNode } from 'vue';
import { Store, StoreOptions } from 'vuex';
import { RouteLocationNormalizedLoaded } from 'vue-router';
import * as Koa from 'koa';

export type ISSRContext<T = {}> = (Koa.Context) & T;
export declare type ESMFeRouteItem<T = {}> = {
  path: string;
  webpackChunkName: string;
} & T;

export type Fetch = (
  params: { store: Store<any>; router: RouteLocationNormalizedLoaded },
  ctx?: ISSRContext
) => Promise<any>;
export type ESMFetch = () => Promise<{
  default: Fetch;
}>;

export type IClientFeRouteItem = ESMFeRouteItem<{
  fetch?: ESMFetch;
}>;

export type IServerFeRouteItem = ESMFeRouteItem<{
  fetch?: Fetch;
}>;

export interface RoutesType {
  Layout: VNode;
  App: VNode;
  layoutFetch?: (
    params: { store: Store<any>; router: RouteLocationNormalizedLoaded },
    ctx?: ISSRContext
  ) => Promise<any>;
  FeRoutes: IClientFeRouteItem[];
  BASE_NAME?: string;
  store?: StoreOptions<any>;
}

export interface VueRouterOptions {
  base?: string;
}
