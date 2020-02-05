const Model = require('../models');
const InventoryHistoriesController = require('./InventoryHistoriesController');

module.exports = {
  /**
   * Create
   * @param req
   * @param res
   * @returns {Promise<void>}
   * @routes POST /inventories/create
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
    params.stock_in = params.stock_in.toLocaleString();
    params.stock_available = params.stock_in;
    params.user_id = req.user.id.toLocaleString();
    params.product_id = params.product_id.toLocaleString();

    try {
      // Validators
      if (_.isEmpty(params.stock_in)) return res.json({ status: 200, message: "Stock In is required.", result: false });
      if (_.isEmpty(params.stock_available)) return res.json({ status: 200, message: "Stock Available is required.", result: false });
      if (_.isEmpty(params.product_id)) return res.json({ status: 200, message: "Product is required.", result: false });

      // Pre-setting variables
      criteria = { where: { product_id: params.product_id, is_deleted: 0 }, include: [{ model: Model.Products, as: 'products' }, { model: Model.Users, as: 'users' }] };
      initialValues = _.pick(params, [
        'stock_in',
        'stock_available',
        'user_id',
        'product_id',
        'created_at'
      ]);
      // Execute findAll query
      data = await Model.Inventories.findAll(criteria);
      if (_.isEmpty(data[0])) {
        await Model.Inventories.create(initialValues)
          .then(() => Model.Inventories.findOrCreate(criteria))
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
   * @route PUT /inventories/update/:id
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
      criteria = { where: { is_deleted: 0 }, include: [{ model: Model.Products, as: 'products' }, { model: Model.Users, as: 'users' }] };
      initialValues = _.pick(params, [
        'stock_in',
        'stock_out',
        'stock_reserved',
        'stock_returned',
        'stock_available',
        'product_id'
      ]);
      // Execute findByPk query
      data = await Model.Inventories.findByPk(req.params.id);
      if (!_.isEmpty(data)) {
        await data.update(initialValues)
          .then(() => Model.Inventories.findByPk(data.id, criteria)
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
   * @route PUT /inventories/delete/:id
   * @param req
   * @param res
   * @returns {never}
   */
  delete: async (req, res) => {
    let data;

    try {
      // Execute findByPk query
      data = await Model.Inventories.findByPk(req.params.id);
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
   * @route POST /inventories/search/:value
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
                stock_in, 
                stock_out, 
                stock_reserved, 
                stock_returned, 
                stock_available, 
                product_id, 
                created_at, 
                updated_at 
              FROM inventories 
              WHERE CONCAT(stock_in, stock_out, stock_reserved, stock_returned, stock_available) LIKE ? AND is_deleted = 0;`;
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
   * @route GET /inventories
   * @param req
   * @param res
   * @returns {never}
   */
  findAll: async (req, res) => {
    let data, criteria;

    try {
      // Pre-setting variables
      criteria = { where: { is_deleted: 0 }, include: [{ model: Model.Products, as: 'products' }, { model: Model.Users, as: 'users' }] };
      // Execute findAll query
      data = await Model.Inventories.findAll(criteria);
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
   * @route GET /inventories/findAllbyProductId/:productId
   * @param req
   * @param res
   * @returns {never}
   */
  findAllbyProductId: async (req, res) => {
    const params = req.params;
    let data, criteria;

    try {
      // Pre-setting variables
      criteria = { limit: 1, where: { product_id: params.productId, is_deleted: 0 }, order: [ [ 'created_at', 'DESC' ]], include: [{ model: Model.Products, as: 'products' }, { model: Model.Users, as: 'users' }] };
      // Execute findAll query
      data = await Model.Inventories.findAll(criteria);
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
   * @route GET /inventories/findAvailableStockByProductId/:productId
   * @param req
   * @param res
   * @returns {never}
   */
  findAvailableStockByProductId: async (req, res) => {
    const params = req.params;
    let data, criteria;

    try {
      // Pre-setting variables
      criteria = { attributes: ['stock_available'], where: { product_id: params.productId, is_deleted: 0 }, order: [ [ 'created_at', 'DESC' ]] };
      // Execute findAll query
      data = await Model.Inventories.findOne(criteria);
      if (!_.isEmpty(data)) {
        res.json({
          status: 200,
          message: "Successfully find all data.",
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
        message: "Failed to find all data."
      });
    }
  },

  /**
   * Find by id
   * @route GET /inventories/:id
   * @param req
   * @param res
   * @returns {never}
   */
  findById: async (req, res) => {
    let data, criteria;

    try {
      // Pre-setting variables
      criteria = { where: { is_deleted: 0 }, include: [{ model: Model.Products, as: 'products' }, { model: Model.Users, as: 'users' }] };
      // Execute findAll query
      data = await Model.Inventories.findByPk(req.params.id, criteria);
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
   * Public Functions
   */

  /**
   * Add stock
   */
  addStockByProductId: async (data) => {
    return new Promise(async (resolve, reject) => {
      try {
        let response = await addStock(data);
        resolve(response);
      } catch (err) {
        resolve({
          status: 401,
          err: err,
          message: "Failed adding stock."
        });
      }
    });
  },
};


/**
 * Other Functions
 */
const addStock = async (obj) => {
  const params = obj;
  let criteria, initialValues, data;

  // Override variables
  params.created_at = moment().utc(8).format('YYYY-MM-DD HH:mm:ss');
  params.stock_in = params.stock_in.toLocaleString();
  params.stock_available = params.stock_in;
  params.product_id = params.product_id.toLocaleString();

  return new Promise(async (resolve, reject) => {
    try {
      // Validators
      if (_.isEmpty(params.stock_in)) return res.json({ status: 200, message: "Stock In is required.", result: false });
      if (_.isEmpty(params.stock_available)) return res.json({ status: 200, message: "Stock Available is required.", result: false });
      if (_.isEmpty(params.product_id)) return res.json({ status: 200, message: "Product is required.", result: false });

      // Pre-setting variables
      criteria = { where: { product_id: params.product_id, is_deleted: 0 }, include: [{ model: Model.Products, as: 'products' }, { model: Model.Users, as: 'users' }] };
      // Execute findAll query
      data = await Model.Inventories.findAll(criteria);
      if (_.isEmpty(data[0])) {
        initialValues = _.pick(params, [
          'stock_in',
          'stock_available',
          'user_id',
          'product_id',
          'created_at'
        ]);

        await Model.Inventories.create(initialValues)
          .then(() => Model.Inventories.findOrCreate(criteria))
          .then(async ([finalData, created]) => {
            let plainData = finalData.get({ plain: true });

            // Saving Inventory History
            let inventoryHistoryObj = {
              quantity: params.stock_in,
              remarks: "IN",
              user_id: params.user_id,
              inventory_id: plainData.id
            };
            let inventoryHistory = await InventoryHistoriesController.create(inventoryHistoryObj);

            resolve({
              status: 200,
              message: "Successfully created data.",
              result: _.omit(plainData, ['is_deleted'])
            });
          })
      } else {
        let plainData = data[0].get({ plain: true });

        // Saving Inventory History
        let inventoryHistoryObj = {
          quantity: params.stock_in,
          remarks: "IN",
          user_id: params.user_id,
          inventory_id: plainData.id
        };
        let inventoryHistory = await InventoryHistoriesController.create(inventoryHistoryObj);

        // Override variables
        params.updated_at = moment().utc(8).format('YYYY-MM-DD HH:mm:ss');
        params.stock_in = parseInt(plainData.stock_in) + parseInt(params.stock_in);
        params.stock_available = parseInt(plainData.stock_in) + parseInt(params.stock_available);
        initialValues = _.pick(params, [
          'stock_in',
          'stock_available',
          'updated_at'
        ]);

        let finalData = await data[0].update(initialValues);
        resolve({
          status: 200,
          message: "Successfully updated data.",
          result: finalData
        });
      }
    } catch (err) {
      resolve({
        status: 401,
        err: err,
        message: "Failed creating data."
      });
    }
  });
}