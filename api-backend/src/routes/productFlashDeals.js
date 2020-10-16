var express = require('express');
var router = express.Router();
const authController = require('../controllers').auth;
const productFlashDealsController = require('../controllers').productFlashDeals;

router.route('/findOne/todayFlashDeal').get(productFlashDealsController.findTodayFlashDeal);

router.route('/').get(authController.authorization, productFlashDealsController.findAll);
router.route('/create').post(authController.authorization, productFlashDealsController.create);
router.route('/update/:id').put(authController.authorization, productFlashDealsController.update);
router.route('/delete/:id').put(authController.authorization, productFlashDealsController.delete);
router.route('/:id').get(authController.authorization, productFlashDealsController.findById);

module.exports = router;
