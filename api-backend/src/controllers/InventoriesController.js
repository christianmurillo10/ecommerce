const Model = require("../models");
const { ErrorHandler, handleSuccess } = require("../helpers/response-helper");
const { NO, YES } = require("../helpers/constant-helper");

module.exports = {
  /**
   * Create bulk with product variants by product id
   * @routes POST /inventories/generateBulkWithProductVariantsByProductId
   */
  generateBulkWithProductVariantsByProductId: async (req, res, next) => {
    const params = req.body;
    let errors = [],
      criteriaProduct,
      criteriaVariants,
      dataVariants,
      dataProduct;

    try {
      // Validators
      if (_.isEmpty(params)) {
        errors.push("Invalid Parameter.");
        throw new ErrorHandler(400, errors);
      }

      // Override variables
      params.created_at = moment().utc(8).format("YYYY-MM-DD HH:mm:ss");
      params.user_id = req.user.id.toLocaleString();
      params.product_id = params.product_id.toLocaleString();

      if (_.isEmpty(params.product_id)) {
        errors.push("Product is required.");
        throw new ErrorHandler(400, errors);
      }

      // Validate Data
      // Get Product Data
      criteriaProduct = {
        attributes: ["code", "name", "unit", "price_amount"],
        where: { is_deleted: NO },
      };
      dataProduct = await Model.Products.findByPk(
        params.product_id,
        criteriaProduct
      );
      if (_.isEmpty(dataProduct)) {
        errors.push("Data doesn't exist.");
        throw new ErrorHandler(500, errors);
      }

      // Get Variants Data by product id
      criteriaVariants = {
        where: { product_id: params.product_id, is_deleted: NO },
      };
      dataVariants = await Model.ProductVariants.findAll(criteriaVariants);
      if (_.isEmpty(dataVariants)) {
        errors.push("No Product Variant found.");
        throw new ErrorHandler(500, errors);
      }

      // Setup bulk data by product variant values
      const bulkInitialValue = await setBulkInventoryData(
        params,
        dataVariants,
        dataProduct
      );

      // Get existing SKU in inventory by product id
      const criteriaInventories = {
        attributes: ["sku"],
        where: { product_id: params.product_id, is_deleted: NO },
        raw: true,
      };
      const existingInventories = await Model.Inventories.findAll(
        criteriaInventories
      );

      // Filter new bulk data and existing data
      const filteredBulkValues = bulkInitialValue.filter(
        (o) => !existingInventories.find((o2) => o.sku === o2.sku)
      );

      if (filteredBulkValues.length < 1) {
        errors.push("No data to be generated.");
        throw new ErrorHandler(500, errors);
      }

      // Create bulk inventories
      Model.Inventories.bulkCreate(filteredBulkValues).then(
        async (response) => {
          handleSuccess(res, {
            statusCode: 201,
            message: "Successfully created data.",
            result: [],
          });
        }
      );
    } catch (err) {
      next(err);
    }
  },

  /**
   * Add Stock
   * @route PUT /inventories/addStock/:id
   */
  addStock: async (req, res, next) => {
    const params = req.body;
    let errors = [],
      initialValues,
      inventoryHistoryInitialValue,
      data,
      criteria;

    try {
      // Validators
      if (_.isEmpty(params)) {
        errors.push("Invalid Parameter.");
        throw new ErrorHandler(400, errors);
      }

      // Override variables
      params.updated_at = moment().utc(8).format("YYYY-MM-DD HH:mm:ss");
      params.quantity = params.quantity.toLocaleString();
      params.user_id = req.user.id.toLocaleString();

      if (_.isEmpty(params.quantity)) {
        errors.push("Quantity is required.");
        throw new ErrorHandler(400, errors);
      }

      // Validate Data
      criteria = { where: { is_deleted: NO } };
      data = await Model.Inventories.findByPk(req.params.id);
      if (_.isEmpty(data)) {
        errors.push("Data doesn't exist.");
        throw new ErrorHandler(500, errors);
      }

      let newQuantityIn, newQuantityAvailable;
      newQuantityIn = parseInt(data.quantity_in) + parseInt(params.quantity);
      newQuantityAvailable =
        parseInt(data.quantity_available) + parseInt(params.quantity);
      initialValues = {
        quantity_in: newQuantityIn,
        quantity_available: newQuantityAvailable,
        updated_at: params.updated_at,
      };
      inventoryHistoryInitialValue = {
        quantity_in: params.quantity,
        quantity_available: params.quantity,
      };

      data.update(initialValues).then(() =>
        Model.Inventories.findByPk(data.id, criteria).then((finalData) => {
          inventoryHistoryInitialValue.user_id = params.user_id;
          inventoryHistoryInitialValue.inventory_id = data.id;
          inventoryHistoryInitialValue.created_at = moment()
            .utc(8)
            .format("YYYY-MM-DD HH:mm:ss");

          // Saving Inventory History
          Model.InventoryHistories.create(inventoryHistoryInitialValue).then(
            (response) => {
              handleSuccess(res, {
                statusCode: 200,
                message: "Successfully update data.",
                result: _.omit(finalData.get({ plain: true }), ["is_deleted"]),
              });
            }
          );
        })
      );
    } catch (err) {
      next(err);
    }
  },

  /**
   * Update
   * @route PUT /inventories/update/:id
   */
  update: async (req, res, next) => {
    const params = req.body;
    let errors = [],
      initialValues,
      data,
      criteria;

    try {
      // Validators
      if (_.isEmpty(params)) {
        errors.push("Invalid Parameter.");
        throw new ErrorHandler(400, errors);
      }

      // Override Variables
      params.updated_at = moment().utc(8).format("YYYY-MM-DD HH:mm:ss");

      // Validate Data
      data = await Model.Inventories.findByPk(req.params.id);
      if (_.isEmpty(data)) {
        errors.push("Data doesn't exist.");
        throw new ErrorHandler(500, errors);
      }

      // Pre-setting variables
      criteria = { where: { is_deleted: NO } };
      initialValues = _.pick(params, ["name", "sku", "unit", "updated_at"]);

      data.update(initialValues).then(() =>
        Model.Inventories.findByPk(data.id, criteria).then((finalData) => {
          handleSuccess(res, {
            statusCode: 200,
            message: "Successfully updated data.",
            result: _.omit(finalData.get({ plain: true }), ["is_deleted"]),
          });
        })
      );
    } catch (err) {
      next(err);
    }
  },

  /**
   * Delete
   * @route PUT /inventories/delete/:id
   */
  delete: async (req, res, next) => {
    let errors = [],
      data;

    try {
      // Validate Data
      data = await Model.Inventories.findByPk(req.params.id);
      if (_.isEmpty(data)) {
        errors.push("Data doesn't exist.");
        throw new ErrorHandler(500, errors);
      }
      let finalData = await data.update({ is_deleted: YES });

      handleSuccess(res, {
        statusCode: 200,
        message: "Successfully deleted data.",
        result: finalData,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Find all
   * @route GET /inventories
   */
  findAll: async (req, res, next) => {
    let errors = [],
      data,
      criteria;

    try {
      // Validate Data
      criteria = {
        where: { is_deleted: NO },
        include: [
          { model: Model.Products, as: "products" },
          { model: Model.Users, as: "users" },
        ],
      };
      // Execute findAll query
      data = await Model.Inventories.findAll(criteria);
      if (_.isEmpty(data[0])) {
        errors.push("No data found.");
        throw new ErrorHandler(500, errors);
      }

      handleSuccess(res, {
        statusCode: 200,
        message: "Successfully find all data.",
        result: data,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Find all total quantity
   * @route GET /inventories/findAllTotalQuantity
   */
  findAllTotalQuantity: async (req, res, next) => {
    let errors = [],
      data,
      criteria;

    try {
      // Validate Data
      criteria = {
        attributes: [
          [
            Model.sequelize.fn("sum", Model.sequelize.col("quantity_in")),
            "total_quantity_in",
          ],
          [
            Model.sequelize.fn("sum", Model.sequelize.col("quantity_out")),
            "total_quantity_out",
          ],
          [
            Model.sequelize.fn("sum", Model.sequelize.col("quantity_reserved")),
            "total_quantity_reserved",
          ],
          [
            Model.sequelize.fn("sum", Model.sequelize.col("quantity_returned")),
            "total_quantity_returned",
          ],
          [
            Model.sequelize.fn(
              "sum",
              Model.sequelize.col("quantity_available")
            ),
            "total_quantity_available",
          ],
          "product_id",
        ],
        where: { is_deleted: NO },
        group: ["product_id"],
        include: [
          {
            model: Model.Products,
            as: "products",
            attributes: ["code", "name", "is_published"],
          },
        ],
      };
      data = await Model.Inventories.findAll(criteria);
      if (_.isEmpty(data[0])) {
        errors.push("No data found.");
        throw new ErrorHandler(500, errors);
      }

      handleSuccess(res, {
        statusCode: 200,
        message: "Successfully find all data.",
        result: data,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Find all by product id
   * @route GET /inventories/findAllbyProductId/:productId
   */
  findAllbyProductId: async (req, res, next) => {
    const params = req.params;
    let errors = [],
      data,
      criteria;

    try {
      // Validate Data
      criteria = {
        where: { product_id: params.productId, is_deleted: NO },
        order: [["created_at", "ASC"]],
      };
      data = await Model.Inventories.findAll(criteria);
      if (_.isEmpty(data[0])) {
        errors.push("No data found.");
        throw new ErrorHandler(500, errors);
      }

      handleSuccess(res, {
        statusCode: 200,
        message: "Successfully find all data.",
        result: data,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Find available quantity by product id
   * @route GET /inventories/findAvailableQuantityByProductId/:productId
   */
  findAvailableQuantityByProductId: async (req, res, next) => {
    const params = req.params;
    let errors = [],
      data,
      criteria;

    try {
      // Validate Data
      criteria = {
        attributes: ["quantity_available"],
        where: { product_id: params.productId, is_deleted: NO },
        order: [["created_at", "DESC"]],
      };
      data = await Model.Inventories.findOne(criteria);
      if (_.isEmpty(data)) {
        errors.push("No data found.");
        throw new ErrorHandler(500, errors);
      }

      handleSuccess(res, {
        statusCode: 200,
        message: "Successfully find all data.",
        result: data.get({ plain: true }),
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Find by sku
   * @route GET /inventories/findBySku/:sku
   */
  findBySku: async (req, res, next) => {
    const params = req.params;
    let errors = [],
      data,
      criteria;

    try {
      // Validate Data
      criteria = {
        attributes: [
          "sku",
          "quantity_available",
          "unit",
          "price_amount",
          "product_id",
        ],
        where: { sku: params.sku, is_deleted: NO },
        order: [["created_at", "DESC"]],
      };
      data = await Model.Inventories.findOne(criteria);
      if (_.isEmpty(data)) {
        errors.push("No data found.");
        throw new ErrorHandler(500, errors);
      }

      handleSuccess(res, {
        statusCode: 200,
        message: "Successfully find data.",
        result: data.get({ plain: true }),
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Find by id
   * @route GET /inventories/:id
   */
  findById: async (req, res, next) => {
    let errors = [],
      data,
      criteria;

    try {
      // Validate Data
      criteria = {
        where: { is_deleted: NO },
        include: [
          { model: Model.Products, as: "products" },
          { model: Model.Users, as: "users" },
        ],
      };
      data = await Model.Inventories.findByPk(req.params.id, criteria);
      if (_.isEmpty(data)) {
        errors.push("No data found.");
        throw new ErrorHandler(500, errors);
      }

      handleSuccess(res, {
        statusCode: 200,
        message: "Successfully find data.",
        result: _.omit(data.get({ plain: true }), ["is_deleted"]),
      });
    } catch (err) {
      next(err);
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

        // Validate Data
        criteria = {
          where: { sku: obj.sku, product_id: obj.product_id, is_deleted: NO },
        };
        data = await Model.Inventories.findOne(criteria);
        if (_.isEmpty(data)) {
          resolve(false);
        }

        const updatedAt = moment().utc(8).format("YYYY-MM-DD HH:mm:ss");
        let computedQuantity, newQuantityReserved, newQuantityAvailable;
        switch (obj.type) {
          case "INSERT":
            newQuantityReserved =
              parseInt(data.quantity_reserved) + parseInt(obj.new_quantity);
            newQuantityAvailable =
              parseInt(data.quantity_available) - parseInt(obj.new_quantity);
            initialValues = {
              quantity_reserved: newQuantityReserved,
              quantity_available: newQuantityAvailable,
              updated_at: updatedAt,
            };
            inventoryHistoryInitialValue = {
              quantity_reserved: obj.new_quantity,
              quantity_available: -obj.new_quantity,
            };
            break;
          case "UPDATE":
            if (obj.old_quantity > obj.new_quantity) {
              // old_quantity - new_quantity
              computedQuantity =
                parseInt(obj.old_quantity) - parseInt(obj.new_quantity);
              newQuantityReserved =
                parseInt(data.quantity_reserved) - computedQuantity;
              newQuantityAvailable =
                parseInt(data.quantity_available) + computedQuantity;
              initialValues = {
                quantity_reserved: newQuantityReserved,
                quantity_available: newQuantityAvailable,
                updated_at: updatedAt,
              };
              inventoryHistoryInitialValue = {
                quantity_reserved: -computedQuantity,
                quantity_available: computedQuantity,
              };
            } else if (obj.old_quantity < obj.new_quantity) {
              // new_quantity - old_quantity
              computedQuantity =
                parseInt(obj.new_quantity) - parseInt(obj.old_quantity);
              newQuantityReserved =
                parseInt(data.quantity_reserved) + computedQuantity;
              newQuantityAvailable =
                parseInt(data.quantity_available) - computedQuantity;
              initialValues = {
                quantity_reserved: newQuantityReserved,
                quantity_available: newQuantityAvailable,
                updated_at: updatedAt,
              };
              inventoryHistoryInitialValue = {
                quantity_reserved: computedQuantity,
                quantity_available: -computedQuantity,
              };
            }
            break;
          case "DELETE":
            newQuantityReserved =
              parseInt(data.quantity_reserved) - parseInt(obj.old_quantity);
            newQuantityAvailable =
              parseInt(data.quantity_available) + parseInt(obj.old_quantity);
            initialValues = {
              quantity_reserved: newQuantityReserved,
              quantity_available: newQuantityAvailable,
              updated_at: updatedAt,
            };
            inventoryHistoryInitialValue = {
              quantity_reserved: -obj.old_quantity,
              quantity_available: obj.old_quantity,
            };
            break;
        }
        data.update(initialValues).then((response) => {
          inventoryHistoryInitialValue.user_id = obj.user_id;
          inventoryHistoryInitialValue.inventory_id = data.id;
          inventoryHistoryInitialValue.created_at = moment()
            .utc(8)
            .format("YYYY-MM-DD HH:mm:ss");

          // Saving Inventory History
          Model.InventoryHistories.create(inventoryHistoryInitialValue).then(
            (response) => {
              resolve(true);
            }
          );
        });
      } catch (err) {
        reject(err);
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

        // Validate Data
        criteria = {
          where: { sku: obj.sku, product_id: obj.product_id, is_deleted: NO },
        };
        data = await Model.Inventories.findOne(criteria);
        if (_.isEmpty(data)) {
          resolve(false);
        }
        
        const updatedAt = moment().utc(8).format("YYYY-MM-DD HH:mm:ss");
        let newQuantityOut, newQuantityReserved;
        newQuantityOut =
          parseInt(data.quantity_out) + parseInt(obj.new_quantity);
        newQuantityReserved =
          parseInt(data.quantity_reserved) - parseInt(obj.new_quantity);
        initialValues = {
          quantity_out: newQuantityOut,
          quantity_reserved: newQuantityReserved,
          updated_at: updatedAt,
        };
        inventoryHistoryInitialValue = {
          quantity_out: obj.new_quantity,
          quantity_reserved: -obj.new_quantity,
        };

        data.update(initialValues).then((response) => {
          inventoryHistoryInitialValue.user_id = obj.user_id;
          inventoryHistoryInitialValue.inventory_id = data.id;
          inventoryHistoryInitialValue.created_at = moment()
            .utc(8)
            .format("YYYY-MM-DD HH:mm:ss");

          // Saving Inventory History
          Model.InventoryHistories.create(inventoryHistoryInitialValue).then(
            (response) => {
              resolve(true);
            }
          );
        });
      } catch (err) {
        reject(err);
      }
    });
  },

  /**
   * Update Quantity Returned and Out
   */
  updateQuantityReturnedAndOut: (obj) => {
    return new Promise(async (resolve, reject) => {
      try {
        let initialValues, inventoryHistoryInitialValue, data, criteria;

        // Validate Data
        criteria = {
          where: { sku: obj.sku, product_id: obj.product_id, is_deleted: NO },
        };
        data = await Model.Inventories.findOne(criteria);
        if (_.isEmpty(data)) {
          resolve(false);
        }
        
        const updatedAt = moment().utc(8).format("YYYY-MM-DD HH:mm:ss");
        let computedQuantity, newQuantityReturned, newQuantityOut;
        switch (obj.type) {
          case "INSERT":
            newQuantityReturned =
              parseInt(data.quantity_returned) + parseInt(obj.new_quantity);
            newQuantityOut =
              parseInt(data.quantity_out) - parseInt(obj.new_quantity);
            initialValues = {
              quantity_returned: newQuantityReturned,
              quantity_out: newQuantityOut,
              updated_at: updatedAt,
            };
            inventoryHistoryInitialValue = {
              quantity_returned: obj.new_quantity,
              quantity_out: -obj.new_quantity,
            };
            break;
          case "UPDATE":
            if (obj.old_quantity > obj.new_quantity) {
              // old_quantity - new_quantity
              computedQuantity =
                parseInt(obj.old_quantity) - parseInt(obj.new_quantity);
              newQuantityReturned =
                parseInt(data.quantity_returned) - computedQuantity;
              newQuantityOut = parseInt(data.quantity_out) + computedQuantity;
              initialValues = {
                quantity_returned: newQuantityReturned,
                quantity_out: newQuantityOut,
                updated_at: updatedAt,
              };
              inventoryHistoryInitialValue = {
                quantity_returned: -computedQuantity,
                quantity_out: computedQuantity,
              };
            } else if (obj.old_quantity < obj.new_quantity) {
              // new_quantity - old_quantity
              computedQuantity =
                parseInt(obj.new_quantity) - parseInt(obj.old_quantity);
              newQuantityReturned =
                parseInt(data.quantity_returned) + computedQuantity;
              newQuantityOut = parseInt(data.quantity_out) - computedQuantity;
              initialValues = {
                quantity_returned: newQuantityReturned,
                quantity_out: newQuantityOut,
                updated_at: updatedAt,
              };
              inventoryHistoryInitialValue = {
                quantity_returned: computedQuantity,
                quantity_out: -computedQuantity,
              };
            }
            break;
          case "DELETE":
            newQuantityReturned =
              parseInt(data.quantity_returned) - parseInt(obj.old_quantity);
            newQuantityOut =
              parseInt(data.quantity_out) + parseInt(obj.old_quantity);
            initialValues = {
              quantity_returned: newQuantityReturned,
              quantity_out: newQuantityOut,
              updated_at: updatedAt,
            };
            inventoryHistoryInitialValue = {
              quantity_returned: -obj.old_quantity,
              quantity_out: obj.old_quantity,
            };
            break;
        }
        data.update(initialValues).then((response) => {
          inventoryHistoryInitialValue.user_id = obj.user_id;
          inventoryHistoryInitialValue.inventory_id = data.id;
          inventoryHistoryInitialValue.created_at = moment()
            .utc(8)
            .format("YYYY-MM-DD HH:mm:ss");

          // Saving Inventory History
          Model.InventoryHistories.create(inventoryHistoryInitialValue).then(
            (response) => {
              resolve(true);
            }
          );
        });
      } catch (err) {
        reject(err);
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
    sliceEnd = 0;

  // 1. Set array values and multiply length
  for (let i = 0; i < data.length; i++) {
    const value = JSON.parse(data[i].values).sort((a, b) => {
      return a.id - b.id;
    });
    multiplyLength = multiplyLength * value.length;
    arrayValues.push(value);
  }

  // 2. Set and filtering of Bulk Data
  for (let a = 0; a < arrayValues.length; a++) {
    const value = arrayValues[a];
    const valueLength = value.length;
    bulkData.map((response) => {
      let newValue = [];
      responseName = response === "" ? product.name : response;
      responseSku = response === "" ? product.code : response;
      for (let b = 0; b < valueLength; b++) {
        let name =
          _.isObject(responseName) === true ? responseName.name : responseName;
        let sku =
          _.isObject(responseSku) === true ? responseSku.sku : responseSku;
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
    });
  }

  // 3. Remove unnecessary data and return
  sliceStart = bulkData.length - multiplyLength;
  sliceEnd = bulkData.length;
  finalData = bulkData.slice(sliceStart, sliceEnd);

  return finalData;
};
