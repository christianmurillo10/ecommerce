const Model = require("../models");
const { ErrorHandler, handleSuccess } = require("../helpers/response-helper");
const { NO, YES } = require("../helpers/constant-helper");

module.exports = {
  /**
   * Create
   * @routes POST /productVariants/create
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
      params.values = params.values ? params.values.toString() : null;
      params.product_id = params.product_id
        ? params.product_id.toLocaleString()
        : null;
      params.user_id = req.user.id.toLocaleString();

      if (_.isEmpty(params.title)) errors.push("Title is required.");
      if (_.isEmpty(params.values)) errors.push("Values is required.");
      if (_.isEmpty(params.product_id)) errors.push("Product is required.");
      if (errors.length > 0) {
        throw new ErrorHandler(400, errors);
      }

      // Validate Data
      criteria = {
        where: { title: params.title, product_id: params.product_id },
        include: [{ model: Model.Products, as: "products" }],
      };
      data = await Model.ProductVariants.findAll(criteria);
      if (!_.isEmpty(data[0])) {
        errors.push("Data already exist.");
        throw new ErrorHandler(409, errors);
      }

      // Pre-setting variables
      initialValues = _.pick(params, [
        "title",
        "values",
        "user_id",
        "product_id",
        "created_at",
      ]);

      await Model.ProductVariants.create(initialValues)
        .then(() => Model.ProductVariants.findOrCreate(criteria))
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
   * @route PUT /productVariants/update/:id
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
      params.values = params.values.toString();

      // Validate Data
      criteria = {
        where: { is_deleted: NO },
        include: [{ model: Model.Products, as: "products" }],
      };
      data = await Model.ProductVariants.findByPk(req.params.id);
      if (_.isEmpty(data)) {
        errors.push("Data doesn't exist.");
        throw new ErrorHandler(404, errors);
      }

      // Pre-setting variables
      initialValues = _.pick(params, [
        "title",
        "values",
        "product_id",
        "updated_at",
      ]);

      await data.update(initialValues).then(() =>
        Model.ProductVariants.findByPk(data.id, criteria).then((finalData) => {
          handleSuccess(res, {
            statusCode: 200,
            message: message,
            result: _.omit(finalData.get({ plain: true }), ["is_deleted"]),
          });
        })
      );
    } catch (err) {
      next(err);
    }
  },

  /**
   * Delete
   * @route PUT /productVariants/delete/:id
   */
  delete: async (req, res, next) => {
    let errors = [],
      message = "Successfully deleted data.",
      data;

    try {
      // Validate Data
      data = await Model.ProductVariants.findByPk(req.params.id);
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
   * @route GET /productVariants
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
        include: [{ model: Model.Products, as: "products" }],
      };
      data = await Model.ProductVariants.findAll(criteria);
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
   * Find all by product id
   * @route GET /productVariants/findAllbyProductId/:productId
   */
  findAllbyProductId: async (req, res, next) => {
    const params = req.params;
    let errors = [],
      message = "Successfully find all data.",
      data,
      criteria;

    try {
      // Validate Data
      criteria = {
        where: { product_id: params.productId, is_deleted: NO },
        include: [{ model: Model.Products, as: "products" }],
      };
      data = await Model.ProductVariants.findAll(criteria);
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
   * @route GET /productVariants/:id
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
        include: [{ model: Model.Products, as: "products" }],
      };
      data = await Model.ProductVariants.findByPk(req.params.id, criteria);
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
};
