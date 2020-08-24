const auth = require('./AuthController');
const roles = require('./RolesController');
const users = require('./UsersController');
const banks = require('./BanksController');
const customerCreditDebitCards = require('./CustomerCreditDebitCardsController');
const customers = require('./CustomersController');
const employees = require('./EmployeesController');
const frontendPolicyPages = require('./frontendPolicyPagesController');
const frontendSliderImages = require('./FrontendSliderImagesController');
const frontendUsefulLinks = require('./FrontendUsefulLinksController');
const inventories = require('./InventoriesController');
const inventoryHistories = require('./InventoryHistoriesController');
const productBrands = require('./ProductBrandsController');
const productCategories = require('./ProductCategoriesController');
const productSubCategories = require('./ProductSubCategoriesController');
const productSubSubCategories = require('./ProductSubSubCategoriesController');
const productOptions = require('./ProductOptionsController');
const products = require('./ProductsController');
const productStores = require('./ProductStoresController');
const productVariations = require('./ProductVariationsController');
const productImages = require('./ProductImagesController');
const productFlashDealHeaders = require('./ProductFlashDealHeadersController');
const productFlashDealDetails = require('./ProductFlashDealDetailsController');
const salesOrderDetails = require('./SalesOrderDetailsController');
const salesOrders = require('./SalesOrdersController');
const salesOrderShippingDetails = require('./SalesOrderShippingDetailsController');
const shippingMethods = require('./ShippingMethodsController');
const shippingMethodRates = require('./ShippingMethodRatesController');

module.exports = {
  auth,
  roles,
  users,
  banks,
  customerCreditDebitCards,
  customers,
  employees,
  frontendPolicyPages,
  frontendSliderImages,
  frontendUsefulLinks,
  inventories,
  inventoryHistories,
  productBrands,
  productCategories,
  productSubCategories,
  productSubSubCategories,
  productOptions,
  products,
  productStores,
  productVariations,
  productImages,
  productFlashDealHeaders,
  productFlashDealDetails,
  salesOrderDetails,
  salesOrders,
  salesOrderShippingDetails,
  shippingMethods,
  shippingMethodRates
}