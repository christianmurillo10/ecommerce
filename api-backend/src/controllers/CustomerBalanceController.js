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
};