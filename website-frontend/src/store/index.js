import Vue from 'vue'
import Vuex from 'vuex'

// Modules
import appbar from './modules/appbar'
import snackbars from './modules/utilities/snackbars'
import customerCarts from './modules/customerCarts'
import frontendSliderImages from './modules/frontendSliderImages'
import productImages from './modules/productImages'
import productCategories from './modules/productCategories'
import productSubCategories from './modules/productSubCategories'
import productFlashDealHeaders from './modules/productFlashDealHeaders'
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
    customerCarts,
    frontendSliderImages,
    productImages,
    productCategories,
    productSubCategories,
    productFlashDealHeaders,
    products
  }
})
