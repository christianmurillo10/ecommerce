var express = require('express');
var router = express.Router();

router.use('/role', require('./roles'));
router.use('/user', require('./users'));
router.use('/inventory', require('./inventories'));
router.use('/inventoryHistory', require('./inventoryHistories'));
router.use('/productBrands', require('./productBrands'));
router.use('/productCategories', require('./productCategories'));
router.use('/productSubCategories', require('./productSubCategories'));
router.use('/productSubSubCategories', require('./productSubSubCategories'));
router.use('/products', require('./products'));
router.use('/productImage', require('./productImages'));
router.use('/productOption', require('./productOptions'));
router.use('/productBannerImage', require('./productBannerImages'));

module.exports = router;
