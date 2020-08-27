const Model = require('../models');
const { NO, YES } = require('../helpers/constant-helper');

module.exports = {
  /**
   * Create
   * @param req
   * @param res
   * @returns {Promise<void>}
   * @routes POST /salesOrderDetails/create
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
    params.quantity = params.quantity.toLocaleString();
    params.rate_amount = params.rate_amount.toLocaleString();
    params.discount_amount = params.discount_amount === null ? null : params.discount_amount.toLocaleString();
    params.amount = params.amount.toLocaleString();
    params.product_id = params.product_id === undefined ? null : params.product_id.toLocaleString();
    params.sales_order_id = params.sales_order_id === undefined ? null : params.sales_order_id.toLocaleString();
    params.claim_type = params.claim_type === undefined ? null : params.claim_type.toLocaleString();

    try {
      // Validators
      if (_.isEmpty(params.sku)) return res.json({ status: 200, message: "SKU is required.", result: false });
      if (_.isEmpty(params.variant_details)) return res.json({ status: 200, message: "Variant is required.", result: false });
      if (_.isEmpty(params.quantity)) return res.json({ status: 200, message: "Quantity is required.", result: false });
      if (_.isEmpty(params.rate_amount)) return res.json({ status: 200, message: "Rate Amount is required.", result: false });
      if (_.isEmpty(params.amount)) return res.json({ status: 200, message: "Amount is required.", result: false });
      if (_.isEmpty(params.product_id)) return res.json({ status: 200, message: "Product is required.", result: false });
      if (_.isEmpty(params.sales_order_id)) return res.json({ status: 200, message: "Sales Order is required.", result: false });
      if (_.isEmpty(params.claim_type)) return res.json({ status: 200, message: "Claim Type is required.", result: false });

      // Pre-setting variables
      criteria = { 
        where: { sku: params.sku, sales_order_id: params.sales_order_id, is_deleted: NO },
        include: [ { model: Model.Products, as: 'products', attributes: ['name', 'unit'] } ]
      };
      initialValues = _.pick(params, [
        'sku', 
        'variant_details',
        'remarks', 
        'quantity', 
        'rate_amount', 
        'discount_amount', 
        'amount', 
        'product_id', 
        'sales_order_id', 
        'created_at', 
        'claim_type'
      ]);
      // Execute findAll query
      data = await Model.SalesOrderDetails.findAll(criteria);
      if (_.isEmpty(data[0])) {
        let finalData = await Model.SalesOrderDetails.create(initialValues);
        res.json({
          status: 200,
          message: "Successfully created data.",
          result: _.omit(finalData.get({ plain: true }), ['is_deleted'])
        });
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
   * @route PUT /salesOrderDetails/update/:id
   * @param req
   * @param res
   * @returns {never}
   */
  update: async (req, res) => {
    const params = req.body;
    let initialValues, data;

    if (_.isUndefined(params))
      return res.badRequest({ err: "Invalid Parameter: [params]" });
    if (_.isEmpty(params))
      return res.badRequest({ err: "Empty Parameter: [params]" });

    // Override variables
    params.updated_at = moment().utc(8).format('YYYY-MM-DD HH:mm:ss');

    try {
      // Pre-setting variables
      criteria = { include: [ { model: Model.Products, as: 'products', attributes: ['name', 'unit'] } ] };
      initialValues = _.pick(params, [
        'sku', 
        'variant_details',
        'remarks', 
        'quantity', 
        'rate_amount', 
        'discount_amount', 
        'amount', 
        'product_id', 
        'sales_order_id', 
        'date', 
        'updated_at', 
        'claim_type', 
        'status'
      ]);
      // Execute findByPk query
      data = await Model.SalesOrderDetails.findByPk(req.params.id, criteria);
      if (!_.isEmpty(data)) {
        await data.update(initialValues)
          .then(() => Model.SalesOrderDetails.findByPk(data.id, criteria)
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
   * @route PUT /salesOrderDetails/delete/:id
   * @param req
   * @param res
   * @returns {never}
   */
  delete: async (req, res) => {
    let data;

    try {
      // Execute findByPk query
      data = await Model.SalesOrderDetails.findByPk(req.params.id);
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
   * @route POST /salesOrderDetails/search/:value
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
      query = `SELECT * FROM sales_order_details WHERE CONCAT(sku) LIKE ? AND is_deleted = ${NO};`;
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
   * @route GET /salesOrderDetails
   * @param req
   * @param res
   * @returns {never}
   */
  findAll: async (req, res) => {
    let data, criteria;

    try {
      // Pre-setting variables
      criteria = { 
        where: { is_deleted: NO }, 
        include: [ { model: Model.Products, as: 'products', attributes: ['name', 'unit'] } ] 
      };
      // Execute findAll query
      data = await Model.SalesOrderDetails.findAll(criteria);
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
   * @route GET /salesOrderDetails/findAllbySalesOrderId/:salesOrderId
   * @param req
   * @param res
   * @returns {never}
   */
  findAllbySalesOrderId: async (req, res) => {
    const params = req.params;
    let data, criteria;

    try {
      // Pre-setting variables
      criteria = { 
        where: { sales_order_id: params.salesOrderId, is_deleted: NO }, 
        include: [ { model: Model.Products, as: 'products', attributes: ['name', 'unit'] } ] 
      };
      // Execute findAll query
      data = await Model.SalesOrderDetails.findAll(criteria);
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
   * @route GET /salesOrderDetails/:id
   * @param req
   * @param res
   * @returns {never}
   */
  findById: async (req, res) => {
    let data;

    try {
      // Execute findAll query
      data = await Model.SalesOrderDetails.findByPk(req.params.id);
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