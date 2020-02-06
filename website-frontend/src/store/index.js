import Vue from 'vue'
import Vuex from 'vuex'

// Modules
import appbar from './modules/appbar'
import snackbars from './modules/utilities/snackbars'
import productBannerImages from './modules/productBannerImages'
import productImages from './modules/productImages'
import productCategories from './modules/productCategories'
import productSubCategories from './modules/productSubCategories'
import products from './modules/products'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    appbar,
    snackbars,
    productBannerImages,
    productImages,
    productCategories,
    productSubCategories,
    products
  }
})
