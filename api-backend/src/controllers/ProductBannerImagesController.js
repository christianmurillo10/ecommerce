const Model = require('../models');
const fs = require('fs');
const path = require('path');

module.exports = {
  /**
   * Create
   * @param req
   * @param res
   * @returns {Promise<void>}
   * @routes POST /productBannerImage/create
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

    try {
      // Validators
      if (_.isEmpty(params.file_name)) return res.json({ status: 200, message: "File Name is required.", result: false });
      if (_.isEmpty(params.order)) return res.json({ status: 200, message: "Order required.", result: false });

      // Pre-setting variables
      criteria = { where: { file_name: params.file_name } };
      initialValues = _.pick(params, ['file_name', 'order', 'user_id', 'created_at']);
      // Execute findAll query
      data = await Model.ProductBannerImages.findAll(criteria);
      if (_.isEmpty(data[0])) {
        let finalData = await Model.ProductBannerImages.create(initialValues);
        // For Upload Images
        if (!_.isUndefined(req.file)) {
          let fileUpload = await uploadImage(params.file_name, req.file);
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
   * @route PUT /productBannerImage/update/:id
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
      // Pre-setting variables
      initialValues = _.pick(params, ['file_name', 'order']);
      // Execute findByPk query
      data = await Model.ProductBannerImages.findByPk(req.params.id);
      if (!_.isEmpty(data)) {
        let finalData = await data.update(initialValues);
        // For Upload Images
        if (!_.isUndefined(req.file)) {
          let fileUpload = await uploadImage(params.file_name, req.file);
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
   * @route PUT /productBannerImage/delete/:id
   * @param req
   * @param res
   * @returns {never}
   */
  delete: async (req, res) => {
    let data;

    try {
      // Execute findByPk query
      data = await Model.ProductBannerImages.findByPk(req.params.id);
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
   * @route POST /productBannerImage/search/:value
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
      query = `SELECT id, file_name, order, created_at, updated_at FROM product_banner_images WHERE CONCAT(file_name) LIKE ? AND is_deleted = 0;`;
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
   * @route GET /productBannerImage
   * @param req
   * @param res
   * @returns {never}
   */
  findAll: async (req, res) => {
    let data, criteria;

    try {
      // Pre-setting variables
      criteria = { where: { is_deleted: 0 }, include: [{ model: Model.Users, as: 'users' }] };
      // Execute findAll query
      data = await Model.ProductBannerImages.findAll(criteria);
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
   * @route GET /productBannerImage/:id
   * @param req
   * @param res
   * @returns {never}
   */
  findById: async (req, res) => {
    let data;

    try {
      // Execute findAll query
      data = await Model.ProductBannerImages.findByPk(req.params.id);
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
   * Find by file_name
   * @route GET /productBannerImage/viewImage/:fileName
   * @param req
   * @param res
   * @returns {never}
   */
  viewImage: (req, res) => {
    res.sendFile(path.join(__dirname, "../../images/productBanners/" + req.params.fileName));
  },
};

/**
 * Other Functions
 */
const uploadImage = (name, file) => {
  try {
    fs.writeFile('images/productBanners/' + name, file.buffer, function (err) {
      if (err) throw err;
    })

    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}