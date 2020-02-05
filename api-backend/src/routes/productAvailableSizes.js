var express = require('express');
var router = express.Router();
const authController = require('../controllers').auth;
const productAvailableSizesController = require('../controllers').productAvailableSizes;

router.route('/').get(productAvailableSizesController.findAll);
router.route('/:id').get(productAvailableSizesController.findById);
router.route('/findAllbyProductId/:productId').get(productAvailableSizesController.findAllbyProductId);
router.route('/create').post(authController.authorization, productAvailableSizesController.create);
router.route('/update/:id').put(authController.authorization, productAvailableSizesController.update);
router.route('/delete/:id').put(authController.authorization, productAvailableSizesController.delete);
router.route('/search/:value').get(authController.authorization, productAvailableSizesController.search);

module.exports = router;
