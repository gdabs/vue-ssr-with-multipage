import { createRouter as create, createWebHistory, createMemoryHistory } from 'vue-router';
import { createStore as createVuexStore } from 'vuex';
import { FeRoutes } from '@/route';
import store from '@/store';

import { VueRouterOptions } from '@/interface';

function createRouter(options: VueRouterOptions = {}) {
  const base = options.base ?? '/';
  return create({
    history: __isBrowser__ ? createWebHistory(base) : createMemoryHistory(),
    routes: FeRoutes,
  });
}

function createStore() {
  return createVuexStore(store);
}

export { createRouter, createStore };
