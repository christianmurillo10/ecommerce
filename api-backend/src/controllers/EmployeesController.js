const Model = require("../models");
const { ErrorHandler, handleSuccess } = require("../helpers/response-helper");
const path = require("path");
const { NO, YES } = require("../helpers/constant-helper");

module.exports = {
  /**
   * Create
   * @routes POST /employees/create
   */
  create: async (req, res, next) => {
    const params = req.body;
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
      if (_.isEmpty(params.firstname)) errors.push("Firstname is required.");
      if (_.isEmpty(params.lastname)) errors.push("Lastname is required.");
      if (_.isEmpty(params.email)) errors.push("Email is required.");
      if (_.isEmpty(params.primary_address))
        errors.push("Primary Address is required.");
      if (_.isEmpty(params.contact_no)) errors.push("Contact No. is required.");
      if (_.isEmpty(params.date_hired)) errors.push("Date Hired is required.");
      if (errors.length > 0) {
        throw new ErrorHandler(400, errors);
      }

      // Override variables
      params.created_at = moment().utc(8).format("YYYY-MM-DD HH:mm:ss");
      params.employee_no = await generateEmployeeNo();
      params.gender_type = params.gender_type
        ? params.gender_type.toLocaleString()
        : null;

      // Validate Data
      criteria = { where: { email: params.email } };
      data = await Model.Employees.findAll(criteria);
      if (!_.isEmpty(data[0])) {
        errors.push("Data already exist.");
        throw new ErrorHandler(500, errors);
      }

      // Pre-setting variables
      initialValues = _.pick(params, [
        "employee_no",
        "firstname",
        "middlename",
        "lastname",
        "email",
        "primary_address",
        "secondary_address",
        "contact_no",
        "date_hired",
        "gender_type",
        "created_at",
      ]);
      let finalData = await Model.Employees.create(initialValues);

      handleSuccess(res, {
        statusCode: 201,
        message: "Successfully created data.",
        result: _.omit(finalData.get({ plain: true }), ["is_deleted"]),
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Update
   * @route PUT /employees/update/:id
   * @param req
   * @param res
   * @returns {never}
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

      // Override variables
      params.updated_at = moment().utc(8).format("YYYY-MM-DD HH:mm:ss");

      // Validate Data
      data = await Model.Employees.findByPk(req.params.id);
      if (_.isEmpty(data)) {
        errors.push("Data doesn't exist.");
        throw new ErrorHandler(500, errors);
      }

      // Pre-setting variables
      initialValues = _.pick(params, [
        "employee_no",
        "firstname",
        "middlename",
        "lastname",
        "email",
        "primary_address",
        "secondary_address",
        "contact_no",
        "date_hired",
        "date_endo",
        "gender_type",
        "updated_at",
        "is_active",
      ]);
      let finalData = await data.update(initialValues);

      handleSuccess(res, {
        statusCode: 200,
        message: "Successfully updated data.",
        result: _.omit(finalData.get({ plain: true }), ["is_deleted"]),
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Delete
   * @route PUT /employees/delete/:id
   * @param req
   * @param res
   * @returns {never}
   */
  delete: async (req, res, next) => {
    let errors = [],
      data;

    try {
      // Validate Data
      data = await Model.Employees.findByPk(req.params.id);
      if (_.isEmpty(data)) {
        errors.push("Data doesn't exist.");
        throw new ErrorHandler(500, errors);
      }
      let finalData = await data.update({ is_deleted: YES });

      res.json({
        status: 200,
        message: "Successfully deleted data.",
        result: finalData,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Find all
   * @route GET /employees
   */
  findAll: async (req, res, next) => {
    let errors = [],
      data,
      criteria;

    try {
      // Validate Data
      criteria = { where: { is_deleted: NO } };
      data = await Model.Employees.findAll(criteria);
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
   * @route GET /employees/:id
   */
  findById: async (req, res, next) => {
    let errors = [],
      data;

    try {
      // Validate Data
      data = await Model.Employees.findByPk(req.params.id);
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
   * @route GET /employees/countAllByIsActive/:isActive
   */
  countAllByIsActive: async (req, res, next) => {
    let errors = [],
      count,
      criteria;

    try {
      criteria = { where: { is_active: req.params.isActive, is_deleted: NO } };
      count = await Model.Employees.count(criteria);

      handleSuccess(res, {
        statusCode: 200,
        message: "Successfully count all data.",
        result: count,
      });
    } catch (err) {
      next(err);
    }
  },
};

const generateEmployeeNo = () => {
  return new Promise(async (resolve, reject) => {
    let data, criteria, value;

    try {
      // Pre-setting variables
      criteria = {
        attributes: ["employee_no"],
        where: { employee_no: { $ne: null }, is_deleted: NO },
        order: [["id", "DESC"]],
      };
      // Execute findOne query
      data = await Model.Employees.findOne(criteria);
      if (_.isEmpty(data)) {
        value = "E000001";
      } else {
        let numLength = 6;
        let stringNumber = data.employee_no.substring(1);
        let newNumber = parseInt(stringNumber) + 1;
        let leadingZero = Array(
          numLength - newNumber.toString().length + 1
        ).join(0);
        value = "E" + leadingZero + newNumber;
      }
      resolve(value);
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
};
