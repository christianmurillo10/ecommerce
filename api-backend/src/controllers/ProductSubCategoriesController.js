const Model = require("../models");
const { ErrorHandler, handleSuccess } = require("../helpers/response-helper");
const { NO, YES } = require("../helpers/constant-helper");

module.exports = {
  /**
   * Create
   * @routes POST /productSubCategories/create
   */
  create: async (req, res, next) => {
    const params = req.body;
    let errors = [],
      message = "Successfully created data.",
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

      if (_.isEmpty(params.name)) errors.push("Name is required.");
      if (_.isEmpty(params.product_category_id))
        errors.push("Product Category is required.");
      if (errors.length > 0) {
        throw new ErrorHandler(400, errors);
      }

      // Validate Data
      criteria = {
        where: {
          name: params.name,
          product_category_id: params.product_category_id,
        },
        include: [{ model: Model.ProductCategories, as: "productCategories" }],
      };
      data = await Model.ProductSubCategories.findAll(criteria);
      if (!_.isEmpty(data[0])) {
        errors.push("Data already exist.");
        throw new ErrorHandler(409, errors);
      }

      // Pre-setting variables
      initialValues = _.pick(params, [
        "name",
        "description",
        "product_category_id",
        "created_at",
      ]);

      await Model.ProductSubCategories.create(initialValues)
        .then(() => Model.ProductSubCategories.findOrCreate(criteria))
        .then(([finalData, created]) => {
          handleSuccess(res, {
            statusCode: 201,
            message: message,
            result: _.omit(finalData.get({ plain: true }), ["is_deleted"]),
          });
        });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Update
   * @route PUT /productSubCategories/update/:id
   */
  update: async (req, res, next) => {
    const params = req.body;
    let errors = [],
      message = "Successfully updated data.",
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
        include: [{ model: Model.ProductCategories, as: "productCategories" }],
      };
      data = await Model.ProductSubCategories.findByPk(req.params.id);
      if (_.isEmpty(data)) {
        errors.push("Data doesn't exist.");
        throw new ErrorHandler(404, errors);
      }

      // Pre-setting variables
      initialValues = _.pick(params, [
        "name",
        "description",
        "product_category_id",
        "updated_at",
      ]);

      await data.update(initialValues).then(() =>
        Model.ProductSubCategories.findByPk(data.id, criteria).then(
          (finalData) => {
            handleSuccess(res, {
              statusCode: 200,
              message: message,
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
   * @route PUT /productSubCategories/delete/:id
   */
  delete: async (req, res, next) => {
    let errors = [],
      message = "Successfully deleted data.",
      data;

    try {
      // Validate Data
      data = await Model.ProductSubCategories.findByPk(req.params.id);
      if (_.isEmpty(data)) {
        errors.push("Data doesn't exist.");
        throw new ErrorHandler(404, errors);
      }
      let finalData = await data.update({ is_deleted: YES });

      handleSuccess(res, {
        statusCode: 200,
        message: message,
        result: finalData,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Find all
   * @route GET /productSubCategories
   */
  findAll: async (req, res, next) => {
    let errors = [],
      message = "Successfully find all data.",
      data,
      criteria;

    try {
      // Validate Data
      criteria = {
        where: { is_deleted: NO },
        include: [{ model: Model.ProductCategories, as: "productCategories" }],
      };
      data = await Model.ProductSubCategories.findAll(criteria);
      if (_.isEmpty(data[0])) {
        message = "No data found.";
      }

      handleSuccess(res, {
        statusCode: 200,
        message: message,
        result: data,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Find all by product category id
   * @route GET /productSubCategories/findAllbyProductCategoryId/:productCategoryId
   */
  findAllbyProductCategoryId: async (req, res, next) => {
    const params = req.params;
    let errors = [],
      message = "Successfully find all data.",
      data,
      criteria;

    try {
      // Validate Data
      criteria = {
        where: {
          product_category_id: params.productCategoryId,
          is_deleted: NO,
        },
        include: [{ model: Model.ProductCategories, as: "productCategories" }],
      };
      data = await Model.ProductSubCategories.findAll(criteria);
      if (_.isEmpty(data[0])) {
        message = "No data found.";
      }

      handleSuccess(res, {
        statusCode: 200,
        message: message,
        result: data,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Find by id
   * @route GET /productSubCategories/:id
   */
  findById: async (req, res, next) => {
    let errors = [],
      message = "Successfully find data.",
      data,
      criteria;

    try {
      // Validate Data
      criteria = {
        where: { is_deleted: NO },
        include: [{ model: Model.ProductCategories, as: "productCategories" }],
      };
      data = await Model.ProductSubCategories.findByPk(req.params.id, criteria);
      if (_.isEmpty(data)) {
        errors.push("Data doesn't exist.");
        throw new ErrorHandler(404, errors);
      }

      handleSuccess(res, {
        statusCode: 200,
        message: message,
        result: _.omit(data.get({ plain: true }), ["is_deleted"]),
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Count all
   * @route GET /productSubCategories/count/all
   */
  countAll: async (req, res, next) => {
    let errors = [],
      message = "Successfully count all data.",
      count,
      criteria;

    try {
      criteria = { where: { is_deleted: NO } };
      count = await Model.ProductSubCategories.count(criteria);

      handleSuccess(res, {
        statusCode: 200,
        message: message,
        result: count,
      });
    } catch (err) {
      next(err);
    }
  },
};
