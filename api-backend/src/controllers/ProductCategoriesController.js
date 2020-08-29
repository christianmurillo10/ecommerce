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
   * @routes POST /productCategories/create
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

    // icon
    if (!_.isUndefined(req.files['icon-image'])) {
      let iconExtension = path.extname(params.icon_file_name);
      let iconFileName = `icon-${params.name}-${date}${iconExtension}`;
      params.icon_file_name = iconFileName;
    } else {
      params.icon_file_name = null;
    }

    // banner
    if (!_.isUndefined(req.files['banner-image'])) {
      let bannerExtension = path.extname(params.banner_file_name);
      let bannerFileName = `banner-${params.name}-${date}${bannerExtension}`;
      params.banner_file_name = bannerFileName;
    } else {
      params.banner_file_name = null;
    }

    try {
      // Validators
      if (_.isEmpty(params.name)) return res.json({ status: 200, message: "Name is required.", result: false });

      // Pre-setting variables
      criteria = { where: { name: params.name, is_deleted: NO } };
      initialValues = _.pick(params, ['name', 'description', 'icon_file_name', 'banner_file_name', 'created_at']);
      // Execute findAll query
      data = await Model.ProductCategories.findAll(criteria);
      if (_.isEmpty(data[0])) {
        let finalData = await Model.ProductCategories.create(initialValues);
        // For Upload Images
        if (!_.isUndefined(req.files)) {
          let fileUpload = await uploadImage(params, req.files);
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
   * @route PUT /productCategories/update/:id
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
      data = await Model.ProductCategories.findByPk(req.params.id);
      // Override variables
      let date = moment(params.created_at).format('YYYY-MM-DD');
      // icon
      if (!_.isUndefined(req.files['icon-image'])) {
        let iconExtension = path.extname(params.icon_file_name);
        let iconFileName = `icon-${params.name}-${date}${iconExtension}`;
        params.icon_file_name = iconFileName;
      } else {
        params.icon_file_name = data.icon_file_name;
      }
      // banner
      if (!_.isUndefined(req.files['banner-image'])) {
        let bannerExtension = path.extname(params.banner_file_name);
        let bannerFileName = `banner-${params.name}-${date}${bannerExtension}`;
        params.banner_file_name = bannerFileName;
      } else {
        params.banner_file_name = data.banner_file_name;
      }

      // Pre-setting variables
      initialValues = _.pick(params, ['name', 'description', 'icon_file_name', 'banner_file_name', 'is_featured']);

      if (!_.isEmpty(data)) {
        let finalData = await data.update(initialValues);
        // For Upload Images
        if (!_.isUndefined(req.files)) {
          let fileUpload = await uploadImage(params, req.files);
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
   * Update is featured
   * @route PUT /productCategories/update/featured/:id
   * @param req
   * @param res
   * @returns {never}
   */
  updateIsFeatured: async (req, res) => {
    const params = req.body;
    let initialValues, data;

    if (_.isUndefined(params))
      return res.badRequest({ err: "Invalid Parameter: [params]" });
    if (_.isEmpty(params))
      return res.badRequest({ err: "Empty Parameter: [params]" });

    try {
      // Execute findByPk query
      data = await Model.ProductCategories.findByPk(req.params.id);
      // Pre-setting variables
      initialValues = _.pick(params, ['is_featured']);

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
   * @route PUT /productCategories/delete/:id
   * @param req
   * @param res
   * @returns {never}
   */
  delete: async (req, res) => {
    let data;

    try {
      // Execute findByPk query
      data = await Model.ProductCategories.findByPk(req.params.id);
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
   * @route POST /productCategories/search/:value
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
      query = `SELECT id, name, description, icon_file_name, banner_file_name, created_at, updated_at FROM product_categories WHERE CONCAT(name) LIKE ? AND is_deleted = ${NO};`;
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
   * @route GET /productCategories
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
      data = await Model.ProductCategories.findAll(criteria);
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
   * Find all with sub categories
   * @route GET /productCategories/findAllWithSubCategories
   * @param req
   * @param res
   * @returns {never}
   */
  findAllWithSubCategories: async (req, res) => {
    let data, criteria;

    try {
      // Pre-setting variables
      criteria = {
        attributes: ['id', 'name', 'description'],
        where: { is_deleted: NO },
        include: [
          { 
            model: Model.ProductSubCategories, 
            as: "productSubCategories", 
            attributes: ['id', 'name', 'description'],
            include: [
              { model: Model.ProductSubSubCategories, as: "productSubSubCategories", attributes: ['id', 'name', 'description'] }
            ]
          },
        ]
      };
      // Execute findAll query
      data = await Model.ProductCategories.findAll(criteria);
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
   * @route GET /productCategories/:id
   * @param req
   * @param res
   * @returns {never}
   */
  findById: async (req, res) => {
    let data;

    try {
      // Execute findAll query
      data = await Model.ProductCategories.findByPk(req.params.id);
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
   * @route GET /productCategories/count/all
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
      count = await Model.ProductCategories.count(criteria);
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
   * @route GET /productCategories/viewImage/:fileName
   * @param req
   * @param res
   * @returns {never}
   */
  viewImage: (req, res) => {
    res.sendFile(path.join(__dirname, "../../images/productCategories/" + req.params.fileName));
  },
};

/**
 * Other Functions
 */
const uploadImage = (data, files) => {
  try {
    if (!_.isUndefined(files['icon-image'])) {
      fs.writeFile('images/productCategories/' + data.icon_file_name, files['icon-image'][0].buffer, function (err) {
        if (err) throw err;
      })
    }

    if (!_.isUndefined(files['banner-image'])) {
      fs.writeFile('images/productCategories/' + data.banner_file_name, files['banner-image'][0].buffer, function (err) {
        if (err) throw err;
      })
    }

    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}