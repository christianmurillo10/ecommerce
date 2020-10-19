const Model = require("../models");
const { ErrorHandler, handleSuccess } = require("../helpers/response-helper");
const fs = require("fs");
const path = require("path");
const { NO, YES } = require("../helpers/constant-helper");

module.exports = {
  /**
   * Create
   * @routes POST /productStores/create
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
      data = await Model.ProductStores.findAll(criteria);
      if (!_.isEmpty(data[0])) {
        errors.push("Data already exist.");
        throw new ErrorHandler(500, errors);
      }

      // Pre-setting variables
      initialValues = _.pick(params, [
        "name",
        "description",
        "file_name",
        "created_at",
      ]);
      let finalData = await Model.ProductStores.create(initialValues);
      // For Upload Images
      if (!_.isUndefined(req.file)) {
        let fileUpload = await uploadImage(params.file_name, req.file);
      }

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
   * @route PUT /productStores/update/:id
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

      // Execute findByPk query
      data = await Model.ProductStores.findByPk(req.params.id);

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

      if (_.isEmpty(data)) {
        errors.push("Data doesn't exist.");
        throw new ErrorHandler(500, errors);
      }

      // Pre-setting variables
      initialValues = _.pick(params, [
        "name",
        "description",
        "file_name",
        "updated_at",
        "is_active",
      ]);
      let finalData = await data.update(initialValues);
      // For Upload Images
      if (!_.isUndefined(req.file)) {
        let fileUpload = await uploadImage(params.file_name, req.file);
      }

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
   * @route PUT /productStores/delete/:id
   */
  delete: async (req, res, next) => {
    let errors = [],
      data;

    try {
      // Validate Data
      data = await Model.ProductStores.findByPk(req.params.id);
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
   * @route GET /productStores
   */
  findAll: async (req, res, next) => {
    let errors = [],
      data,
      criteria;

    try {
      // Validate Data
      criteria = { where: { is_deleted: NO } };
      data = await Model.ProductStores.findAll(criteria);
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
   * @route GET /productStores/:id
   */
  findById: async (req, res, next) => {
    let errors = [],
      data;

    try {
      // Validate Data
      data = await Model.ProductStores.findByPk(req.params.id);
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
   * @route GET /productStores/count/all
   */
  countAll: async (req, res, next) => {
    let errors = [],
      count,
      criteria;

    try {
      criteria = { where: { is_deleted: NO } };
      count = await Model.ProductStores.count(criteria);
      
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
   * Find by file_name
   * @route GET /productStores/viewImage/:fileName
   */
  viewImage: (req, res) => {
    res.sendFile(
      path.join(__dirname, "../../images/productStores/" + req.params.fileName)
    );
  },
};

/**
 * Other Functions
 */
const uploadImage = (name, file) => {
  try {
    fs.writeFile("images/productStores/" + name, file.buffer, function (err) {
      if (err) throw err;
    });

    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};
