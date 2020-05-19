var express = require('express');
var router = express.Router();

const authController = require('../controllers').auth;
const employeesController = require('../controllers').employees;

router.route('/countAllByIsActive/:isActive').get(authController.authorization, employeesController.countAllByIsActive);
router.route('/').get(authController.authorization, employeesController.findAll);
router.route('/:id').get(authController.authorization, employeesController.findById);
router.route('/create').post(authController.authorization, employeesController.create);
router.route('/update/:id').put(authController.authorization, employeesController.update);
router.route('/delete/:id').put(authController.authorization, employeesController.delete);
router.route('/search/:value').get(authController.authorization, employeesController.search);

module.exports = router;
