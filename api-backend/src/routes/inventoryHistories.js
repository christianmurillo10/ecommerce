var express = require('express');
var router = express.Router();
const authController = require('../controllers').auth;
const inventoryHistoriesController = require('../controllers').inventoryHistories;

router.route('/').get(authController.authorization, inventoryHistoriesController.findAll);
router.route('/:id').get(authController.authorization, inventoryHistoriesController.findById);
router.route('/findAllbyInventoryId/:inventoryId').get(authController.authorization, inventoryHistoriesController.findAllbyInventoryId);
router.route('/delete/:id').put(authController.authorization, inventoryHistoriesController.delete);

module.exports = router;
