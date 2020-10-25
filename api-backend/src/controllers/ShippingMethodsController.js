const Model = require("../models");
const { ErrorHandler, handleSuccess } = require("../helpers/response-helper");
const { NO, YES } = require("../helpers/constant-helper");

module.exports = {
  /**
   * Create
   * @routes POST /shippingMethods/create
   */
  create: async (req, res, next) => {
    const params = req.body;
    let errors = [],
      message = "Successfully created data.",
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

      if (_.isEmpty(params.name)) {
        errors.push("Name is required.");
        throw new ErrorHandler(400, errors);
      }

      // Validate Data
      criteria = { where: { name: params.name } };
      data = await Model.ShippingMethods.findAll(criteria);
      if (!_.isEmpty(data[0])) {
        errors.push("Data already exist.");
        throw new ErrorHandler(409, errors);
      }

      // Pre-setting variables
      initialValues = _.pick(params, ["name", "description", "created_at"]);
      let finalData = await Model.ShippingMethods.create(initialValues);

      handleSuccess(res, {
        statusCode: 201,
        message: message,
        result: _.omit(finalData.get({ plain: true }), ["is_deleted"]),
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Update
   * @route PUT /shippingMethods/update/:id
   */
  update: async (req, res, next) => {
    const params = req.body;
    let errors = [],
      message = "Successfully updated data.",
      initialValues,
      data;

    try {
      // Validators
      if (_.isEmpty(params)) {
        errors.push("Invalid Parameter.");
        throw new ErrorHandler(400, errors);
      }

      // Override Variables
      params.updated_at = moment().utc(8).format("YYYY-MM-DD HH:mm:ss");

      // Validate Data
      data = await Model.ShippingMethods.findByPk(req.params.id);
      if (_.isEmpty(data)) {
        errors.push("Data doesn't exist.");
        throw new ErrorHandler(404, errors);
      }

      // Pre-setting variables
      initialValues = _.pick(params, ["name", "description", "updated_at"]);
      let finalData = await data.update(initialValues);

      handleSuccess(res, {
        statusCode: 200,
        message: message,
        result: finalData,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Delete
   * @route PUT /shippingMethods/delete/:id
   */
  delete: async (req, res, next) => {
    let errors = [],
      message = "Successfully deleted data.",
      data;

    try {
      // Validate Data
      data = await Model.ShippingMethods.findByPk(req.params.id);
      if (_.isEmpty(data)) {
        errors.push("Data doesn't exist.");
        throw new ErrorHandler(404, errors);
      }
      let finalData = await data.update({ is_deleted: YES });

      handleSuccess(res, {
        statusCode: 200,
        message: message,
        result: finalData,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Find all
   * @route GET /shippingMethods
   */
  findAll: async (req, res, next) => {
    let errors = [],
      message = "Successfully find all data.",
      data,
      criteria;

    try {
      // Validate Data
      criteria = { where: { is_deleted: NO } };
      data = await Model.ShippingMethods.findAll(criteria);
      if (_.isEmpty(data[0])) {
        message = "No data found.";
      }

      handleSuccess(res, {
        statusCode: 200,
        message: message,
        result: data,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Find by id
   * @route GET /shippingMethods/:id
   */
  findById: async (req, res, next) => {
    let errors = [],
      message = "Successfully find data.",
      data;

    try {
      // Validate Data
      data = await Model.ShippingMethods.findByPk(req.params.id);
      if (_.isEmpty(data)) {
        errors.push("Data doesn't exist.");
        throw new ErrorHandler(404, errors);
      }

      handleSuccess(res, {
        statusCode: 200,
        message: message,
        result: _.omit(data.get({ plain: true }), ["is_deleted"]),
      });
    } catch (err) {
      next(err);
    }
  },
};
