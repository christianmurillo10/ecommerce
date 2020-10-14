const Model = require("../models");
const { ErrorHandler, handleSuccess } = require("../helpers/response-helper");
const { NO, YES } = require("../helpers/constant-helper");

module.exports = {
  /**
   * Create
   * @routes POST /customerCreditDebitCards/create
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
      params.bank_id = params.bank_id ? params.bank_id.toLocaleString() : null;
      params.customer_id = params.customer_id
        ? params.customer_id.toLocaleString()
        : null;
      params.type = params.type ? params.type.toLocaleString() : null;

      if (_.isEmpty(params.card_no)) errors.push("Card No. is required.");
      if (_.isEmpty(params.security_code))
        errors.push("Security Code is required.");
      if (_.isEmpty(params.firstname)) errors.push("Firstname is required.");
      if (_.isEmpty(params.lastname)) errors.push("Lastname is required.");
      if (_.isEmpty(params.bank_id)) errors.push("Bank is required.");
      if (_.isEmpty(params.customer_id)) errors.push("Customer is required.");
      if (_.isEmpty(params.date_expired))
        errors.push("Date Expired is required.");
      if (_.isEmpty(params.type)) errors.push("Type is required.");
      if (errors.length > 0) {
        throw new ErrorHandler(400, errors);
      }

      // Validate Data
      criteria = {
        where: { card_no: params.card_no, is_deleted: NO },
        include: [
          { model: Model.Banks, as: "banks", attributes: ["code", "name"] },
        ],
      };
      data = await Model.CustomerCreditDebitCards.findAll(criteria);
      if (!_.isEmpty(data[0])) {
        errors.push("Data already exist.");
        throw new ErrorHandler(500, errors);
      }

      // Pre-setting variables
      initialValues = _.pick(params, [
        "card_no",
        "security_code",
        "firstname",
        "lastname",
        "bank_id",
        "customer_id",
        "date_expired",
        "created_at",
        "type",
      ]);

      await Model.CustomerCreditDebitCards.create(initialValues)
        .then(() => Model.CustomerCreditDebitCards.findOrCreate(criteria))
        .then(async ([finalData, created]) => {
          let plainData = finalData.get({ plain: true });
          handleSuccess(res, {
            statusCode: 201,
            message: "Successfully created data.",
            result: _.omit(plainData, ["is_deleted"]),
          });
        });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Update
   * @route PUT /customerCreditDebitCards/update/:id
   */
  update: async (req, res, next) => {
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
      params.updated_at = moment().utc(8).format("YYYY-MM-DD HH:mm:ss");

      // Validate Data
      criteria = {
        include: [
          { model: Model.Banks, as: "banks", attributes: ["code", "name"] },
        ],
      };
      data = await Model.CustomerCreditDebitCards.findByPk(
        req.params.id,
        criteria
      );
      if (_.isEmpty(data)) {
        errors.push("Data doesn't exist.");
        throw new ErrorHandler(500, errors);
      }

      // Pre-setting variables
      initialValues = _.pick(params, [
        "card_no",
        "security_code",
        "firstname",
        "lastname",
        "bank_id",
        "customer_id",
        "date_expired",
        "updated_at",
        "type",
      ]);

      await data.update(initialValues).then(() =>
        Model.CustomerCreditDebitCards.findByPk(data.id, criteria).then(
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
   * @route PUT /customerCreditDebitCards/delete/:id
   */
  delete: async (req, res, next) => {
    let errors = [],
      data;

    try {
      // Validate Data
      data = await Model.CustomerCreditDebitCards.findByPk(req.params.id);
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
   * @route GET /customerCreditDebitCards
   */
  findAll: async (req, res, next) => {
    let errors = [],
      data,
      criteria;

    try {
      // Validate Data
      criteria = { where: { is_deleted: NO } };
      data = await Model.CustomerCreditDebitCards.findAll(criteria);
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
   * Find all by customer id
   * @route GET /customerCreditDebitCards/findAllbyCustomerId/:customerId
   */
  findAllbyCustomerId: async (req, res, next) => {
    const params = req.params;
    let errors = [],
      data,
      criteria;

    try {
      // Validate Data
      criteria = {
        where: { customer_id: params.customerId, is_deleted: NO },
        include: [
          { model: Model.Banks, as: "banks", attributes: ["code", "name"] },
        ],
      };
      data = await Model.CustomerCreditDebitCards.findAll(criteria);
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
   * @route GET /customerCreditDebitCards/:id
   */
  findById: async (req, res, next) => {
    let errors = [],
      data;

    try {
      // Validate Data
      data = await Model.CustomerCreditDebitCards.findByPk(req.params.id);
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
