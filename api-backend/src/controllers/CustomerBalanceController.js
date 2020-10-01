const Model = require('../models');
const { NO, YES } = require('../helpers/constant-helper');

module.exports = {
  /**
   * Find all
   * @route GET /customerBalance
   * @param req
   * @param res
   * @returns {never}
   */
  findAll: async (req, res) => {
    let data, criteria;

    try {
      // Pre-setting variables
      criteria = { where: { is_deleted: NO }, include: [{ model: Model.Customers, as: 'customers' }, { model: Model.SalesOrders, as: 'salesOrders' }, { model: Model.Payments, as: 'payments' }] };
      // Execute findAll query
      data = await Model.CustomerBalance.findAll(criteria);
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
   * Find all by customer id
   * @route GET /customerBalance/findAllbyCustomerId/:customerId
   * @param req
   * @param res
   * @returns {never}
   */
  findAllbyCustomerId: async (req, res) => {
    const params = req.params;
    let data, criteria;

    try {
      // Pre-setting variables
      criteria = { where: { customer_id: params.customerId, is_deleted: NO }, include: [{ model: Model.SalesOrders, as: 'salesOrders' }, { model: Model.Payments, as: 'payments' }] };
      // Execute findAll query
      data = await Model.CustomerBalance.findAll(criteria);
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
   * Find all by sales order id
   * @route GET /customerBalance/findAllbySalesOrderId/:salesOrderId
   * @param req
   * @param res
   * @returns {never}
   */
  findAllbySalesOrderId: async (req, res) => {
    const params = req.params;
    let data, criteria;

    try {
      // Pre-setting variables
      criteria = { where: { sales_order_id: params.salesOrderId, is_deleted: NO }, include: [{ model: Model.Customers, as: 'customers' }, { model: Model.Payments, as: 'payments' }] };
      // Execute findAll query
      data = await Model.CustomerBalance.findAll(criteria);
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
   * @route GET /customerBalance/:id
   * @param req
   * @param res
   * @returns {never}
   */
  findById: async (req, res) => {
    let data, criteria;

    try {
      // Pre-setting variables
      criteria = { where: { is_deleted: NO }, include: [{ model: Model.Customers, as: 'customers' }, { model: Model.SalesOrders, as: 'salesOrders' }, { model: Model.Payments, as: 'payments' }] };
      // Execute findAll query
      data = await Model.CustomerBalance.findByPk(req.params.id, criteria);
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
   * Insert Debit, Balance and Amount
   */
  insertDebitBalanceAndAmount: (obj) => {
    return new Promise((resolve, reject) => {
      try {
        let initialValues;
        const createdAt = moment().utc(8).format('YYYY-MM-DD HH:mm:ss');
        initialValues = { 
          debit: obj.amount, 
          balance: obj.amount, 
          amount: obj.amount, 
          customer_id: obj.customer_id, 
          sales_order_id: obj.sales_order_id, 
          created_at: createdAt 
        };

        Model.CustomerBalance.create(initialValues)
          .then(response => {
            resolve({
              status: 200,
              message: "Successfully created data.",
              result: true
            });
          });
      } catch (err) {
        resolve({
          status: 401,
          err: err,
          message: "Failed to find data."
        });
      }
    });
  },

  /**
   * Insert Credit, Balance, Overpayment and Amount
   */
  insertCreditBalanceOverpaymentAndAmount: (obj) => {
    return new Promise( async (resolve, reject) => {
      try {
        let initialValues, data, criteria;
        // Pre-setting variables
        criteria = { 
          where: { customer_id: obj.customer_id, sales_order_id: obj.sales_order_id, is_deleted: NO }, 
          order: [ [ 'id', 'DESC' ]] 
        };
        // Execute findOne query
        data = await Model.CustomerBalance.findOne(criteria);
        if (!_.isEmpty(data)) {
          const plainData = data.get({ plain: true });

          // Set and compute initial values
          const createdAt = moment().utc(8).format('YYYY-MM-DD HH:mm:ss');
          const computedBalance = parseFloat(plainData.balance) - parseFloat(obj.amount);
          const balance = parseFloat(computedBalance) > 0 ? parseFloat(computedBalance) : 0;
          const overpayment = parseFloat(computedBalance) < 0 ? Math.abs(parseFloat(computedBalance)) : 0;
          const credit = parseFloat(computedBalance) <= 0 ? parseFloat(plainData.balance) : parseFloat(plainData.balance) - parseFloat(computedBalance);
  
          initialValues = { 
            credit: credit, 
            balance: balance, 
            overpayment: overpayment, 
            amount: obj.amount, 
            customer_id: obj.customer_id, 
            sales_order_id: obj.sales_order_id, 
            created_at: createdAt 
          };
  
          Model.CustomerBalance.create(initialValues)
            .then(response => {
              resolve({
                status: 200,
                message: "Successfully created data.",
                result: true
              });
            });
        } else {
          resolve({
            status: 200,
            message: "Data doesn't exist.",
            result: false
          });
        }
      } catch (err) {
        resolve({
          status: 401,
          err: err,
          message: "Failed to find data."
        });
      }
    });
  },
};