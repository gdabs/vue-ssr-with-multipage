import { StoreOptions } from 'vuex'
import { indexStore } from './modules/index'
import { detailStore } from './modules/detail'
import { searchStore } from './modules/search'

const modules: StoreOptions<any> = {
  modules: {
    indexStore,
    detailStore,
    searchStore
  }
}
export default modules;
