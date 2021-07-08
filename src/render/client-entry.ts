import { h, createApp, reactive } from 'vue';
import { createStore } from 'vuex';
import stores from '@/store';
// import * as serviceWorker from '@/serviceWorker';
import { RouteType } from '@/interface';

const clientRender = async (route: RouteType) => {
  const store = createStore(stores || {});

  const { component } = route;

  if (window.__INITIAL_DATA__) {
    store.replaceState(window.__INITIAL_DATA__);
  }

  const asyncData = reactive({
    value: window.__INITIAL_DATA__ ?? {},
  });
  let fetchData = window.__INITIAL_DATA__ ?? {};
  const app = createApp({
    render: () =>
      h(component, {
        asyncData,
        fetchData,
      }),
  });

  app.use(store);
  app.mount('#app', !!window.__USE_SSR__); // 这里需要做判断 ssr/csr 来为 true/false

  // If you want your app to work offline and load faster, you can change
  // unregister() to register() below. Note this comes with some pitfalls.
  // Learn more about service workers: https://bit.ly/CRA-PWA
  // serviceWorker.register();
};

export default clientRender;
