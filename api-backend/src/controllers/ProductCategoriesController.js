const Model = require("../models");
const { ErrorHandler, handleSuccess } = require("../helpers/response-helper");
const fs = require("fs");
const path = require("path");
const { NO, YES } = require("../helpers/constant-helper");

module.exports = {
  /**
   * Create
   * @routes POST /productCategories/create
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
      // icon
      if (!_.isUndefined(req.files["icon-image"])) {
        let iconExtension = path.extname(params.icon_file_name);
        let iconFileName = `icon-${params.name}-${date}${iconExtension}`;
        params.icon_file_name = iconFileName;
      } else {
        params.icon_file_name = null;
      }
      // banner
      if (!_.isUndefined(req.files["banner-image"])) {
        let bannerExtension = path.extname(params.banner_file_name);
        let bannerFileName = `banner-${params.name}-${date}${bannerExtension}`;
        params.banner_file_name = bannerFileName;
      } else {
        params.banner_file_name = null;
      }

      if (_.isEmpty(params.name)) {
        errors.push("Name is required.");
        throw new ErrorHandler(400, errors);
      }

      // Validate Data
      criteria = { where: { name: params.name, is_deleted: NO } };
      data = await Model.ProductCategories.findAll(criteria);
      if (!_.isEmpty(data[0])) {
        errors.push("Data already exist.");
        throw new ErrorHandler(409, errors);
      }

      // Pre-setting variables
      initialValues = _.pick(params, [
        "name",
        "description",
        "icon_file_name",
        "banner_file_name",
        "created_at",
      ]);
      let finalData = await Model.ProductCategories.create(initialValues);
      // For Upload Images
      if (!_.isUndefined(req.files)) {
        let fileUpload = await uploadImage(params, req.files);
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
   * @route PUT /productCategories/update/:id
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
      data = await Model.ProductCategories.findByPk(req.params.id);
      if (_.isEmpty(data)) {
        errors.push("Data doesn't exist.");
        throw new ErrorHandler(404, errors);
      }

      // Override variables
      params.updated_at = moment().utc(8).format("YYYY-MM-DD HH:mm:ss");
      let date = moment(params.created_at).format("YYYY-MM-DD");
      // icon
      if (!_.isUndefined(req.files["icon-image"])) {
        let iconExtension = path.extname(params.icon_file_name);
        let iconFileName = `icon-${params.name}-${date}${iconExtension}`;
        params.icon_file_name = iconFileName;
      } else {
        params.icon_file_name = data.icon_file_name;
      }
      // banner
      if (!_.isUndefined(req.files["banner-image"])) {
        let bannerExtension = path.extname(params.banner_file_name);
        let bannerFileName = `banner-${params.name}-${date}${bannerExtension}`;
        params.banner_file_name = bannerFileName;
      } else {
        params.banner_file_name = data.banner_file_name;
      }

      // Pre-setting variables
      initialValues = _.pick(params, [
        "name",
        "description",
        "icon_file_name",
        "banner_file_name",
        "is_featured",
        "updated_at",
      ]);
      let finalData = await data.update(initialValues);
      // For Upload Images
      if (!_.isUndefined(req.files)) {
        let fileUpload = await uploadImage(params, req.files);
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
   * Update is featured
   * @route PUT /productCategories/update/featured/:id
   */
  updateIsFeatured: async (req, res, next) => {
    const params = req.body;
    let errors = [],
      message = "Successfully updated data.",
      initialValues,
      data;

    try {
      // Validate Data
      data = await Model.ProductCategories.findByPk(req.params.id);
      if (_.isEmpty(data)) {
        errors.push("Data doesn't exist.");
        throw new ErrorHandler(404, errors);
      }

      // Override variables
      params.updated_at = moment().utc(8).format("YYYY-MM-DD HH:mm:ss");

      // Pre-setting variables
      initialValues = _.pick(params, ["is_featured", "updated_at"]);
      let finalData = await data.update(initialValues);

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
   * @route PUT /productCategories/delete/:id
   */
  delete: async (req, res, next) => {
    let errors = [],
      message = "Successfully deleted data.",
      data;

    try {
      // Validate Data
      data = await Model.ProductCategories.findByPk(req.params.id);
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
   * @route GET /productCategories
   */
  findAll: async (req, res, next) => {
    let errors = [],
      message = "Successfully find all data.",
      data,
      criteria;

    try {
      // Validate Data
      criteria = { where: { is_deleted: NO } };
      data = await Model.ProductCategories.findAll(criteria);
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
   * Find all with sub categories
   * @route GET /productCategories/findAllWithSubCategories
   */
  findAllWithSubCategories: async (req, res, next) => {
    let errors = [],
      message = "Successfully find all data.",
      data,
      criteria;

    try {
      // Validate Data
      criteria = {
        attributes: ["id", "name", "description"],
        where: { is_deleted: NO },
        include: [
          {
            model: Model.ProductSubCategories,
            as: "productSubCategories",
            attributes: ["id", "name", "description"],
            include: [
              {
                model: Model.ProductSubSubCategories,
                as: "productSubSubCategories",
                attributes: ["id", "name", "description"],
              },
            ],
          },
        ],
      };
      data = await Model.ProductCategories.findAll(criteria);
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
   * @route GET /productCategories/:id
   */
  findById: async (req, res, next) => {
    let errors = [],
      message = "Successfully find data.",
      data;

    try {
      // Validate Data
      data = await Model.ProductCategories.findByPk(req.params.id);
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
   * @route GET /productCategories/count/all
   * @param req
   * @param res
   * @returns {never}
   */
  countAll: async (req, res, next) => {
    let errors = [],
      message = "Successfully count all data.",
      count,
      criteria;

    try {
      criteria = { where: { is_deleted: NO } };
      count = await Model.ProductCategories.count(criteria);

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
   * @route GET /productCategories/viewImage/:fileName
   */
  viewImage: (req, res) => {
    res.sendFile(
      path.join(
        __dirname,
        "../../images/productCategories/" + req.params.fileName
      )
    );
  },
};

/**
 * Private Functions
 */
const uploadImage = (data, files) => {
  try {
    if (!_.isUndefined(files["icon-image"])) {
      fs.writeFile(
        "images/productCategories/" + data.icon_file_name,
        files["icon-image"][0].buffer,
        function (err) {
          if (err) throw err;
        }
      );
    }

    if (!_.isUndefined(files["banner-image"])) {
      fs.writeFile(
        "images/productCategories/" + data.banner_file_name,
        files["banner-image"][0].buffer,
        function (err) {
          if (err) throw err;
        }
      );
    }

    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};
