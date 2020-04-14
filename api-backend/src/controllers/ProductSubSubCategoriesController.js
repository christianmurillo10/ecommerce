const Model = require('../models');

module.exports = {
  /**
   * Create
   * @param req
   * @param res
   * @returns {Promise<void>}
   * @routes POST /productSubSubCategories/create
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
    params.product_category_id = params.product_category_id.toLocaleString();
    params.product_sub_category_id = params.product_sub_category_id.toLocaleString();

    try {
      // Validators
      if (_.isEmpty(params.name)) return res.json({ status: 200, message: "Name is required.", result: false });
      if (_.isEmpty(params.description)) return res.json({ status: 200, message: "Description is required.", result: false });
      if (_.isEmpty(params.product_category_id)) return res.json({ status: 200, message: "Product Category is required.", result: false });
      if (_.isEmpty(params.product_sub_category_id)) return res.json({ status: 200, message: "Product Sub Category is required.", result: false });

      // Pre-setting variables
      criteria = {
        where: {
          name: params.name, product_category_id: params.product_category_id, product_sub_category_id: params.product_sub_category_id
        },
        include: [{ model: Model.ProductCategories, as: 'productCategories' }, { model: Model.ProductSubCategories, as: 'productSubCategories' }]
      };
      initialValues = _.pick(params, [
        'name',
        'description',
        'product_category_id',
        'product_sub_category_id',
        'created_at'
      ]);
      // Execute findAll query
      data = await Model.ProductSubSubCategories.findAll(criteria);
      if (_.isEmpty(data[0])) {
        await Model.ProductSubSubCategories.create(initialValues)
          .then(() => Model.ProductSubSubCategories.findOrCreate(criteria))
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
   * Update
   * @route PUT /productSubSubCategories/update/:id
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
      criteria = { where: { is_deleted: 0 }, include: [{ model: Model.ProductCategories, as: 'productCategories' }, { model: Model.ProductSubCategories, as: 'productSubCategories' }] };
      initialValues = _.pick(params, [
        'name',
        'description',
        'product_category_id',
        'product_sub_category_id'
      ]);
      // Execute findByPk query
      data = await Model.ProductSubSubCategories.findByPk(req.params.id);
      if (!_.isEmpty(data)) {
        await data.update(initialValues)
          .then(() => Model.ProductSubSubCategories.findByPk(data.id, criteria)
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
   * @route PUT /productSubSubCategories/delete/:id
   * @param req
   * @param res
   * @returns {never}
   */
  delete: async (req, res) => {
    let data;

    try {
      // Execute findByPk query
      data = await Model.ProductSubSubCategories.findByPk(req.params.id);
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
   * @route POST /productSubSubCategories/search/:value
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
                name, 
                description, 
                product_category_id, 
                product_sub_category_id, 
                created_at, 
                updated_at 
              FROM product_sub_sub_categories 
              WHERE CONCAT(name) LIKE ? AND is_deleted = 0;`;
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
   * @route GET /productSubSubCategories
   * @param req
   * @param res
   * @returns {never}
   */
  findAll: async (req, res) => {
    let data, criteria;

    try {
      // Pre-setting variables
      criteria = { where: { is_deleted: 0 }, include: [{ model: Model.ProductCategories, as: 'productCategories' }, { model: Model.ProductSubCategories, as: 'productSubCategories' }] };
      // Execute findAll query
      data = await Model.ProductSubSubCategories.findAll(criteria);
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
   * Find all by product category id
   * @route GET /productSubSubCategories/findAllbyProductCategoryId/:productCategoryId
   * @param req
   * @param res
   * @returns {never}
   */
  findAllbyProductCategoryId: async (req, res) => {
    const params = req.params;
    let data, criteria;

    try {
      // Pre-setting variables
      criteria = { where: { product_category_id: params.productCategoryId, is_deleted: 0 }, include: [{ model: Model.ProductCategories, as: 'productCategories' }, { model: Model.ProductSubCategories, as: 'productSubCategories' }] };
      // Execute findAll query
      data = await Model.ProductSubSubCategories.findAll(criteria);
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
   * Find all by product category id
   * @route GET /productSubSubCategories/findAllbyProductSubCategoryId/:productSubCategoryId
   * @param req
   * @param res
   * @returns {never}
   */
  findAllbyProductSubCategoryId: async (req, res) => {
    const params = req.params;
    let data, criteria;

    try {
      // Pre-setting variables
      criteria = { where: { product_sub_category_id: params.productSubCategoryId, is_deleted: 0 }, include: [{ model: Model.ProductCategories, as: 'productCategories' }, { model: Model.ProductSubCategories, as: 'productSubCategories' }] };
      // Execute findAll query
      data = await Model.ProductSubSubCategories.findAll(criteria);
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
   * Find all by product category id and product sub-category id
   * @route GET /productSubSubCategories/findAllbyProductCategoryIdAndProductSubCategoryId/:productCategoryId/:productSubCategoryId
   * @param req
   * @param res
   * @returns {never}
   */
  findAllbyProductCategoryIdAndProductSubCategoryId: async (req, res) => {
    const params = req.params;
    let data, criteria;

    try {
      // Pre-setting variables
      criteria = { where: { product_category_id: params.productCategoryId, product_sub_category_id: params.productSubCategoryId, is_deleted: 0 }, include: [{ model: Model.ProductCategories, as: 'productCategories' }, { model: Model.ProductSubCategories, as: 'productSubCategories' }] };
      // Execute findAll query
      data = await Model.ProductSubSubCategories.findAll(criteria);
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
   * @route GET /productSubSubCategories/:id
   * @param req
   * @param res
   * @returns {never}
   */
  findById: async (req, res) => {
    let data, criteria;

    try {
      // Pre-setting variables
      criteria = { where: { is_deleted: 0 }, include: [{ model: Model.ProductCategories, as: 'productCategories' }, { model: Model.ProductSubCategories, as: 'productSubCategories' }] };
      // Execute findAll query
      data = await Model.ProductSubSubCategories.findByPk(req.params.id, criteria);
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
   * @route GET /productSubSubCategories/count/all
   * @param req
   * @param res
   * @returns {never}
   */
  countAll: async (req, res) => {
    let count, criteria;

    try {
      // Pre-setting variables
      criteria = { where: { is_deleted: 0 } };
      // Execute findAll query
      count = await Model.ProductSubSubCategories.count(criteria);
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
};