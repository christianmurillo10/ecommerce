var express = require('express');
var router = express.Router();
const authController = require('../controllers').auth;
const productOptionsController = require('../controllers').productOptions;

router.route('/').get(productOptionsController.findAll);
router.route('/:id').get(productOptionsController.findById);
router.route('/findAllbyProductId/:productId').get(productOptionsController.findAllbyProductId);
router.route('/create').post(authController.authorization, productOptionsController.create);
router.route('/update/:id').put(authController.authorization, productOptionsController.update);
router.route('/delete/:id').put(authController.authorization, productOptionsController.delete);
router.route('/search/:value').get(authController.authorization, productOptionsController.search);

module.exports = router;
