const Model = require('../models');
const { NO, YES } = require('../helpers/constant-helper');

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
    params.quantity_in = params.quantity_in.toLocaleString();
    params.quantity_available = params.quantity_in;
    params.user_id = req.user.id.toLocaleString();
    params.product_id = params.product_id.toLocaleString();

    try {
      // Validators
      if (_.isEmpty(params.quantity_in)) return res.json({ status: 200, message: "Quantity In is required.", result: false });
      if (_.isEmpty(params.quantity_available)) return res.json({ status: 200, message: "Quantity Available is required.", result: false });
      if (_.isEmpty(params.product_id)) return res.json({ status: 200, message: "Product is required.", result: false });

      // Pre-setting variables
      criteria = { where: { product_id: params.product_id, is_deleted: NO }, include: [{ model: Model.Products, as: 'products' }, { model: Model.Users, as: 'users' }] };
      initialValues = _.pick(params, [
        'quantity_in',
        'quantity_available',
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
   * Add Stock
   * @route PUT /inventories/addStock/:id
   * @param req
   * @param res
   * @returns {never}
   */
  addStock: async (req, res) => {
    const params = req.body;
    let initialValues, inventoryHistoryInitialValue, data, criteria;

    if (_.isUndefined(params))
      return res.badRequest({ err: "Invalid Parameter: [params]" });
    if (_.isEmpty(params))
      return res.badRequest({ err: "Empty Parameter: [params]" });

    // Override variables
    params.updated_at = moment().utc(8).format('YYYY-MM-DD HH:mm:ss');
    params.quantity = params.quantity.toLocaleString();
    params.user_id = req.user.id.toLocaleString();

    try {
      // Validators
      if (_.isEmpty(params.quantity)) return res.json({ status: 200, message: "Quantity is required.", result: false });

      // Pre-setting variables
      criteria = { where: { is_deleted: NO } };
      // Execute findByPk query
      data = await Model.Inventories.findByPk(req.params.id);
      if (!_.isEmpty(data)) {
        let newQuantityIn, newQuantityAvailable;
        newQuantityIn = parseInt(data.quantity_in) + parseInt(params.quantity);
        newQuantityAvailable = parseInt(data.quantity_available) + parseInt(params.quantity);
        initialValues = { quantity_in: newQuantityIn, quantity_available: newQuantityAvailable, updated_at: params.updated_at };
        inventoryHistoryInitialValue = { quantity_in: params.quantity, quantity_available: params.quantity };

        data.update(initialValues)
          .then(() => Model.Inventories.findByPk(data.id, criteria)
            .then(finalData => {
            inventoryHistoryInitialValue.user_id = params.user_id;
            inventoryHistoryInitialValue.inventory_id = data.id;
            inventoryHistoryInitialValue.created_at = moment().utc(8).format('YYYY-MM-DD HH:mm:ss');
            
            // Saving Inventory History
            Model.InventoryHistories.create(inventoryHistoryInitialValue)
              .then(response => {
                res.json({
                  status: 200,
                  message: "Successfully update data.",
                  result: _.omit(finalData.get({ plain: true }), ['is_deleted'])
                });
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
   * Create bulk with product variants by product id
   * @param req
   * @param res
   * @returns {Promise<void>}
   * @routes POST /inventories/generateBulkWithProductVariantsByProductId
   */
  generateBulkWithProductVariantsByProductId: async (req, res) => {
    const params = req.body;
    let criteriaProduct, criteriaVariants, dataProduct, dataVariants;

    // Validators
    if (_.isUndefined(params))
      return res.badRequest({ err: "Invalid Parameter: [params]" });
    if (_.isEmpty(params))
      return res.badRequest({ err: "Empty Parameter: [params]" });

    // Override variables
    params.created_at = moment().utc(8).format('YYYY-MM-DD HH:mm:ss');
    params.user_id = req.user.id.toLocaleString();
    params.product_id = params.product_id.toLocaleString();

    try {
      // // Validators
      if (_.isEmpty(params.product_id)) return res.json({ status: 200, message: "Product is required.", result: false });

      // Pre-setting variables
      criteriaProduct = { attributes: ['code', 'name', 'unit', 'price_amount'], where: { is_deleted: NO } };
      criteriaVariants = { where: { product_id: params.product_id, is_deleted: NO } };

      // Execute query
      dataProduct = await Model.Products.findByPk(params.product_id, criteriaProduct);
      dataVariants = await Model.ProductVariants.findAll(criteriaVariants);
      
      if (!_.isEmpty(dataVariants)) {
        // Setup bulk data by product variant values
        const bulkInitialValue = await setBulkInventoryData(params, dataVariants, dataProduct);

        // Get existing SKU in inventory by product id
        const criteriaInventories = { attributes: ['sku'], where: { product_id: params.product_id, is_deleted: NO }, raw: true };
        const existingInventories = await Model.Inventories.findAll(criteriaInventories);

        // Filter new bulk data and existing data
        const filteredBulkValues = bulkInitialValue.filter(o => !existingInventories.find(o2 => o.sku === o2.sku));

        if (filteredBulkValues.length > 0) {
          // Create bulk inventories
          Model.Inventories.bulkCreate(filteredBulkValues)
            .then(async response => {
              res.json({
                status: 200,
                message: "Successfully created data.",
                result: true
              });
            });
        } else {
          res.json({
            status: 200,
            message: "No data to be generated.",
            result: false
          });
        }
      } else {
        res.json({
          status: 200,
          message: "No Product Variant found.",
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
      criteria = { where: { is_deleted: NO } };
      initialValues = _.pick(params, [
        'name',
        'sku',
        'quantity_in',
        'quantity_out',
        'quantity_reserved',
        'quantity_returned',
        'quantity_available',
        'unit',
        'price_amount',
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
                quantity_in, 
                quantity_out, 
                quantity_reserved, 
                quantity_returned, 
                quantity_available, 
                product_id, 
                created_at, 
                updated_at 
              FROM inventories 
              WHERE CONCAT(quantity_in, quantity_out, quantity_reserved, quantity_returned, quantity_available) LIKE ? AND is_deleted = ${NO};`;
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
      criteria = { where: { is_deleted: NO }, include: [{ model: Model.Products, as: 'products' }, { model: Model.Users, as: 'users' }] };
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
      criteria = { where: { product_id: params.productId, is_deleted: NO }, order: [ [ 'created_at', 'ASC' ]] };
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
   * Find available quantity by product id
  * @route GET /inventories/findAvailableQuantityByProductId/:productId
   * @param req
   * @param res
   * @returns {never}
   */
  findAvailableQuantityByProductId: async (req, res) => {
    const params = req.params;
    let data, criteria;

    try {
      // Pre-setting variables
      criteria = { attributes: ['quantity_available'], where: { product_id: params.productId, is_deleted: NO }, order: [ [ 'created_at', 'DESC' ]] };
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
   * Find by sku
   * @route GET /inventories/findBySku/:sku
   * @param req
   * @param res
   * @returns {never}
   */
  findBySku: async (req, res) => {
    const params = req.params;
    let data, criteria;

    try {
      // Pre-setting variables
      criteria = { attributes: ['sku', 'quantity_available', 'unit', 'price_amount', 'product_id'], where: { sku: params.sku, is_deleted: NO }, order: [ [ 'created_at', 'DESC' ]] };
      // Execute findAll query
      data = await Model.Inventories.findOne(criteria);
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
      criteria = { where: { is_deleted: NO }, include: [{ model: Model.Products, as: 'products' }, { model: Model.Users, as: 'users' }] };
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
   * Update Quantity Reserved and Available
   */
  updateQuantityReservedAndAvailable: (obj) => {
    return new Promise(async (resolve, reject) => {
      try {
        let initialValues, inventoryHistoryInitialValue, data, criteria;
        // Pre-setting variables
        criteria = { where: { sku: obj.sku, product_id: obj.product_id, is_deleted: NO } };
        // Execute findByPk query
        data = await Model.Inventories.findOne(criteria);
        if (!_.isEmpty(data)) {
          const updatedAt = moment().utc(8).format('YYYY-MM-DD HH:mm:ss');
          let computedQuantity, newQuantityReserved, newQuantityAvailable;
          switch(obj.type) {
            case 'INSERT':
              newQuantityReserved = parseInt(data.quantity_reserved) + parseInt(obj.new_quantity);
              newQuantityAvailable = parseInt(data.quantity_available) - parseInt(obj.new_quantity);
              initialValues = { quantity_reserved: newQuantityReserved, quantity_available: newQuantityAvailable, updated_at: updatedAt };
              inventoryHistoryInitialValue = { quantity_reserved: obj.new_quantity, quantity_available: -obj.new_quantity };
              break;
            case 'UPDATE':
              if (obj.old_quantity > obj.new_quantity) {
                // old_quantity - new_quantity
                computedQuantity = parseInt(obj.old_quantity) - parseInt(obj.new_quantity);
                newQuantityReserved = parseInt(data.quantity_reserved) - computedQuantity;
                newQuantityAvailable = parseInt(data.quantity_available) + computedQuantity;
                initialValues = { quantity_reserved: newQuantityReserved, quantity_available: newQuantityAvailable, updated_at: updatedAt };
                inventoryHistoryInitialValue = { quantity_reserved: -computedQuantity, quantity_available: computedQuantity };
              } else if (obj.old_quantity < obj.new_quantity) {
                // new_quantity - old_quantity
                computedQuantity = parseInt(obj.new_quantity) - parseInt(obj.old_quantity);
                newQuantityReserved = parseInt(data.quantity_reserved) + computedQuantity;
                newQuantityAvailable = parseInt(data.quantity_available) - computedQuantity;
                initialValues = { quantity_reserved: newQuantityReserved, quantity_available: newQuantityAvailable, updated_at: updatedAt };
                inventoryHistoryInitialValue = { quantity_reserved: computedQuantity, quantity_available: -computedQuantity };
              }
              break;
            case 'DELETE':
              newQuantityReserved = parseInt(data.quantity_reserved) - parseInt(obj.old_quantity);
              newQuantityAvailable = parseInt(data.quantity_available) + parseInt(obj.old_quantity);
              initialValues = { quantity_reserved: newQuantityReserved, quantity_available: newQuantityAvailable, updated_at: updatedAt };
              inventoryHistoryInitialValue = { quantity_reserved: -obj.old_quantity, quantity_available: obj.old_quantity };
              break;
          }
          data.update(initialValues)
            .then(response => {
              inventoryHistoryInitialValue.user_id = obj.user_id;
              inventoryHistoryInitialValue.inventory_id = data.id;
              inventoryHistoryInitialValue.created_at = moment().utc(8).format('YYYY-MM-DD HH:mm:ss');
              
              // Saving Inventory History
              Model.InventoryHistories.create(inventoryHistoryInitialValue)
                .then(response => {
                  resolve({
                    status: 200,
                    message: "Successfully update data.",
                    result: true
                  });
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

  /**
   * Update Quatity Out and Reserved
   */
  updateQuantityOutAndReserved: (obj) => {
    return new Promise(async (resolve, reject) => {
      try {
        let initialValues, inventoryHistoryInitialValue, data, criteria;
        // Pre-setting variables
        criteria = { where: { sku: obj.sku, product_id: obj.product_id, is_deleted: NO } };
        // Execute findByPk query
        data = await Model.Inventories.findOne(criteria);
        if (!_.isEmpty(data)) {
          const updatedAt = moment().utc(8).format('YYYY-MM-DD HH:mm:ss');
          let newQuantityOut, newQuantityReserved;
          newQuantityOut = parseInt(data.quantity_out) + parseInt(obj.new_quantity);
          newQuantityReserved = parseInt(data.quantity_reserved) - parseInt(obj.new_quantity);
          initialValues = { quantity_out: newQuantityOut, quantity_reserved: newQuantityReserved, updated_at: updatedAt };
          inventoryHistoryInitialValue = { quantity_out: obj.new_quantity, quantity_reserved: -obj.new_quantity };

          data.update(initialValues)
            .then(response => {
              inventoryHistoryInitialValue.user_id = obj.user_id;
              inventoryHistoryInitialValue.inventory_id = data.id;
              inventoryHistoryInitialValue.created_at = moment().utc(8).format('YYYY-MM-DD HH:mm:ss');
              
              // Saving Inventory History
              Model.InventoryHistories.create(inventoryHistoryInitialValue)
                .then(response => {
                  resolve({
                    status: 200,
                    message: "Successfully update data.",
                    result: true
                  });
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

/**
 * Other Functions
 */
const setBulkInventoryData = (params, data, product) => {
  let multiplyLength = 1, 
    arrayValues = [],
    bulkData = [""],
    finalData = "",
    sliceStart = 0,
    sliceEnd = 0

  // 1. Set array values and multiply length
  for (let i = 0; i < data.length; i++) {
    const value = JSON.parse(data[i].values).sort((a, b) => {return a.id - b.id});
    multiplyLength = multiplyLength * value.length;
    arrayValues.push(value);
  }

  // 2. Set and filtering of Bulk Data
  for (let a = 0; a < arrayValues.length; a++) {
    const value = arrayValues[a];
    const valueLength = value.length;
    bulkData.map(response => {
      let newValue = [];
      responseName = response === '' ? product.name : response;
      responseSku = response === '' ? product.code : response;
      for (let b = 0; b < valueLength; b++) {
        let name = _.isObject(responseName) === true ? responseName.name : responseName;
        let sku = _.isObject(responseSku) === true ? responseSku.sku : responseSku;
        newValue[b] = {
          name: `${name} ${value[b].name}`,
          sku: `${sku}-${value[b].code.toUpperCase()}`,
          unit: product.unit,
          price_amount: product.price_amount,
          quantity_in: 0,
          quantity_available: 0,
          user_id: params.user_id,
          product_id: params.product_id,
          created_at: params.created_at,
        };
        bulkData.push(newValue[b]);
      }
    })
  }

  // 3. Remove unnecessary data and return
  sliceStart = bulkData.length - multiplyLength;
  sliceEnd = bulkData.length;
  finalData = bulkData.slice(sliceStart, sliceEnd);

  return finalData;
}