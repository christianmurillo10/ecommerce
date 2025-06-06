var express = require('express');
var router = express.Router();
const authController = require('../controllers').auth;
const inventoriesController = require('../controllers').inventories;

router.route('/').get(authController.authorization, inventoriesController.findAll);
router.route('/findAllTotalQuantity').get(authController.authorization, inventoriesController.findAllTotalQuantity);
router.route('/findAllbyProductId/:productId').get(inventoriesController.findAllbyProductId);
router.route('/findAvailableQuantityByProductId/:productId').get(inventoriesController.findAvailableQuantityByProductId);
router.route('/findBySku/:sku').get(authController.authorization, inventoriesController.findBySku);
router.route('/:id').get(authController.authorization, inventoriesController.findById);
router.route('/addStock/:id').put(authController.authorization, inventoriesController.addStock);
router.route('/generateBulkWithProductVariantsByProductId').post(authController.authorization, inventoriesController.generateBulkWithProductVariantsByProductId);
router.route('/update/:id').put(authController.authorization, inventoriesController.update);
router.route('/delete/:id').put(authController.authorization, inventoriesController.delete);

module.exports = router;
