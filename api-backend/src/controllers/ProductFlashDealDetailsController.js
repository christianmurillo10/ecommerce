const Model = require("../models");
const { ErrorHandler, handleSuccess } = require("../helpers/response-helper");
const {
  NO,
  YES,
  PRODUCT_IMAGES_TYPE_MAIN,
  PRODUCT_IMAGES_TYPE_THUMBNAIL,
  PRODUCT_IMAGES_TYPE_FEATURED,
  PRODUCT_IMAGES_TYPE_FASH_DEAL,
} = require("../helpers/constant-helper");

module.exports = {
  /**
   * Create
   * @routes POST /productFlashDealDetails/create
   */
  create: async (req, res, next) => {
    const params = req.body;
    let errors = [],
      criteria,
      initialValues;

    try {
      // Validators
      if (_.isEmpty(params)) {
        errors.push("Invalid Parameter.");
        throw new ErrorHandler(400, errors);
      }

      // Override variables
      params.created_at = moment().utc(8).format("YYYY-MM-DD HH:mm:ss");
      params.discount_percentage = params.discount_percentage
        ? params.discount_percentage.toLocaleString()
        : null;
      params.discount_amount = params.discount_amount
        ? params.discount_amount.toLocaleString()
        : null;
      params.base_price_amount = params.base_price_amount.toLocaleString();
      params.current_price_amount = params.current_price_amount.toLocaleString();
      params.quantity = params.quantity.toLocaleString();
      params.quantity_available = params.quantity.toLocaleString();
      params.user_id = req.user.id.toLocaleString();
      params.product_id = params.product_id
        ? params.product_id.toLocaleString()
        : null;
      params.product_flash_deal_id = params.product_flash_deal_id
        ? params.product_flash_deal_id.toLocaleString()
        : null;
      params.discount_type = params.discount_type
        ? params.discount_type.toLocaleString()
        : null;

      if (_.isEmpty(params.base_price_amount))
        errors.push("Base Price Amount is required.");
      if (_.isEmpty(params.current_price_amount))
        errors.push("Current Price Amount is required.");
      if (_.isEmpty(params.quantity)) errors.push("Quantity is required.");
      if (_.isEmpty(params.product_id)) errors.push("Product is required.");
      if (_.isEmpty(params.product_flash_deal_id))
        errors.push("Product Flash Deal is required.");
      if (errors.length > 0) {
        throw new ErrorHandler(400, errors);
      }

      // Validate Data
      criteria = {
        where: {
          product_flash_deal_id: params.product_flash_deal_id,
          product_id: params.product_id,
          is_deleted: NO,
        },
        include: [
          {
            model: Model.Products,
            as: "products",
            attributes: ["name", "price_amount"],
            include: [
              {
                model: Model.ProductImages,
                as: "productImages",
                attributes: ["file_name", "order", "type", "product_id"],
                where: { type: PRODUCT_IMAGES_TYPE_THUMBNAIL, is_deleted: NO },
                required: false,
              },
            ],
          },
        ],
      };
      data = await Model.ProductFlashDealDetails.findAll(criteria);
      if (!_.isEmpty(data[0])) {
        errors.push("Data already exist.");
        throw new ErrorHandler(500, errors);
      }

      // Pre-setting variables
      initialValues = _.pick(params, [
        "discount_percentage",
        "discount_amount",
        "base_price_amount",
        "current_price_amount",
        "quantity",
        "quantity_available",
        "user_id",
        "product_id",
        "product_flash_deal_id",
        "created_at",
        "discount_type",
      ]);

      await Model.ProductFlashDealDetails.create(initialValues)
        .then(() => Model.ProductFlashDealDetails.findOrCreate(criteria))
        .then(async ([finalData, created]) => {
          let plainData = finalData.get({ plain: true });
          handleSuccess(res, {
            statusCode: 201,
            message: "Successfully created data.",
            result: _.omit(plainData, ["is_deleted"]),
          });
        });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Update
   * @route PUT /productFlashDealDetails/update/:id
   */
  update: async (req, res, next) => {
    const params = req.body;
    let errors = [],
      initialValues,
      data;

    try {
      // Validators
      if (_.isEmpty(params)) {
        errors.push("Invalid Parameter.");
        throw new ErrorHandler(400, errors);
      }

      // Override variables
      params.updated_at = moment().utc(8).format("YYYY-MM-DD HH:mm:ss");
      params.quantity = params.quantity.toLocaleString();
      params.quantity_available = params.quantity.toLocaleString();

      // Validate Data
      criteria = {
        include: [
          {
            model: Model.Products,
            as: "products",
            attributes: ["name", "price_amount"],
            include: [
              {
                model: Model.ProductImages,
                as: "productImages",
                attributes: ["file_name", "order", "type", "product_id"],
                where: { type: PRODUCT_IMAGES_TYPE_THUMBNAIL, is_deleted: NO },
                required: false,
              },
            ],
          },
        ],
      };
      data = await Model.ProductFlashDealDetails.findByPk(
        req.params.id,
        criteria
      );
      if (_.isEmpty(data)) {
        errors.push("Data doesn't exist.");
        throw new ErrorHandler(500, errors);
      }

      // Pre-setting variables
      initialValues = _.pick(params, [
        "discount_percentage",
        "discount_amount",
        "base_price_amount",
        "current_price_amount",
        "quantity",
        "quantity_available",
        "user_id",
        "product_id",
        "product_flash_deal_id",
        "updated_at",
        "discount_type",
      ]);
      let finalData = await data.update(initialValues);

      handleSuccess(res, {
        statusCode: 200,
        message: "Successfully updated data.",
        result: finalData,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Delete
   * @route PUT /productFlashDealDetails/delete/:id
   */
  delete: async (req, res, next) => {
    let errors = [],
      data;

    try {
      // Validate Data
      data = await Model.ProductFlashDealDetails.findByPk(req.params.id);
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
   * @route GET /productFlashDealDetails
   */
  findAll: async (req, res, next) => {
    let errors = [],
      data,
      criteria;

    try {
      // Validate Data
      criteria = { where: { is_deleted: NO } };
      data = await Model.ProductFlashDealDetails.findAll(criteria);
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
   * Find all by product flash deal id
   * @route GET /productFlashDealDetails/findAllbyProductFlashDealId/:productFlashDealId
   */
  findAllbyProductFlashDealId: async (req, res, next) => {
    const params = req.params;
    let errors = [],
      data,
      criteria;

    try {
      // Validate Data
      criteria = {
        where: {
          product_flash_deal_id: params.productFlashDealId,
          is_deleted: NO,
        },
        include: [
          {
            model: Model.Products,
            as: "products",
            attributes: ["name", "price_amount"],
            include: [
              {
                model: Model.ProductImages,
                as: "productImages",
                attributes: ["file_name", "order", "type", "product_id"],
                where: { type: PRODUCT_IMAGES_TYPE_THUMBNAIL, is_deleted: NO },
                required: false,
              },
            ],
          },
        ],
      };
      data = await Model.ProductFlashDealDetails.findAll(criteria);
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
   * Find by id
   * @route GET /productFlashDealDetails/:id
   */
  findById: async (req, res, next) => {
    let errors = [],
      data;

    try {
      // Validate Data
      data = await Model.ProductFlashDealDetails.findByPk(req.params.id);
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
   * Update Quantity Sold and Available
   */
  updateQuantitySoldAndAvailable: (obj) => {
    return new Promise(async (resolve, reject) => {
      try {
        let initialValues, data;
        // Execute findByPk query
        data = await Model.ProductFlashDealDetails.findByPk(obj.id);
        if (!_.isEmpty(data)) {
          const updatedAt = moment().utc(8).format("YYYY-MM-DD HH:mm:ss");
          let computedQuantity, newQuantitySold, newQuantityAvailable;
          switch (obj.type) {
            case "INSERT":
              newQuantitySold =
                parseInt(data.quantity_sold) + parseInt(obj.new_quantity);
              newQuantityAvailable =
                parseInt(data.quantity_available) - parseInt(obj.new_quantity);
              initialValues = {
                quantity_sold: newQuantitySold,
                quantity_available: newQuantityAvailable,
                updated_at: updatedAt,
              };
              break;
            case "UPDATE":
              if (obj.old_quantity > obj.new_quantity) {
                // old_quantity - new_quantity
                computedQuantity =
                  parseInt(obj.old_quantity) - parseInt(obj.new_quantity);
                newQuantitySold =
                  parseInt(data.quantity_sold) - computedQuantity;
                newQuantityAvailable =
                  parseInt(data.quantity_available) + computedQuantity;
                initialValues = {
                  quantity_sold: newQuantitySold,
                  quantity_available: newQuantityAvailable,
                  updated_at: updatedAt,
                };
              } else if (obj.old_quantity < obj.new_quantity) {
                // new_quantity - old_quantity
                computedQuantity =
                  parseInt(obj.new_quantity) - parseInt(obj.old_quantity);
                newQuantitySold =
                  parseInt(data.quantity_sold) + computedQuantity;
                newQuantityAvailable =
                  parseInt(data.quantity_available) - computedQuantity;
                initialValues = {
                  quantity_sold: newQuantitySold,
                  quantity_available: newQuantityAvailable,
                  updated_at: updatedAt,
                };
              }
              break;
            case "DELETE":
              newQuantitySold =
                parseInt(data.quantity_sold) - parseInt(obj.old_quantity);
              newQuantityAvailable =
                parseInt(data.quantity_available) + parseInt(obj.old_quantity);
              initialValues = {
                quantity_sold: newQuantitySold,
                quantity_available: newQuantityAvailable,
                updated_at: updatedAt,
              };
              break;
          }
          data.update(initialValues).then((response) => {
            resolve({
              status: 200,
              message: "Successfully update data.",
              result: true,
            });
          });
        } else {
          resolve({
            status: 200,
            message: "Data doesn't exist.",
            result: false,
          });
        }
      } catch (err) {
        resolve({
          status: 401,
          err: err,
          message: "Failed to find data.",
        });
      }
    });
  },
};
