const Model = require('../models');
const fs = require('fs');
const path = require('path');
const bcrypt = require('../helpers/bcrypt-helper');
const { 
  NO, 
  YES,
  CUSTOMER_STATUS_APPROVED,
  CUSTOMER_STATUS_DECLINED,
  CUSTOMER_STATUS_PENDING
} = require('../helpers/constant-helper');
const EmailerActions = require('../mailer/emailer-actions');

module.exports = {
  /**
   * Create
   * @param req
   * @param res
   * @returns {Promise<void>}
   * @routes POST /customers/create
   */
  create: async (req, res) => {
    const params = req.body;
    let criteria, initialValues, data;

    // Validators
    if (_.isUndefined(params))
      return res.badRequest({ err: "Invalid Parameter: [params]" });
    if (_.isEmpty(params))
      return res.badRequest({ err: "Empty Parameter: [params]" });

    // Override variables
    params.created_at = moment().utc(8).format('YYYY-MM-DD HH:mm:ss');
    params.gender_type = params.gender_type === null ? null : params.gender_type.toLocaleString();
    params.status = params.status.toLocaleString();
    if (params.status === CUSTOMER_STATUS_APPROVED.toLocaleString()) params.customer_no = await generateCustomerNo();

    if (!_.isUndefined(req.file)) {
      let extension = path.extname(params.file_name);
      let fileName = `${params.email}${extension}`;
      params.file_name = fileName;
    } else {
      params.file_name = null;
    }

    try {
      // Validators
      if (_.isEmpty(params.firstname)) return res.json({ status: 200, message: "Firstname required.", result: false });
      if (_.isEmpty(params.lastname)) return res.json({ status: 200, message: "Lastname required.", result: false });
      if (_.isEmpty(params.email)) return res.json({ status: 200, message: "Email required.", result: false });
      if (_.isEmpty(params.password)) return res.json({ status: 200, message: "Password required.", result: false });
      if (_.isEmpty(params.primary_address)) return res.json({ status: 200, message: "Primary Address required.", result: false });
      if (_.isEmpty(params.contact_no)) return res.json({ status: 200, message: "Contact No. required.", result: false });

      // Pre-setting variables
      criteria = { where: { email: params.email } };
      initialValues = _.pick(params, [
        'customer_no', 
        'firstname', 
        'middlename', 
        'lastname', 
        'email', 
        'password', 
        'primary_address', 
        'secondary_address', 
        'contact_no', 
        'file_name', 
        'date_approved', 
        'gender_type', 
        'status', 
        'created_at'
      ]);
      // Execute findAll query
      data = await Model.Customers.findAll(criteria);
      if (_.isEmpty(data[0])) {
        let finalData = await Model.Customers.create(initialValues);
        finalData = finalData.get({ plain: true });
        //Sending of email for verification if pending status
        // if (finalData.status === "3") await EmailerActions.sendEmailRegistrationConfirmation(finalData);
        // For Upload Images
        if (!_.isUndefined(req.file)) {
          let fileUpload = await uploadImage(params.file_name, req.file);
        }
        res.json({
          status: 200,
          message: "Successfully created data.",
          result: _.omit(finalData, ['password', 'is_deleted'])
        });
      } else {
        res.json({
          status: 200,
          message: "Data already exist.",
          result: false
        });
      }
    } catch (err) {
      res.json({
        status: 401,
        err: err,
        message: "Failed creating data."
      });
    }
  },

  /**
   * Create Pending
   * @param req
   * @param res
   * @returns {Promise<void>}
   * @routes POST /customers/create/pending
   */
  createPending: async (req, res) => {
    const params = req.body;
    const emailChecker = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let criteria, initialValues, data;

    // Validators
    if (_.isUndefined(params))
      return res.badRequest({ err: "Invalid Parameter: [params]" });
    if (_.isEmpty(params))
      return res.badRequest({ err: "Empty Parameter: [params]" });

    // Override variables
    params.created_at = moment().utc(8).format('YYYY-MM-DD HH:mm:ss');
    params.gender_type = params.gender_type === null ? null : params.gender_type.toLocaleString();
    params.status = CUSTOMER_STATUS_PENDING;

    try {
      // Validators
      if (_.isEmpty(params.firstname)) return res.json({ status: 200, message: "Firstname required.", result: false });
      if (_.isEmpty(params.lastname)) return res.json({ status: 200, message: "Lastname required.", result: false });
      if (_.isEmpty(params.email)) return res.json({ status: 200, message: "Email required.", result: false });
      if (_.isEmpty(params.password)) return res.json({ status: 200, message: "Password required.", result: false });
      if (_.isEmpty(params.primary_address)) return res.json({ status: 200, message: "Primary Address required.", result: false });
      if (_.isEmpty(params.contact_no)) return res.json({ status: 200, message: "Contact No. required.", result: false });
      if (!emailChecker.test(params.email)) return res.json({ status: 200, message: "Invalid email format.", result: false });

      // Pre-setting variables
      criteria = { where: { email: params.email } };
      initialValues = _.pick(params, [
        'firstname', 
        'middlename', 
        'lastname', 
        'email', 
        'password', 
        'primary_address', 
        'contact_no', 
        'gender_type', 
        'status', 
        'created_at'
      ]);
      // Execute findAll query
      data = await Model.Customers.findAll(criteria);
      if (_.isEmpty(data[0])) {
        let finalData = await Model.Customers.create(initialValues);
        //Sending of email for verification
        // await EmailerActions.sendEmailRegistrationConfirmation(finalData);
        res.json({
          status: 200,
          message: "Successfully created data.",
          result: _.omit(finalData.get({ plain: true }), ['password', 'is_deleted'])
        });
      } else {
        res.json({
          status: 200,
          message: "Email already exist.",
          result: false
        });
      }
    } catch (err) {
      res.json({
        status: 401,
        err: err,
        message: "Failed creating data."
      });
    }
  },

  /**
   * Update
   * @route PUT /customers/update/:id
   * @param req
   * @param res
   * @returns {never}
   */
  update: async (req, res) => {
    const params = req.body;
    let initialValues, data;

    if (_.isUndefined(params))
      return res.badRequest({ err: "Invalid Parameter: [params]" });
    if (_.isEmpty(params))
      return res.badRequest({ err: "Empty Parameter: [params]" });

    try {
      // Execute findByPk query
      data = await Model.Customers.findByPk(req.params.id);

      // Override variables
      if (!_.isUndefined(req.file)) {
        let extension = path.extname(params.file_name);
        let fileName = `${params.email}${extension}`;
        params.file_name = fileName;
      } else {
        params.file_name = data.file_name;
      }
      if (params.status === CUSTOMER_STATUS_APPROVED.toLocaleString()) params.customer_no = await generateCustomerNo();
      
      // Pre-setting variables
      initialValues = _.pick(params, [
        'customer_no', 
        'firstname', 
        'middlename', 
        'lastname', 
        'email', 
        'password', 
        'primary_address', 
        'secondary_address', 
        'contact_no', 
        'file_name', 
        'date_approved', 
        'gender_type', 
        'status'
      ]);

      if (!_.isEmpty(data)) {
        let finalData = await data.update(initialValues);
        // For Upload Images
        if (!_.isUndefined(req.file)) {
          let fileUpload = await uploadImage(params.file_name, req.file);
        }
        res.json({
          status: 200,
          message: "Successfully updated data.",
          result: _.omit(finalData.get({ plain: true }), ['password', 'is_deleted'])
        });
      } else {
        res.json({
          status: 200,
          message: "Data doesn't exist.",
          result: false
        });
      }
    } catch (err) {
      res.json({
        status: 401,
        err: err,
        message: "Failed updating data."
      });
    }
  },

  /**
   * Delete
   * @route PUT /customers/delete/:id
   * @param req
   * @param res
   * @returns {never}
   */
  delete: async (req, res) => {
    let data;

    try {
      // Execute findByPk query
      data = await Model.Customers.findByPk(req.params.id);
      if (!_.isEmpty(data)) {
        let finalData = await data.update({ is_deleted: YES });
        res.json({
          status: 200,
          message: "Successfully deleted data.",
          result: finalData
        });
      } else {
        res.json({
          status: 200,
          message: "Data doesn't exist.",
          result: false
        });
      }
    } catch (err) {
      res.json({
        status: 401,
        err: err,
        message: "Failed deleting data."
      });
    }
  },

  /**
   * Change Password
   * @route PUT /customers/changePassword/:id
   * @param req
   * @param res
   * @returns {never}
   */
  changePassword: async (req, res) => {
    const params = req.body;
    let initialValues, data, compareOldPassword, compareNewPassword;

    if (_.isUndefined(params))
      return res.badRequest({ err: "Invalid Parameter: [params]" });
    if (_.isEmpty(params))
      return res.badRequest({ err: "Empty Parameter: [params]" });

    try {
      // Validators
      if (_.isEmpty(params.old_password)) return res.json({ status: 200, message: "Old Password is required.", result: false });
      if (_.isEmpty(params.new_password)) return res.json({ status: 200, message: "New Password is required.", result: false });

      // Override variables
      params.updated_at = moment().utc(8).format("YYYY-MM-DD HH:mm:ss");
      params.password = params.new_password;

      // Pre-setting variables
      initialValues = _.pick(params, [
        'password',
        'updated_at'
      ]);
      // Execute findByPk query
      data = await Model.Customers.findByPk(req.params.id);
      if (!_.isEmpty(data)) {
        compareOldPassword = await bcrypt.comparePassword(params.old_password, data.password);
        if (compareOldPassword) {
          compareNewPassword = await bcrypt.comparePassword(params.new_password, data.password);
          if (!compareNewPassword) {
            initialValues.password = await bcrypt.hashPassword(initialValues.password);
            await data.update(initialValues);
            res.json({
              status: 200,
              message: "Successfully changed password.",
              result: true
            });
          } else {
            res.json({
              status: 200,
              message: "New password cannot be the same as your old password.",
              result: false
            });
          }
        } else {
          res.json({
            status: 200,
            message: "Old password is incorrect.",
            result: false
          });
        }
      } else {
        res.json({
          status: 200,
          message: "Data doesn't exist.",
          result: false
        });
      }
    } catch (err) {
      res.json({
        status: 401,
        err: err,
        message: "Failed to change password."
      });
    }
  },

  /**
   * Search
   * @route POST /customers/search/:value
   * @param req
   * @param res
   * @returns {never}
   */
  search: async (req, res) => {
    const params = req.params;
    let query, data;

    if (_.isUndefined(params))
      return res.badRequest({ err: "Invalid Parameter: [params]" });
    if (_.isEmpty(params))
      return res.badRequest({ err: "Empty Parameter: [params]" });

    try {
      // Pre-setting variables
      query = `SELECT * FROM customers WHERE CONCAT(customer_no) LIKE ? AND is_deleted = ${NO};`;
      // Execute native query
      data = await Model.sequelize.query(query, {
        replacements: [`%${params.value}%`],
        type: Model.sequelize.QueryTypes.SELECT
      });
      if (!_.isEmpty(data)) {
        res.json({
          status: 200,
          message: "Successfully searched data.",
          result: data
        });
      } else {
        res.json({
          status: 200,
          message: "No Data Found.",
          result: false
        });
      }
    } catch (err) {
      res.json({
        status: 401,
        err: err,
        message: "Failed to search data."
      });
    }
  },

  /**
   * Find all
   * @route GET /customers
   * @param req
   * @param res
   * @returns {never}
   */
  findAll: async (req, res) => {
    let data, criteria;

    try {
      // Pre-setting variables
      criteria = { where: { is_active: YES, is_deleted: NO } };
      // Execute findAll query
      data = await Model.Customers.findAll(criteria);
      if (!_.isEmpty(data[0])) {
        res.json({
          status: 200,
          message: "Successfully find all data.",
          result: data
        });
      } else {
        res.json({
          status: 200,
          message: "No Data Found.",
          result: false
        });
      }
    } catch (err) {
      res.json({
        status: 401,
        err: err,
        message: "Failed to find all data."
      });
    }
  },

  /**
   * Find by id
   * @route GET /customers/:id
   * @param req
   * @param res
   * @returns {never}
   */
  findById: async (req, res) => {
    let data;

    try {
      // Execute findAll query
      data = await Model.Customers.findByPk(req.params.id);
      if (!_.isEmpty(data)) {
        res.json({
          status: 200,
          message: "Successfully find data.",
          result: _.omit(data.get({ plain: true }), ['is_deleted'])
        });
      } else {
        res.json({
          status: 200,
          message: "No Data Found.",
          result: false
        });
      }
    } catch (err) {
      res.json({
        status: 401,
        err: err,
        message: "Failed to find data."
      });
    }
  },

  /**
   * Count all by status and is active
   * @route GET /customers/countAllByStatusAndIsActive/:status/:isActive
   * @param req
   * @param res
   * @returns {never}
   */
  countAllByStatusAndIsActive: async (req, res) => {
    let count, criteria;

    try {
      // Pre-setting variables
      criteria = { where: { status: req.params.status, is_active: req.params.isActive, is_deleted: NO } };
      // Execute findAll query
      count = await Model.Customers.count(criteria);
      res.json({
        status: 200,
        message: "Successfully count all data.",
        result: count
      });
    } catch (err) {
      res.json({
        status: 401,
        err: err,
        message: "Failed to count all data."
      });
    }
  },

  /**
   * Find by file_name
   * @route GET /customers/viewImage/:fileName
   * @param req
   * @param res
   * @returns {never}
   */
  viewImage: (req, res) => {
    res.sendFile(path.join(__dirname, "../../images/customers/" + req.params.fileName));
  },
};

/**
 * Other Functions
 */
const uploadImage = (name, file) => {
  try {
    fs.writeFile('images/customers/' + name, file.buffer, function (err) {
      if (err) throw err;
    })

    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

const generateCustomerNo = () => {
  return new Promise(async (resolve, reject) => {
    let data, criteria, value;

    try {
      // Pre-setting variables
      criteria = { attributes: ['customer_no'], where: { customer_no: { $ne: null }, is_deleted: NO }, order: [ [ 'id', 'DESC' ]] };
      // Execute findOne query
      data = await Model.Customers.findOne(criteria);
      if (_.isEmpty(data)) {
        value = 'C000001';
      } else {
        let numLength = 6;
        let stringNumber = data.customer_no.substring(1);
        let newNumber = (parseInt(stringNumber) + 1);
        let leadingZero = Array(numLength - (newNumber.toString().length) + 1).join(0);
        value = 'C' + leadingZero + newNumber;
      }
      resolve(value);
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
}