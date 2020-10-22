const Model = require("../models");
const { ErrorHandler, handleSuccess } = require("../helpers/response-helper");
const jwt = require("../helpers/jwt-helper");
const bcrypt = require("../helpers/bcrypt-helper");
const {
  NO,
  YES,
  CUSTOMER_STATUS_APPROVED,
  CUSTOMER_STATUS_DECLINED,
  CUSTOMER_STATUS_PENDING,
} = require("../helpers/constant-helper");

module.exports = {
  /**
   * Login
   * @routes POST /users/login
   */
  login: async (req, res, next) => {
    let ip = req.headers["x-forwarded-for"] || req.ip;
    let params = req.body;
    let errors = [],
      message = "User successfully signed in.",
      criteria,
      data,
      token;

    try {
      // Validators
      if (_.isEmpty(params)) {
        errors.push("Invalid Parameter.");
        throw new ErrorHandler(400, errors);
      }
      if (_.isEmpty(params.username)) errors.push("Username is required.");
      if (_.isEmpty(params.password)) errors.push("Password is required.");
      if (errors.length > 0) {
        throw new ErrorHandler(400, errors);
      }

      // Validate Account
      criteria = { where: { username: params.username } };
      user = await Model.Users.findAll(criteria);
      if (_.isEmpty(user[0])) {
        errors.push("Data doesn't exist.");
        throw new ErrorHandler(404, errors);
      }

      // Validate Password
      let userInfo = user[0].get({ plain: true });
      let passwordCompare = await bcrypt.comparePassword(
        params.password,
        userInfo.password
      );
      if (!passwordCompare) {
        errors.push("Invalid Password.");
        throw new ErrorHandler(400, errors);
      }

      // Update login status
      let updatedUser = await user[0].update({ is_logged: YES });
      data = updatedUser.get({ plain: true });
      token = await jwt.generateToken({ id: data.id, type: "user" });
      console.log(
        "AuthController@login - [ID]:%s [User]:%s [IP]%s",
        updatedUser.id,
        updatedUser.username,
        ip
      );

      handleSuccess(res, {
        statusCode: 200,
        message: message,
        result: {
          token: token,
          data: _.omit(data, [
            "password",
            "created_at",
            "updated_at",
            "permission_type",
            "is_logged",
            "is_active",
            "is_deleted",
          ]),
        },
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Logout
   * @routes POST /users/logout
   */
  logout: async (req, res, next) => {
    let ip = req.headers["x-forwarded-for"] || req.ip;
    let params = req.body;
    let errors = [],
      message = "Successfully signed out.",
      token = params.token;

    try {
      // Validators
      if (_.isEmpty(params)) {
        errors.push("Invalid Parameter.");
        throw new ErrorHandler(400, errors);
      }

      if (_.isEmpty(token)) {
        errors.push("Token is required.");
        throw new ErrorHandler(400, errors);
      }

      let tokenData = await jwt.verifyToken(token);
      if (_.isNull(tokenData)) {
        errors.push("Invalid Token.");
        throw new ErrorHandler(400, errors);
      }

      let user = await Model.Users.findByPk(tokenData.id);
      let updatedUser = await user.update({ is_logged: NO });
      console.log(
        "AuthController@logout - [ID]:%s [User]:%s [IP]%s",
        updatedUser.id,
        updatedUser.username,
        ip
      );

      handleSuccess(res, {
        statusCode: 200,
        message: message,
        result: [],
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Customer Login
   * @routes POST /customers/login
   */
  customerLogin: async (req, res, next) => {
    let ip = req.headers["x-forwarded-for"] || req.ip;
    let params = req.body;
    let errors = [],
      message = "Customer successfully signed in.",
      criteria,
      data,
      token;

    try {
      // Validators
      if (_.isEmpty(params)) {
        errors.push("Invalid Parameter.");
        throw new ErrorHandler(400, errors);
      }
      if (_.isEmpty(params.email)) errors.push("Email is required.");
      if (_.isEmpty(params.password)) errors.push("Password is required.");
      if (errors.length > 0) {
        throw new ErrorHandler(400, errors);
      }

      // Validate Account
      criteria = { where: { email: params.email, is_deleted: NO } };
      customer = await Model.Customers.findAll(criteria);
      if (_.isEmpty(customer[0])) {
        errors.push("Data doesn't exist.");
        throw new ErrorHandler(404, errors);
      }

      // Validate Password
      let customerInfo = customer[0].get({ plain: true });
      let passwordCompare = await bcrypt.comparePassword(
        params.password,
        customerInfo.password
      );
      if (!passwordCompare) {
        errors.push("Invalid Password.");
        throw new ErrorHandler(400, errors);
      }

      if (
        customerInfo.status === CUSTOMER_STATUS_APPROVED &&
        customerInfo.is_active === YES
      ) {
        // Update login status
        let updatedCustomer = await customer[0].update({ is_logged: YES });
        data = updatedCustomer.get({ plain: true });
        token = await jwt.generateToken({ id: data.id, type: "customer" });
        console.log(
          "AuthController@customerLogin - [ID]:%s [Customer]:%s [IP]%s",
          updatedCustomer.id,
          updatedCustomer.email,
          ip
        );

        handleSuccess(res, {
          statusCode: 200,
          message: message,
          result: {
            token: token,
            data: _.omit(data, [
              "password",
              "created_at",
              "updated_at",
              "status",
              "is_logged",
              "is_active",
              "is_deleted",
            ]),
          },
        });
      } else if (customerInfo.is_active === NO) {
        errors.push(
          "Your account is inactive, please contact administration to activate your account."
        );
        throw new ErrorHandler(401, errors);
      } else {
        errors.push("Your account is not yet activated.");
        throw new ErrorHandler(401, errors);
      }
    } catch (err) {
      next(err);
    }
  },

  /**
   * Customer Logout
   * @routes POST /customers/logout
   */
  customerlogout: async (req, res, next) => {
    let ip = req.headers["x-forwarded-for"] || req.ip;
    let params = req.body;
    let errors = [],
      message = "Successfully signed out.",
      token = params.token;

    try {
      // Validators
      if (_.isEmpty(params)) {
        errors.push("Invalid Parameter.");
        throw new ErrorHandler(400, errors);
      }

      if (_.isEmpty(token)) {
        errors.push("Token is required.");
        throw new ErrorHandler(400, errors);
      }

      let tokenData = await jwt.verifyToken(token);
      if (_.isNull(tokenData)) {
        errors.push("Invalid Token.");
        throw new ErrorHandler(400, errors);
      }

      let customer = await Model.Customers.findByPk(tokenData.id);
      let updatedCustomer = await customer.update({ is_logged: NO });
      console.log(
        "AuthController@customerlogout - [ID]:%s [Customer]:%s [IP]%s",
        updatedCustomer.id,
        updatedCustomer.email,
        ip
      );

      handleSuccess(res, {
        statusCode: 200,
        message: message,
        result: [],
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Validate Token
   * @routes POST /authorizations/validateToken
   */
  validateToken: async (req, res, next) => {
    let params = req.body;
    let errors = [],
      message = "Token Exist.",
      token = params.token;

    try {
      // Validators
      if (_.isEmpty(params)) {
        errors.push("Invalid Parameter.");
        throw new ErrorHandler(400, errors);
      }

      if (_.isEmpty(token)) {
        errors.push("Token is required.");
        throw new ErrorHandler(400, errors);
      }

      let tokenData = await jwt.verifyToken(token);
      if (_.isNull(tokenData)) {
        errors.push("Invalid Token.");
        throw new ErrorHandler(400, errors);
      }

      handleSuccess(res, {
        statusCode: 200,
        message: message,
        result: [],
      });
    } catch (err) {
      next(err);
    }
  },

  authorization: (req, res, next) => {
    if (req.user) {
      next();
    } else {
      throw new ErrorHandler(401, []);
    }
  },
};
