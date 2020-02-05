var express = require('express');
var router = express.Router();
const authController = require('../controllers').auth;
const productDiscountedPriceRangesController = require('../controllers').productDiscountedPriceRanges;

router.route('/').get(productDiscountedPriceRangesController.findAll);
router.route('/:id').get(productDiscountedPriceRangesController.findById);
router.route('/findAllbyProductId/:productId').get(productDiscountedPriceRangesController.findAllbyProductId);
router.route('/create').post(authController.authorization, productDiscountedPriceRangesController.create);
router.route('/update/:id').put(authController.authorization, productDiscountedPriceRangesController.update);
router.route('/delete/:id').put(authController.authorization, productDiscountedPriceRangesController.delete);
router.route('/search/:value').get(authController.authorization, productDiscountedPriceRangesController.search);

module.exports = router;
