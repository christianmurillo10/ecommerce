const Model = require('../models');
const fs = require('fs');
const path = require('path');

const MAIN_IMAGE = 1;
const THUMBNAIL_IMAGE = 2;
const FEATURED_IMAGE = 3;
const FLASH_DEAL_IMAGE = 4;

module.exports = {
  /**
   * Create
   * @param req
   * @param res
   * @returns {Promise<void>}
   * @routes POST /productImage/create
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
    params.order = params.order.toLocaleString();
    params.user_id = req.user.id.toLocaleString();
    params.product_id = params.product_id.toLocaleString();
    params.type = params.type.toLocaleString();

    let date = moment(params.created_at).format('YYYY-MM-DD');
    let extension = path.extname(params.file_name);
    let fileName = `${params.product_id}-${params.type}-${params.order}-${date}${extension}`;
    params.file_name = fileName;

    try {
      // Validators
      if (_.isEmpty(params.file_name)) return res.json({ status: 200, message: "File Name is required.", result: false });
      if (_.isEmpty(params.order)) return res.json({ status: 200, message: "Order required.", result: false });
      if (_.isEmpty(params.product_id)) return res.json({ status: 200, message: "Product is required.", result: false });
      if (_.isEmpty(params.type)) return res.json({ status: 200, message: "Type required.", result: false });

      // Pre-setting variables
      criteria = { where: { file_name: params.file_name } };
      initialValues = _.pick(params, ['file_name', 'order', 'product_id', 'user_id', 'type', 'created_at']);
      // Execute findAll query
      data = await Model.ProductImages.findAll(criteria);
      if (_.isEmpty(data[0])) {
        let finalData = await Model.ProductImages.create(initialValues);
        // For Upload Images
        if (!_.isUndefined(req.file)) {
          let fileUpload = await uploadImage(params.file_name, params.type, req.file);
        }
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
   * @route PUT /productImage/update/:id
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

    try {
      // Execute findByPk query
      data = await Model.ProductImages.findByPk(req.params.id);
      // Override variables
      if (!_.isUndefined(req.file)) {
        let date = moment(params.created_at).format('YYYY-MM-DD');
        let extension = path.extname(params.file_name);
        let fileName = `${params.product_id}-${params.color}-${params.order}-${date}${extension}`;
        params.file_name = fileName;
      } else {
        params.file_name = data.file_name;
      }
      // Pre-setting variables
      initialValues = _.pick(params, ['file_name', 'order', 'type', 'product_id']);

      if (!_.isEmpty(data)) {
        let finalData = await data.update(initialValues);
        // For Upload Images
        if (!_.isUndefined(req.file)) {
          let fileUpload = await uploadImage(params.file_name, params.type, req.file);
        }
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
   * @route PUT /productImage/delete/:id
   * @param req
   * @param res
   * @returns {never}
   */
  delete: async (req, res) => {
    let data;

    try {
      // Execute findByPk query
      data = await Model.ProductImages.findByPk(req.params.id);
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
   * @route POST /productImage/search/:value
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
      query = `SELECT id, file_name, order, type, created_at, updated_at FROM product_images WHERE CONCAT(file_name) LIKE ? AND is_deleted = 0;`;
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
   * @route GET /productImage
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
          { model: Model.Products, as: "products", attributes: ['name', 'description'] },
          { model: Model.Users, as: "users", attributes: ['email', 'username'] }
        ]
      };
      // Execute findAll query
      data = await Model.ProductImages.findAll(criteria);
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
   * @route GET /productImage/findAllbyProductId/:productId
   * @param req
   * @param res
   * @returns {never}
   */
  findAllbyProductId: async (req, res) => {
    const params = req.params;
    let data, criteria;

    try {
      // Pre-setting variables
      criteria = { 
        where: { product_id: params.productId, is_deleted: 0 }, 
        include: [
          { model: Model.Products, as: "products", attributes: ['name', 'description'] },
          { model: Model.Users, as: "users", attributes: ['email', 'username'] }
        ]
      };
      // Execute findAll query
      data = await Model.ProductImages.findAll(criteria);
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
   * Find all by product id and type
   * @route GET /productImage/findAllbyProductIdAndType/:productId/:type
   * @param req
   * @param res
   * @returns {never}
   */
  findAllbyProductIdAndType: async (req, res) => {
    const params = req.params;
    let data, criteria;

    try {
      // Pre-setting variables
      criteria = { 
        where: { product_id: params.productId, type: params.type, is_deleted: 0 }, 
        include: [
          { model: Model.Products, as: "products", attributes: ['name', 'description'] },
          { model: Model.Users, as: "users", attributes: ['email', 'username'] }
        ]
      };
      // Execute findAll query
      data = await Model.ProductImages.findAll(criteria);
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
   * @route GET /productImage/:id
   * @param req
   * @param res
   * @returns {never}
   */
  findById: async (req, res) => {
    let data;

    try {
      // Execute findAll query
      data = await Model.ProductImages.findByPk(req.params.id);
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
   * Find by file_name and type
   * @route GET /productImage/viewImage/:fileName/:type
   * @param req
   * @param res
   * @returns {never}
   */
  viewImage: (req, res) => {
    let filePath;
    switch(parseInt(req.params.type)) {
      case MAIN_IMAGE:
        filePath = "../../images/products/main/";
        break;
      case THUMBNAIL_IMAGE:
        filePath = "../../images/products/thumbnail/";
        break;
      case FEATURED_IMAGE:
        filePath = "../../images/products/featured/";
        break;
      case FLASH_DEAL_IMAGE:
        filePath = "../../images/products/flashDeal/";
        break;
    }
    res.sendFile(path.join(__dirname, filePath + req.params.fileName));
  },
};

/**
 * Other Functions
 */
const uploadImage = (name, type, file) => {
  try {
    let filePath;
    switch(parseInt(type)) {
      case MAIN_IMAGE:
        filePath = "images/products/main/";
        break;
      case THUMBNAIL_IMAGE:
        filePath = "images/products/thumbnail/";
        break;
      case FEATURED_IMAGE:
        filePath = "images/products/featured/";
        break;
      case FLASH_DEAL_IMAGE:
        filePath = "images/products/flashDeal/";
        break;
    }
    fs.writeFile(filePath + name, file.buffer, function (err) {
      if (err) throw err;
    })

    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}