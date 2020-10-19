var express = require('express');
var router = express.Router();
const authController = require('../controllers').auth;
const productVariationDetailsController = require('../controllers').productVariationDetails;

// With Authentication
router.route('/').get(authController.authorization, productVariationDetailsController.findAll);
router.route('/:id').get(authController.authorization, productVariationDetailsController.findById);
router.route('/findAllbyProductVariationId/:productVariationId').get(authController.authorization, productVariationDetailsController.findAllbyProductVariationId);
router.route('/create').post(authController.authorization, productVariationDetailsController.create);
router.route('/update/:id').put(authController.authorization, productVariationDetailsController.update);
router.route('/delete/:id').put(authController.authorization, productVariationDetailsController.delete);

module.exports = router;
