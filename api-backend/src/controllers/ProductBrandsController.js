const Model = require('../models');
const fs = require('fs');
const path = require('path');
const { NO, YES } = require('../helpers/constant-helper');

module.exports = {
  /**
   * Create
   * @param req
   * @param res
   * @returns {Promise<void>}
   * @routes POST /productBrands/create
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

    let date = moment(params.created_at).format('YYYY-MM-DD');
    
    if (!_.isUndefined(req.file)) {
      let extension = path.extname(params.file_name);
      let fileName = `${params.name}-${date}${extension}`;
      params.file_name = fileName;
    } else {
      params.file_name = null;
    }

    try {
      // Validators
      if (_.isEmpty(params.name)) return res.json({ status: 200, message: "Name required.", result: false });

      // Pre-setting variables
      criteria = { where: { name: params.name, is_deleted: NO } };
      initialValues = _.pick(params, ['name', 'description', 'file_name', 'created_at']);
      // Execute findAll query
      data = await Model.ProductBrands.findAll(criteria);
      if (_.isEmpty(data[0])) {
        let finalData = await Model.ProductBrands.create(initialValues);
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
   * @route PUT /productBrands/update/:id
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
      data = await Model.ProductBrands.findByPk(req.params.id);
      // Override variables
      if (!_.isUndefined(req.file)) {
        let date = moment(params.created_at).format('YYYY-MM-DD');
        let extension = path.extname(params.file_name);
        let fileName = `${params.name}-${date}${extension}`;
        params.file_name = fileName;
      } else {
        params.file_name = data.file_name;
      }
      // Pre-setting variables
      initialValues = _.pick(params, ['name', 'description', 'file_name']);

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
   * @route PUT /productBrands/delete/:id
   * @param req
   * @param res
   * @returns {never}
   */
  delete: async (req, res) => {
    let data;

    try {
      // Execute findByPk query
      data = await Model.ProductBrands.findByPk(req.params.id);
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
   * @route POST /productBrands/search/:value
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
      query = `SELECT id, name, description, file_name, created_at, updated_at FROM product_brands WHERE CONCAT(name) LIKE ? AND is_deleted = ${NO};`;
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
   * @route GET /productBrands
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
      data = await Model.ProductBrands.findAll(criteria);
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
   * @route GET /productBrands/:id
   * @param req
   * @param res
   * @returns {never}
   */
  findById: async (req, res) => {
    let data;

    try {
      // Execute findAll query
      data = await Model.ProductBrands.findByPk(req.params.id);
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
   * Count all
   * @route GET /productBrands/count/all
   * @param req
   * @param res
   * @returns {never}
   */
  countAll: async (req, res) => {
    let count, criteria;

    try {
      // Pre-setting variables
      criteria = { where: { is_deleted: NO } };
      // Execute findAll query
      count = await Model.ProductBrands.count(criteria);
      res.json({
        status: 200,
        message: "Successfully count all data.",
        result: count
      });
    } catch (err) {
      res.json({
        status: 401,
        err: err,
        message: "Failed to find all data."
      });
    }
  },

  /**
   * Find by file_name
   * @route GET /productBrands/viewImage/:fileName
   * @param req
   * @param res
   * @returns {never}
   */
  viewImage: (req, res) => {
    res.sendFile(path.join(__dirname, "../../images/productBrands/" + req.params.fileName));
  },
};

/**
 * Other Functions
 */
const uploadImage = (name, file) => {
  try {
    fs.writeFile('images/productBrands/' + name, file.buffer, function (err) {
      if (err) throw err;
    })

    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}