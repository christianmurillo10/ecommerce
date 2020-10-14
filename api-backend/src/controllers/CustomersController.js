const Model = require("../models");
const { ErrorHandler, handleSuccess } = require("../helpers/response-helper");
const fs = require("fs");
const path = require("path");
const bcrypt = require("../helpers/bcrypt-helper");
const {
  NO,
  YES,
  CUSTOMER_STATUS_APPROVED,
  CUSTOMER_STATUS_DECLINED,
  CUSTOMER_STATUS_PENDING,
} = require("../helpers/constant-helper");
const EmailerActions = require("../mailer/emailer-actions");

module.exports = {
  /**
   * Create
   * @routes POST /customers/create
   */
  create: async (req, res, next) => {
    const params = req.body;
    const emailChecker = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let errors = [],
      criteria,
      initialValues,
      data;

    try {
      // Validators
      if (_.isEmpty(params)) {
        errors.push("Invalid Parameter.");
        throw new ErrorHandler(400, errors);
      }

      // Override variables
      params.created_at = moment().utc(8).format("YYYY-MM-DD HH:mm:ss");
      params.gender_type = params.gender_type
        ? params.gender_type.toLocaleString()
        : null;
      params.status = params.status
        ? params.status.toLocaleString()
        : CUSTOMER_STATUS_PENDING;
      if (params.status === CUSTOMER_STATUS_APPROVED.toLocaleString()) {
        params.customer_no = await generateCustomerNo();
      }
      if (!_.isUndefined(req.file)) {
        let extension = path.extname(params.file_name);
        let fileName = `${params.email}${extension}`;
        params.file_name = fileName;
      } else {
        params.file_name = null;
      }

      if (_.isEmpty(params.firstname)) errors.push("Firstname is required.");
      if (_.isEmpty(params.lastname)) errors.push("Lastname is required.");
      if (_.isEmpty(params.email)) errors.push("Email is required.");
      if (_.isEmpty(params.password)) errors.push("Password is required.");
      if (_.isEmpty(params.primary_address))
        errors.push("Primary Address is required.");
      if (_.isEmpty(params.contact_no)) errors.push("Contact No. is required.");
      if (errors.length > 0) {
        throw new ErrorHandler(400, errors);
      }

      // Validate Data
      criteria = { where: { email: params.email } };
      data = await Model.Customers.findAll(criteria);
      if (!_.isEmpty(data[0])) {
        errors.push("Data already exist.");
        throw new ErrorHandler(500, errors);
      }

      // Pre-setting variables
      initialValues = _.pick(params, [
        "customer_no",
        "firstname",
        "middlename",
        "lastname",
        "email",
        "password",
        "primary_address",
        "secondary_address",
        "contact_no",
        "file_name",
        "date_approved",
        "gender_type",
        "status",
        "created_at",
      ]);

      let finalData = await Model.Customers.create(initialValues);
      finalData = finalData.get({ plain: true });
      //Sending of email for verification if pending status
      // if (finalData.status === "3") await EmailerActions.sendEmailRegistrationConfirmation(finalData);
      // For Upload Images
      if (!_.isUndefined(req.file)) {
        let fileUpload = await uploadImage(params.file_name, req.file);
      }

      handleSuccess(res, {
        statusCode: 201,
        message: "Successfully created data.",
        result: _.omit(finalData, ["password", "is_deleted"]),
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Create Pending
   * @routes POST /customers/create/pending
   */
  createPending: async (req, res, next) => {
    const params = req.body;
    const emailChecker = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let errors = [],
      criteria,
      initialValues,
      data;

    try {
      // Validators
      if (_.isEmpty(params)) {
        errors.push("Invalid Parameter.");
        throw new ErrorHandler(400, errors);
      }

      // Override variables
      params.created_at = moment().utc(8).format("YYYY-MM-DD HH:mm:ss");
      params.gender_type = params.gender_type
        ? params.gender_type.toLocaleString()
        : null;
      params.status = CUSTOMER_STATUS_PENDING;

      if (_.isEmpty(params.firstname)) errors.push("Firstname is required.");
      if (_.isEmpty(params.lastname)) errors.push("Lastname is required.");
      if (_.isEmpty(params.email)) errors.push("Email is required.");
      if (_.isEmpty(params.password)) errors.push("Password is required.");
      if (_.isEmpty(params.primary_address))
        errors.push("Primary Address is required.");
      if (_.isEmpty(params.contact_no)) errors.push("Contact No. is required.");
      if (!emailChecker.test(params.email))
        errors.push("Invalid email format.");
      if (errors.length > 0) {
        throw new ErrorHandler(400, errors);
      }

      // Validate Data
      criteria = { where: { email: params.email } };
      data = await Model.Customers.findAll(criteria);
      if (!_.isEmpty(data[0])) {
        errors.push("Email already exist.");
        throw new ErrorHandler(500, errors);
      }

      // Pre-setting variables
      initialValues = _.pick(params, [
        "firstname",
        "middlename",
        "lastname",
        "email",
        "password",
        "primary_address",
        "secondary_address",
        "contact_no",
        "gender_type",
        "status",
        "created_at",
      ]);

      let finalData = await Model.Customers.create(initialValues);
      //Sending of email for verification
      // await EmailerActions.sendEmailRegistrationConfirmation(finalData);

      handleSuccess(res, {
        statusCode: 201,
        message: "Successfully created data.",
        result: _.omit(finalData.get({ plain: true }), [
          "password",
          "is_deleted",
        ]),
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Update
   * @route PUT /customers/update/:id
   */
  update: async (req, res, next) => {
    const params = req.body;
    let errors = [],
      initialValues,
      data;

    try {
      // Validators
      if (_.isEmpty(params)) {
        errors.push("Invalid Parameter.");
        throw new ErrorHandler(400, errors);
      }

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
      if (params.status === CUSTOMER_STATUS_APPROVED.toLocaleString())
        params.customer_no = await generateCustomerNo();

      // Validate Data
      if (_.isEmpty(data)) {
        errors.push("Data doesn't exist.");
        throw new ErrorHandler(500, errors);
      }

      // Pre-setting variables
      initialValues = _.pick(params, [
        "customer_no",
        "firstname",
        "middlename",
        "lastname",
        "email",
        "password",
        "primary_address",
        "secondary_address",
        "contact_no",
        "file_name",
        "date_approved",
        "gender_type",
        "status",
      ]);

      let finalData = await data.update(initialValues);
      // For Upload Images
      if (!_.isUndefined(req.file)) {
        let fileUpload = await uploadImage(params.file_name, req.file);
      }

      handleSuccess(res, {
        statusCode: 200,
        message: "Successfully updated data.",
        result: _.omit(finalData.get({ plain: true }), [
          "password",
          "is_deleted",
        ]),
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Delete
   * @route PUT /customers/delete/:id
   */
  delete: async (req, res, next) => {
    let errors = [],
      data;

    try {
      // Validate Data
      data = await Model.Customers.findByPk(req.params.id);
      if (_.isEmpty(data)) {
        errors.push("Data doesn't exist.");
        throw new ErrorHandler(500, errors);
      }
      let finalData = await data.update({ is_deleted: YES });

      handleSuccess(res, {
        statusCode: 200,
        message: "Successfully deleted data.",
        result: finalData,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Change Password
   * @route PUT /customers/changePassword/:id
   */
  changePassword: async (req, res, next) => {
    const params = req.body;
    let errors = [],
      initialValues,
      data,
      compareOldPassword,
      compareNewPassword;

    try {
      // Validators
      if (_.isEmpty(params)) {
        errors.push("Invalid Parameter.");
        throw new ErrorHandler(400, errors);
      }
      if (_.isEmpty(params.old_password))
        errors.push("Old Password is required.");
      if (_.isEmpty(params.new_password))
        errors.push("New Password is required.");
      if (errors.length > 0) {
        throw new ErrorHandler(400, errors);
      }

      // Override variables
      params.updated_at = moment().utc(8).format("YYYY-MM-DD HH:mm:ss");
      params.password = params.new_password;

      // Validate Data
      data = await Model.Customers.findByPk(req.params.id);
      if (_.isEmpty(data)) {
        errors.push("Data doesn't exist.");
        throw new ErrorHandler(500, errors);
      }

      // Validate Old Password
      compareOldPassword = await bcrypt.comparePassword(
        params.old_password,
        data.password
      );
      if (!compareOldPassword) {
        errors.push("Old password is incorrect.");
        throw new ErrorHandler(500, errors);
      }

      // Validate New Password
      compareNewPassword = await bcrypt.comparePassword(
        params.new_password,
        data.password
      );
      if (compareNewPassword) {
        errors.push("New password cannot be the same as your old password.");
        throw new ErrorHandler(500, errors);
      }

      // Pre-setting variables
      initialValues = _.pick(params, ["password", "updated_at"]);
      initialValues.password = await bcrypt.hashPassword(
        initialValues.password
      );
      await data.update(initialValues);

      handleSuccess(res, {
        statusCode: 200,
        message: "Successfully changed password.",
        result: [],
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Find all
   * @route GET /customers
   */
  findAll: async (req, res, next) => {
    let errors = [],
      data,
      criteria;

    try {
      // Validate Data
      criteria = { where: { is_active: YES, is_deleted: NO } };
      data = await Model.Customers.findAll(criteria);
      if (_.isEmpty(data[0])) {
        errors.push("No data found.");
        throw new ErrorHandler(500, errors);
      }

      handleSuccess(res, {
        statusCode: 200,
        message: "Successfully find all data.",
        result: data,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Find by id
   * @route GET /customers/:id
   */
  findById: async (req, res, next) => {
    let errors = [],
      data;

    try {
      // Validate Data
      data = await Model.Customers.findByPk(req.params.id);
      if (_.isEmpty(data)) {
        errors.push("No data found.");
        throw new ErrorHandler(500, errors);
      }

      handleSuccess(res, {
        statusCode: 200,
        message: "Successfully find data.",
        result: _.omit(data.get({ plain: true }), ["is_deleted"]),
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Count all by status and is active
   * @route GET /customers/countAllByStatusAndIsActive/:status/:isActive
   */
  countAllByStatusAndIsActive: async (req, res, next) => {
    const params = req.params;
    let errors = [],
      count,
      criteria;

    try {
      criteria = {
        where: {
          status: params.status,
          is_active: params.isActive,
          is_deleted: NO,
        },
      };
      count = await Model.Customers.count(criteria);

      handleSuccess(res, {
        statusCode: 200,
        message: "Successfully count all data.",
        result: count,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Find by file_name
   * @route GET /customers/viewImage/:fileName
   */
  viewImage: (req, res) => {
    res.sendFile(
      path.join(__dirname, "../../images/customers/" + req.params.fileName)
    );
  },
};

/**
 * Other Functions
 */
const uploadImage = (name, file) => {
  try {
    fs.writeFile("images/customers/" + name, file.buffer, function (err) {
      if (err) throw err;
    });

    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

const generateCustomerNo = () => {
  return new Promise(async (resolve, reject) => {
    let data, criteria, value;

    try {
      // Pre-setting variables
      criteria = {
        attributes: ["customer_no"],
        where: { customer_no: { $ne: null }, is_deleted: NO },
        order: [["id", "DESC"]],
      };
      // Execute findOne query
      data = await Model.Customers.findOne(criteria);
      if (_.isEmpty(data)) {
        value = "C000001";
      } else {
        let numLength = 6;
        let stringNumber = data.customer_no.substring(1);
        let newNumber = parseInt(stringNumber) + 1;
        let leadingZero = Array(
          numLength - newNumber.toString().length + 1
        ).join(0);
        value = "C" + leadingZero + newNumber;
      }
      resolve(value);
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
};
