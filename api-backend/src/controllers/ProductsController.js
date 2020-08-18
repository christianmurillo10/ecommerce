const Model = require("../models");
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
   * Update status
   * @route PUT /products/updateStatus/:id
   * @param req
   * @param res
   * @returns {never}
   */
  updateStatus: async (req, res) => {
    const params = req.body;
    let initialValues, data;

    if (_.isUndefined(params))
      return res.badRequest({ err: "Invalid Parameter: [params]" });
    if (_.isEmpty(params))
      return res.badRequest({ err: "Empty Parameter: [params]" });

    try {
      // Pre-setting variables
      initialValues = _.pick(params, [
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
        where: { name: { $like: `${params.keyword}%` }, is_deleted: NO },
        order: [
          ['id', 'ASC'],
        ],
        limit,
        offset,
        include: [
          { 
            model: Model.ProductImages, as: "productImages", 
            attributes: ['file_name', 'order', 'type', 'product_id'],
            where: { type: PRODUCT_IMAGES_TYPE_THUMBNAIL, is_deleted: NO },
            required: false 
          },
          { 
            model: Model.Inventories, as: "inventories", 
            attributes: ['stock_available', 'price_amount', 'product_id'], 
            where: { is_deleted: NO },
            required: false 
          },
        ]
      };
      countCriteria = { where: { name: { $like: `${params.keyword}%` }, is_deleted: NO } };

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
   * Search with related categories
   * @route GET /products/searchWithRelatedCategories/:keyword/:limit/:offset
   * @param req
   * @param res
   * @returns {never}
   */
  searchWithRelatedCategories: async (req, res) => {
    const params = req.params;
    let data, criteria, countCriteria, relatedCategoriesCriteria;

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
        where: { name: { $like: `${params.keyword}%` }, is_deleted: NO },
        order: [
          ['id', 'ASC'],
        ],
        limit,
        offset,
        include: [
          { 
            model: Model.ProductImages, as: "productImages", 
            attributes: ['file_name', 'order', 'type', 'product_id'],
            where: { type: PRODUCT_IMAGES_TYPE_THUMBNAIL, is_deleted: NO },
            required: false 
          },
          { 
            model: Model.Inventories, as: "inventories", 
            attributes: ['stock_available', 'price_amount', 'product_id'], 
            where: { is_deleted: NO },
            required: false 
          },
        ]
      };
      countCriteria = { where: { name: { $like: `${params.keyword}%` }, is_deleted: NO } };
      relatedCategoriesCriteria = {
        attributes: ['product_sub_category_id'],
        where: { name: { $like: `${params.keyword}%` }, is_deleted: NO },
        group: ['product_sub_category_id'],
        include: [
          { model: Model.ProductSubCategories, as: "productSubCategories", attributes: ['name', 'description'] }
        ]
      };

      // Execute findAll query
      data = await Model.Products.findAll(criteria);
      if (!_.isEmpty(data[0])) {
        count = await Model.Products.count(countCriteria);
        relatedCategoriesData = await Model.Products.findAll(relatedCategoriesCriteria);
        let obj = {
          data: data,
          count: count,
          relatedCategoriesData: relatedCategoriesData
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
   * Search by sub category id with related categories
   * @route GET /products/searchBySubCategoryIdWithRelatedCategories/:subCategoryId/:keyword/:limit/:offset
   * @param req
   * @param res
   * @returns {never}
   */
  searchBySubCategoryIdWithRelatedCategories: async (req, res) => {
    const params = req.params;
    let data, criteria, countCriteria, relatedCategoriesCriteria;

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
        where: { name: { $like: `${params.keyword}%` }, product_sub_category_id: params.subCategoryId, is_deleted: NO },
        order: [
          ['id', 'ASC'],
        ],
        limit,
        offset,
        include: [
          { 
            model: Model.ProductImages, as: "productImages", 
            attributes: ['file_name', 'order', 'type', 'product_id'],
            where: { type: PRODUCT_IMAGES_TYPE_THUMBNAIL, is_deleted: NO },
            required: false 
          },
          { 
            model: Model.Inventories, as: "inventories", 
            attributes: ['stock_available', 'price_amount', 'product_id'], 
            where: { is_deleted: NO },
            required: false 
          },
        ]
      };
      countCriteria = { where: { name: { $like: `${params.keyword}%` }, product_sub_category_id: params.subCategoryId, is_deleted: NO } };
      relatedCategoriesCriteria = {
        attributes: ['product_sub_category_id'],
        where: { name: { $like: `${params.keyword}%` }, is_deleted: NO },
        group: ['product_sub_category_id'],
        include: [
          { model: Model.ProductSubCategories, as: "productSubCategories", attributes: ['name', 'description'] }
        ]
      };

      // Execute findAll query
      data = await Model.Products.findAll(criteria);
      if (!_.isEmpty(data[0])) {
        count = await Model.Products.count(countCriteria);
        relatedCategoriesData = await Model.Products.findAll(relatedCategoriesCriteria);
        let obj = {
          data: data,
          count: count,
          relatedCategoriesData: relatedCategoriesData
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
        where: { is_deleted: NO },
        // include: [
        //   { model: Model.ProductBrands, as: "productBrands", attributes: ['name', 'description'] },
        //   { model: Model.ProductCategories, as: "productCategories", attributes: ['name', 'description'] },
        //   { model: Model.ProductSubCategories, as: "productSubCategories", attributes: ['name', 'description'] },
        //   { model: Model.ProductSubSubCategories, as: "productSubSubCategories", attributes: ['name', 'description'] }
        // ]
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
   * Find all by is featured
   * @route GET /products/featured/:value
   * @param req
   * @param res
   * @returns {never}
   */
  findAllByIsFeatured: async (req, res) => {
    let data, criteria;

    try {
      // Pre-setting variables
      criteria = {
        attributes: [
          'id',
          'name',
          'unit',
          'price_amount',
          'created_at',
          'is_today_deal',
          'is_featured',
          'is_published'
        ],
        where: { is_deleted: NO, is_featured: req.params.value, is_published: YES },
        order: [
          ['id', 'ASC'],
        ],
        include: [
          { 
            model: Model.ProductImages, as: "productImages", 
            attributes: ['file_name', 'order', 'type', 'product_id'],
            where: { type: PRODUCT_IMAGES_TYPE_FEATURED, is_deleted: NO },
            required: false 
          },
          { 
            model: Model.Inventories, as: "inventories", 
            attributes: ['stock_available', 'product_id'], 
            where: { is_deleted: NO },
            required: false 
          },
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
        where: { is_deleted: NO },
        order: [
          ['id', 'ASC'],
        ],
        limit,
        offset,
        include: [
          { model: Model.ProductBrands, as: "productBrands", attributes: ['name', 'description'] },
          { model: Model.ProductCategories, as: "productCategories", attributes: ['name', 'description'] },
          { model: Model.ProductSubCategories, as: "productSubCategories", attributes: ['name', 'description'] },
          { model: Model.ProductSubSubCategories, as: "productSubSubCategories", attributes: ['name', 'description'] },
          { 
            model: Model.ProductImages, as: "productImages", 
            attributes: ['file_name', 'order', 'type', 'product_id'],
            where: { type: PRODUCT_IMAGES_TYPE_THUMBNAIL, is_deleted: NO },
            required: false 
          },
          { 
            model: Model.ProductOptions, as: "productOptions", 
            attributes: ['id', 'title', 'values', 'product_id'], 
            where: { is_deleted: NO },
            required: false 
          },
          { 
            model: Model.Inventories, as: "inventories", 
            attributes: ['stock_available', 'product_id'], 
            where: { is_deleted: NO },
            required: false 
          },
        ]
      };
      countCriteria = { where: { is_deleted: NO } };

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
   * Find all by product category id with limit and offset
   * @route GET /products/findAllByProductCategoryIdWithLimitAndOffset/:productCategoryId/:limit/:offset
   * @param req
   * @param res
   * @returns {never}
   */
  findAllByProductCategoryIdWithLimitAndOffset: async (req, res) => {
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
        where: { product_category_id: params.productCategoryId, is_deleted: NO },
        order: [
          ['id', 'ASC'],
        ],
        limit,
        offset,
        include: [
          { 
            model: Model.ProductImages, as: "productImages", 
            attributes: ['file_name', 'order', 'type', 'product_id'],
            where: { type: PRODUCT_IMAGES_TYPE_THUMBNAIL, is_deleted: NO },
            required: false 
          },
          { 
            model: Model.Inventories, as: "inventories", 
            attributes: ['stock_available', 'price_amount', 'product_id'], 
            where: { is_deleted: NO },
            required: false 
          },
        ]
      };
      countCriteria = { where: { product_category_id: params.productCategoryId, is_deleted: NO } };

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
   * Find all by product sub category id with limit and offset
   * @route GET /products/findAllByProductSubCategoryIdWithLimitAndOffset/:productSubCategoryId/:limit/:offset
   * @param req
   * @param res
   * @returns {never}
   */
  findAllByProductSubCategoryIdWithLimitAndOffset: async (req, res) => {
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
        where: { product_sub_category_id: params.productSubCategoryId, is_deleted: NO },
        order: [
          ['id', 'ASC'],
        ],
        limit,
        offset,
        include: [
          { 
            model: Model.ProductImages, as: "productImages", 
            attributes: ['file_name', 'order', 'type', 'product_id'],
            where: { type: PRODUCT_IMAGES_TYPE_THUMBNAIL, is_deleted: NO },
            required: false 
          },
          { 
            model: Model.Inventories, as: "inventories", 
            attributes: ['stock_available', 'price_amount', 'product_id'], 
            where: { is_deleted: NO },
            required: false 
          },
        ]
      };
      countCriteria = { where: { product_sub_category_id: params.productSubCategoryId, is_deleted: NO } };

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
   * Find all by product sub sub-category id with limit and offset
   * @route GET /products/findAllByProductSubSubCategoryIdWithLimitAndOffset/:productSubSubCategoryId/:limit/:offset
   * @param req
   * @param res
   * @returns {never}
   */
  findAllByProductSubSubCategoryIdWithLimitAndOffset: async (req, res) => {
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
        where: { product_sub_sub_category_id: params.productSubSubCategoryId, is_deleted: NO },
        order: [
          ['id', 'ASC'],
        ],
        limit,
        offset,
        include: [
          { 
            model: Model.ProductImages, as: "productImages", 
            attributes: ['file_name', 'order', 'type', 'product_id'],
            where: { type: PRODUCT_IMAGES_TYPE_THUMBNAIL, is_deleted: NO },
            required: false 
          },
          { 
            model: Model.Inventories, as: "inventories", 
            attributes: ['stock_available', 'price_amount', 'product_id'], 
            where: { is_deleted: NO },
            required: false 
          },
        ]
      };
      countCriteria = { where: { product_sub_sub_category_id: params.productSubSubCategoryId, is_deleted: NO } };

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
        where: { is_deleted: NO },
        include: [
          { model: Model.ProductBrands, as: "productBrands", attributes: ['name', 'description'] },
          { model: Model.ProductCategories, as: "productCategories", attributes: ['name', 'description'] },
          { model: Model.ProductSubCategories, as: "productSubCategories", attributes: ['name', 'description'] },
          { model: Model.ProductSubSubCategories, as: "productSubSubCategories", attributes: ['name', 'description'] },
          { 
            model: Model.ProductImages, as: "productImages", 
            attributes: ['file_name', 'order', 'type', 'product_id'],
            where: { type: PRODUCT_IMAGES_TYPE_MAIN, is_deleted: NO },
            required: false 
          },
          { 
            model: Model.ProductOptions, as: "productOptions", 
            attributes: ['id', 'title', 'values', 'product_id'], 
            where: { is_deleted: NO },
            required: false 
          },
          { 
            model: Model.Inventories, as: "inventories", 
            attributes: ['name', 'price_amount', 'sku', 'stock_available', 'product_id'], 
            where: { is_deleted: NO },
            required: false 
          },
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
   * Count all
   * @route GET /products/count/all
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
      count = await Model.Products.count(criteria);
      res.json({
        status: 200,
        message: "Successfully count all data.",
        result: count
      });
    } catch (err) {
      res.json({
        status: 401,
        err: err,
        message: "Failed to count all data."
      });
    }
  },

  /**
   * Public Functions
   */

  /**
   * getNameById
   */
  getNameById: async (id) => {
    return new Promise(async (resolve, reject) => {
      try {
        // Pre-setting variables
        criteria = {
          attributes: ['name'],
          where: { is_deleted: NO }
        };
        // Execute findAll query
        data = await Model.Products.findByPk(id, criteria);
        resolve(data.name);
      } catch (err) {
        resolve({
          status: 401,
          err: err,
          message: "Failed to find data."
        });
      }
    });
  },
};
