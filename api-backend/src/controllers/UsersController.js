const Model = require("../models");
const { ErrorHandler, handleSuccess } = require("../helpers/response-helper");
const bcrypt = require("../helpers/bcrypt-helper");
const { NO, YES } = require("../helpers/constant-helper");

module.exports = {
  /**
   * Create
   * @routes POST /users/create
   */
  create: async (req, res, next) => {
    const params = req.body;
    const usernameChecker = /^(?=[a-zA-Z0-9._]{6,30}$)(?!.*[_.]{2})[^_.].*[^_.]$/;
    const emailChecker = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
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
      params.role_id = _.isUndefined(params.role_id) ? 1 : params.role_id;

      if (_.isEmpty(params.username)) errors.push("Username is required.");
      if (_.isEmpty(params.password)) errors.push("Password is required.");
      if (_.isEmpty(params.email)) errors.push("Email is required.");
      if (params.username && params.username.length > 30)
        errors.push("Username exceed 30 characters.");
      if (params.username && params.username.length < 6)
        errors.push("Username must be at least 6 characters.");
      if (!usernameChecker.test(params.username))
        errors.push("Invalid username format.");
      if (!emailChecker.test(params.email))
        errors.push("Invalid email format.");
      if (errors.length > 0) {
        throw new ErrorHandler(400, errors);
      }

      // Validate Data
      criteria = {
        where: {
          $or: [{ email: params.email }, { username: params.username }],
        },
      };
      data = await Model.Users.findAll(criteria);
      if (!_.isEmpty(data[0])) {
        errors.push("Data already exist.");
        throw new ErrorHandler(500, errors);
      }

      // Pre-setting variables
      initialValues = _.pick(params, [
        "email",
        "username",
        "password",
        "role_id",
        "created_at",
      ]);
      let finalData = await Model.Users.create(initialValues);

      handleSuccess(res, {
        statusCode: 201,
        message: "Successfully created data.",
        result: _.omit(finalData.get({ plain: true }), [
          "password",
          "is_deleted",
        ]),
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Update
   * @route PUT /users/update/:id
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
      data = await Model.Users.findByPk(req.params.id);
      if (_.isEmpty(data)) {
        errors.push("Data doesn't exist.");
        throw new ErrorHandler(500, errors);
        y;
      }

      // Pre-setting variables
      initialValues = _.pick(params, [
        "email",
        "username",
        "role_id",
        "updated_at",
      ]);
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
   * @route PUT /users/delete/:id
   */
  delete: async (req, res, next) => {
    let errors = [],data;

    try {
      // Validate Data
      data = await Model.Users.findByPk(req.params.id);
      if (_.isEmpty(data)) {
        errors.push("Data doesn't exist.");
        throw new ErrorHandler(500, errors);
      }
      let finalData = await data.update({ is_deleted: YES });

      handleSuccess(res, {
        statusCode: 200,
        message: "Successfully deleted an account.",
        result: finalData,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Change Password
   * @route PUT /users/changePassword/:id
   */
  changePassword: async (req, res, next) => {
    const params = req.body;
    let errors = [],
      initialValues,
      data,
      compareOldPassword,
      compareNewPassword;

    try {
      // Validators
      if (_.isEmpty(params)) {
        errors.push("Invalid Parameter.");
        throw new ErrorHandler(400, errors);
      }
      if (_.isEmpty(params.old_password))
        errors.push("Old Password is required.");
      if (_.isEmpty(params.new_password))
        errors.push("New Password is required.");
      if (errors.length > 0) {
        throw new ErrorHandler(400, errors);
      }

      // Override variables
      params.updated_at = moment().utc(8).format("YYYY-MM-DD HH:mm:ss");
      params.password = params.new_password;

      // Validate Data
      data = await Model.Users.findByPk(req.params.id);
      if (_.isEmpty(data)) {
        errors.push("Data doesn't exist.");
        throw new ErrorHandler(500, errors);
      }

      // Validate Old Password
      compareOldPassword = await bcrypt.comparePassword(
        params.old_password,
        data.password
      );
      if (!compareOldPassword) {
        errors.push("Old password is incorrect.");
        throw new ErrorHandler(500, errors);
      }

      // Validate New Password
      compareNewPassword = await bcrypt.comparePassword(
        params.new_password,
        data.password
      );
      if (compareNewPassword) {
        errors.push("New password cannot be the same as your old password.");
        throw new ErrorHandler(500, errors);
      }

      // Pre-setting variables
      initialValues = _.pick(params, ["password", "updated_at"]);
      initialValues.password = await bcrypt.hashPassword(
        initialValues.password
      );
      await data.update(initialValues);

      handleSuccess(res, {
        statusCode: 200,
        message: "Successfully changed password.",
        result: [],
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Find all
   * @route GET /users
   */
  findAll: async (req, res, next) => {
    let errors = [],data, criteria;

    try {
      // Validate Data
      criteria = {
        attributes: ['email', 'username', 'role_id', 'created_at', 'updated_at', 'permission_type', 'is_logged', 'is_active'],
        where: { is_deleted: NO },
        include: [{ model: Model.Roles, as: "roles" }],
      };
      data = await Model.Users.findAll(criteria);
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
   * @route GET /users/:id
   */
  findById: async (req, res, next) => {
    let errors = [],data, criteria;

    try {
      // Validate Data
      criteria = { include: [{ model: Model.Roles, as: "roles" }] };
      data = await Model.Users.findByPk(req.params.id, criteria);
      if (_.isEmpty(data)) {
        errors.push("No data found.");
        throw new ErrorHandler(500, errors);
      }

      handleSuccess(res, {
        statusCode: 200,
        message: "Successfully find data.",
        result: _.omit(data.get({ plain: true }), ["password", "is_deleted"]),
      });
    } catch (err) {
      next(err);
    }
  },
};
