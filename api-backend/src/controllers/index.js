const auth = require('./AuthController');
const roles = require('./RolesController');
const users = require('./UsersController');
const inventories = require('./InventoriesController');
const inventoryHistories = require('./InventoryHistoriesController');
const productCategories = require('./ProductCategoriesController');
const productSubCategories = require('./ProductSubCategoriesController');
const productAvailableSizes = require('./ProductAvailableSizesController');
const productDiscountedPriceRanges = require('./ProductDiscountedPriceRangesController');
const products = require('./ProductsController');
const productImages = require('./ProductImagesController');
const productBannerImages = require('./ProductBannerImagesController');

module.exports = {
    auth,
    roles,
    users,
    inventories,
    inventoryHistories,
    productCategories,
    productSubCategories,
    productAvailableSizes,
    productDiscountedPriceRanges,
    products,
    productImages,
    productBannerImages
}