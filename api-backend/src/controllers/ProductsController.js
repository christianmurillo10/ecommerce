const Model = require("../models");
const { ErrorHandler, handleSuccess } = require("../helpers/response-helper");
const {
  NO,
  YES,
  PRODUCT_IMAGES_TYPE_MAIN,
  PRODUCT_IMAGES_TYPE_THUMBNAIL,
  PRODUCT_IMAGES_TYPE_FEATURED,
  PRODUCT_IMAGES_TYPE_FASH_DEAL,
} = require("../helpers/constant-helper");

module.exports = {
  /**
   * Create
   * @routes POST /products/create
   */
  create: async (req, res, next) => {
    const params = req.body;
    let errors = [],
      criteria,
      initialValues,
      data;

    try {
      // Validators
      if (_.isEmpty(params)) {
        errors.push("Invalid Parameter.");
        throw new ErrorHandler(400, errors);
      }

      // Override variables
      params.created_at = moment().utc(8).format("YYYY-MM-DD HH:mm:ss");
      params.tags = params.tags.length > 0 ? params.tags.toString() : null;
      params.price_amount = params.price_amount
        ? params.price_amount.toLocaleString()
        : null;
      params.user_id = req.user.id.toLocaleString();
      params.product_store_id = params.product_store_id
        ? params.product_store_id.toLocaleString()
        : null;
      params.product_brand_id = params.product_brand_id
        ? params.product_brand_id.toLocaleString()
        : null;
      params.product_category_id = params.product_category_id
        ? params.product_category_id.toLocaleString()
        : null;
      params.product_sub_category_id = params.product_sub_category_id
        ? params.product_sub_category_id.toLocaleString()
        : null;
      params.product_sub_sub_category_id = params.product_sub_sub_category_id
        ? params.product_sub_sub_category_id.toLocaleString()
        : null;

      if (_.isEmpty(params.code)) errors.push("Code is required.");
      if (_.isEmpty(params.name)) errors.push("Name is required.");
      if (_.isEmpty(params.unit)) errors.push("Unit is required.");
      if (_.isEmpty(params.price_amount))
        errors.push("Price Amount is required.");
      if (_.isEmpty(params.product_store_id))
        errors.push("Product Store is required.");
      if (_.isEmpty(params.product_brand_id))
        errors.push("Product Brand is required.");
      if (_.isEmpty(params.product_category_id))
        errors.push("Product Category is required.");
      if (_.isEmpty(params.product_sub_category_id))
        errors.push("Product Sub-Category is required.");
      if (_.isEmpty(params.product_sub_sub_category_id))
        errors.push("Product Sub Sub-Category is required.");
      if (errors.length > 0) {
        throw new ErrorHandler(400, errors);
      }

      // Validate Data
      criteria = {
        where: { name: params.name },
        include: [
          {
            model: Model.ProductStores,
            as: "productStores",
            attributes: ["name", "description"],
          },
          {
            model: Model.ProductBrands,
            as: "productBrands",
            attributes: ["name", "description"],
          },
          {
            model: Model.ProductCategories,
            as: "productCategories",
            attributes: ["name", "description"],
          },
          {
            model: Model.ProductSubCategories,
            as: "productSubCategories",
            attributes: ["name", "description"],
          },
          {
            model: Model.ProductSubSubCategories,
            as: "productSubSubCategories",
            attributes: ["name", "description"],
          },
          {
            model: Model.Users,
            as: "users",
            attributes: ["email", "username"],
          },
        ],
      };
      data = await Model.Products.findAll(criteria);
      if (!_.isEmpty(data[0])) {
        errors.push("Data already exist.");
        throw new ErrorHandler(500, errors);
      }

      // Pre-setting variables
      initialValues = _.pick(params, [
        "code",
        "name",
        "description",
        "unit",
        "tags",
        "price_amount",
        "user_id",
        "product_store_id",
        "product_brand_id",
        "product_category_id",
        "product_sub_category_id",
        "product_sub_sub_category_id",
        "created_at",
        "is_featured",
        "is_published",
      ]);

      await Model.Products.create(initialValues)
        .then(() => Model.Products.findOrCreate(criteria))
        .then(async ([finalData, created]) => {
          let plainData = finalData.get({ plain: true });
          handleSuccess(res, {
            statusCode: 201,
            message: "Successfully created data.",
            result: _.omit(plainData, ["is_deleted"]),
          });
        });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Update
   * @route PUT /products/update/:id
   */
  update: async (req, res, next) => {
    const params = req.body;
    let errors = [],
      initialValues,
      data;

    try {
      // Validators
      if (_.isEmpty(params)) {
        errors.push("Invalid Parameter.");
        throw new ErrorHandler(400, errors);
      }

      // Override variables
      params.updated_at = moment().utc(8).format("YYYY-MM-DD HH:mm:ss");
      params.tags = params.tags.length === 0 ? null : params.tags.toString();

      // Validate Data
      data = await Model.Products.findByPk(req.params.id);
      if (_.isEmpty(data)) {
        errors.push("Data doesn't exist.");
        throw new ErrorHandler(500, errors);
      }

      // Pre-setting variables
      initialValues = _.pick(params, [
        "code",
        "name",
        "description",
        "unit",
        "tags",
        "price_amount",
        "product_store_id",
        "product_brand_id",
        "product_category_id",
        "product_sub_category_id",
        "product_sub_sub_category_id",
        "updated_at",
        "is_featured",
        "is_published",
      ]);
      let finalData = await data.update(initialValues);

      handleSuccess(res, {
        statusCode: 200,
        message: "Successfully updated data.",
        result: finalData,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Update status
   * @route PUT /products/updateStatus/:id
   */
  updateStatus: async (req, res, next) => {
    const params = req.body;
    let errors = [],
      initialValues,
      data;

    try {
      // Validators
      if (_.isEmpty(params)) {
        errors.push("Invalid Parameter.");
        throw new ErrorHandler(400, errors);
      }

      // Override Variables
      params.updated_at = moment().utc(8).format("YYYY-MM-DD HH:mm:ss");

      // Validate Data
      data = await Model.Products.findByPk(req.params.id);
      if (_.isEmpty(data)) {
        errors.push("Data doesn't exist.");
        throw new ErrorHandler(500, errors);
      }

      // Pre-setting variables
      initialValues = _.pick(params, [
        "updated_at",
        "is_featured",
        "is_published",
      ]);
      let finalData = await data.update(initialValues);

      handleSuccess(res, {
        statusCode: 200,
        message: "Successfully updated data.",
        result: finalData,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Delete
   * @route PUT /products/delete/:id
   */
  delete: async (req, res, next) => {
    let errors = [],
      data;

    try {
      // Validate Data
      data = await Model.Products.findByPk(req.params.id);
      if (_.isEmpty(data)) {
        errors.push("Data doesn't exist.");
        throw new ErrorHandler(500, errors);
      }
      let finalData = await data.update({ is_deleted: YES });

      handleSuccess(res, {
        statusCode: 200,
        message: "Successfully deleted data.",
        result: finalData,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Search
   * @route GET /products/search/:keyword?limit=:limit&offset=:offset
   */
  search: async (req, res, next) => {
    const params = req.params;
    const query = req.query;
    let errors = [],
      data,
      criteria,
      countCriteria;

    try {
      // Validate Data
      let limit = query.limit ? parseInt(query.limit) : 10;
      let offset = query.offset ? parseInt(query.offset) : 0;

      criteria = {
        attributes: [
          "id",
          "code",
          "name",
          "unit",
          "tags",
          "price_amount",
          "product_store_id",
          "product_brand_id",
          "product_category_id",
          "product_sub_category_id",
          "product_sub_sub_category_id",
          "created_at",
          "is_featured",
          "is_published",
        ],
        where: { name: { $like: `${params.keyword}%` }, is_deleted: NO },
        order: [["id", "ASC"]],
        limit,
        offset,
        include: [
          {
            model: Model.ProductImages,
            as: "productImages",
            attributes: ["file_name", "order", "type", "product_id"],
            where: { type: PRODUCT_IMAGES_TYPE_THUMBNAIL, is_deleted: NO },
            required: false,
          },
          {
            model: Model.Inventories,
            as: "inventories",
            attributes: ["quantity_available", "price_amount", "product_id"],
            where: { is_deleted: NO },
            required: false,
          },
        ],
      };
      data = await Model.Products.findAll(criteria);
      if (_.isEmpty(data[0])) {
        errors.push("No data found.");
        throw new ErrorHandler(500, errors);
      }

      countCriteria = {
        where: { name: { $like: `${params.keyword}%` }, is_deleted: NO },
      };
      count = await Model.Products.count(countCriteria);
      let obj = {
        data: data,
        count: count,
      };

      handleSuccess(res, {
        statusCode: 200,
        message: "Successfully find all data.",
        result: obj,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Search with related categories
   * @route GET /products/searchWithRelatedCategories/:keyword?limit=:limit&offset=:offset
   */
  searchWithRelatedCategories: async (req, res, next) => {
    const params = req.params;
    const query = req.query;
    let errors = [],
      data,
      criteria,
      countCriteria,
      relatedCategoriesCriteria;

    try {
      // Validate Data
      let limit = query.limit ? parseInt(query.limit) : 10;
      let offset = query.offset ? parseInt(query.offset) : 0;

      criteria = {
        attributes: [
          "id",
          "code",
          "name",
          "unit",
          "tags",
          "price_amount",
          "product_store_id",
          "product_brand_id",
          "product_category_id",
          "product_sub_category_id",
          "product_sub_sub_category_id",
          "created_at",
          "is_featured",
          "is_published",
        ],
        where: { name: { $like: `${params.keyword}%` }, is_deleted: NO },
        order: [["id", "ASC"]],
        limit,
        offset,
        include: [
          {
            model: Model.ProductImages,
            as: "productImages",
            attributes: ["file_name", "order", "type", "product_id"],
            where: { type: PRODUCT_IMAGES_TYPE_THUMBNAIL, is_deleted: NO },
            required: false,
          },
          {
            model: Model.Inventories,
            as: "inventories",
            attributes: ["quantity_available", "price_amount", "product_id"],
            where: { is_deleted: NO },
            required: false,
          },
        ],
      };
      data = await Model.Products.findAll(criteria);
      if (_.isEmpty(data[0])) {
        errors.push("No data found.");
        throw new ErrorHandler(500, errors);
      }

      countCriteria = {
        where: { name: { $like: `${params.keyword}%` }, is_deleted: NO },
      };
      count = await Model.Products.count(countCriteria);
      relatedCategoriesCriteria = {
        attributes: ["product_sub_category_id"],
        where: { name: { $like: `${params.keyword}%` }, is_deleted: NO },
        group: ["product_sub_category_id"],
        include: [
          {
            model: Model.ProductSubCategories,
            as: "productSubCategories",
            attributes: ["name", "description"],
          },
        ],
      };
      relatedCategoriesData = await Model.Products.findAll(
        relatedCategoriesCriteria
      );
      let obj = {
        data: data,
        count: count,
        relatedCategoriesData: relatedCategoriesData,
      };

      handleSuccess(res, {
        statusCode: 200,
        message: "Successfully find all data.",
        result: obj,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Search by sub category id with related categories
   * @route GET /products/searchBySubCategoryIdWithRelatedCategories/:subCategoryId/:keyword?limit=:limit&offset=:offset
   */
  searchBySubCategoryIdWithRelatedCategories: async (req, res, next) => {
    const params = req.params;
    const query = req.query;
    let errors = [],
      data,
      criteria,
      countCriteria,
      relatedCategoriesCriteria;

    try {
      // Validate Data
      let limit = query.limit ? parseInt(query.limit) : 10;
      let offset = query.offset ? parseInt(query.offset) : 0;

      criteria = {
        attributes: [
          "id",
          "code",
          "name",
          "unit",
          "tags",
          "price_amount",
          "product_store_id",
          "product_brand_id",
          "product_category_id",
          "product_sub_category_id",
          "product_sub_sub_category_id",
          "created_at",
          "is_featured",
          "is_published",
        ],
        where: {
          name: { $like: `${params.keyword}%` },
          product_sub_category_id: params.subCategoryId,
          is_deleted: NO,
        },
        order: [["id", "ASC"]],
        limit,
        offset,
        include: [
          {
            model: Model.ProductImages,
            as: "productImages",
            attributes: ["file_name", "order", "type", "product_id"],
            where: { type: PRODUCT_IMAGES_TYPE_THUMBNAIL, is_deleted: NO },
            required: false,
          },
          {
            model: Model.Inventories,
            as: "inventories",
            attributes: ["quantity_available", "price_amount", "product_id"],
            where: { is_deleted: NO },
            required: false,
          },
        ],
      };
      data = await Model.Products.findAll(criteria);
      if (_.isEmpty(data[0])) {
        errors.push("No data found.");
        throw new ErrorHandler(500, errors);
      }

      countCriteria = {
        where: {
          name: { $like: `${params.keyword}%` },
          product_sub_category_id: params.subCategoryId,
          is_deleted: NO,
        },
      };
      count = await Model.Products.count(countCriteria);
      relatedCategoriesCriteria = {
        attributes: ["product_sub_category_id"],
        where: { name: { $like: `${params.keyword}%` }, is_deleted: NO },
        group: ["product_sub_category_id"],
        include: [
          {
            model: Model.ProductSubCategories,
            as: "productSubCategories",
            attributes: ["name", "description"],
          },
        ],
      };
      relatedCategoriesData = await Model.Products.findAll(
        relatedCategoriesCriteria
      );
      let obj = {
        data: data,
        count: count,
        relatedCategoriesData: relatedCategoriesData,
      };

      handleSuccess(res, {
        statusCode: 200,
        message: "Successfully find all data.",
        result: obj,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Find all
   * @route GET /products
   */
  findAll: async (req, res, next) => {
    let errors = [],
      data,
      criteria;

    try {
      // Validate Data
      criteria = {
        attributes: [
          "id",
          "code",
          "name",
          "description",
          "unit",
          "tags",
          "price_amount",
          "product_store_id",
          "product_brand_id",
          "product_category_id",
          "product_sub_category_id",
          "product_sub_sub_category_id",
          "created_at",
          "is_featured",
          "is_published",
        ],
        where: { is_deleted: NO },
        // include: [
        //   { model: Model.ProductStores, as: "productStores", attributes: ['name', 'description'] },
        //   { model: Model.ProductBrands, as: "productBrands", attributes: ['name', 'description'] },
        //   { model: Model.ProductCategories, as: "productCategories", attributes: ['name', 'description'] },
        //   { model: Model.ProductSubCategories, as: "productSubCategories", attributes: ['name', 'description'] },
        //   { model: Model.ProductSubSubCategories, as: "productSubSubCategories", attributes: ['name', 'description'] }
        // ]
      };
      data = await Model.Products.findAll(criteria);
      if (_.isEmpty(data[0])) {
        errors.push("No data found.");
        throw new ErrorHandler(500, errors);
      }

      handleSuccess(res, {
        statusCode: 200,
        message: "Successfully find all data.",
        result: data,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Find all by is featured
   * @route GET /products/featured/:value
   */
  findAllByIsFeatured: async (req, res, next) => {
    let errors = [],
      data,
      criteria;

    try {
      // Validate Data
      criteria = {
        attributes: [
          "id",
          "code",
          "name",
          "unit",
          "price_amount",
          "created_at",
          "is_featured",
          "is_published",
        ],
        where: {
          is_deleted: NO,
          is_featured: req.params.value,
          is_published: YES,
        },
        order: [["id", "ASC"]],
        include: [
          {
            model: Model.ProductImages,
            as: "productImages",
            attributes: ["file_name", "order", "type", "product_id"],
            where: { type: PRODUCT_IMAGES_TYPE_FEATURED, is_deleted: NO },
            required: false,
          },
          {
            model: Model.Inventories,
            as: "inventories",
            attributes: ["quantity_available", "product_id"],
            where: { is_deleted: NO },
            required: false,
          },
        ],
      };
      data = await Model.Products.findAll(criteria);
      if (_.isEmpty(data[0])) {
        errors.push("No data found.");
        throw new ErrorHandler(500, errors);
      }

      handleSuccess(res, {
        statusCode: 200,
        message: "Successfully find all data.",
        result: data,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Find all with limit and offset
   * @route GET /products/findAllWithLimitAndOffset?limit=:limit&offset=:offset
   */
  findAllWithLimitAndOffset: async (req, res, next) => {
    let params = req.params;
    let query = req.query;
    let errors = [],
      data,
      criteria,
      countCriteria;

    try {
      // Validate Data
      let limit = query.limit ? parseInt(query.limit) : 10;
      let offset = query.offset ? parseInt(query.offset) : 0;

      criteria = {
        attributes: [
          "id",
          "code",
          "name",
          "unit",
          "tags",
          "price_amount",
          "product_store_id",
          "product_brand_id",
          "product_category_id",
          "product_sub_category_id",
          "product_sub_sub_category_id",
          "created_at",
          "is_featured",
          "is_published",
        ],
        where: { is_deleted: NO },
        order: [["id", "ASC"]],
        limit,
        offset,
        include: [
          {
            model: Model.ProductStores,
            as: "productStores",
            attributes: ["name", "description"],
          },
          {
            model: Model.ProductBrands,
            as: "productBrands",
            attributes: ["name", "description"],
          },
          {
            model: Model.ProductCategories,
            as: "productCategories",
            attributes: ["name", "description"],
          },
          {
            model: Model.ProductSubCategories,
            as: "productSubCategories",
            attributes: ["name", "description"],
          },
          {
            model: Model.ProductSubSubCategories,
            as: "productSubSubCategories",
            attributes: ["name", "description"],
          },
          {
            model: Model.ProductImages,
            as: "productImages",
            attributes: ["file_name", "order", "type", "product_id"],
            where: { type: PRODUCT_IMAGES_TYPE_THUMBNAIL, is_deleted: NO },
            required: false,
          },
          {
            model: Model.ProductVariants,
            as: "productVariants",
            attributes: ["id", "title", "values", "product_id"],
            where: { is_deleted: NO },
            required: false,
          },
          {
            model: Model.Inventories,
            as: "inventories",
            attributes: ["quantity_available", "product_id"],
            where: { is_deleted: NO },
            required: false,
          },
        ],
      };
      data = await Model.Products.findAll(criteria);
      if (_.isEmpty(data[0])) {
        errors.push("No data found.");
        throw new ErrorHandler(500, errors);
      }

      countCriteria = { where: { is_deleted: NO } };
      count = await Model.Products.count(countCriteria);
      let obj = {
        data: data,
        count: count,
      };

      handleSuccess(res, {
        statusCode: 200,
        message: "Successfully find all data.",
        result: obj,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Find all by product category id with limit and offset
   * @route GET /products/findAllByProductCategoryIdWithLimitAndOffset/:productCategoryId?limit=:limit&offset=:offset
   */
  findAllByProductCategoryIdWithLimitAndOffset: async (req, res, next) => {
    let params = req.params;
    let query = req.query;
    let errors = [],
      data,
      criteria,
      countCriteria;

    try {
      // Validate Data
      let limit = query.limit ? parseInt(query.limit) : 10;
      let offset = query.offset ? parseInt(query.offset) : 0;

      criteria = {
        attributes: [
          "id",
          "code",
          "name",
          "unit",
          "tags",
          "price_amount",
          "product_store_id",
          "product_brand_id",
          "product_category_id",
          "product_sub_category_id",
          "product_sub_sub_category_id",
          "created_at",
          "is_featured",
          "is_published",
        ],
        where: {
          product_category_id: params.productCategoryId,
          is_deleted: NO,
        },
        order: [["id", "ASC"]],
        limit,
        offset,
        include: [
          {
            model: Model.ProductImages,
            as: "productImages",
            attributes: ["file_name", "order", "type", "product_id"],
            where: { type: PRODUCT_IMAGES_TYPE_THUMBNAIL, is_deleted: NO },
            required: false,
          },
          {
            model: Model.Inventories,
            as: "inventories",
            attributes: ["quantity_available", "price_amount", "product_id"],
            where: { is_deleted: NO },
            required: false,
          },
        ],
      };
      data = await Model.Products.findAll(criteria);
      if (_.isEmpty(data[0])) {
        errors.push("No data found.");
        throw new ErrorHandler(500, errors);
      }

      countCriteria = {
        where: {
          product_category_id: params.productCategoryId,
          is_deleted: NO,
        },
      };
      count = await Model.Products.count(countCriteria);
      let obj = {
        data: data,
        count: count,
      };

      handleSuccess(res, {
        statusCode: 200,
        message: "Successfully find all data.",
        result: obj,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Find all by product sub category id with limit and offset
   * @route GET /products/findAllByProductSubCategoryIdWithLimitAndOffset/:productSubCategoryId?limit=:limit&offset=:offset
   */
  findAllByProductSubCategoryIdWithLimitAndOffset: async (req, res, next) => {
    let params = req.params;
    let query = req.query;
    let errors = [],
      data,
      criteria,
      countCriteria;

    try {
      // Validate Data
      let limit = query.limit ? parseInt(query.limit) : 10;
      let offset = query.offset ? parseInt(query.offset) : 0;

      criteria = {
        attributes: [
          "id",
          "code",
          "name",
          "unit",
          "tags",
          "price_amount",
          "product_store_id",
          "product_brand_id",
          "product_category_id",
          "product_sub_category_id",
          "product_sub_sub_category_id",
          "created_at",
          "is_featured",
          "is_published",
        ],
        where: {
          product_sub_category_id: params.productSubCategoryId,
          is_deleted: NO,
        },
        order: [["id", "ASC"]],
        limit,
        offset,
        include: [
          {
            model: Model.ProductImages,
            as: "productImages",
            attributes: ["file_name", "order", "type", "product_id"],
            where: { type: PRODUCT_IMAGES_TYPE_THUMBNAIL, is_deleted: NO },
            required: false,
          },
          {
            model: Model.Inventories,
            as: "inventories",
            attributes: ["quantity_available", "price_amount", "product_id"],
            where: { is_deleted: NO },
            required: false,
          },
        ],
      };
      data = await Model.Products.findAll(criteria);
      if (_.isEmpty(data[0])) {
        errors.push("No data found.");
        throw new ErrorHandler(500, errors);
      }

      countCriteria = {
        where: {
          product_sub_category_id: params.productSubCategoryId,
          is_deleted: NO,
        },
      };
      count = await Model.Products.count(countCriteria);
      let obj = {
        data: data,
        count: count,
      };

      handleSuccess(res, {
        statusCode: 200,
        message: "Successfully find all data.",
        result: obj,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Find all by product sub sub-category id with limit and offset
   * @route GET /products/findAllByProductSubSubCategoryIdWithLimitAndOffset/:productSubSubCategoryId?limit=:limit&offset=:offset
   */
  findAllByProductSubSubCategoryIdWithLimitAndOffset: async (
    req,
    res,
    next
  ) => {
    let params = req.params;
    let query = req.query;
    let errors = [],
      data,
      criteria,
      countCriteria;

    try {
      // Validate Data
      let limit = query.limit ? parseInt(query.limit) : 10;
      let offset = query.offset ? parseInt(query.offset) : 0;

      criteria = {
        attributes: [
          "id",
          "code",
          "name",
          "unit",
          "tags",
          "price_amount",
          "product_store_id",
          "product_brand_id",
          "product_category_id",
          "product_sub_category_id",
          "product_sub_sub_category_id",
          "created_at",
          "is_featured",
          "is_published",
        ],
        where: {
          product_sub_sub_category_id: params.productSubSubCategoryId,
          is_deleted: NO,
        },
        order: [["id", "ASC"]],
        limit,
        offset,
        include: [
          {
            model: Model.ProductImages,
            as: "productImages",
            attributes: ["file_name", "order", "type", "product_id"],
            where: { type: PRODUCT_IMAGES_TYPE_THUMBNAIL, is_deleted: NO },
            required: false,
          },
          {
            model: Model.Inventories,
            as: "inventories",
            attributes: ["quantity_available", "price_amount", "product_id"],
            where: { is_deleted: NO },
            required: false,
          },
        ],
      };
      data = await Model.Products.findAll(criteria);
      if (_.isEmpty(data[0])) {
        errors.push("No data found.");
        throw new ErrorHandler(500, errors);
      }

      countCriteria = {
        where: {
          product_sub_sub_category_id: params.productSubSubCategoryId,
          is_deleted: NO,
        },
      };
      count = await Model.Products.count(countCriteria);
      let obj = {
        data: data,
        count: count,
      };

      handleSuccess(res, {
        statusCode: 200,
        message: "Successfully find all data.",
        result: obj,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Find by id
   * @route GET /products/:id
   */
  findById: async (req, res, next) => {
    let errors = [],
      data;

    try {
      // Validate Data
      criteria = {
        where: { is_deleted: NO },
        include: [
          {
            model: Model.ProductStores,
            as: "productStores",
            attributes: ["name", "description"],
          },
          {
            model: Model.ProductBrands,
            as: "productBrands",
            attributes: ["name", "description"],
          },
          {
            model: Model.ProductCategories,
            as: "productCategories",
            attributes: ["name", "description"],
          },
          {
            model: Model.ProductSubCategories,
            as: "productSubCategories",
            attributes: ["name", "description"],
          },
          {
            model: Model.ProductSubSubCategories,
            as: "productSubSubCategories",
            attributes: ["name", "description"],
          },
          {
            model: Model.ProductImages,
            as: "productImages",
            attributes: ["file_name", "order", "type", "product_id"],
            where: { is_deleted: NO },
            required: false,
          },
          {
            model: Model.ProductVariants,
            as: "productVariants",
            attributes: ["id", "title", "values", "product_id"],
            where: { is_deleted: NO },
            required: false,
          },
          {
            model: Model.Inventories,
            as: "inventories",
            attributes: [
              "name",
              "price_amount",
              "sku",
              "quantity_available",
              "product_id",
            ],
            where: { is_deleted: NO },
            required: false,
          },
        ],
      };
      data = await Model.Products.findByPk(req.params.id, criteria);
      if (_.isEmpty(data)) {
        errors.push("No data found.");
        throw new ErrorHandler(500, errors);
      }

      handleSuccess(res, {
        statusCode: 200,
        message: "Successfully find data.",
        result: _.omit(data.get({ plain: true }), ["is_deleted"]),
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Find by id
   * @route GET /products/findByIdWithImageType/:id/:imageType
   */
  findByIdWithImageType: async (req, res, next) => {
    let errors = [],
      data;

    try {
      // Validate Data
      criteria = {
        where: { is_deleted: NO },
        include: [
          {
            model: Model.ProductStores,
            as: "productStores",
            attributes: ["name", "description"],
          },
          {
            model: Model.ProductBrands,
            as: "productBrands",
            attributes: ["name", "description"],
          },
          {
            model: Model.ProductCategories,
            as: "productCategories",
            attributes: ["name", "description"],
          },
          {
            model: Model.ProductSubCategories,
            as: "productSubCategories",
            attributes: ["name", "description"],
          },
          {
            model: Model.ProductSubSubCategories,
            as: "productSubSubCategories",
            attributes: ["name", "description"],
          },
          {
            model: Model.ProductImages,
            as: "productImages",
            attributes: ["file_name", "order", "type", "product_id"],
            where: { type: req.params.imageType, is_deleted: NO },
            required: false,
          },
          {
            model: Model.ProductVariants,
            as: "productVariants",
            attributes: ["id", "title", "values", "product_id"],
            where: { is_deleted: NO },
            required: false,
          },
          {
            model: Model.Inventories,
            as: "inventories",
            attributes: [
              "name",
              "price_amount",
              "sku",
              "quantity_available",
              "product_id",
            ],
            where: { is_deleted: NO },
            required: false,
          },
        ],
      };
      data = await Model.Products.findByPk(req.params.id, criteria);
      if (_.isEmpty(data)) {
        errors.push("No data found.");
        throw new ErrorHandler(500, errors);
      }

      handleSuccess(res, {
        statusCode: 200,
        message: "Successfully find data.",
        result: _.omit(data.get({ plain: true }), ["is_deleted"]),
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Count all
   * @route GET /products/count/all
   */
  countAll: async (req, res, next) => {
    let errors = [],
      count,
      criteria;

    try {
      criteria = { where: { is_deleted: NO } };
      count = await Model.Products.count(criteria);

      handleSuccess(res, {
        statusCode: 200,
        message: "Successfully count all data.",
        result: count,
      });
    } catch (err) {
      next(err);
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
          attributes: ["name"],
          where: { is_deleted: NO },
        };
        // Execute findAll query
        data = await Model.Products.findByPk(id, criteria);
        resolve(data.name);
      } catch (err) {
        resolve({
          status: 401,
          err: err,
          message: "Failed to find data.",
        });
      }
    });
  },
};
