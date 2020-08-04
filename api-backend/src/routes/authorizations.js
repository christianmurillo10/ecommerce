var express = require('express');
var router = express.Router();
const authController = require('../controllers').auth;

router.route('/validateToken').post(authController.validateToken);

module.exports = router;
