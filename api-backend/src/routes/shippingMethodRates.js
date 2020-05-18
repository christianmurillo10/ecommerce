var express = require('express');
var router = express.Router();
const authController = require('../controllers').auth;
const shippingMethodRatesController = require('../controllers').shippingMethodRates;

router.route('/').get(authController.authorization, shippingMethodRatesController.findAll);
router.route('/create').post(authController.authorization, shippingMethodRatesController.create);
router.route('/update/:id').put(authController.authorization, shippingMethodRatesController.update);
router.route('/delete/:id').put(authController.authorization, shippingMethodRatesController.delete);
router.route('/search/:value').get(authController.authorization, shippingMethodRatesController.search);
router.route('/:id').get(authController.authorization, shippingMethodRatesController.findById);

module.exports = router;
