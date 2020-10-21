const Model = require("../models");
const { ErrorHandler, handleSuccess } = require("../helpers/response-helper");
const { NO, YES } = require("../helpers/constant-helper");

module.exports = {
  /**
   * Create
   * @routes POST /shippingMethodRates/create
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

      // Override variables
      params.created_at = moment().utc(8).format("YYYY-MM-DD HH:mm:ss");
      params.rate_amount = params.rate_amount
        ? params.rate_amount.toLocaleString()
        : null;
      params.subtotal_amount_from = params.subtotal_amount_from
        ? params.subtotal_amount_from.toLocaleString()
        : null;
      params.subtotal_amount_to = params.subtotal_amount_to
        ? params.subtotal_amount_to.toLocaleString()
        : null;
      params.quantity_from = params.quantity_from
        ? params.quantity_from.toLocaleString()
        : null;
      params.quantity_to = params.quantity_to
        ? params.quantity_to.toLocaleString()
        : null;
      params.shipping_method_id = params.shipping_method_id
        ? params.shipping_method_id.toLocaleString()
        : null;

      if (_.isEmpty(params.rate_amount))
        errors.push("Rate Amount is required.");
      if (_.isEmpty(params.shipping_method_id))
        errors.push("Shipping Method is required.");
      if (errors.length > 0) {
        throw new ErrorHandler(400, errors);
      }

      // Validate Data
      criteria = { where: { rate_amount: params.rate_amount, is_deleted: NO } };
      data = await Model.ShippingMethodRates.findAll(criteria);
      if (!_.isEmpty(data[0])) {
        errors.push("Data already exist.");
        throw new ErrorHandler(500, errors);
      }

      // Pre-setting variables
      initialValues = _.pick(params, [
        "rate_amount",
        "subtotal_amount_from",
        "subtotal_amount_to",
        "quantity_from",
        "quantity_to",
        "shipping_method_id",
        "created_at",
      ]);
      let finalData = await Model.ShippingMethodRates.create(initialValues);

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
   * @route PUT /shippingMethodRates/update/:id
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

      // Override Variables
      params.updated_at = moment().utc(8).format("YYYY-MM-DD HH:mm:ss");

      // Validate Data
      data = await Model.ShippingMethodRates.findByPk(req.params.id);
      if (_.isEmpty(data)) {
        errors.push("Data doesn't exist.");
        throw new ErrorHandler(500, errors);
      }

      // Pre-setting variables
      initialValues = _.pick(params, [
        "rate_amount",
        "subtotal_amount_from",
        "subtotal_amount_to",
        "quantity_from",
        "quantity_to",
        "shipping_method_id",
        "updated_at",
      ]);
      let finalData = await data.update(initialValues);

      handleSuccess(res, {
        statusCode: 200,
        message: "Successfully updated data.",
        result: finalData,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Delete
   * @route PUT /shippingMethodRates/delete/:id
   */
  delete: async (req, res, next) => {
    let errors = [],
      data;

    try {
      // Validate Data
      data = await Model.ShippingMethodRates.findByPk(req.params.id);
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
   * Find all
   * @route GET /shippingMethodRates
   */
  findAll: async (req, res, next) => {
    let errors = [],
      data,
      criteria;

    try {
      // Validate Data
      criteria = { where: { is_deleted: NO } };
      data = await Model.ShippingMethodRates.findAll(criteria);
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
   * Find all by shipping method id
   * @route GET /shippingMethodRates/findAllbyShippingMethodId/:shippingMethodId
   */
  findAllbyShippingMethodId: async (req, res, next) => {
    const params = req.params;
    let errors = [],
      data,
      criteria;

    try {
      // Validate Data
      criteria = {
        where: { shipping_method_id: params.shippingMethodId, is_deleted: NO },
      };
      data = await Model.ShippingMethodRates.findAll(criteria);
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
   * @route GET /shippingMethodRates/:id
   */
  findById: async (req, res, next) => {
    let errors = [], data;

    try {
      // Validate Data
      data = await Model.ShippingMethodRates.findByPk(req.params.id);
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
};
