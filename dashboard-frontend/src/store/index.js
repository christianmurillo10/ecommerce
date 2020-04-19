import Vue from "vue";
import Vuex from "vuex";

// Modules
import alerts from './modules/utilities/alerts'
import snackbars from './modules/utilities/snackbars'
import toolbar from './modules/toolbar'
import userAuthentication from './modules/userAuthentication'
import users from './modules/users'
import roles from './modules/roles'
import customers from './modules/customers'
import frontendPolicyPages from './modules/frontendPolicyPages'
import frontendSliderImages from './modules/frontendSliderImages'
import frontendUsefulLinks from './modules/frontendUsefulLinks'
import productBrands from './modules/productBrands'
import productCategories from './modules/productCategories'
import productSubCategories from './modules/productSubCategories'
import productSubSubCategories from './modules/productSubSubCategories'
import productImages from './modules/productImages'
import productOptions from './modules/productOptions'
import productFlashDealHeaders from './modules/productFlashDealHeaders'
import productFlashDealDetails from './modules/productFlashDealDetails'
import products from './modules/products'
import inventories from './modules/inventories'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    alerts,
    snackbars,
    toolbar,
    userAuthentication,
    users,
    roles,
    customers,
    frontendPolicyPages,
    frontendSliderImages,
    frontendUsefulLinks,
    productBrands,
    productCategories,
    productSubCategories,
    productSubSubCategories,
    productImages,
    productOptions,
    productFlashDealHeaders,
    productFlashDealDetails,
    products,
    inventories
  }
});
