const Model = require("../models");
const InventoriesController = require("./InventoriesController");

module.exports = {
  /**
   * Create
   * @param req
   * @param res
   * @returns {Promise<void>}
   * @routes POST /products/create
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
    params.created_at = moment().utc(8).format("YYYY-MM-DD HH:mm:ss");
    params.tags = params.tags.length === 0 ? null : params.tags.toString();
    params.stock = params.stock === null ? 0 : params.stock.toLocaleString();
    params.price_amount = params.price_amount.toLocaleString();
    params.vat_value = params.vat_value === null ? null : params.vat_value.toLocaleString();
    params.discount_value = params.discount_value === null ? null : params.discount_value.toLocaleString();
    params.user_id = req.user.id.toLocaleString();
    params.product_brand_id = params.product_brand_id.toLocaleString();
    params.product_category_id = params.product_category_id.toLocaleString();
    params.product_sub_category_id = params.product_sub_category_id.toLocaleString();
    params.product_sub_sub_category_id = params.product_sub_sub_category_id.toLocaleString();
    params.vat_type = params.vat_type === null ? null : params.vat_type.toLocaleString();
    params.discount_type = params.discount_type === null ? null : params.discount_type.toLocaleString();

    try {
      // Validators
      if (_.isEmpty(params.name)) return res.json({ status: 200, message: "Name is required.", result: false });
      if (_.isEmpty(params.unit)) return res.json({ status: 200, message: "Unit is required.", result: false });
      if (_.isEmpty(params.stock)) return res.json({ status: 200, message: "Stock is required.", result: false });
      if (_.isEmpty(params.price_amount)) return res.json({ status: 200, message: "Price Amount is required.", result: false });
      if (_.isEmpty(params.product_brand_id)) return res.json({ status: 200, message: "Product Brand is required.", result: false });
      if (_.isEmpty(params.product_category_id)) return res.json({ status: 200, message: "Product Category is required.", result: false });
      if (_.isEmpty(params.product_sub_category_id)) return res.json({ status: 200, message: "Product Sub-Category is required.", result: false });
      if (_.isEmpty(params.product_sub_sub_category_id)) return res.json({ status: 200, message: "Product Sub Sub-Category is required.", result: false });

      // Pre-setting variables
      criteria = {
        where: { name: params.name },
        include: [
          { model: Model.ProductBrands, as: "productBrands", attributes: ['name', 'description'] },
          { model: Model.ProductCategories, as: "productCategories", attributes: ['name', 'description'] },
          { model: Model.ProductSubCategories, as: "productSubCategories", attributes: ['name', 'description'] },
          { model: Model.ProductSubSubCategories, as: "productSubSubCategories", attributes: ['name', 'description'] },
          { model: Model.Users, as: "users", attributes: ['email', 'username'] }
        ]
      };
      initialValues = _.pick(params, [
        "name",
        "description",
        "unit",
        "stock",
        "tags",
        "price_amount",
        "vat_value",
        "discount_value",
        "user_id",
        "product_brand_id",
        "product_category_id",
        "product_sub_category_id",
        "product_sub_sub_category_id",
        "created_at",
        "vat_type",
        "discount_type",
        "is_today_deal",
        "is_featured",
        "is_published"
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
            let inventories = await InventoriesController.addStockByProductId(obj);

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
   * @route PUT /products/update/:id
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
    params.tags = params.tags.length === 0 ? null : params.tags.toString();

    try {
      // Pre-setting variables
      initialValues = _.pick(params, [
        "name",
        "description",
        "unit",
        "tags",
        "price_amount",
        "vat_value",
        "discount_value",
        "user_id",
        "product_brand_id",
        "product_category_id",
        "product_sub_category_id",
        "product_sub_sub_category_id",
        "vat_type",
        "discount_type",
        "is_today_deal",
        "is_featured",
        "is_published"
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
   * @route PUT /products/delete/:id
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
   * @route GET /products/search/:keyword/:limit/:offset
   * @param req
   * @param res
   * @returns {never}
   */
  search: async (req, res) => {
    const params = req.params;
    let data, criteria, countCriteria;

    if (_.isUndefined(params))
      return res.badRequest({ err: "Invalid Parameter: [params]" });
    if (_.isEmpty(params))
      return res.badRequest({ err: "Empty Parameter: [params]" });

    try {
      // Pre-setting variables
      let limit = parseInt(params.limit);
      let offset = parseInt(params.offset);
      criteria = {
        attributes: [
          'id',
          'name',
          'description',
          'unit',
          'tags',
          'price_amount',
          'vat_value',
          'discount_value',
          'product_brand_id',
          'product_category_id',
          'product_sub_category_id',
          'product_sub_sub_category_id',
          'created_at',
          'vat_type',
          'discount_type',
          'is_today_deal',
          'is_featured',
          'is_published'
        ],
        where: { name: { $like: `%${params.keyword}%` }, is_deleted: 0 },
        limit,
        offset,
        include: [
          { model: Model.ProductBrands, as: "productBrands", attributes: ['name', 'description'] },
          { model: Model.ProductCategories, as: "productCategories", attributes: ['name', 'description'] },
          { model: Model.ProductSubCategories, as: "productSubCategories", attributes: ['name', 'description'] },
          { model: Model.ProductSubSubCategories, as: "productSubSubCategories", attributes: ['name', 'description'] },
          { model: Model.ProductImages, as: "productImages", attributes: ['file_name', 'order', 'product_id'], required: false }
        ]
      };
      countCriteria = { where: { name: { $like: `%${params.keyword}%` }, is_deleted: 0 } };

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
        message: "Failed to search data."
      });
    }
  },

  /**
   * Find all with limit and offset
   * @route GET /products/findAllWithLimitAndOffset/:limit/:offset
   * @param req
   * @param res
   * @returns {never}
   */
  findAllWithLimitAndOffset: async (req, res) => {
    let params = req.params;
    let data, criteria, countCriteria;

    try {
      // Pre-setting variables
      let limit = parseInt(params.limit);
      let offset = parseInt(params.offset);
      criteria = {
        attributes: [
          'id',
          'name',
          'description',
          'unit',
          'tags',
          'price_amount',
          'vat_value',
          'discount_value',
          'product_brand_id',
          'product_category_id',
          'product_sub_category_id',
          'product_sub_sub_category_id',
          'created_at',
          'vat_type',
          'discount_type',
          'is_today_deal',
          'is_featured',
          'is_published'
        ],
        where: { is_deleted: 0 },
        limit,
        offset,
        include: [
          { model: Model.ProductBrands, as: "productBrands", attributes: ['name', 'description'] },
          { model: Model.ProductCategories, as: "productCategories", attributes: ['name', 'description'] },
          { model: Model.ProductSubCategories, as: "productSubCategories", attributes: ['name', 'description'] },
          { model: Model.ProductSubSubCategories, as: "productSubSubCategories", attributes: ['name', 'description'] },
          { model: Model.ProductImages, as: "productImages", attributes: ['file_name', 'order', 'product_id'], required: false }
        ]
      };
      countCriteria = { where: { is_deleted: 0 } };

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
   * Find all
   * @route GET /products
   * @param req
   * @param res
   * @returns {never}
   */
  findAll: async (req, res) => {
    let data, criteria;

    try {
      // Pre-setting variables
      criteria = {
        attributes: [
          'id',
          'name',
          'description',
          'unit',
          'tags',
          'price_amount',
          'vat_value',
          'discount_value',
          'product_brand_id',
          'product_category_id',
          'product_sub_category_id',
          'product_sub_sub_category_id',
          'created_at',
          'vat_type',
          'discount_type',
          'is_today_deal',
          'is_featured',
          'is_published'
        ],
        where: { is_deleted: 0 },
        include: [
          { model: Model.ProductBrands, as: "productBrands", attributes: ['name', 'description'] },
          { model: Model.ProductCategories, as: "productCategories", attributes: ['name', 'description'] },
          { model: Model.ProductSubCategories, as: "productSubCategories", attributes: ['name', 'description'] },
          { model: Model.ProductSubSubCategories, as: "productSubSubCategories", attributes: ['name', 'description'] }
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
   * @route GET /products/findAllWithLimitOffsetAndFileName/:limit/:offset
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
        attributes: [
          'id',
          'name',
          'description',
          'unit',
          'tags',
          'price_amount',
          'vat_value',
          'discount_value',
          'product_brand_id',
          'product_category_id',
          'product_sub_category_id',
          'product_sub_sub_category_id',
          'created_at',
          'vat_type',
          'discount_type',
          'is_today_deal',
          'is_featured',
          'is_published'
        ],
        where: { is_deleted: 0 },
        limit,
        offset,
        include: [
          { model: Model.ProductBrands, as: "productBrands", attributes: ['name', 'description'] },
          { model: Model.ProductCategories, as: "productCategories", attributes: ['name', 'description'] },
          { model: Model.ProductSubCategories, as: "productSubCategories", attributes: ['name', 'description'] },
          { model: Model.ProductSubSubCategories, as: "productSubSubCategories", attributes: ['name', 'description'] },
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
   * @route GET /products/findAllByProductCategoryIdWithLimitOffsetAndFileName/:productCategoryId/:limit/:offset
   * @param req
   * @param res
   * @returns {never}
   */
  findAllByProductCategoryIdWithLimitOffsetAndFileName: async (req, res) => {
    let params = req.params;
    let data, criteria, countCriteria;

    try {
      // Pre-setting variables
      let limit = parseInt(params.limit);
      let offset = parseInt(params.offset);
      criteria = {
        attributes: [
          'id',
          'name',
          'description',
          'unit',
          'tags',
          'price_amount',
          'vat_value',
          'discount_value',
          'product_brand_id',
          'product_category_id',
          'product_sub_category_id',
          'product_sub_sub_category_id',
          'created_at',
          'vat_type',
          'discount_type',
          'is_today_deal',
          'is_featured',
          'is_published'
        ],
        where: { product_category_id: params.productCategoryId, is_deleted: 0 },
        limit,
        offset,
        include: [
          { model: Model.ProductBrands, as: "productBrands", attributes: ['name', 'description'] },
          { model: Model.ProductCategories, as: "productCategories", attributes: ['name', 'description'] },
          { model: Model.ProductSubCategories, as: "productSubCategories", attributes: ['name', 'description'] },
          { model: Model.ProductSubSubCategories, as: "productSubSubCategories", attributes: ['name', 'description'] },
          { model: Model.ProductImages, as: "productImages", attributes: ['file_name', 'color', 'order', 'product_id'], required: false }
        ]
      };
      countCriteria = { where: { product_category_id: params.productCategoryId, is_deleted: 0 } };

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
   * Find all by product sub category id with limit, offset and file name
   * @route GET /products/findAllbyProductSubCategoryIdWithLimitOffsetAndFileName/:productSubCategoryId/:limit/:offset
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
        attributes: [
          'id',
          'name',
          'description',
          'unit',
          'tags',
          'price_amount',
          'vat_value',
          'discount_value',
          'product_brand_id',
          'product_category_id',
          'product_sub_category_id',
          'product_sub_sub_category_id',
          'created_at',
          'vat_type',
          'discount_type',
          'is_today_deal',
          'is_featured',
          'is_published'
        ],
        where: { product_sub_category_id: params.productSubCategoryId, is_deleted: 0 },
        limit,
        offset,
        include: [
          { model: Model.ProductBrands, as: "productBrands", attributes: ['name', 'description'] },
          { model: Model.ProductCategories, as: "productCategories", attributes: ['name', 'description'] },
          { model: Model.ProductSubCategories, as: "productSubCategories", attributes: ['name', 'description'] },
          { model: Model.ProductSubSubCategories, as: "productSubSubCategories", attributes: ['name', 'description'] },
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
   * @route GET /products/:id
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
          { model: Model.ProductBrands, as: "productBrands", attributes: ['name', 'description'] },
          { model: Model.ProductCategories, as: "productCategories", attributes: ['name', 'description'] },
          { model: Model.ProductSubCategories, as: "productSubCategories", attributes: ['name', 'description'] },
          { model: Model.ProductSubSubCategories, as: "productSubSubCategories", attributes: ['name', 'description'] },
          { model: Model.ProductImages, as: "productImages", attributes: ['id', 'file_name', 'order', 'product_id'], required: false },
          { model: Model.Inventories, as: "inventories", attributes: ['stock_available', 'product_id'], required: false },
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
};
