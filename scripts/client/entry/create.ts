
import { createRouter as create, createWebHistory, createMemoryHistory } from 'vue-router'
import { createStore as createVuexStore } from 'vuex'
import * as Routes from '@/route';

import { RoutesType, VueRouterOptions } from './interface'

const { store, FeRoutes } = Routes as RoutesType

function createRouter (options: VueRouterOptions = {}) {
  const base = options.base ?? '/'
  return create({
    history: __isBrowser__ ? createWebHistory(base) : createMemoryHistory(),
    // @ts-expect-error
    routes: FeRoutes
  })
}

function createStore () {
  return createVuexStore(store ?? {})
}

export {
  createRouter,
  createStore
}
