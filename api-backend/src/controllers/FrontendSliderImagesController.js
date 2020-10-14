const Model = require("../models");
const { ErrorHandler, handleSuccess } = require("../helpers/response-helper");
const fs = require("fs");
const path = require("path");
const { NO, YES } = require("../helpers/constant-helper");

module.exports = {
  /**
   * Create
   * @routes POST /frontendSliderImages/create
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
      params.order = params.order.toLocaleString();
      params.user_id = req.user.id.toLocaleString();

      if (!_.isUndefined(req.file)) {
        let extension = path.extname(params.file_name);
        let fileName = `Frontend-Slider-${params.order}${extension}`;
        params.file_name = fileName;
      } else {
        params.file_name = null;
      }

      if (_.isEmpty(params.file_name)) errors.push("Image is required.");
      if (_.isEmpty(params.order)) errors.push("Order is required.");
      if (errors.length > 0) {
        throw new ErrorHandler(400, errors);
      }

      // Validate Data
      criteria = { where: { file_name: params.file_name } };
      data = await Model.FrontendSliderImages.findAll(criteria);
      if (!_.isEmpty(data[0])) {
        errors.push("Data already exist.");
        throw new ErrorHandler(500, errors);
      }

      // Pre-setting variables
      initialValues = _.pick(params, [
        "file_name",
        "url",
        "order",
        "user_id",
        "created_at",
      ]);
      let finalData = await Model.FrontendSliderImages.create(initialValues);
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
   * @route PUT /frontendSliderImages/update/:id
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
      data = await Model.FrontendSliderImages.findByPk(req.params.id);

      // Override variables
      if (!_.isUndefined(req.file)) {
        let extension = path.extname(params.file_name);
        let fileName = `Frontend-Slider-${params.order}${extension}`;
        params.file_name = fileName;
      } else {
        params.file_name = data.file_name;
      }

      // Validate Data
      if (_.isEmpty(data)) {
        errors.push("Data doesn't exist.");
        throw new ErrorHandler(500, errors);
      }

      // Pre-setting variables
      initialValues = _.pick(params, ["url", "order"]);
      let finalData = await data.update(initialValues);
      // For Upload Images
      if (!_.isUndefined(req.file)) {
        let fileUpload = await uploadImage(data.file_name, req.file);
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
   * @route PUT /frontendSliderImages/delete/:id
   */
  delete: async (req, res, next) => {
    let errors = [],
      data;

    try {
      // Validate Data
      data = await Model.FrontendSliderImages.findByPk(req.params.id);
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
   * @route GET /frontendSliderImages
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
          {
            model: Model.Users,
            as: "users",
            attributes: ["email", "username"],
          },
        ],
      };
      data = await Model.FrontendSliderImages.findAll(criteria);
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
   * @route GET /frontendSliderImages/:id
   */
  findById: async (req, res, next) => {
    let errors = [],
      data;

    try {
      // Validate Data
      data = await Model.FrontendSliderImages.findByPk(req.params.id);
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
   * Find by file_name
   * @route GET /frontendSliderImages/viewImage/:fileName
   */
  viewImage: (req, res) => {
    res.sendFile(
      path.join(
        __dirname,
        "../../images/frontendSliders/" + req.params.fileName
      )
    );
  },
};

/**
 * Other Functions
 */
const uploadImage = (name, file) => {
  try {
    fs.writeFile("images/frontendSliders/" + name, file.buffer, function (err) {
      if (err) throw err;
    });

    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};
