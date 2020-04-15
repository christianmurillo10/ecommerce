var express = require('express');
var router = express.Router();
const authController = require('../controllers').auth;
const productFlashDealDetailsController = require('../controllers').productFlashDealDetails;

router.route('/').get(authController.authorization, productFlashDealDetailsController.findAll);
router.route('/create').post(authController.authorization, productFlashDealDetailsController.create);
router.route('/update/:id').put(authController.authorization, productFlashDealDetailsController.update);
router.route('/delete/:id').put(authController.authorization, productFlashDealDetailsController.delete);
router.route('/search/:value').get(authController.authorization, productFlashDealDetailsController.search);
router.route('/:id').get(authController.authorization, productFlashDealDetailsController.findById);

module.exports = router;
