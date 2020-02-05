const Model = require('../models');

module.exports = {
  /**
   * Create
   * @param req
   * @param res
   * @returns {Promise<void>}
   * @routes POST /productDiscountedPriceRange/create
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
    params.quantity_from = params.quantity_from.toLocaleString();
    params.quantity_to = params.quantity_to.toLocaleString();
    params.price = params.price.toLocaleString();
    params.product_id = params.product_id.toLocaleString();

    try {
      // Validators
      if (_.isEmpty(params.quantity_from)) return res.json({ status: 200, message: "Quantity From is required.", result: false });
      if (_.isEmpty(params.quantity_to)) return res.json({ status: 200, message: "Quantity To is required.", result: false });
      if (_.isEmpty(params.price)) return res.json({ status: 200, message: "Price is required.", result: false });
      if (_.isEmpty(params.product_id)) return res.json({ status: 200, message: "Product is required.", result: false });

      // Pre-setting variables
      criteria = { where: { quantity_from: params.quantity_from, quantity_to: params.quantity_to, price: params.price, product_id: params.product_id, is_deleted: 0 }, include: [{ model: Model.Products, as: 'products' }] };
      initialValues = _.pick(params, [
        'quantity_from',
        'quantity_to',
        'price',
        'product_id',
        'created_at'
      ]);
      // Execute findAll query
      data = await Model.ProductDiscountedPriceRanges.findAll(criteria);
      if (_.isEmpty(data[0])) {
        await Model.ProductDiscountedPriceRanges.create(initialValues)
          .then(() => Model.ProductDiscountedPriceRanges.findOrCreate(criteria))
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
   * @route PUT /productDiscountedPriceRange/update/:id
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
      criteria = { where: { is_deleted: 0 }, include: [{ model: Model.Products, as: 'products' }] };
      initialValues = _.pick(params, [
        'quantity_from',
        'quantity_to',
        'price',
        'product_id'
      ]);
      // Execute findByPk query
      data = await Model.ProductDiscountedPriceRanges.findByPk(req.params.id);
      if (!_.isEmpty(data)) {
        await data.update(initialValues)
          .then(() => Model.ProductDiscountedPriceRanges.findByPk(data.id, criteria)
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
   * @route PUT /productDiscountedPriceRange/delete/:id
   * @param req
   * @param res
   * @returns {never}
   */
  delete: async (req, res) => {
    let data;

    try {
      // Execute findByPk query
      data = await Model.ProductDiscountedPriceRanges.findByPk(req.params.id);
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
   * @route POST /productDiscountedPriceRange/search/:value
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
                quantity_from, 
                quantity_to,
                price,
                product_id, 
                created_at, 
                updated_at 
              FROM product_discounted_price_ranges 
              WHERE CONCAT(quantity_from, quantity_to, price) LIKE ? AND is_deleted = 0;`;
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
   * @route GET /productDiscountedPriceRange
   * @param req
   * @param res
   * @returns {never}
   */
  findAll: async (req, res) => {
    let data, criteria;

    try {
      // Pre-setting variables
      criteria = { where: { is_deleted: 0 }, include: [{ model: Model.Products, as: 'products' }] };
      // Execute findAll query
      data = await Model.ProductDiscountedPriceRanges.findAll(criteria);
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
   * Find all by product id
   * @route GET /productDiscountedPriceRange/findAllbyProductId/:productId
   * @param req
   * @param res
   * @returns {never}
   */
  findAllbyProductId: async (req, res) => {
    const params = req.params;
    let data, criteria;

    try {
      // Pre-setting variables
      criteria = { where: { product_id: params.productId, is_deleted: 0 }, include: [{ model: Model.Products, as: 'products' }] };
      // Execute findAll query
      data = await Model.ProductDiscountedPriceRanges.findAll(criteria);
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
   * @route GET /productDiscountedPriceRange/:id
   * @param req
   * @param res
   * @returns {never}
   */
  findById: async (req, res) => {
    let data, criteria;

    try {
      // Pre-setting variables
      criteria = { where: { is_deleted: 0 }, include: [{ model: Model.Products, as: 'products' }] };
      // Execute findAll query
      data = await Model.ProductDiscountedPriceRanges.findByPk(req.params.id, criteria);
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