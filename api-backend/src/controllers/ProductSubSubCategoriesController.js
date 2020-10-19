const Model = require("../models");
const { ErrorHandler, handleSuccess } = require("../helpers/response-helper");
const { NO, YES } = require("../helpers/constant-helper");

module.exports = {
  /**
   * Create
   * @routes POST /productSubSubCategories/create
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
      params.product_category_id = params.product_category_id
        ? params.product_category_id.toLocaleString()
        : null;
      params.product_sub_category_id = params.product_sub_category_id
        ? params.product_sub_category_id.toLocaleString()
        : null;

      if (_.isEmpty(params.name)) errors.push("Name is required.");
      if (_.isEmpty(params.product_category_id))
        errors.push("Product Category is required.");
      if (_.isEmpty(params.product_sub_category_id))
        errors.push("Product Sub Category is required.");
      if (errors.length > 0) {
        throw new ErrorHandler(400, errors);
      }

      // Validate Data
      criteria = {
        where: {
          name: params.name,
          product_category_id: params.product_category_id,
          product_sub_category_id: params.product_sub_category_id,
        },
        include: [
          { model: Model.ProductCategories, as: "productCategories" },
          { model: Model.ProductSubCategories, as: "productSubCategories" },
        ],
      };
      data = await Model.ProductSubSubCategories.findAll(criteria);
      if (!_.isEmpty(data[0])) {
        errors.push("Data already exist.");
        throw new ErrorHandler(500, errors);
      }

      // Pre-setting variables
      initialValues = _.pick(params, [
        "name",
        "description",
        "product_category_id",
        "product_sub_category_id",
        "created_at",
      ]);

      await Model.ProductSubSubCategories.create(initialValues)
        .then(() => Model.ProductSubSubCategories.findOrCreate(criteria))
        .then(([finalData, created]) => {
          handleSuccess(res, {
            statusCode: 201,
            message: "Successfully created data.",
            result: _.omit(finalData.get({ plain: true }), ["is_deleted"]),
          });
        });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Update
   * @route PUT /productSubSubCategories/update/:id
   */
  update: async (req, res, next) => {
    const params = req.body;
    let errors = [],
      initialValues,
      data,
      criteria;

    try {
      // Validators
      if (_.isEmpty(params)) {
        errors.push("Invalid Parameter.");
        throw new ErrorHandler(400, errors);
      }

      // Override Variables
      params.updated_at = moment().utc(8).format("YYYY-MM-DD HH:mm:ss");

      // Validate Data
      criteria = {
        where: { is_deleted: NO },
        include: [
          { model: Model.ProductCategories, as: "productCategories" },
          { model: Model.ProductSubCategories, as: "productSubCategories" },
        ],
      };
      data = await Model.ProductSubSubCategories.findByPk(req.params.id);
      if (_.isEmpty(data)) {
        errors.push("Data doesn't exist.");
        throw new ErrorHandler(500, errors);
      }

      // Pre-setting variables
      initialValues = _.pick(params, [
        "name",
        "description",
        "product_category_id",
        "product_sub_category_id",
      ]);

      await data.update(initialValues).then(() =>
        Model.ProductSubSubCategories.findByPk(data.id, criteria).then(
          (finalData) => {
            handleSuccess(res, {
              statusCode: 200,
              message: "Successfully updated data.",
              result: _.omit(finalData.get({ plain: true }), ["is_deleted"]),
            });
          }
        )
      );
    } catch (err) {
      next(err);
    }
  },

  /**
   * Delete
   * @route PUT /productSubSubCategories/delete/:id
   */
  delete: async (req, res, next) => {
    let errors = [],
      data;

    try {
      // Validate Data
      data = await Model.ProductSubSubCategories.findByPk(req.params.id);
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
   * Find all
   * @route GET /productSubSubCategories
   */
  findAll: async (req, res, next) => {
    let errors = [],
      data,
      criteria;

    try {
      // Validate Data
      criteria = {
        where: { is_deleted: NO },
        include: [
          { model: Model.ProductCategories, as: "productCategories" },
          { model: Model.ProductSubCategories, as: "productSubCategories" },
        ],
      };
      data = await Model.ProductSubSubCategories.findAll(criteria);
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
   * Find all by product category id
   * @route GET /productSubSubCategories/findAllbyProductCategoryId/:productCategoryId
   */
  findAllbyProductCategoryId: async (req, res, next) => {
    const params = req.params;
    let errors = [],
      data,
      criteria;

    try {
      // Validate Data
      criteria = {
        where: {
          product_category_id: params.productCategoryId,
          is_deleted: NO,
        },
        include: [
          { model: Model.ProductCategories, as: "productCategories" },
          { model: Model.ProductSubCategories, as: "productSubCategories" },
        ],
      };
      data = await Model.ProductSubSubCategories.findAll(criteria);
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
   * Find all by product sub category id
   * @route GET /productSubSubCategories/findAllbyProductSubCategoryId/:productSubCategoryId
   */
  findAllbyProductSubCategoryId: async (req, res, next) => {
    const params = req.params;
    let errors = [],
      data,
      criteria;

    try {
      // Validate Data
      criteria = {
        where: {
          product_sub_category_id: params.productSubCategoryId,
          is_deleted: NO,
        },
        include: [
          { model: Model.ProductCategories, as: "productCategories" },
          { model: Model.ProductSubCategories, as: "productSubCategories" },
        ],
      };
      data = await Model.ProductSubSubCategories.findAll(criteria);
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
   * Find all by product category id and product sub-category id
   * @route GET /productSubSubCategories/findAllbyProductCategoryIdAndProductSubCategoryId/:productCategoryId/:productSubCategoryId
   */
  findAllbyProductCategoryIdAndProductSubCategoryId: async (req, res, next) => {
    const params = req.params;
    let errors = [],
      data,
      criteria;

    try {
      // Validate Data
      criteria = {
        where: {
          product_category_id: params.productCategoryId,
          product_sub_category_id: params.productSubCategoryId,
          is_deleted: NO,
        },
        include: [
          { model: Model.ProductCategories, as: "productCategories" },
          { model: Model.ProductSubCategories, as: "productSubCategories" },
        ],
      };
      data = await Model.ProductSubSubCategories.findAll(criteria);
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
   * Find by id
   * @route GET /productSubSubCategories/:id
   */
  findById: async (req, res, next) => {
    let errors = [],
      data,
      criteria;

    try {
      // Validate Data
      criteria = {
        where: { is_deleted: NO },
        include: [
          { model: Model.ProductCategories, as: "productCategories" },
          { model: Model.ProductSubCategories, as: "productSubCategories" },
        ],
      };
      data = await Model.ProductSubSubCategories.findByPk(
        req.params.id,
        criteria
      );
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
   * @route GET /productSubSubCategories/count/all
   */
  countAll: async (req, res, next) => {
    let errors = [],
      count,
      criteria;

    try {
      criteria = { where: { is_deleted: NO } };
      count = await Model.ProductSubSubCategories.count(criteria);

      handleSuccess(res, {
        statusCode: 200,
        message: "Successfully count all data.",
        result: count,
      });
    } catch (err) {
      next(err);
    }
  },
};
