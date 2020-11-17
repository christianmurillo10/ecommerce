const Model = require("../models");
const { ErrorHandler, handleSuccess } = require("../helpers/response-helper");
const fs = require("fs");
const path = require("path");
const { NO, YES } = require("../helpers/constant-helper");

module.exports = {
  /**
   * Create
   * @routes POST /productBrands/create
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
      let date = moment(params.created_at).format("YYYY-MM-DD");
      if (!_.isUndefined(req.file)) {
        let extension = path.extname(params.file_name);
        let fileName = `${params.name}-${date}${extension}`;
        params.file_name = fileName;
      } else {
        params.file_name = null;
      }

      if (_.isEmpty(params.name)) {
        errors.push("Name is required.");
        throw new ErrorHandler(400, errors);
      }

      // Validate Data
      criteria = { where: { name: params.name, is_deleted: NO } };
      data = await Model.ProductBrands.findAll(criteria);
      if (!_.isEmpty(data[0])) {
        errors.push("Data already exist.");
        throw new ErrorHandler(409, errors);
      }

      // Pre-setting variables
      initialValues = _.pick(params, [
        "name",
        "description",
        "file_name",
        "created_at",
      ]);
      let finalData = await Model.ProductBrands.create(initialValues);
      // For Upload Images
      if (!_.isUndefined(req.file)) {
        let fileUpload = await uploadImage(params.file_name, req.file);
      }

      handleSuccess(res, {
        statusCode: 201,
        message: message,
        result: _.omit(finalData.get({ plain: true }), ["is_deleted"]),
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Update
   * @route PUT /productBrands/update/:id
   */
  update: async (req, res, next) => {
    const params = req.body;
    let errors = [],
      message = "Successfully updated data.",
      initialValues,
      data;

    try {
      // Validators
      if (_.isEmpty(params)) {
        errors.push("Invalid Parameter.");
        throw new ErrorHandler(400, errors);
      }

      // Validate Data
      data = await Model.ProductBrands.findByPk(req.params.id);
      if (_.isEmpty(data)) {
        errors.push("Data doesn't exist.");
        throw new ErrorHandler(404, errors);
      }

      // Override variables
      params.updated_at = moment().utc(8).format("YYYY-MM-DD HH:mm:ss");
      if (!_.isUndefined(req.file)) {
        let date = moment(params.created_at).format("YYYY-MM-DD");
        let extension = path.extname(params.file_name);
        let fileName = `${params.name}-${date}${extension}`;
        params.file_name = fileName;
      } else {
        params.file_name = data.file_name;
      }

      // Pre-setting variables
      initialValues = _.pick(params, [
        "name",
        "description",
        "file_name",
        "updated_at",
      ]);
      let finalData = await data.update(initialValues);
      // For Upload Images
      if (!_.isUndefined(req.file)) {
        let fileUpload = await uploadImage(params.file_name, req.file);
      }

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
   * Delete
   * @route PUT /productBrands/delete/:id
   */
  delete: async (req, res, next) => {
    let errors = [],
      message = "Successfully deleted data.",
      data;

    try {
      // Validate Data
      data = await Model.ProductBrands.findByPk(req.params.id);
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
   * @route GET /productBrands
   */
  findAll: async (req, res, next) => {
    let errors = [],
      message = "Successfully find all data.",
      data,
      criteria;

    try {
      // Validate Data
      criteria = { where: { is_deleted: NO } };
      data = await Model.ProductBrands.findAll(criteria);
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
   * @route GET /productBrands/:id
   */
  findById: async (req, res, next) => {
    let errors = [],
      message = "Successfully find data.",
      data;

    try {
      // Validate Data
      data = await Model.ProductBrands.findByPk(req.params.id);
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
   * @route GET /productBrands/count/all
   */
  countAll: async (req, res, next) => {
    let errors = [],
      message = "Successfully count all data.",
      count,
      criteria;

    try {
      criteria = { where: { is_deleted: NO } };
      count = await Model.ProductBrands.count(criteria);

      handleSuccess(res, {
        statusCode: 200,
        message: message,
        result: count,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Find by file_name
   * @route GET /productBrands/viewImage/:fileName
   */
  viewImage: (req, res) => {
    res.sendFile(
      path.join(__dirname, "../../images/productBrands/" + req.params.fileName)
    );
  },
};

/**
 * Private Functions
 */
const uploadImage = (name, file) => {
  try {
    fs.writeFile("images/productBrands/" + name, file.buffer, function (err) {
      if (err) throw err;
    });

    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};
