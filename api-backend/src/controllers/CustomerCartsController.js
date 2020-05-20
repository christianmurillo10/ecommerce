const Model = require('../models');

module.exports = {
  /**
   * Create
   * @param req
   * @param res
   * @returns {Promise<void>}
   * @routes POST /customerCarts/create
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
    params.price_amount = params.price_amount.toLocaleString();
    params.discount_amount = params.discount_amount === null ? null : params.discount_amount.toLocaleString();
    params.total_price_amount = params.total_price_amount.toLocaleString();
    params.product_id = params.product_id === undefined ? null : params.product_id.toLocaleString();
    params.customer_id = params.customer_id === undefined ? null : params.customer_id.toLocaleString();

    try {
      // Validators
      if (_.isEmpty(params.sku)) return res.json({ status: 200, message: "SKU is required.", result: false });
      if (_.isEmpty(params.quantity)) return res.json({ status: 200, message: "Quantity is required.", result: false });
      if (_.isEmpty(params.price_amount)) return res.json({ status: 200, message: "Price Amount is required.", result: false });
      if (_.isEmpty(params.total_price_amount)) return res.json({ status: 200, message: "Total Price Amount is required.", result: false });
      if (_.isEmpty(params.product_id)) return res.json({ status: 200, message: "Product is required.", result: false });
      if (_.isEmpty(params.customer_id)) return res.json({ status: 200, message: "Customer is required.", result: false });

      // Pre-setting variables
      criteria = { include: [{ model: Model.Products, as: 'products', attributes: ['name'] }] };
      initialValues = _.pick(params, [
        'sku', 
        'quantity', 
        'price_amount', 
        'discount_amount', 
        'total_price_amount', 
        'product_id', 
        'customer_id', 
        'created_at'
      ]);
      // Execute create query
      await Model.CustomerCarts.create(initialValues)
        .then(response =>  Model.CustomerCarts.findByPk(response.id, criteria)
        .then(finalData => {
          res.json({
            status: 200,
            message: "Successfully updated data.",
            result: finalData.get({ plain: true })
          });
        }));
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
   * @route PUT /customerCarts/update/:id
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
      criteria = { include: [{ model: Model.Products, as: 'products', attributes: ['name'] }] };
      initialValues = _.pick(params, [
        'sku', 
        'quantity', 
        'price_amount', 
        'discount_amount', 
        'total_price_amount', 
        'product_id', 
        'customer_id', 
        'updated_at'
      ]);
      // Execute findByPk query
      data = await Model.CustomerCarts.findByPk(req.params.id, criteria);
      if (!_.isEmpty(data)) {
        await data.update(initialValues)
          .then(() => Model.CustomerCarts.findByPk(data.id, criteria)
          .then(finalData => {
            res.json({
              status: 200,
              message: "Successfully updated data.",
              result: finalData.get({ plain: true })
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
   * @route DELETE /customerCarts/delete/:id
   * @param req
   * @param res
   * @returns {never}
   */
  delete: async (req, res) => {
    let data;

    try {
      // Execute destroy query
      data = await Model.CustomerCarts.destroy({ where: { id: req.params.id} });
      if (data !== 0) {
        res.json({
          status: 200,
          message: "Successfully deleted data.",
          result: true
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
   * @route POST /customerCarts/search/:value
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
      query = `SELECT id, sku, quantity, price_amount, discount_amount, total_price_amount, product_id, customer_id, created_at, updated_at FROM customer_carts WHERE CONCAT(sku) LIKE ?;`;
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
   * @route GET /customerCarts
   * @param req
   * @param res
   * @returns {never}
   */
  findAll: async (req, res) => {
    let data, criteria;

    try {
      // Execute findAll query
      data = await Model.CustomerCarts.findAll();
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
   * Find all by shipping method id
   * @route GET /customerCarts/findAllbyCustomerId/:customerId
   * @param req
   * @param res
   * @returns {never}
   */
  findAllbyCustomerId: async (req, res) => {
    const params = req.params;
    let data, criteria;

    try {
      // Pre-setting variables
      criteria = { 
        where: { customer_id: params.customerId },
        include: [{ model: Model.Products, as: 'products', attributes: ['name'] }]
      };
      // Execute findAll query
      data = await Model.CustomerCarts.findAll(criteria);
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
   * @route GET /customerCarts/:id
   * @param req
   * @param res
   * @returns {never}
   */
  findById: async (req, res) => {
    let data;

    try {
      // Execute findAll query
      data = await Model.CustomerCarts.findByPk(req.params.id);
      if (!_.isEmpty(data)) {
        res.json({
          status: 200,
          message: "Successfully find data.",
          result: data.get({ plain: true })
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