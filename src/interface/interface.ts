import { VNode } from 'vue';
import { Store } from 'vuex';
import * as Koa from 'koa';

export type ISSRContext<T = {}> = Koa.Context & T;
export declare type ESMFeRouteItem<T = {}> = {
  path: string;
} & T;

export type Fetch = (
  params: { store: Store<any>; },
  ctx?: ISSRContext
) => Promise<any>;
export interface RouteType {
  entry: string;
  path: string;
  fetch?: Fetch;
  component: VNode;
};