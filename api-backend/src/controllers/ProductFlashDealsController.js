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
   * @routes POST /productFlashDeals/create
   */
  create: async (req, res, next) => {
    const params = req.body;
    let errors = [],
      message = "Successfully created data.",
      criteria,
      criteriaFindExistingDate,
      initialValues,
      data,
      dataFindExistingDate;

    try {
      // Validators
      if (_.isEmpty(params)) {
        errors.push("Invalid Parameter.");
        throw new ErrorHandler(400, errors);
      }

      // Override variables
      params.created_at = moment().utc(8).format("YYYY-MM-DD HH:mm:ss");
      params.user_id = req.user.id.toLocaleString();

      if (_.isEmpty(params.title)) errors.push("Title is required.");
      if (_.isEmpty(params.date_from)) errors.push("Date From is required.");
      if (_.isEmpty(params.date_to)) errors.push("Date To is required.");
      if (errors.length > 0) {
        throw new ErrorHandler(400, errors);
      }

      // Validate Data
      criteria = { where: { title: params.title } };
      data = await Model.ProductFlashDeals.findAll(criteria);
      if (!_.isEmpty(data[0])) {
        errors.push("Data already exist.");
        throw new ErrorHandler(409, errors);
      }

      criteriaFindExistingDate = {
        attributes: ["id", "title", "date_from", "date_to"],
        where: {
          date_from: { $lte: params.date_from },
          date_to: { $gte: params.date_from },
          is_deleted: NO,
        },
      };
      dataFindExistingDate = await Model.ProductFlashDeals.findOne(
        criteriaFindExistingDate
      );
      if (!_.isEmpty(dataFindExistingDate)) {
        errors.push("Data already exist.");
        throw new ErrorHandler(409, errors);
      }

      const currentDate = moment().utc(8).format("YYYY-MM-DD HH:mm:ss");
      const dateFrom = moment(params.date_from)
        .utc(8)
        .format("YYYY-MM-DD HH:mm:ss");
      const dateTo = moment(params.date_to)
        .utc(8)
        .format("YYYY-MM-DD HH:mm:ss");
      if (
        moment(dateFrom).isBefore(currentDate) ||
        moment(dateFrom).isAfter(dateTo)
      ) {
        errors.push("Conflict on setting date.");
        throw new ErrorHandler(409, errors);
      }

      // Pre-setting variables
      initialValues = _.pick(params, [
        "title",
        "date_from",
        "date_to",
        "user_id",
        "created_at",
      ]);
      let finalData = await Model.ProductFlashDeals.create(initialValues);

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
   * @route PUT /productFlashDeals/update/:id
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

      // Override Variables
      params.updated_at = moment().utc(8).format("YYYY-MM-DD HH:mm:ss");

      // Validate Data
      data = await Model.ProductFlashDeals.findByPk(req.params.id);
      if (_.isEmpty(data)) {
        errors.push("Data doesn't exist.");
        throw new ErrorHandler(404, errors);
      }

      const oldDateFrom = moment(data.date_from)
        .utc(8)
        .format("YYYY-MM-DD HH:mm:ss");
      const dateFrom = moment(params.date_from)
        .utc(8)
        .format("YYYY-MM-DD HH:mm:ss");
      const dateTo = moment(params.date_to)
        .utc(8)
        .format("YYYY-MM-DD HH:mm:ss");
      if (
        moment(dateFrom).isBefore(oldDateFrom) ||
        moment(dateFrom).isAfter(dateTo)
      ) {
        errors.push("Conflict on setting date.");
        throw new ErrorHandler(409, errors);
      }

      // Pre-setting variables
      initialValues = _.pick(params, [
        "title",
        "date_from",
        "date_to",
        "is_active",
      ]);
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
   * @route PUT /productFlashDeals/delete/:id
   */
  delete: async (req, res, next) => {
    let errors = [],
      message = "Successfully deleted data.",
      data;

    try {
      // Validate Data
      data = await Model.ProductFlashDeals.findByPk(req.params.id);
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
   * @route GET /productFlashDeals
   */
  findAll: async (req, res, next) => {
    let errors = [],
      message = "Successfully find all data.",
      data,
      criteria;

    try {
      // Validate Data
      criteria = { where: { is_deleted: NO } };
      data = await Model.ProductFlashDeals.findAll(criteria);
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
   * Find all
   * @route GET /productFlashDeals/findOne/todayFlashDeal
   * @param req
   * @param res
   * @returns {never}
   */
  findTodayFlashDeal: async (req, res, next) => {
    let errors = [],
      message = "Successfully find data.",
      data,
      criteria;

    try {
      // Validate Data
      let dateToday = moment().utc(8).format("YYYY-MM-DD");
      criteria = {
        attributes: ["id", "title", "date_from", "date_to"],
        where: {
          date_from: { $lte: dateToday },
          date_to: { $gte: dateToday },
          is_active: YES,
          is_deleted: NO,
        },
        order: [["id", "DESC"]],
        include: [
          {
            model: Model.ProductFlashDealDetails,
            as: "productFlashDealDetails",
            attributes: [
              "id",
              "discount_percentage",
              "discount_amount",
              "base_price_amount",
              "current_price_amount",
              "product_id",
              "discount_type",
            ],
            where: { is_deleted: NO },
            order: [["id", "ASC"]],
            include: [
              {
                model: Model.Products,
                as: "products",
                attributes: ["name", "unit"],
                where: { is_published: YES, is_deleted: NO },
                include: [
                  {
                    model: Model.ProductImages,
                    as: "productImages",
                    attributes: ["file_name", "order", "type"],
                    where: {
                      type: PRODUCT_IMAGES_TYPE_FASH_DEAL,
                      is_deleted: NO,
                    },
                    order: [["id", "ASC"]],
                    separate: true,
                    required: false,
                  },
                ],
                required: false,
              },
            ],
            separate: true,
            required: false,
          },
        ],
      };
      data = await Model.ProductFlashDeals.findOne(criteria);
      if (_.isEmpty(data)) {
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
   * @route GET /productFlashDeals/:id
   */
  findById: async (req, res, next) => {
    let errors = [],
      message = "Successfully find data.",
      data;

    try {
      // Validate Data
      data = await Model.ProductFlashDeals.findByPk(req.params.id);
      if (_.isEmpty(data)) {
        errors.push("No data found.");
        throw new ErrorHandler(500, errors);
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
