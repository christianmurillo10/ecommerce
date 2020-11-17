const Model = require("../models");
const { ErrorHandler, handleSuccess } = require("../helpers/response-helper");
const ProductsController = require("./ProductsController");
const fs = require("fs");
const path = require("path");
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
   * @routes POST /productImages/create
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
      params.order = params.order.toLocaleString();
      params.user_id = req.user.id.toLocaleString();
      params.product_id = params.product_id
        ? params.product_id.toLocaleString()
        : null;
      params.type = params.type.toLocaleString();

      if (!_.isUndefined(req.file)) {
        let date = moment(params.created_at).format("YYYY-MM-DD");
        let extension = path.extname(params.file_name);
        let productName = await ProductsController.getNameById(
          params.product_id
        );
        let fileName = `${productName}-${params.type}-${params.order}-${date}${extension}`;
        params.file_name = fileName;
      } else {
        params.file_name = null;
      }

      if (_.isEmpty(params.file_name)) errors.push("Image is required.");
      if (_.isEmpty(params.order)) errors.push("Order is required.");
      if (_.isEmpty(params.product_id)) errors.push("Product is required.");
      if (_.isEmpty(params.type)) errors.push("Type is required.");
      if (errors.length > 0) {
        throw new ErrorHandler(400, errors);
      }

      // Validate Data
      criteria = { where: { file_name: params.file_name } };
      data = await Model.ProductImages.findAll(criteria);
      if (!_.isEmpty(data[0])) {
        errors.push("Data already exist.");
        throw new ErrorHandler(409, errors);
      }

      // Pre-setting variables
      initialValues = _.pick(params, [
        "file_name",
        "order",
        "product_id",
        "user_id",
        "type",
        "created_at",
      ]);
      let finalData = await Model.ProductImages.create(initialValues);
      // For Upload Images
      if (!_.isUndefined(req.file)) {
        let fileUpload = await uploadImage(
          params.file_name,
          params.type,
          req.file
        );
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
   * @route PUT /productImages/update/:id
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
      // Execute findByPk query
      data = await Model.ProductImages.findByPk(req.params.id);

      // Override Variables
      params.updated_at = moment().utc(8).format("YYYY-MM-DD HH:mm:ss");
      if (!_.isUndefined(req.file)) {
        let date = moment(params.created_at).format("YYYY-MM-DD");
        let extension = path.extname(params.file_name);
        let productName = await ProductsController.getNameById(
          params.product_id
        );
        let fileName = `${productName}-${params.type}-${params.order}-${date}${extension}`;
        params.file_name = fileName;
      } else {
        params.file_name = data.file_name;
      }

      // Validate Data
      if (_.isEmpty(data)) {
        errors.push("Data doesn't exist.");
        throw new ErrorHandler(404, errors);
      }

      // Pre-setting variables
      initialValues = _.pick(params, [
        "file_name",
        "order",
        "type",
        "product_id",
        "updated_at",
      ]);
      let finalData = await data.update(initialValues);
      // For Upload Images
      if (!_.isUndefined(req.file)) {
        let fileUpload = await uploadImage(
          params.file_name,
          params.type,
          req.file
        );
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
   * @route PUT /productImages/delete/:id
   */
  delete: async (req, res, next) => {
    let errors = [],
      message = "Successfully deleted data.",
      data;

    try {
      // Validate Data
      data = await Model.ProductImages.findByPk(req.params.id);
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
   * @route GET /productImages
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
        include: [
          {
            model: Model.Products,
            as: "products",
            attributes: ["name", "description"],
          },
          {
            model: Model.Users,
            as: "users",
            attributes: ["email", "username"],
          },
        ],
      };
      data = await Model.ProductImages.findAll(criteria);
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
   * @route GET /productImages/findAllbyProductId/:productId
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
        include: [
          {
            model: Model.Products,
            as: "products",
            attributes: ["name", "description"],
          },
          {
            model: Model.Users,
            as: "users",
            attributes: ["email", "username"],
          },
        ],
      };
      data = await Model.ProductImages.findAll(criteria);
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
   * Find all by product id and type
   * @route GET /productImages/findAllbyProductIdAndType/:productId/:type
   */
  findAllbyProductIdAndType: async (req, res, next) => {
    const params = req.params;
    let errors = [],
      message = "Successfully find all data.",
      data,
      criteria;

    try {
      // Validate Data
      criteria = {
        where: {
          product_id: params.productId,
          type: params.type,
          is_deleted: NO,
        },
        include: [
          {
            model: Model.Products,
            as: "products",
            attributes: ["name", "description"],
          },
          {
            model: Model.Users,
            as: "users",
            attributes: ["email", "username"],
          },
        ],
      };
      data = await Model.ProductImages.findAll(criteria);
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
   * @route GET /productImages/:id
   */
  findById: async (req, res, next) => {
    let errors = [],
      message = "Successfully find data.",
      data;

    try {
      // Validate Data
      data = await Model.ProductImages.findByPk(req.params.id);
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
   * Find by file_name and type
   * @route GET /productImages/viewImage/:fileName/:type
   */
  viewImage: (req, res) => {
    let filePath;
    switch (parseInt(req.params.type)) {
      case PRODUCT_IMAGES_TYPE_MAIN:
        filePath = "../../images/products/main/";
        break;
      case PRODUCT_IMAGES_TYPE_THUMBNAIL:
        filePath = "../../images/products/thumbnail/";
        break;
      case PRODUCT_IMAGES_TYPE_FEATURED:
        filePath = "../../images/products/featured/";
        break;
      case PRODUCT_IMAGES_TYPE_FASH_DEAL:
        filePath = "../../images/products/flashDeal/";
        break;
    }
    res.sendFile(path.join(__dirname, filePath + req.params.fileName));
  },
};

/**
 * Private Functions
 */
const uploadImage = (name, type, file) => {
  try {
    let filePath;
    switch (parseInt(type)) {
      case PRODUCT_IMAGES_TYPE_MAIN:
        filePath = "images/products/main/";
        break;
      case PRODUCT_IMAGES_TYPE_THUMBNAIL:
        filePath = "images/products/thumbnail/";
        break;
      case PRODUCT_IMAGES_TYPE_FEATURED:
        filePath = "images/products/featured/";
        break;
      case PRODUCT_IMAGES_TYPE_FASH_DEAL:
        filePath = "images/products/flashDeal/";
        break;
    }
    fs.writeFile(filePath + name, file.buffer, function (err) {
      if (err) throw err;
    });

    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};
