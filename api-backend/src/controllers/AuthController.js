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
   * Login Account
   * @param req
   * @param res
   * @routes POST /users/login
   * @returns {never}
   */
  login: async (req, res) => {
    let ip = req.headers["x-forwarded-for"] || req.ip;
    let params = req.body;
    let criteria, data, token;

    // Validators
    if (_.isUndefined(params.username))
      return res.badRequest("Invalid Credentials.");

    try {
      // Validators
      if (_.isEmpty(params.username))
        return cb(null, { error: true, message: "Username is required." });
      if (_.isEmpty(params.password))
        return cb(null, { error: true, message: "Password is required." });

      // Pre-setting variables
      criteria = { where: { username: params.username } };
      // Execute findAll query
      user = await Model.Users.findAll(criteria);
      // Account checker
      if (!_.isEmpty(user[0])) {
        let userInfo = user[0].get({ plain: true });
        let passwordCompare = await bcrypt.comparePassword(
          params.password,
          userInfo.password
        );
        if (passwordCompare) {
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

          res.json({
            status: 200,
            message: "User successfully signed in.",
            result: {
              token: token,
              data: data,
            },
          });
        } else {
          res.json({
            status: 200,
            message: "Invalid Password.",
            result: false,
          });
        }
      } else {
        res.json({
          status: 200,
          message: "Invalid Username.",
          result: false,
        });
      }
    } catch (err) {
      res.json({
        status: 401,
        err: err,
        message: "Failed to signin account.",
      });
    }
  },

  /**
   * Logout Account
   * @param req
   * @param res
   * @returns {Promise<void>}
   * @routes POST /users/logout
   */
  logout: async (req, res) => {
    let ip = req.headers["x-forwarded-for"] || req.ip;
    var token = req.body.token; // Value needs to be changed, so keep it to `var`

    try {
      if (token) {
        let tokenData = await jwt.verifyToken(token);
        if (!tokenData) {
          res.json({
            status: 200,
            message: "Already logged out.",
            result: false,
          });
        }

        let user = await Model.Users.findByPk(tokenData.id);
        // Update login status
        let updatedUser = await user.update({ is_logged: NO });
        console.log(
          "AuthController@logout - [ID]:%s [User]:%s [IP]%s",
          updatedUser.id,
          updatedUser.username,
          ip
        );

        res.json({
          status: 200,
          message: "Successfully signed out.",
          result: true,
        });
      }
    } catch (err) {
      res.json({
        status: 401,
        err: err,
        message: "Failed to signout account.",
      });
    }
  },

  /**
   * Customer Login Account
   * @param req
   * @param res
   * @routes POST /customers/login
   * @returns {never}
   */
  customerLogin: async (req, res) => {
    let ip = req.headers["x-forwarded-for"] || req.ip;
    let params = req.body;
    let criteria, data, token;

    // Validators
    if (_.isUndefined(params.email))
      return res.badRequest("Invalid Credentials.");

    try {
      // Validators
      if (_.isEmpty(params.email))
        return cb(null, { error: true, message: "Email is required." });
      if (_.isEmpty(params.password))
        return cb(null, { error: true, message: "Password is required." });

      // Pre-setting variables
      criteria = { where: { email: params.email, is_deleted: NO } };
      // Execute findAll query
      customer = await Model.Customers.findAll(criteria);
      // Account checker
      if (!_.isEmpty(customer[0])) {
        let customerInfo = customer[0].get({ plain: true });
        let passwordCompare = await bcrypt.comparePassword(
          params.password,
          customerInfo.password
        );
        if (passwordCompare) {
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

            res.json({
              status: 200,
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
            res.json({
              status: 200,
              message:
                "Your account is inactive, please contact administration to activate your account.",
              result: false,
            });
          } else {
            res.json({
              status: 200,
              message: "Your account is not yet activated.",
              result: false,
            });
          }
        } else {
          res.json({
            status: 200,
            message: "Invalid Password.",
            result: false,
          });
        }
      } else {
        res.json({
          status: 200,
          message: "Invalid Email.",
          result: false,
        });
      }
    } catch (err) {
      res.json({
        status: 401,
        err: err,
        message: "Failed to sign in account.",
      });
    }
  },

  /**
   * Customer Logout Account
   * @param req
   * @param res
   * @returns {Promise<void>}
   * @routes POST /customers/logout
   */
  customerlogout: async (req, res) => {
    let ip = req.headers["x-forwarded-for"] || req.ip;
    var token = req.body.token; // Value needs to be changed, so keep it to `var`

    try {
      if (token) {
        let tokenData = await jwt.verifyToken(token);
        if (!tokenData) {
          res.json({
            status: 200,
            message: "Already logged out.",
            result: false,
          });
        }

        let customer = await Model.Customers.findByPk(tokenData.id);
        // Update login status
        let updatedCustomer = await customer.update({ is_logged: NO });
        console.log(
          "AuthController@customerlogout - [ID]:%s [Customer]:%s [IP]%s",
          updatedCustomer.id,
          updatedCustomer.email,
          ip
        );

        res.json({
          status: 200,
          message: "Successfully signed out.",
          result: true,
        });
      }
    } catch (err) {
      res.json({
        status: 401,
        err: err,
        message: "Failed to sign out account.",
      });
    }
  },

  /**
   * Validate Token
   * @param req
   * @param res
   * @returns {Promise<void>}
   * @routes POST /authorizations/validateToken
   */
  validateToken: async (req, res) => {
    // let ip = req.headers["x-forwarded-for"] || req.ip;
    var token = req.body.token; // Value needs to be changed, so keep it to `var`

    try {
      if (token) {
        let tokenData = await jwt.verifyToken(token);
        if (tokenData) {
          res.json({
            status: 200,
            message: "Token Exist.",
            result: true,
          });
        } else {
          res.json({
            status: 200,
            message: "Token Already Expired.",
            result: false,
          });
        }
      } else {
        res.json({
          status: 200,
          message: "Token Not Exist.",
          result: false,
        });
      }
    } catch (err) {
      res.json({
        status: 401,
        err: err,
        message: "Failed to signout account.",
      });
    }
  },

  authorization: (req, res, next) => {
    if (req.user) {
      next();
    } else {
      return res.status(401).json({ message: "Unauthorized user!" });
    }
  },
};
