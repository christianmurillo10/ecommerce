var express = require('express');
var router = express.Router();
const authController = require('../controllers').auth;
const productFlashDealHeadersController = require('../controllers').productFlashDealHeaders;

router.route('/findOne/todayFlashDeal').get(productFlashDealHeadersController.findTodayFlashDeal);

router.route('/').get(authController.authorization, productFlashDealHeadersController.findAll);
router.route('/create').post(authController.authorization, productFlashDealHeadersController.create);
router.route('/update/:id').put(authController.authorization, productFlashDealHeadersController.update);
router.route('/delete/:id').put(authController.authorization, productFlashDealHeadersController.delete);
router.route('/search/:value').get(authController.authorization, productFlashDealHeadersController.search);
router.route('/:id').get(authController.authorization, productFlashDealHeadersController.findById);

module.exports = router;
