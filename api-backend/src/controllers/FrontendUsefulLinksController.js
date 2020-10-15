const Model = require("../models");
const { ErrorHandler, handleSuccess } = require("../helpers/response-helper");
const { NO, YES } = require("../helpers/constant-helper");

module.exports = {
  /**
   * Create
   * @routes POST /frontendUsefulLinks/create
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

      if (_.isEmpty(params.name)) errors.push("Name is required.");
      if (_.isEmpty(params.url)) errors.push("Url is required.");
      if (errors.length > 0) {
        throw new ErrorHandler(400, errors);
      }

      // Validate Data
      criteria = { where: { name: params.name } };
      data = await Model.FrontendUsefulLinks.findAll(criteria);
      if (!_.isEmpty(data[0])) {
        errors.push("Data already exist.");
        throw new ErrorHandler(500, errors);
      }

      // Pre-setting variables
      initialValues = _.pick(params, ["name", "url", "created_at"]);
      let finalData = await Model.FrontendUsefulLinks.create(initialValues);

      handleSuccess(res, {
        statusCode: 201,
        message: "Successfully created data.",
        result: _.omit(finalData.get({ plain: true }), ["is_deleted"]),
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Update
   * @route PUT /frontendUsefulLinks/update/:id
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

      // Override Variables
      params.updated_at = moment().utc(8).format("YYYY-MM-DD HH:mm:ss");

      // Validate Data
      data = await Model.FrontendUsefulLinks.findByPk(req.params.id);
      if (_.isEmpty(data)) {
        errors.push("Data doesn't exist.");
        throw new ErrorHandler(500, errors);
      }

      // Pre-setting variables
      initialValues = _.pick(params, ["name", "url", "updated_at"]);
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
   * @route PUT /frontendUsefulLinks/delete/:id
   */
  delete: async (req, res, next) => {
    let errors = [],
      data;

    try {
      // Validate Data
      data = await Model.FrontendUsefulLinks.findByPk(req.params.id);
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
   * @route GET /frontendUsefulLinks
   */
  findAll: async (req, res, next) => {
    let errors = [],
      data,
      criteria;

    try {
      // Validate Data
      criteria = { where: { is_deleted: NO } };
      data = await Model.FrontendUsefulLinks.findAll(criteria);
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
   * @route GET /frontendUsefulLinks/:id
   */
  findById: async (req, res, next) => {
    let errors = [],
      data;

    try {
      // Execute findAll query
      data = await Model.FrontendUsefulLinks.findByPk(req.params.id);
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
};
