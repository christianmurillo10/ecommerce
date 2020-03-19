const auth = require('./AuthController');
const roles = require('./RolesController');
const users = require('./UsersController');
const inventories = require('./InventoriesController');
const inventoryHistories = require('./InventoryHistoriesController');
const productBrands = require('./ProductBrandsController');
const productCategories = require('./ProductCategoriesController');
const productSubCategories = require('./ProductSubCategoriesController');
const productSubSubCategories = require('./ProductSubSubCategoriesController');
const productOptions = require('./ProductOptionsController');
const products = require('./ProductsController');
const productImages = require('./ProductImagesController');
const productBannerImages = require('./ProductBannerImagesController');

module.exports = {
    auth,
    roles,
    users,
    inventories,
    inventoryHistories,
    productBrands,
    productCategories,
    productSubCategories,
    productSubSubCategories,
    productOptions,
    products,
    productImages,
    productBannerImages
}