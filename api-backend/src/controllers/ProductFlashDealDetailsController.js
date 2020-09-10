const Model = require('../models');
const { 
  NO, 
  YES,
  PRODUCT_IMAGES_TYPE_MAIN,
  PRODUCT_IMAGES_TYPE_THUMBNAIL,
  PRODUCT_IMAGES_TYPE_FEATURED,
  PRODUCT_IMAGES_TYPE_FASH_DEAL
} = require('../helpers/constant-helper');

module.exports = {
  /**
   * Create
   * @param req
   * @param res
   * @returns {Promise<void>}
   * @routes POST /productFlashDealDetails/create
   */
  create: async (req, res) => {
    const params = req.body;
    let criteria, initialValues;

    // Validators
    if (_.isUndefined(params))
      return res.badRequest({ err: "Invalid Parameter: [params]" });
    if (_.isEmpty(params))
      return res.badRequest({ err: "Empty Parameter: [params]" });

    // Override variables
    params.created_at = moment().utc(8).format('YYYY-MM-DD HH:mm:ss');
    params.discount_percentage = params.discount_percentage === null ? null : params.discount_percentage.toLocaleString();
    params.discount_amount = params.discount_amount === null ? null : params.discount_amount.toLocaleString();
    params.base_price_amount = params.base_price_amount.toLocaleString();
    params.current_price_amount = params.current_price_amount.toLocaleString();
    params.quantity = params.quantity.toLocaleString();
    params.quantity_available = params.quantity.toLocaleString();
    params.user_id = req.user.id.toLocaleString();
    params.product_id = params.product_id === undefined ? null : params.product_id.toLocaleString();
    params.product_flash_deal_id = params.product_flash_deal_id === undefined ? null : params.product_flash_deal_id.toLocaleString();
    params.discount_type = params.discount_type === null ? null : params.discount_type.toLocaleString();

    try {
      // Validators
      if (_.isEmpty(params.base_price_amount)) return res.json({ status: 200, message: "Base Price Amount is required.", result: false });
      if (_.isEmpty(params.current_price_amount)) return res.json({ status: 200, message: "Current Price Amount is required.", result: false });
      if (_.isEmpty(params.quantity)) return res.json({ status: 200, message: "Quantity is required.", result: false });
      if (_.isEmpty(params.product_id)) return res.json({ status: 200, message: "Product is required.", result: false });
      if (_.isEmpty(params.product_flash_deal_id)) return res.json({ status: 200, message: "Product Flash Deal is required.", result: false });

      // Pre-setting variables
      criteria = { 
        where: { product_flash_deal_id: params.product_flash_deal_id, product_id: params.product_id, is_deleted: NO }, 
        include: [
          { 
            model: Model.Products, as: 'products', 
            attributes: ['name', 'price_amount'], 
            include: [
              { 
                model: Model.ProductImages, as: "productImages", 
                attributes: ['file_name', 'order', 'type', 'product_id'],
                where: { type: PRODUCT_IMAGES_TYPE_THUMBNAIL, is_deleted: NO },
                required: false 
              },
            ] 
          }
        ] 
      };
      initialValues = _.pick(params, [
        'discount_percentage', 
        'discount_amount', 
        'base_price_amount', 
        'current_price_amount', 
        'quantity',
        'quantity_available',
        'user_id', 
        'product_id', 
        'product_flash_deal_id', 
        'created_at', 
        'discount_type'
      ]);
      
      // Execute findAll query
      data = await Model.ProductFlashDealDetails.findAll(criteria);
      if (_.isEmpty(data[0])) {
        await Model.ProductFlashDealDetails.create(initialValues)
          .then(() => Model.ProductFlashDealDetails.findOrCreate(criteria))
          .then(async ([finalData, created]) => {
            let plainData = finalData.get({ plain: true });
            res.json({
              status: 200,
              message: "Successfully created data.",
              result: _.omit(plainData, ["is_deleted"])
            });
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
   * @route PUT /productFlashDealDetails/update/:id
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
    params.quantity = params.quantity.toLocaleString();
    params.quantity_available = params.quantity.toLocaleString();

    try {
      // Pre-setting variables
      criteria = { 
        include: [
          { 
            model: Model.Products, as: 'products', 
            attributes: ['name', 'price_amount'], 
            include: [
              { 
                model: Model.ProductImages, as: "productImages", 
                attributes: ['file_name', 'order', 'type', 'product_id'],
                where: { type: PRODUCT_IMAGES_TYPE_THUMBNAIL, is_deleted: NO },
                required: false 
              },
            ] 
          }
        ] 
      };
      initialValues = _.pick(params, [
        'discount_percentage', 
        'discount_amount', 
        'base_price_amount', 
        'current_price_amount', 
        'quantity',
        'quantity_available',
        'user_id', 
        'product_id', 
        'product_flash_deal_id',
        'updated_at', 
        'discount_type'
      ]);
      // Execute findByPk query
      data = await Model.ProductFlashDealDetails.findByPk(req.params.id, criteria);
      if (!_.isEmpty(data)) {
        let finalData = await data.update(initialValues);
        res.json({
          status: 200,
          message: "Successfully updated data.",
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
        message: "Failed updating data."
      });
    }
  },

  /**
   * Delete
   * @route PUT /productFlashDealDetails/delete/:id
   * @param req
   * @param res
   * @returns {never}
   */
  delete: async (req, res) => {
    let data;

    try {
      // Execute findByPk query
      data = await Model.ProductFlashDealDetails.findByPk(req.params.id);
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
   * @route POST /productFlashDealDetails/search/:value
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
      query = `SELECT id, base_price_amount, current_price_amount, product_id, product_flash_deal_id, created_at, updated_at, discount_type FROM product_flash_deal_details WHERE CONCAT(product_id) LIKE ? AND is_deleted = ${NO};`;
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
   * @route GET /productFlashDealDetails
   * @param req
   * @param res
   * @returns {never}
   */
  findAll: async (req, res) => {
    let data, criteria;

    try {
      // Pre-setting variables
      criteria = { where: { is_deleted: NO } };
      // Execute findAll query
      data = await Model.ProductFlashDealDetails.findAll(criteria);
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
   * Find all by product flash deal id
   * @route GET /productFlashDealDetails/findAllbyProductFlashDealId/:productFlashDealId
   * @param req
   * @param res
   * @returns {never}
   */
  findAllbyProductFlashDealId: async (req, res) => {
    const params = req.params;
    let data, criteria;

    try {
      // Pre-setting variables
      criteria = { 
        where: { product_flash_deal_id: params.productFlashDealId, is_deleted: NO }, 
        include: [
          { 
            model: Model.Products, as: 'products', 
            attributes: ['name', 'price_amount'], 
            include: [
              { 
                model: Model.ProductImages, as: "productImages", 
                attributes: ['file_name', 'order', 'type', 'product_id'],
                where: { type: PRODUCT_IMAGES_TYPE_THUMBNAIL, is_deleted: NO },
                required: false 
              },
            ] 
          }
        ] 
      };
      // Execute findAll query
      data = await Model.ProductFlashDealDetails.findAll(criteria);
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
   * @route GET /productFlashDealDetails/:id
   * @param req
   * @param res
   * @returns {never}
   */
  findById: async (req, res) => {
    let data;

    try {
      // Execute findAll query
      data = await Model.ProductFlashDealDetails.findByPk(req.params.id);
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