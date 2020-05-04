import Vue from 'vue'
import Vuex from 'vuex'

// Modules
import appbar from './modules/appbar'
import snackbars from './modules/utilities/snackbars'
import customerAuthentication from './modules/customerAuthentication'
import customerCarts from './modules/customerCarts'
import customers from './modules/customers'
import frontendSliderImages from './modules/frontendSliderImages'
import productImages from './modules/productImages'
import productCategories from './modules/productCategories'
import productSubCategories from './modules/productSubCategories'
import productSubSubCategories from './modules/productSubSubCategories'
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
    customerAuthentication,
    customerCarts,
    customers,
    frontendSliderImages,
    productImages,
    productCategories,
    productSubCategories,
    productSubSubCategories,
    productFlashDealHeaders,
    products
  }
})
