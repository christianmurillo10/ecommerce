const Model = require("../models");
const { ErrorHandler, handleSuccess } = require("../helpers/response-helper");
const SalesOrdersController = require("./SalesOrdersController");
const CustomerBalanceController = require("./CustomerBalanceController");
const { NO, YES } = require("../helpers/constant-helper");

module.exports = {
  /**
   * Create
   * @routes POST /payments/create
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
      params.reference_no = await generateReferenceNo();
      params.vat_amount = params.vat_amount
        ? params.vat_amount.toLocaleString()
        : null;
      params.amount = params.amount ? params.amount.toLocaleString() : null;
      params.customer_id = params.customer_id
        ? params.customer_id.toLocaleString()
        : null;
      params.sales_order_id = params.sales_order_id
        ? params.sales_order_id.toLocaleString()
        : null;
      params.bank_id = params.bank_id ? params.bank_id.toLocaleString() : null;
      params.customer_credit_debit_card_id = params.customer_credit_debit_card_id
        ? params.customer_credit_debit_card_id.toLocaleString()
        : null;
      params.payment_method_type = params.payment_method_type
        ? params.payment_method_type.toLocaleString()
        : null;
      params.is_with_vat = params.is_with_vat
        ? params.is_with_vat.toLocaleString()
        : null;

      if (_.isEmpty(params.reference_no))
        errors.push("Reference No. is required.");
      if (_.isEmpty(params.amount)) errors.push("Amount is required.");
      if (_.isEmpty(params.customer_id)) errors.push("Customer is required.");
      if (_.isEmpty(params.sales_order_id))
        errors.push("Sales Order is required.");
      if (_.isEmpty(params.date)) errors.push("Date is required.");
      if (_.isEmpty(params.payment_method_type))
        errors.push("Payment Method is required.");
      if (errors.length > 0) {
        throw new ErrorHandler(400, errors);
      }

      // Validate Data
      criteria = {
        where: { reference_no: params.reference_no },
        include: [
          {
            model: Model.Customers,
            as: "customers",
            attributes: ["customer_no", "firstname", "middlename", "lastname"],
          },
          {
            model: Model.SalesOrders,
            as: "salesOrders",
            attributes: ["order_no"],
          },
        ],
      };
      data = await Model.Payments.findAll(criteria);
      if (!_.isEmpty(data[0])) {
        errors.push("Data already exist.");
        throw new ErrorHandler(409, errors);
      }

      initialValues = _.pick(params, [
        "reference_no",
        "or_no",
        "remarks",
        "vat_amount",
        "amount",
        "customer_id",
        "sales_order_id",
        "bank_id",
        "customer_credit_debit_card_id",
        "date",
        "created_at",
        "payment_method",
        "is_with_vat",
      ]);

      await Model.Payments.create(initialValues)
        .then(() => Model.Payments.findOrCreate(criteria))
        .then(async ([finalData, created]) => {
          let plainData = finalData.get({ plain: true });

          // Update sales order total balance amount and paid status
          await SalesOrdersController.updateTotalAmountBalanceAndPaidStatus({
            sales_order_id: params.sales_order_id,
            amount: params.amount,
            type: "INSERT",
          });

          // Insert customer balance
          await CustomerBalanceController.insertCreditBalanceOverpaymentAndAmount(
            {
              customer_id: params.customer_id,
              sales_order_id: params.sales_order_id,
              payment_id: plainData.id,
              amount: params.amount,
            }
          );

          handleSuccess(res, {
            statusCode: 201,
            message: message,
            result: _.omit(plainData, ["is_deleted"]),
          });
        });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Update
   * @route PUT /payments/update/:id
   */
  update: async (req, res, next) => {
    const params = req.body;
    let errors = [],
      message = "Successfully updated data.",
      initialValues,
      data,
      criteria;

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
        where: { is_deleted: NO },
        include: [
          {
            model: Model.Customers,
            as: "customers",
            attributes: ["customer_no", "firstname", "middlename", "lastname"],
          },
          {
            model: Model.SalesOrders,
            as: "salesOrders",
            attributes: ["order_no"],
          },
        ],
      };
      data = await Model.Payments.findByPk(req.params.id);
      if (_.isEmpty(data)) {
        errors.push("Data doesn't exist.");
        throw new ErrorHandler(404, errors);
      }

      // Pre-setting variables
      initialValues = _.pick(params, [
        "or_no",
        "remarks",
        "vat_amount",
        "amount",
        "customer_id",
        "sales_order_id",
        "bank_id",
        "customer_credit_debit_card_id",
        "date",
        "updated_at",
        "payment_method",
        "is_with_vat",
      ]);

      await data.update(initialValues).then(() =>
        Model.Payments.findByPk(data.id, criteria).then(async (finalData) => {
          let plainData = finalData.get({ plain: true });
          handleSuccess(res, {
            statusCode: 200,
            message: message,
            result: _.omit(plainData, ["is_deleted"]),
          });
        })
      );
    } catch (err) {
      next(err);
    }
  },

  /**
   * Delete
   * @route PUT /payments/delete/:id
   */
  delete: async (req, res, next) => {
    let errors = [],
      message = "Successfully deleted data.",
      data;

    try {
      // Validate Data
      data = await Model.Payments.findByPk(req.params.id);
      if (_.isEmpty(data)) {
        errors.push("Data doesn't exist.");
        throw new ErrorHandler(404, errors);
      }

      // Update sales order total balance amount and paid status
      await SalesOrdersController.updateTotalAmountBalanceAndPaidStatus({
        sales_order_id: data.sales_order_id,
        amount: data.amount,
        type: "DELETE",
      });

      await CustomerBalanceController.insertDebitBalanceAndAmount({
        remarks: `DELETE PAYMENT FOR ${data.reference_no}`,
        amount: data.amount,
        customer_id: data.customer_id,
        sales_order_id: data.sales_order_id,
      });

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
   * @route GET /payments
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
            model: Model.Customers,
            as: "customers",
            attributes: ["customer_no", "firstname", "middlename", "lastname"],
          },
          {
            model: Model.SalesOrders,
            as: "salesOrders",
            attributes: ["order_no"],
          },
        ],
      };
      data = await Model.Payments.findAll(criteria);
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
   * @route GET /payments/:id
   */
  findById: async (req, res, next) => {
    let errors = [],
      message = "Successfully find data.",
      data,
      criteria;

    try {
      // Validate Data
      criteria = {
        where: { is_deleted: NO },
        include: [
          {
            model: Model.Customers,
            as: "customers",
            attributes: ["customer_no", "firstname", "middlename", "lastname"],
          },
          {
            model: Model.SalesOrders,
            as: "salesOrders",
            attributes: ["order_no"],
          },
        ],
      };
      data = await Model.Payments.findByPk(req.params.id);
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

/**
 * Other Functions
 */
const generateReferenceNo = () => {
  return new Promise(async (resolve, reject) => {
    let data, criteria, value;

    try {
      let date = moment().utc(8).format("YYYY-MM-DD");
      date = date.split("-").join("");
      // Pre-setting variables
      criteria = {
        attributes: ["reference_no"],
        where: { reference_no: { $ne: null }, is_deleted: NO },
        order: [["id", "DESC"]],
      };
      // Execute findOne query
      data = await Model.Payments.findOne(criteria);
      if (_.isEmpty(data)) {
        value = `PM${date}-000001`;
      } else {
        let numLength = 6;
        let stringNumber = data.reference_no.substring(11);
        let newNumber = parseInt(stringNumber) + 1;
        let leadingZero = Array(
          numLength - newNumber.toString().length + 1
        ).join(0);
        value = `PM${date}-${leadingZero}${newNumber}`;
      }
      resolve(value);
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
};
