var express = require('express');
var router = express.Router();
const authController = require('../controllers').auth;
const frontendPolicyPages = require('../controllers').frontendPolicyPages;


// Without Authentication
router.route('/findOneByType/:type').get(frontendPolicyPages.findOneByType);

// With Authentication
router.route('/').get(authController.authorization, frontendPolicyPages.findAll);
router.route('/create').post(authController.authorization, frontendPolicyPages.create);
router.route('/update/:id').put(authController.authorization, frontendPolicyPages.update);
router.route('/delete/:id').put(authController.authorization, frontendPolicyPages.delete);
router.route('/:id').get(authController.authorization, frontendPolicyPages.findById);

module.exports = router;
