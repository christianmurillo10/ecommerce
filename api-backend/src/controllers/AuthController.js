const Model = require("../models");
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
  login: async (req, res) => {
    let ip = req.headers["x-forwarded-for"] || req.ip;
    let params = req.body;
    let statusCode = 200,
      errors = [],
      criteria,
      data,
      token;

    try {
      // Validators
      if (_.isEmpty(params)) {
        statusCode = 400;
        errors.push("Please check your input.");
        throw new Error("Bad Request");
      }
      if (_.isEmpty(params.username)) errors.push("Username is required.");
      if (_.isEmpty(params.password)) errors.push("Password is required.");
      if (errors.length > 0) {
        statusCode = 400;
        throw new Error("Bad Request");
      }

      // Validate Account
      criteria = { where: { username: params.username } };
      user = await Model.Users.findAll(criteria);
      if (_.isEmpty(user[0])) {
        statusCode = 400;
        errors.push("Invalid Username.");
        throw new Error("Bad Request");
      }

      // Validate Password
      let userInfo = user[0].get({ plain: true });
      let passwordCompare = await bcrypt.comparePassword(
        params.password,
        userInfo.password
      );
      if (!passwordCompare) {
        statusCode = 400;
        errors.push("Invalid Password.");
        throw new Error("Bad Request");
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

      res.status(statusCode).send({
        message: "User successfully signed in.",
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
      res.status(statusCode).send({
        message: err.message.toString(),
        errors: errors,
      });
    }
  },

  /**
   * Logout
   * @routes POST /users/logout
   */
  logout: async (req, res) => {
    let ip = req.headers["x-forwarded-for"] || req.ip;
    let params = req.body;
    let statusCode = 200,
      errors = [],
      token = params.token;

    try {
      // Validators
      if (_.isEmpty(params)) {
        statusCode = 400;
        errors.push("Please check your input.");
        throw new Error("Bad Request");
      }

      if (_.isEmpty(token)) {
        statusCode = 400;
        errors.push("Token is required.");
        throw new Error("Bad Request");
      }

      let tokenData = await jwt.verifyToken(token);
      if (_.isNull(tokenData)) {
        statusCode = 400;
        errors.push("Invalid Token.");
        throw new Error("Bad Request");
      }

      let user = await Model.Users.findByPk(tokenData.id);
      let updatedUser = await user.update({ is_logged: NO });
      console.log(
        "AuthController@logout - [ID]:%s [User]:%s [IP]%s",
        updatedUser.id,
        updatedUser.username,
        ip
      );

      res.status(statusCode).send({
        message: "Successfully signed out.",
        result: [],
      });
    } catch (err) {
      res.status(statusCode).send({
        message: err.message.toString(),
        errors: errors,
      });
    }
  },

  /**
   * Customer Login
   * @routes POST /customers/login
   */
  customerLogin: async (req, res) => {
    let ip = req.headers["x-forwarded-for"] || req.ip;
    let params = req.body;
    let statusCode = 200,
      errors = [],
      criteria,
      data,
      token;

    try {
      // Validators
      if (_.isEmpty(params)) {
        statusCode = 400;
        errors.push("Please check your input.");
        throw new Error("Bad Request");
      }
      if (_.isEmpty(params.email)) errors.push("Email is required.");
      if (_.isEmpty(params.password)) errors.push("Password is required.");
      if (errors.length > 0) {
        statusCode = 400;
        throw new Error("Bad Request");
      }

      // Validate Account
      criteria = { where: { email: params.email, is_deleted: NO } };
      customer = await Model.Customers.findAll(criteria);
      if (_.isEmpty(customer[0])) {
        statusCode = 400;
        errors.push("Invalid Email.");
        throw new Error("Bad Request");
      }

      // Validate Password
      let customerInfo = customer[0].get({ plain: true });
      let passwordCompare = await bcrypt.comparePassword(
        params.password,
        customerInfo.password
      );
      if (!passwordCompare) {
        statusCode = 400;
        errors.push("Invalid Password.");
        throw new Error("Bad Request");
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

        res.status(statusCode).send({
          message: "Customer successfully signed in.",
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
        statusCode = 500;
        errors.push(
          "Your account is inactive, please contact administration to activate your account."
        );
        throw new Error("Something Went Wrong");
      } else {
        statusCode = 500;
        errors.push("Your account is not yet activated.");
        throw new Error("Something Went Wrong");
      }
    } catch (err) {
      res.status(statusCode).send({
        message: err.message.toString(),
        errors: errors,
      });
    }
  },

  /**
   * Customer Logout
   * @routes POST /customers/logout
   */
  customerlogout: async (req, res) => {
    let ip = req.headers["x-forwarded-for"] || req.ip;
    let params = req.body;
    let statusCode = 200,
      errors = [],
      token = params.token;

    try {
      // Validators
      if (_.isEmpty(params)) {
        statusCode = 400;
        errors.push("Please check your input.");
        throw new Error("Bad Request");
      }

      if (_.isEmpty(token)) {
        statusCode = 400;
        errors.push("Token is required.");
        throw new Error("Bad Request");
      }

      let tokenData = await jwt.verifyToken(token);
      if (_.isNull(tokenData)) {
        statusCode = 400;
        errors.push("Invalid Token.");
        throw new Error("Bad Request");
      }

      let customer = await Model.Customers.findByPk(tokenData.id);
      let updatedCustomer = await customer.update({ is_logged: NO });
      console.log(
        "AuthController@customerlogout - [ID]:%s [Customer]:%s [IP]%s",
        updatedCustomer.id,
        updatedCustomer.email,
        ip
      );

      res.status(statusCode).send({
        message: "Successfully signed out.",
        result: [],
      });
    } catch (err) {
      res.status(statusCode).send({
        message: err.message.toString(),
        errors: errors,
      });
    }
  },

  /**
   * Validate Token
   * @routes POST /authorizations/validateToken
   */
  validateToken: async (req, res) => {
    let params = req.body;
    let statusCode = 200,
      errors = [],
      token = params.token;

    try {
      // Validators
      if (_.isEmpty(params)) {
        statusCode = 400;
        errors.push("Please check your input.");
        throw new Error("Bad Request");
      }

      if (_.isEmpty(token)) {
        statusCode = 400;
        errors.push("Token is required.");
        throw new Error("Bad Request");
      }

      let tokenData = await jwt.verifyToken(token);
      if (_.isNull(tokenData)) {
        statusCode = 400;
        errors.push("Invalid Token.");
        throw new Error("Bad Request");
      }
      
      res.status(statusCode).send({
        message: "Token Exist.",
        result: [],
      });
    } catch (err) {
      res.status(statusCode).send({
        message: err.message.toString(),
        errors: errors,
      });
    }
  },

  authorization: (req, res, next) => {
    if (req.user) {
      next();
    } else {
      return res.status(401).json({
        message: "Unauthorized",
        errors: [],
      });
    }
  },
};
