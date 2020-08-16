import Vue from 'vue'
import Vuex from 'vuex'

// Modules
import appbar from './modules/appbar'
import loading from './modules/utilities/loading'
import snackbars from './modules/utilities/snackbars'
import customerAuthentication from './modules/customerAuthentication'
import customerCarts from './modules/customerCarts'
import customers from './modules/customers'
import frontendPolicyPages from './modules/frontendPolicyPages'
import frontendSliderImages from './modules/frontendSliderImages'
import frontendUsefulLinks from './modules/frontendUsefulLinks'
import productImages from './modules/productImages'
import productCategories from './modules/productCategories'
import productSubCategories from './modules/productSubCategories'
import productSubSubCategories from './modules/productSubSubCategories'
import productFlashDealHeaders from './modules/productFlashDealHeaders'
import products from './modules/products'
import salesOrders from './modules/salesOrders'
import search from './modules/search'

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
    loading,
    snackbars,
    customerAuthentication,
    customerCarts,
    customers,
    frontendPolicyPages,
    frontendSliderImages,
    frontendUsefulLinks,
    productImages,
    productCategories,
    productSubCategories,
    productSubSubCategories,
    productFlashDealHeaders,
    products,
    salesOrders,
    search
  }
})
