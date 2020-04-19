var express = require('express');
var router = express.Router();
const multer = require('multer');
const upload = multer();

const authController = require('../controllers').auth;
const customersController = require('../controllers').customers;

// Without Authentication
router.route('/:id').get(customersController.findById);
router.route('/viewImage/:fileName').get(customersController.viewImage);

// With Authentication
router.route('/countAllByStatusAndIsActive/:status/:isActive').get(authController.authorization, customersController.countAllByStatusAndIsActive);
router.route('/').get(authController.authorization, customersController.findAll);
router.route('/create').post(authController.authorization, upload.single('image'), customersController.create);
router.route('/update/:id').put(authController.authorization, upload.single('image'), customersController.update);
router.route('/delete/:id').put(authController.authorization, customersController.delete);
router.route('/search/:value').get(authController.authorization, customersController.search);

module.exports = router;
