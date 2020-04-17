var express = require('express');
var router = express.Router();

router.use('/roles', require('./roles'));
router.use('/users', require('./users'));
router.use('/frontendPolicyPages', require('./frontendPolicyPages'));
router.use('/frontendSliderImages', require('./frontendSliderImages'));
router.use('/inventories', require('./inventories'));
router.use('/inventoryHistories', require('./inventoryHistories'));
router.use('/productBrands', require('./productBrands'));
router.use('/productCategories', require('./productCategories'));
router.use('/productSubCategories', require('./productSubCategories'));
router.use('/productSubSubCategories', require('./productSubSubCategories'));
router.use('/products', require('./products'));
router.use('/productImages', require('./productImages'));
router.use('/productOptions', require('./productOptions'));
router.use('/productFlashDealHeaders', require('./productFlashDealHeaders'));
router.use('/productFlashDealDetails', require('./productFlashDealDetails'));

module.exports = router;
