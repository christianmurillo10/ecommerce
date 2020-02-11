const Model = require("../models");
const InventoriesController = require("./InventoriesController");

module.exports = {
  /**
   * Create
   * @param req
   * @param res
   * @returns {Promise<void>}
   * @routes POST /product/create
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
    params.created_at = moment()
      .utc(8)
      .format("YYYY-MM-DD HH:mm:ss");
    params.user_id = req.user.id.toLocaleString();
    params.price = params.price.toLocaleString();
    params.product_category_id = params.product_category_id.toLocaleString();
    params.product_sub_category_id = params.product_sub_category_id.toLocaleString();

    try {
      // Validators
      if (_.isEmpty(params.name))
        return res.json({
          status: 200,
          message: "Name is required.",
          result: false
        });
      if (_.isEmpty(params.price))
        return res.json({
          status: 200,
          message: "Price is required.",
          result: false
        });
      if (_.isEmpty(params.product_category_id))
        return res.json({
          status: 200,
          message: "Product Category is required.",
          result: false
        });
      if (_.isEmpty(params.product_sub_category_id))
        return res.json({
          status: 200,
          message: "Product Sub-Category is required.",
          result: false
        });

      // Pre-setting variables
      criteria = {
        where: { name: params.name },
        include: [
          { model: Model.ProductCategories, as: "productCategories", attributes: ['name', 'description'] },
          { model: Model.ProductSubCategories, as: "productSubCategories", attributes: ['name', 'description'] },
          { model: Model.Users, as: "users", attributes: ['email', 'username'] }
        ]
      };
      initialValues = _.pick(params, [
        "name",
        "description",
        "price",
        "product_category_id",
        "product_sub_category_id",
        "user_id",
        "created_at"
      ]);
      // Execute findAll query
      data = await Model.Products.findAll(criteria);
      if (_.isEmpty(data[0])) {
        await Model.Products.create(initialValues)
          .then(() => Model.Products.findOrCreate(criteria))
          .then(async ([finalData, created]) => {
            let plainData = finalData.get({ plain: true });
            // Adding data from inventories
            let obj = {
              stock_in: params.stock,
              user_id: params.user_id,
              product_id: plainData.id
            };
            let inventories = await InventoriesController.addStockByProductId(
              obj
            );

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
   * @route PUT /product/update/:id
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
      initialValues = _.pick(params, [
        "name",
        "description",
        "price",
        "product_category_id",
        "product_sub_category_id"
      ]);
      // Execute findByPk query
      data = await Model.Products.findByPk(req.params.id);
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
   * @route PUT /product/delete/:id
   * @param req
   * @param res
   * @returns {never}
   */
  delete: async (req, res) => {
    let data;

    try {
      // Execute findByPk query
      data = await Model.Products.findByPk(req.params.id);
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
   * @route POST /product/search/:value
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
      query = `SELECT id, name, description, price, created_at, updated_at FROM products WHERE CONCAT(name, description, price) LIKE ? AND is_deleted = 0;`;
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
   * @route GET /product
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
          { model: Model.ProductCategories, as: "productCategories", attributes: ['name', 'description'] },
          { model: Model.ProductSubCategories, as: "productSubCategories", attributes: ['name', 'description'] },
          { model: Model.Users, as: "users", attributes: ['email', 'username'] }
        ]
      };
      // Execute findAll query
      data = await Model.Products.findAll(criteria);
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
   * Find all with limit, offset and file name
   * @route GET /product/findAllWithLimitOffsetAndFileName/:limit/:offset
   * @param req
   * @param res
   * @returns {never}
   */
  findAllWithLimitOffsetAndFileName: async (req, res) => {
    let params = req.params;
    let data, criteria;

    try {
      // Pre-setting variables
      let limit = parseInt(params.limit);
      let offset = parseInt(params.offset);
      criteria = {
        attributes: ['id', 'name', 'description', 'price', 'product_category_id', 'product_sub_category_id'],
        where: { is_deleted: 0 },
        limit,
        offset,
        include: [
          { model: Model.ProductCategories, as: "productCategories", attributes: ['name', 'description'] },
          { model: Model.ProductSubCategories, as: "productSubCategories", attributes: ['name', 'description'] },
          { model: Model.ProductImages, as: "productImages", attributes: ['file_name', 'color', 'order', 'product_id'], required: false }
        ]
      };

      // Execute findAll query
      data = await Model.Products.findAll(criteria);
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
   * Find all by product category id with limit, offset and file name
   * @route GET /product/findAllByProductCategoryIdWithLimitOffsetAndFileName/:productCategoryId/:limit/:offset
   * @param req
   * @param res
   * @returns {never}
   */
  findAllByProductCategoryIdWithLimitOffsetAndFileName: async (req, res) => {
    let params = req.params;
    let data, criteria;

    try {
      // Pre-setting variables
      let limit = parseInt(params.limit);
      let offset = parseInt(params.offset);
      criteria = {
        attributes: ['id', 'name', 'description', 'price', 'product_category_id', 'product_sub_category_id'],
        where: { product_category_id: params.productCategoryId, is_deleted: 0 },
        limit,
        offset,
        include: [
          { model: Model.ProductCategories, as: "productCategories", attributes: ['name', 'description'] },
          { model: Model.ProductSubCategories, as: "productSubCategories", attributes: ['name', 'description'] },
          { model: Model.ProductImages, as: "productImages", attributes: ['file_name', 'color', 'order', 'product_id'], required: false }
        ]
      };

      // Execute findAll query
      data = await Model.Products.findAll(criteria);
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
   * Find all by product sub category id with limit, offset and file name
   * @route GET /product/findAllbyProductSubCategoryIdWithLimitOffsetAndFileName/:productSubCategoryId/:limit/:offset
   * @param req
   * @param res
   * @returns {never}
   */
  findAllbyProductSubCategoryIdWithLimitOffsetAndFileName: async (req, res) => {
    let params = req.params;
    let data, criteria, countCriteria;

    try {
      // Pre-setting variables
      let limit = parseInt(params.limit);
      let offset = parseInt(params.offset);
      criteria = {
        attributes: ['id', 'name', 'description', 'price', 'product_category_id', 'product_sub_category_id'],
        where: { product_sub_category_id: params.productSubCategoryId, is_deleted: 0 },
        limit,
        offset,
        include: [
          { model: Model.ProductCategories, as: "productCategories", attributes: ['name', 'description'] },
          { model: Model.ProductSubCategories, as: "productSubCategories", attributes: ['name', 'description'] },
          { model: Model.ProductImages, as: "productImages", attributes: ['file_name', 'color', 'order', 'product_id'], required: false }
        ]
      };
      countCriteria = { where: { product_sub_category_id: params.productSubCategoryId, is_deleted: 0 } };

      // Execute findAll query
      data = await Model.Products.findAll(criteria);
      if (!_.isEmpty(data[0])) {
        count = await Model.Products.count(countCriteria);
        let obj = {
          data: data,
          count: count
        }
        
        res.json({
          status: 200,
          message: "Successfully find all data.",
          result: obj
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
   * @route GET /product/:id
   * @param req
   * @param res
   * @returns {never}
   */
  findById: async (req, res) => {
    let data;

    try {
      // Pre-setting variables
      criteria = {
        where: { is_deleted: 0 },
        include: [
          { model: Model.ProductCategories, as: "productCategories", attributes: ['name', 'description'] },
          { model: Model.ProductSubCategories, as: "productSubCategories", attributes: ['name', 'description'] },
          { model: Model.ProductImages, as: "productImages", attributes: ['file_name', 'color', 'order', 'product_id'], required: false },
          { model: Model.Users, as: "users", attributes: ['email', 'username'] }
        ]
      };
      // Execute findAll query
      data = await Model.Products.findByPk(req.params.id, criteria);
      if (!_.isEmpty(data)) {
        res.json({
          status: 200,
          message: "Successfully find data.",
          result: _.omit(data.get({ plain: true }), ["is_deleted"])
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
   * Find all by category id
   * @route GET /product/findAllbyProductCategoryId/:productCategoryId
   * @param req
   * @param res
   * @returns {never}
   */
  findAllbyProductCategoryId: async (req, res) => {
    const params = req.params;
    let data, criteria;

    try {
      // // Pre-setting variables
      // criteria = {
      //   where: { product_category_id: params.productCategoryId, is_deleted: 0 },
      //   include: [
      //     { model: Model.ProductCategories, as: "productCategories" },
      //     { model: Model.ProductSubCategories, as: "productSubCategories" },
      //     { model: Model.Users, as: "users" }
      //   ]
      // };
      // // Execute findAll query
      // data = await Model.Products.findAll(criteria);
      // if (!_.isEmpty(data[0])) {
      //   res.json({
      //     status: 200,
      //     message: "Successfully find all data.",
      //     result: data
      //   });
      // } else {
      //   res.json({
      //     status: 200,
      //     message: "No Data Found.",
      //     result: false
      //   });
      // }

      // Pre-setting variables
      query = `SELECT 
                products.*,
                productImages.file_name,
                productImages.color
              FROM products AS products
                LEFT OUTER JOIN product_images AS productImages ON productImages.product_id = products.id
                WHERE products.product_category_id = ? AND productImages.is_deleted = 0 GROUP BY productImages.product_id ASC;`;
      // Execute native query
      data = await Model.sequelize.query(query, {
        replacements: [params.productCategoryId],
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
          result: []
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
   * Find all by category id
   * @route GET /product/findAllbyProductSubCategoryId/:productSubCategoryId
   * @param req
   * @param res
   * @returns {never}
   */
  findAllbyProductSubCategoryId: async (req, res) => {
    const params = req.params;
    let data, criteria;

    try {
      // // Pre-setting variables
      // criteria = {
      //   where: {
      //     product_sub_category_id: params.productSubCategoryId,
      //     is_deleted: 0
      //   },
      //   include: [
      //     { model: Model.ProductCategories, as: "productCategories" },
      //     { model: Model.ProductSubCategories, as: "productSubCategories" },
      //     { model: Model.Users, as: "users" }
      //   ]
      // };
      // // Execute findAll query
      // data = await Model.Products.findAll(criteria);
      // if (!_.isEmpty(data[0])) {
      //   res.json({
      //     status: 200,
      //     message: "Successfully find all data.",
      //     result: data
      //   });
      // } else {
      //   res.json({
      //     status: 200,
      //     message: "No Data Found.",
      //     result: false
      //   });
      // }

      // Pre-setting variables
      query = `SELECT 
                products.*,
                productImages.file_name,
                productImages.color
              FROM products AS products
                LEFT OUTER JOIN product_images AS productImages ON productImages.product_id = products.id
                WHERE products.product_sub_category_id = ? AND productImages.is_deleted = 0 GROUP BY productImages.product_id ASC;`;
      // Execute native query
      data = await Model.sequelize.query(query, {
        replacements: [params.productSubCategoryId],
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
          result: []
        });
      }
    } catch (err) {
      res.json({
        status: 401,
        err: err,
        message: "Failed to find all data."
      });
    }
  }
};
