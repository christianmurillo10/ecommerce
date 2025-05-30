const Model = require("../models");
const { ErrorHandler, handleSuccess } = require("../helpers/response-helper");
const { NO, YES } = require("../helpers/constant-helper");

module.exports = {
  /**
   * Create
   * @routes POST /salesOrderShippingDetails/create
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
      params.amount = params.amount ? params.amount.toLocaleString() : null;
      params.shipping_method_id = params.shipping_method_id
        ? params.shipping_method_id.toLocaleString()
        : null;
      params.shipping_method_rate_id = params.shipping_method_rate_id
        ? params.shipping_method_rate_id.toLocaleString()
        : null;
      params.sales_order_id = params.sales_order_id
        ? params.sales_order_id.toLocaleString()
        : null;

      if (_.isEmpty(params.shipping_no))
        errors.push("Shipping No. is required.");
      if (_.isEmpty(params.address)) errors.push("Address is required.");
      if (_.isEmpty(params.amount)) errors.push("Amount is required.");
      if (_.isEmpty(params.shipping_method_id))
        errors.push("Shipping Method is required.");
      if (_.isEmpty(params.shipping_method_rate_id))
        errors.push("Shipping Method Rate is required.");
      if (_.isEmpty(params.sales_order_id))
        errors.push("Sales Order is required.");
      if (errors.length > 0) {
        throw new ErrorHandler(400, errors);
      }

      // Validate Data
      criteria = {
        where: {
          shipping_no: params.shipping_no,
          sales_order_id: params.sales_order_id,
          is_deleted: NO,
        },
        include: [
          {
            model: Model.ShippingMethods,
            as: "shippingMethods",
            attributes: ["name"],
          },
          {
            model: Model.ShippingMethodRates,
            as: "shippingMethodRates",
            attributes: ["rate_amount"],
          },
        ],
      };
      data = await Model.SalesOrderShippingDetails.findAll(criteria);
      if (!_.isEmpty(data[0])) {
        errors.push("Data already exist.");
        throw new ErrorHandler(409, errors);
      }

      // Pre-setting variables
      initialValues = _.pick(params, [
        "shipping_no",
        "address",
        "amount",
        "shipping_method_id",
        "shipping_method_rate_id",
        "sales_order_id",
        "created_at",
      ]);
      let finalData = await Model.SalesOrderShippingDetails.create(
        initialValues
      );

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
   * @route PUT /salesOrderShippingDetails/update/:id
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
            model: Model.ShippingMethods,
            as: "shippingMethods",
            attributes: ["name"],
          },
          {
            model: Model.ShippingMethodRates,
            as: "shippingMethodRates",
            attributes: ["rate_amount"],
          },
        ],
      };
      data = await Model.SalesOrderShippingDetails.findByPk(
        req.params.id,
        criteria
      );
      if (_.isEmpty(data)) {
        errors.push("Data doesn't exist.");
        throw new ErrorHandler(404, errors);
      }

      // Pre-setting variables
      initialValues = _.pick(params, [
        "shipping_no",
        "address",
        "amount",
        "shipping_method_id",
        "shipping_method_rate_id",
        "sales_order_id",
        "updated_at",
      ]);

      await data.update(initialValues).then(() =>
        Model.SalesOrderShippingDetails.findByPk(data.id, criteria).then(
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
   * @route PUT /salesOrderShippingDetails/delete/:id
   */
  delete: async (req, res, next) => {
    let errors = [],
      message = "Successfully deleted data.",
      data;

    try {
      // Validate Data
      data = await Model.SalesOrderShippingDetails.findByPk(req.params.id);
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
   * @route GET /salesOrderShippingDetails
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
            model: Model.ShippingMethods,
            as: "shippingMethods",
            attributes: ["name"],
          },
          {
            model: Model.ShippingMethodRates,
            as: "shippingMethodRates",
            attributes: ["rate_amount"],
          },
        ],
      };
      data = await Model.SalesOrderShippingDetails.findAll(criteria);
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
   * @route GET /salesOrderShippingDetails/findAllbySalesOrderId/:salesOrderId
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
            model: Model.ShippingMethods,
            as: "shippingMethods",
            attributes: ["name"],
          },
          {
            model: Model.ShippingMethodRates,
            as: "shippingMethodRates",
            attributes: ["rate_amount"],
          },
        ],
      };
      data = await Model.SalesOrderShippingDetails.findAll(criteria);
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
   * @route GET /salesOrderShippingDetails/:id
   */
  findById: async (req, res, next) => {
    let errors = [],
      message = "Successfully find data.",
      data;

    try {
      // Validate Data
      data = await Model.SalesOrderShippingDetails.findByPk(req.params.id);
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

  /**
   * Public Functions
   */

  /**
   * Insert Sales Order Shipping Details
   */
  insertSalesOrderShippingDetails: (obj) => {
    return new Promise(async (resolve, reject) => {
      try {
        let initialValues;

        // Pre-setting variables
        obj.shipping_no = await generateShippingNo();
        obj.created_at = moment().utc(8).format("YYYY-MM-DD HH:mm:ss");
        initialValues = _.pick(obj, [
          "shipping_no",
          "address",
          "amount",
          "shipping_method_id",
          "shipping_method_rate_id",
          "sales_order_id",
          "created_at",
        ]);
        Model.SalesOrderShippingDetails.create(initialValues)
          .then((response) => {
            resolve(true);
          })
          .catch((err) => {
            resolve(false);
          });
      } catch (err) {
        reject(err);
      }
    });
  },

  /**
   * Update Sales Order Shipping Details
   */
  updateSalesOrderShippingDetails: (obj) => {
    return new Promise(async (resolve, reject) => {
      try {
        let initialValues, data;

        // Pre-setting variables
        obj.updated_at = moment().utc(8).format("YYYY-MM-DD HH:mm:ss");
        initialValues = _.pick(obj, [
          "shipping_no",
          "address",
          "amount",
          "shipping_method_id",
          "shipping_method_rate_id",
          "updated_at",
        ]);

        data = await Model.SalesOrderShippingDetails.findByPk(obj.id);
        data
          .update(initialValues)
          .then((response) => {
            resolve(true);
          })
          .catch((err) => {
            resolve(false);
          });
      } catch (err) {
        reject(err);
      }
    });
  },
};

/**
 * Private Functions
 */
const generateShippingNo = () => {
  return new Promise(async (resolve, reject) => {
    let data, criteria, value;

    try {
      let date = moment().utc(8).format("YYYY-MM-DD");
      date = date.split("-").join("");
      // Pre-setting variables
      criteria = {
        attributes: ["shipping_no"],
        where: { shipping_no: { $ne: null }, is_deleted: NO },
        order: [["id", "DESC"]],
      };
      // Execute findOne query
      data = await Model.SalesOrderShippingDetails.findOne(criteria);
      if (_.isEmpty(data)) {
        value = `SH${date}-000001`;
      } else {
        let numLength = 6;
        let stringNumber = data.shipping_no.substring(11);
        let newNumber = parseInt(stringNumber) + 1;
        let leadingZero = Array(
          numLength - newNumber.toString().length + 1
        ).join(0);
        value = `SH${date}-${leadingZero}${newNumber}`;
      }
      resolve(value);
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
};
