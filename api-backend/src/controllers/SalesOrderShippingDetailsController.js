const Model = require('../models');

module.exports = {
  /**
   * Create
   * @param req
   * @param res
   * @returns {Promise<void>}
   * @routes POST /salesOrderShippingDetails/create
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
    params.amount = params.amount.toLocaleString();
    params.shipping_method_id = params.shipping_method_id === undefined ? null : params.shipping_method_id.toLocaleString();
    params.shipping_method_rate_id = params.shipping_method_rate_id === undefined ? null : params.shipping_method_rate_id.toLocaleString();
    params.sales_order_id = params.sales_order_id === undefined ? null : params.sales_order_id.toLocaleString();

    try {
      // Validators
      if (_.isEmpty(params.shipping_no)) return res.json({ status: 200, message: "Shipping No. is required.", result: false });
      if (_.isEmpty(params.address)) return res.json({ status: 200, message: "Address is required.", result: false });
      if (_.isEmpty(params.amount)) return res.json({ status: 200, message: "Amount is required.", result: false });
      if (_.isEmpty(params.shipping_method_id)) return res.json({ status: 200, message: "Shipping Method is required.", result: false });
      if (_.isEmpty(params.shipping_method_rate_id)) return res.json({ status: 200, message: "Shippping Method Rate is required.", result: false });
      if (_.isEmpty(params.sales_order_id)) return res.json({ status: 200, message: "Sales Order is required.", result: false });

      // Pre-setting variables
      criteria = { 
        where: { shipping_no: params.shipping_no, sales_order_id: params.sales_order_id, is_deleted: 0 },
        include: [ 
          { model: Model.ShippingMethods, as: 'shippingMethods', attributes: ['name'] },
          { model: Model.ShippingMethodRates, as: 'shippingMethodRates', attributes: ['rate_amount'] } 
        ]
      };
      initialValues = _.pick(params, [
        'shipping_no', 
        'address', 
        'amount', 
        'shipping_method_id', 
        'shipping_method_rate_id', 
        'sales_order_id', 
        'created_at'
      ]);
      // Execute findAll query
      data = await Model.SalesOrderShippingDetails.findAll(criteria);
      if (_.isEmpty(data[0])) {
        let finalData = await Model.SalesOrderShippingDetails.create(initialValues);
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
   * @route PUT /salesOrderShippingDetails/update/:id
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
      criteria = { 
        include: [ 
          { model: Model.ShippingMethods, as: 'shippingMethods', attributes: ['name'] },
          { model: Model.ShippingMethodRates, as: 'shippingMethodRates', attributes: ['rate_amount'] } 
        ]
       };
      initialValues = _.pick(params, [
        'shipping_no', 
        'address', 
        'amount', 
        'shipping_method_id', 
        'shipping_method_rate_id', 
        'sales_order_id', 
        'updated_at'
      ]);
      // Execute findByPk query
      data = await Model.SalesOrderShippingDetails.findByPk(req.params.id, criteria);
      if (!_.isEmpty(data)) {
        await data.update(initialValues)
          .then(() => Model.SalesOrderShippingDetails.findByPk(data.id, criteria)
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
   * @route PUT /salesOrderShippingDetails/delete/:id
   * @param req
   * @param res
   * @returns {never}
   */
  delete: async (req, res) => {
    let data;

    try {
      // Execute findByPk query
      data = await Model.SalesOrderShippingDetails.findByPk(req.params.id);
      if (!_.isEmpty(data)) {
        let finalData = await data.update({ is_deleted: 1 });
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
   * @route POST /salesOrderShippingDetails/search/:value
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
      query = `SELECT * FROM sales_order_shipping_details WHERE CONCAT(shipping_no) LIKE ? AND is_deleted = 0;`;
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
   * @route GET /salesOrderShippingDetails
   * @param req
   * @param res
   * @returns {never}
   */
  findAll: async (req, res) => {
    let data, criteria;

    try {
      // Pre-setting variables
      criteria = { 
        where: { is_deleted: 0 }, 
        include: [ 
          { model: Model.ShippingMethods, as: 'shippingMethods', attributes: ['name'] },
          { model: Model.ShippingMethodRates, as: 'shippingMethodRates', attributes: ['rate_amount'] } 
        ]
      };
      // Execute findAll query
      data = await Model.SalesOrderShippingDetails.findAll(criteria);
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
   * @route GET /salesOrderShippingDetails/findAllbySalesOrderId/:salesOrderId
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
        where: { sales_order_id: params.salesOrderId, is_deleted: 0 }, 
        include: [ 
          { model: Model.ShippingMethods, as: 'shippingMethods', attributes: ['name'] },
          { model: Model.ShippingMethodRates, as: 'shippingMethodRates', attributes: ['rate_amount'] } 
        ]
      };
      // Execute findAll query
      data = await Model.SalesOrderShippingDetails.findAll(criteria);
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
   * @route GET /salesOrderShippingDetails/:id
   * @param req
   * @param res
   * @returns {never}
   */
  findById: async (req, res) => {
    let data;

    try {
      // Execute findAll query
      data = await Model.SalesOrderShippingDetails.findByPk(req.params.id);
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