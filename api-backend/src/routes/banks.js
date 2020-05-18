var express = require('express');
var router = express.Router();
const authController = require('../controllers').auth;
const banksController = require('../controllers').banks;

// Without Authentication
router.route('/').get(banksController.findAll);

// With Authentication
router.route('/create').post(authController.authorization, banksController.create);
router.route('/update/:id').put(authController.authorization, banksController.update);
router.route('/delete/:id').put(authController.authorization, banksController.delete);
router.route('/search/:value').get(authController.authorization, banksController.search);
router.route('/:id').get(authController.authorization, banksController.findById);

module.exports = router;
