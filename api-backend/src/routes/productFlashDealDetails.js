var express = require('express');
var router = express.Router();
const authController = require('../controllers').auth;
const productFlashDealDetailsController = require('../controllers').productFlashDealDetails;

router.route('/').get(authController.authorization, productFlashDealDetailsController.findAll);
router.route('/findAllbyProductFlashDealId/:productFlashDealId').get(authController.authorization, productFlashDealDetailsController.findAllbyProductFlashDealId);
router.route('/create').post(authController.authorization, productFlashDealDetailsController.create);
router.route('/update/:id').put(authController.authorization, productFlashDealDetailsController.update);
router.route('/delete/:id').put(authController.authorization, productFlashDealDetailsController.delete);
router.route('/:id').get(authController.authorization, productFlashDealDetailsController.findById);

module.exports = router;
