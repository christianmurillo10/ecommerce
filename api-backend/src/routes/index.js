var express = require('express');
var router = express.Router();

router.use('/role', require('./roles'));
router.use('/user', require('./users'));
router.use('/inventory', require('./inventories'));
router.use('/inventoryHistory', require('./inventoryHistories'));
router.use('/productBrand', require('./productBrands'));
router.use('/productCategory', require('./productCategories'));
router.use('/productSubCategory', require('./productSubCategories'));
router.use('/productSubSubCategory', require('./productSubSubCategories'));
router.use('/productAvailableSize', require('./productAvailableSizes'));
router.use('/productDiscountedPriceRange', require('./productDiscountedPriceRanges'));
router.use('/product', require('./products'));
router.use('/productImage', require('./productImages'));
router.use('/productBannerImage', require('./productBannerImages'));

module.exports = router;
