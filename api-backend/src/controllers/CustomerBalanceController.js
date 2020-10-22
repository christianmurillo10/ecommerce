const Model = require("../models");
const { ErrorHandler, handleSuccess } = require("../helpers/response-helper");
const { NO, YES } = require("../helpers/constant-helper");

module.exports = {
  /**
   * Find all
   * @route GET /customerBalance
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
          {
            model: Model.Payments,
            as: "payments",
            attributes: ["reference_no"],
          },
        ],
      };
      data = await Model.CustomerBalance.findAll(criteria);
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
   * Find all by customer id
   * @route GET /customerBalance/findAllbyCustomerId/:customerId
   */
  findAllbyCustomerId: async (req, res, next) => {
    const params = req.params;
    let errors = [],
      message = "Successfully find all data.",
      data,
      criteria;

    try {
      // Validate Data
      criteria = {
        where: { customer_id: params.customerId, is_deleted: NO },
        include: [
          {
            model: Model.SalesOrders,
            as: "salesOrders",
            attributes: ["order_no"],
          },
          {
            model: Model.Payments,
            as: "payments",
            attributes: ["reference_no"],
          },
        ],
      };
      data = await Model.CustomerBalance.findAll(criteria);
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
   * @route GET /customerBalance/findAllbySalesOrderId/:salesOrderId
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
            model: Model.Customers,
            as: "customers",
            attributes: ["customer_no", "firstname", "middlename", "lastname"],
          },
          {
            model: Model.Payments,
            as: "payments",
            attributes: ["reference_no"],
          },
        ],
      };
      data = await Model.CustomerBalance.findAll(criteria);
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
   * @route GET /customerBalance/:id
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
          {
            model: Model.Payments,
            as: "payments",
            attributes: ["reference_no"],
          },
        ],
      };
      // Execute findAll query
      data = await Model.CustomerBalance.findByPk(req.params.id, criteria);
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
   * Insert Debit, Balance and Amount
   */
  insertDebitBalanceAndAmount: (obj) => {
    return new Promise((resolve, reject) => {
      try {
        let initialValues;
        const createdAt = moment().utc(8).format("YYYY-MM-DD HH:mm:ss");
        initialValues = {
          remarks: obj.remarks ? obj.remarks : null,
          debit: obj.amount,
          balance: obj.amount,
          amount: obj.amount,
          customer_id: obj.customer_id,
          sales_order_id: obj.sales_order_id,
          created_at: createdAt,
        };

        Model.CustomerBalance.create(initialValues).then((response) => {
          resolve(true);
        });
      } catch (err) {
        reject(err);
      }
    });
  },

  /**
   * Insert Credit, Balance, Overpayment and Amount
   */
  insertCreditBalanceOverpaymentAndAmount: (obj) => {
    return new Promise(async (resolve, reject) => {
      try {
        let initialValues, data, criteria;

        // Validate Data
        criteria = {
          where: {
            customer_id: obj.customer_id,
            sales_order_id: obj.sales_order_id,
            is_deleted: NO,
          },
          order: [["id", "DESC"]],
        };
        data = await Model.CustomerBalance.findOne(criteria);
        if (_.isEmpty(data)) {
          resolve(false);
        }

        const plainData = data.get({ plain: true });

        // Set and compute initial values
        const createdAt = moment().utc(8).format("YYYY-MM-DD HH:mm:ss");
        const computedBalance =
          parseFloat(plainData.balance) - parseFloat(obj.amount);
        const balance =
          parseFloat(computedBalance) > 0 ? parseFloat(computedBalance) : 0;
        const overpayment =
          parseFloat(computedBalance) < 0
            ? Math.abs(parseFloat(computedBalance))
            : 0;
        const credit =
          parseFloat(computedBalance) <= 0
            ? parseFloat(plainData.balance)
            : parseFloat(plainData.balance) - parseFloat(computedBalance);

        // Pre-setting variables
        initialValues = {
          remarks: obj.remarks ? obj.remarks : null,
          credit: credit,
          balance: balance,
          overpayment: overpayment,
          amount: obj.amount,
          customer_id: obj.customer_id,
          sales_order_id: obj.sales_order_id,
          payment_id: obj.payment_id,
          created_at: createdAt,
        };

        Model.CustomerBalance.create(initialValues).then((response) => {
          resolve(true);
        });
      } catch (err) {
        reject(err);
      }
    });
  },
};
