import { App } from 'vue';
import { Router } from 'vue-router';

declare module '*.less';
interface IWindow extends Window {
  __USE_SSR__?: boolean;
  __INITIAL_DATA__?: any;
  STORE_CONTEXT?: any;
  __USE_VITE__?: boolean;
}
declare global {
  interface Window {
    __USE_SSR__?: IWindow['__USE_SSR__'];
    __INITIAL_DATA__?: IWindow['__INITIAL_DATA__'];
    STORE_CONTEXT?: IWindow['STORE_CONTEXT'];
    __VUE_ROUTER__: Router;
    __VUE_APP__: App;
  }
  var __VUE_PROD_DEVTOOLS__: boolean;
  const __isBrowser__: boolean;
}
