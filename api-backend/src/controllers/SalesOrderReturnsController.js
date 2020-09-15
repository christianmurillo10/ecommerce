const Model = require('../models');
const { NO, YES } = require('../helpers/constant-helper');

module.exports = {
  /**
   * Create
   * @param req
   * @param res
   * @returns {Promise<void>}
   * @routes POST /salesOrderReturns/create
   */
  create: async (req, res) => {
    const params = req.body;
    let criteria, initialValues, data;

    // Validators
    if (_.isUndefined(params))
      return res.badRequest({ err: "Invalid Parameter: [params]" });
    if (_.isEmpty(params))
      return res.badRequest({ err: "Empty Parameter: [params]" });

    // Override variables
    params.created_at = moment().utc(8).format('YYYY-MM-DD HH:mm:ss');
    params.user_id = req.user.id.toLocaleString();
    params.sales_order_id = params.sales_order_id.toLocaleString();
    params.sales_order_detail_id = params.sales_order_detail_id.toLocaleString();

    try {
      // Validators
      if (_.isEmpty(params.remarks)) return res.json({ status: 200, message: "Remarks is required.", result: false });
      if (_.isEmpty(params.quantity)) return res.json({ status: 200, message: "Quantity is required.", result: false });
      if (_.isEmpty(params.sales_order_id)) return res.json({ status: 200, message: "Sales Order is required.", result: false });
      if (_.isEmpty(params.sales_order_detail_id)) return res.json({ status: 200, message: "Sales Order Detail is required.", result: false });

      // Pre-setting variables
      criteria = {
        where: {
          name: params.name, sales_order_id: params.sales_order_id, sales_order_detail_id: params.sales_order_detail_id
        },
        include: [{ model: Model.SalesOrders, as: 'salesOrders' }, { model: Model.SalesOrderDetails, as: 'salesOrderDetails' }]
      };
      initialValues = _.pick(params, [
        'remarks',
        'quantity',
        'user_id',
        'sales_order_id',
        'sales_order_detail_id',
        'created_at'
      ]);
      // Execute findAll query
      data = await Model.SalesOrderReturns.findAll(criteria);
      if (_.isEmpty(data[0])) {
        await Model.SalesOrderReturns.create(initialValues)
          .then(() => Model.SalesOrderReturns.findOrCreate(criteria))
          .then(([finalData, created]) => {
            res.json({
              status: 200,
              message: "Successfully created data.",
              result: _.omit(finalData.get({ plain: true }), ['is_deleted'])
            });
          })
      } else {
        res.json({
          status: 200,
          message: "Data already exist.",
          result: false
        });
      }
    } catch (err) {
      res.json({
        status: 401,
        err: err,
        message: "Failed creating data."
      });
    }
  },

  /**
   * Update
   * @route PUT /salesOrderReturns/update/:id
   * @param req
   * @param res
   * @returns {never}
   */
  update: async (req, res) => {
    const params = req.body;
    let initialValues, data, criteria;

    if (_.isUndefined(params))
      return res.badRequest({ err: "Invalid Parameter: [params]" });
    if (_.isEmpty(params))
      return res.badRequest({ err: "Empty Parameter: [params]" });

    try {
      // Pre-setting variables
      criteria = { where: { is_deleted: NO }, include: [{ model: Model.SalesOrders, as: 'salesOrders' }, { model: Model.SalesOrderDetails, as: 'salesOrderDetails' }] };
      initialValues = _.pick(params, [
        'remarks',
        'quantity',
        'user_id',
        'sales_order_id',
        'sales_order_detail_id'
      ]);
      // Execute findByPk query
      data = await Model.SalesOrderReturns.findByPk(req.params.id);
      if (!_.isEmpty(data)) {
        await data.update(initialValues)
          .then(() => Model.SalesOrderReturns.findByPk(data.id, criteria)
            .then(finalData => {
              res.json({
                status: 200,
                message: "Successfully updated data.",
                result: _.omit(finalData.get({ plain: true }), ['is_deleted'])
              });
            }));
      } else {
        res.json({
          status: 200,
          message: "Data doesn't exist.",
          result: false
        });
      }
    } catch (err) {
      res.json({
        status: 401,
        err: err,
        message: "Failed updating data."
      });
    }
  },

  /**
   * Delete
   * @route PUT /salesOrderReturns/delete/:id
   * @param req
   * @param res
   * @returns {never}
   */
  delete: async (req, res) => {
    let data;

    try {
      // Execute findByPk query
      data = await Model.SalesOrderReturns.findByPk(req.params.id);
      if (!_.isEmpty(data)) {
        let finalData = await data.update({ is_deleted: YES });
        res.json({
          status: 200,
          message: "Successfully deleted data.",
          result: finalData
        });
      } else {
        res.json({
          status: 200,
          message: "Data doesn't exist.",
          result: false
        });
      }
    } catch (err) {
      res.json({
        status: 401,
        err: err,
        message: "Failed deleting data."
      });
    }
  },

  /**
   * Search
   * @route POST /salesOrderReturns/search/:value
   * @param req
   * @param res
   * @returns {never}
   */
  search: async (req, res) => {
    const params = req.params;
    let query, data;

    if (_.isUndefined(params))
      return res.badRequest({ err: "Invalid Parameter: [params]" });
    if (_.isEmpty(params))
      return res.badRequest({ err: "Empty Parameter: [params]" });

    try {
      // Pre-setting variables
      query = `SELECT 
                id, 
                remarks, 
                quantity, 
                sales_order_id, 
                sales_order_detail_id, 
                created_at, 
                updated_at 
              FROM sales_order_returns 
              WHERE CONCAT(quantity) LIKE ? AND is_deleted = ${NO};`;
      // Execute native query
      data = await Model.sequelize.query(query, {
        replacements: [`%${params.value}%`],
        type: Model.sequelize.QueryTypes.SELECT
      });
      if (!_.isEmpty(data)) {
        res.json({
          status: 200,
          message: "Successfully searched data.",
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
        message: "Failed to search data."
      });
    }
  },

  /**
   * Find all
   * @route GET /salesOrderReturns
   * @param req
   * @param res
   * @returns {never}
   */
  findAll: async (req, res) => {
    let data, criteria;

    try {
      // Pre-setting variables
      criteria = { where: { is_deleted: NO }, include: [{ model: Model.SalesOrders, as: 'salesOrders' }, { model: Model.SalesOrderDetails, as: 'salesOrderDetails' }] };
      // Execute findAll query
      data = await Model.SalesOrderReturns.findAll(criteria);
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
   * @route GET /salesOrderReturns/findAllbySalesOrderId/:salesOrderId
   * @param req
   * @param res
   * @returns {never}
   */
  findAllbySalesOrderId: async (req, res) => {
    const params = req.params;
    let data, criteria;

    try {
      // Pre-setting variables
      criteria = { where: { sales_order_id: params.salesOrderId, is_deleted: NO }, include: [{ model: Model.SalesOrders, as: 'salesOrders' }, { model: Model.SalesOrderDetails, as: 'salesOrderDetails' }] };
      // Execute findAll query
      data = await Model.SalesOrderReturns.findAll(criteria);
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
   * Find all by sales order detail id
   * @route GET /salesOrderReturns/findAllbySalesOrderDetailId/:salesOrderDetailId
   * @param req
   * @param res
   * @returns {never}
   */
  findAllbySalesOrderDetailId: async (req, res) => {
    const params = req.params;
    let data, criteria;

    try {
      // Pre-setting variables
      criteria = { where: { sales_order_detail_id: params.salesOrderDetailId, is_deleted: NO }, include: [{ model: Model.SalesOrders, as: 'salesOrders' }, { model: Model.SalesOrderDetails, as: 'salesOrderDetails' }] };
      // Execute findAll query
      data = await Model.SalesOrderReturns.findAll(criteria);
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
   * Find all by sales order id and sales order detail id
   * @route GET /salesOrderReturns/findAllbySalesOrderIdAndSalesOrderDetailId/:salesOrderId/:salesOrderDetailId
   * @param req
   * @param res
   * @returns {never}
   */
  findAllbySalesOrderIdAndSalesOrderDetailId: async (req, res) => {
    const params = req.params;
    let data, criteria;

    try {
      // Pre-setting variables
      criteria = { where: { sales_order_id: params.salesOrderId, sales_order_detail_id: params.salesOrderDetailId, is_deleted: NO }, include: [{ model: Model.SalesOrders, as: 'salesOrders' }, { model: Model.SalesOrderDetails, as: 'salesOrderDetails' }] };
      // Execute findAll query
      data = await Model.SalesOrderReturns.findAll(criteria);
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
   * @route GET /salesOrderReturns/:id
   * @param req
   * @param res
   * @returns {never}
   */
  findById: async (req, res) => {
    let data, criteria;

    try {
      // Pre-setting variables
      criteria = { where: { is_deleted: NO }, include: [{ model: Model.SalesOrders, as: 'salesOrders' }, { model: Model.SalesOrderDetails, as: 'salesOrderDetails' }] };
      // Execute findAll query
      data = await Model.SalesOrderReturns.findByPk(req.params.id, criteria);
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