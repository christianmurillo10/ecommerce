var express = require('express');
var router = express.Router();
const authController = require('../controllers').auth;
const inventoriesController = require('../controllers').inventories;

router.route('/').get(authController.authorization, inventoriesController.findAll);
router.route('/:id').get(authController.authorization, inventoriesController.findById);
router.route('/findBySku/:sku').get(authController.authorization, inventoriesController.findBySku);
router.route('/findAllbyProductId/:productId').get(inventoriesController.findAllbyProductId);
router.route('/findAvailableQuantityByProductId/:productId').get(inventoriesController.findAvailableQuantityByProductId);
router.route('/create').post(authController.authorization, inventoriesController.create);
router.route('/generateBulkWithProductVariantsByProductId').post(authController.authorization, inventoriesController.generateBulkWithProductVariantsByProductId);
router.route('/update/:id').put(authController.authorization, inventoriesController.update);
router.route('/delete/:id').put(authController.authorization, inventoriesController.delete);
router.route('/search/:value').get(authController.authorization, inventoriesController.search);

module.exports = router;
