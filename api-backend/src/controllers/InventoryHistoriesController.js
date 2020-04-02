const Model = require('../models');

module.exports = {
  /**
   * Delete
   * @route PUT /inventoryHistories/delete/:id
   * @param req
   * @param res
   * @returns {never}
   */
  delete: async (req, res) => {
    let data;

    try {
      // Execute findByPk query
      data = await Model.InventoryHistories.findByPk(req.params.id);
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
   * @route POST /inventoryHistories/search/:value
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
                quantity, 
                inventory_id, 
                created_at, 
                updated_at 
              FROM inventory_histories
              WHERE CONCAT(remarks) LIKE ? AND is_deleted = 0;`;
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
   * @route GET /inventoryHistories
   * @param req
   * @param res
   * @returns {never}
   */
  findAll: async (req, res) => {
    let data, criteria;

    try {
      // Pre-setting variables
      criteria = { where: { is_deleted: 0 }, include: [{ model: Model.Inventories, as: 'inventories' }, { model: Model.Users, as: 'users' }] };
      // Execute findAll query
      data = await Model.InventoryHistories.findAll(criteria);
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
   * Find all by inventory id
   * @route GET /inventoryHistories/findAllbyInventoryId/:inventoryId
   * @param req
   * @param res
   * @returns {never}
   */
  findAllbyInventoryId: async (req, res) => {
    const params = req.params;
    let data, criteria;

    try {
      // Pre-setting variables
      criteria = { where: { inventory_id: params.inventoryId, is_deleted: 0 }, include: [{ model: Model.Inventories, as: 'inventories' }, { model: Model.Users, as: 'users' }] };
      // Execute findAll query
      data = await Model.InventoryHistories.findAll(criteria);
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
   * @route GET /inventoryHistories/:id
   * @param req
   * @param res
   * @returns {never}
   */
  findById: async (req, res) => {
    let data, criteria;

    try {
      // Pre-setting variables
      criteria = { where: { is_deleted: 0 }, include: [{ model: Model.Inventories, as: 'inventories' }, { model: Model.Users, as: 'users' }] };
      // Execute findAll query
      data = await Model.InventoryHistories.findByPk(req.params.id, criteria);
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
   * Create
   */
  create: async (obj) => {
    const params = obj;
    let criteria, initialValues;

    // Override variables
    params.created_at = moment().utc(8).format('YYYY-MM-DD HH:mm:ss');
    params.quantity = params.quantity.toLocaleString();
    params.user_id = params.user_id.toLocaleString();
    params.inventory_id = params.inventory_id.toLocaleString();

    return new Promise(async (resolve, reject) => {
      try {
        // Validators
        if (_.isEmpty(params.quantity)) return res.json({ status: 200, message: "Quantity is required.", result: false });
        if (_.isEmpty(params.remarks)) return res.json({ status: 200, message: "Remarks is required.", result: false });
        if (_.isEmpty(params.inventory_id)) return res.json({ status: 200, message: "Inventory is required.", result: false });

        // Pre-setting variables
        criteria = { where: { inventory_id: params.inventory_id, is_deleted: 0 }, include: [{ model: Model.Inventories, as: 'inventories' }, { model: Model.Users, as: 'users' }] };
        initialValues = _.pick(params, [
          'quantity',
          'remarks',
          'user_id',
          'inventory_id',
          'created_at'
        ]);
        await Model.InventoryHistories.create(initialValues)
          .then(() => Model.InventoryHistories.findOrCreate(criteria))
          .then(([finalData, created]) => {
            resolve({
              status: 200,
              message: "Successfully created data.",
              result: _.omit(finalData.get({ plain: true }), ['is_deleted'])
            });
          })
      } catch (err) {
        resolve({
          status: 401,
          err: err,
          message: "Failed creating data."
        });
      }
    });
  },
};