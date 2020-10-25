const Model = require("../models");
const { ErrorHandler, handleSuccess } = require("../helpers/response-helper");
const { NO, YES } = require("../helpers/constant-helper");

module.exports = {
  /**
   * Create
   * @routes POST /salesOrderDetails/create
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
      params.quantity = params.quantity
        ? params.quantity.toLocaleString()
        : null;
      params.rate_amount = params.rate_amount
        ? params.rate_amount.toLocaleString()
        : null;
      params.discount_amount = params.discount_amount
        ? params.discount_amount.toLocaleString()
        : null;
      params.amount = params.amount ? params.amount.toLocaleString() : null;
      params.product_id = params.product_id
        ? params.product_id.toLocaleString()
        : null;
      params.sales_order_id = params.sales_order_id
        ? params.sales_order_id.toLocaleString()
        : null;
      params.claim_type = params.claim_type
        ? params.claim_type.toLocaleString()
        : null;

      if (_.isEmpty(params.sku)) errors.push("SKU is required.");
      if (_.isEmpty(params.variant_details))
        errors.push("Variant is required.");
      if (_.isEmpty(params.variant_details))
        errors.push("Variant is required.");
      if (_.isEmpty(params.quantity)) errors.push("Quantity is required.");
      if (_.isEmpty(params.rate_amount))
        errors.push("Rate Amount is required.");
      if (_.isEmpty(params.amount)) errors.push("Amount is required.");
      if (_.isEmpty(params.product_id)) errors.push("Product is required.");
      if (_.isEmpty(params.sales_order_id))
        errors.push("Sales Order is required.");
      if (_.isEmpty(params.claim_type)) errors.push("Claim Type is required.");
      if (errors.length > 0) {
        throw new ErrorHandler(400, errors);
      }

      // Validate Data
      criteria = {
        where: {
          sku: params.sku,
          sales_order_id: params.sales_order_id,
          is_deleted: NO,
        },
        include: [
          {
            model: Model.Products,
            as: "products",
            attributes: ["name", "unit"],
          },
        ],
      };
      data = await Model.SalesOrderDetails.findAll(criteria);
      if (!_.isEmpty(data[0])) {
        errors.push("Data already exist.");
        throw new ErrorHandler(409, errors);
      }

      // Pre-setting variables
      initialValues = _.pick(params, [
        "sku",
        "variant_details",
        "remarks",
        "quantity",
        "rate_amount",
        "discount_percentage",
        "discount_amount",
        "total_discount_amount",
        "amount",
        "product_id",
        "sales_order_id",
        "created_at",
        "discount_type",
        "claim_type",
        "is_flash_deal",
      ]);
      let finalData = await Model.SalesOrderDetails.create(initialValues);

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
   * @route PUT /salesOrderDetails/update/:id
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

      // Override variables
      params.updated_at = moment().utc(8).format("YYYY-MM-DD HH:mm:ss");

      // Validate Data
      criteria = {
        include: [
          {
            model: Model.Products,
            as: "products",
            attributes: ["name", "unit"],
          },
        ],
      };
      data = await Model.SalesOrderDetails.findByPk(req.params.id, criteria);
      if (_.isEmpty(data)) {
        errors.push("Data doesn't exist.");
        throw new ErrorHandler(404, errors);
      }

      // Pre-setting variables
      initialValues = _.pick(params, [
        "sku",
        "variant_details",
        "remarks",
        "quantity",
        "rate_amount",
        "discount_percentage",
        "discount_amount",
        "total_discount_amount",
        "amount",
        "product_id",
        "sales_order_id",
        "date",
        "updated_at",
        "discount_type",
        "claim_type",
        "status",
        "is_flash_deal",
      ]);

      await data.update(initialValues).then(() =>
        Model.SalesOrderDetails.findByPk(data.id, criteria).then(
          (finalData) => {
            handleSuccess(res, {
              statusCode: 200,
              message: message,
              result: _.omit(finalData.get({ plain: true }), ["is_deleted"]),
            });
          }
        )
      );
    } catch (err) {
      next(err);
    }
  },

  /**
   * Delete
   * @route PUT /salesOrderDetails/delete/:id
   */
  delete: async (req, res, next) => {
    let errors = [],
      message = "Successfully deleted data.",
      data;

    try {
      // Validate Data
      data = await Model.SalesOrderDetails.findByPk(req.params.id);
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
   * @route GET /salesOrderDetails
   */
  findAll: async (req, res, next) => {
    let errors = [],
      message = "Successfully find all data.",
      data,
      criteria;

    try {
      // Validate Data
      criteria = {
        where: { is_deleted: NO },
        include: [
          {
            model: Model.Products,
            as: "products",
            attributes: ["name", "unit"],
          },
        ],
      };
      data = await Model.SalesOrderDetails.findAll(criteria);
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
   * Find all by sales order id
   * @route GET /salesOrderDetails/findAllbySalesOrderId/:salesOrderId
   */
  findAllbySalesOrderId: async (req, res, next) => {
    const params = req.params;
    let errors = [],
      message = "Successfully find all data.",
      data,
      criteria;

    try {
      // Validate Data
      criteria = {
        where: { sales_order_id: params.salesOrderId, is_deleted: NO },
        include: [
          {
            model: Model.Products,
            as: "products",
            attributes: ["name", "unit"],
          },
        ],
      };
      data = await Model.SalesOrderDetails.findAll(criteria);
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
   * @route GET /salesOrderDetails/:id
   */
  findById: async (req, res, next) => {
    let errors = [],
      message = "Successfully find data.",
      data;

    try {
      // Validate Data
      data = await Model.SalesOrderDetails.findByPk(req.params.id);
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
