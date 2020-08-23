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
   * @routes POST /productStores/create
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
    let extension = path.extname(params.file_name);
    let fileName = `${params.name}-${date}${extension}`;
    params.file_name = fileName;

    try {
      // Validators
      if (_.isEmpty(params.name)) return res.json({ status: 200, message: "Name required.", result: false });
      if (_.isEmpty(params.file_name)) return res.json({ status: 200, message: "File Name is required.", result: false });

      // Pre-setting variables
      criteria = { where: { name: params.name, is_deleted: NO } };
      initialValues = _.pick(params, ['name', 'description', 'file_name', 'created_at']);
      // Execute findAll query
      data = await Model.ProductStores.findAll(criteria);
      if (_.isEmpty(data[0])) {
        let finalData = await Model.ProductStores.create(initialValues);
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
   * @route PUT /productStores/update/:id
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
      data = await Model.ProductStores.findByPk(req.params.id);
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
   * @route PUT /productStores/delete/:id
   * @param req
   * @param res
   * @returns {never}
   */
  delete: async (req, res) => {
    let data;

    try {
      // Execute findByPk query
      data = await Model.ProductStores.findByPk(req.params.id);
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
   * @route POST /productStores/search/:value
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
      query = `SELECT id, name, description, file_name, created_at, updated_at FROM product_stores WHERE CONCAT(name) LIKE ? AND is_active = ${YES} AND is_deleted = ${NO};`;
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
   * @route GET /productStores
   * @param req
   * @param res
   * @returns {never}
   */
  findAll: async (req, res) => {
    let data, criteria;

    try {
      // Pre-setting variables
      criteria = { where: { is_active: YES, is_deleted: NO } };
      // Execute findAll query
      data = await Model.ProductStores.findAll(criteria);
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
   * @route GET /productStores/:id
   * @param req
   * @param res
   * @returns {never}
   */
  findById: async (req, res) => {
    let data;

    try {
      // Execute findAll query
      data = await Model.ProductStores.findByPk(req.params.id);
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
   * @route GET /productStores/count/all
   * @param req
   * @param res
   * @returns {never}
   */
  countAll: async (req, res) => {
    let count, criteria;

    try {
      // Pre-setting variables
      criteria = { where: { is_active: YES, is_deleted: NO } };
      // Execute findAll query
      count = await Model.ProductStores.count(criteria);
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
   * @route GET /productStores/viewImage/:fileName
   * @param req
   * @param res
   * @returns {never}
   */
  viewImage: (req, res) => {
    res.sendFile(path.join(__dirname, "../../images/productStores/" + req.params.fileName));
  },
};

/**
 * Other Functions
 */
const uploadImage = (name, file) => {
  try {
    fs.writeFile('images/productStores/' + name, file.buffer, function (err) {
      if (err) throw err;
    })

    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}