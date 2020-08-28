import Vue from "vue";
import Vuex from "vuex";

// Modules
import alerts from './modules/utilities/alerts'
import loading from './modules/utilities/loading'
import snackbars from './modules/utilities/snackbars'
import toolbar from './modules/toolbar'
import userAuthentication from './modules/userAuthentication'
import users from './modules/users'
import roles from './modules/roles'
import banks from './modules/banks'
import customerCreditDebitCards from './modules/customerCreditDebitCards'
import customers from './modules/customers'
import employees from './modules/employees'
import frontendPolicyPages from './modules/frontendPolicyPages'
import frontendSliderImages from './modules/frontendSliderImages'
import frontendUsefulLinks from './modules/frontendUsefulLinks'
import productBrands from './modules/productBrands'
import productCategories from './modules/productCategories'
import productSubCategories from './modules/productSubCategories'
import productSubSubCategories from './modules/productSubSubCategories'
import productImages from './modules/productImages'
import productFlashDeals from './modules/productFlashDeals'
import productFlashDealDetails from './modules/productFlashDealDetails'
import products from './modules/products'
import productStores from './modules/productStores'
import productVariants from './modules/productVariants'
import productVariationDetails from './modules/productVariationDetails'
import productVariations from './modules/productVariations'
import inventories from './modules/inventories'
import salesOrders from './modules/salesOrders'
import shippingMethods from './modules/shippingMethods'
import shippingMethodRates from './modules/shippingMethodRates'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    alerts,
    loading,
    snackbars,
    toolbar,
    userAuthentication,
    users,
    roles,
    banks,
    customerCreditDebitCards,
    customers,
    employees,
    frontendPolicyPages,
    frontendSliderImages,
    frontendUsefulLinks,
    productBrands,
    productCategories,
    productSubCategories,
    productSubSubCategories,
    productImages,
    productFlashDeals,
    productFlashDealDetails,
    products,
    productStores,
    productVariants,
    productVariationDetails,
    productVariations,
    inventories,
    salesOrders,
    shippingMethods,
    shippingMethodRates
  }
});
