const Model = require('../models');
const jwt = require('../helpers/jwt-helper');
const bcrypt = require('../helpers/bcrypt-helper');

module.exports = {
  /**
   * Login Accounts
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
    if (_.isUndefined(params.username)) return res.badRequest("Invalid Credentials.");

    try {
      // Validators
      if (_.isEmpty(params.username)) return cb(null, { error: true, message: "Username is required." });
      if (_.isEmpty(params.password)) return cb(null, { error: true, message: "Password is required." });

      // Pre-setting variables
      criteria = { where: { username: params.username } };
      // Execute findAll query
      user = await Model.Users.findAll(criteria);
      // Account checker
      if (!_.isEmpty(user[0])) {
        let userInfo = user[0].get({ plain: true });
        let passwordCompare = await bcrypt.comparePassword(params.password, userInfo.password);
        if (passwordCompare) {
          // Update login status
          let updatedUser = await user[0].update({ is_logged: 1 });
          data = updatedUser.get({ plain: true });
          token = await jwt.generateToken(data.id);
          console.log("AuthController@login - [ID]:%s [User]:%s [IP]%s", updatedUser.id, updatedUser.username, ip);

          res.json({
            status: 200,
            message: "User successfully signed in.",
            result: {
              token: token,
              data: data
            }
          });
        } else {
          res.json({
            status: 200,
            message: "Invalid Password.",
            result: false
          });
        }
      } else {
        res.json({
          status: 200,
          message: "Invalid Username.",
          result: false
        });
      }
    } catch (err) {
      res.json({
        status: 401,
        err: err,
        message: "Failed to signin account."
      });
    }
  },

  /**
   * Logout Accounts
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
            result: false
          });
        }

        let user = await Model.Users.findByPk(tokenData.id);
        // Update login status
        let updatedUser = await user.update({ is_logged: 0 });
        console.log("AuthController@logout - [ID]:%s [User]:%s [IP]%s", updatedUser.id, updatedUser.username, ip);

        res.json({
          status: 200,
          message: "Successfully signed out.",
          result: true
        });
      }
    } catch (err) {
      res.json({
        status: 401,
        err: err,
        message: "Failed to signout account."
      });
    }
  },

  /**
   * Validate Token
   * @param req
   * @param res
   * @returns {Promise<void>}
   * @routes POST /users/validateToken
   */
  validateToken: async (req, res) => {
    // let ip = req.headers["x-forwarded-for"] || req.ip;
    var token = req.body.token; // Value needs to be changed, so keep it to `var`

    try {
      if (token) {
        let tokenData = await jwt.verifyToken(token);
        if (tokenData.id !== null) {
          res.json({
            status: 200,
            message: "Token Exist.",
            result: false
          });
        } else {
          // let user = await Model.Users.findByPk(tokenData.id);
          // Update login status
          // let updatedUser = await user.update({ is_logged: 0 });
          // console.log("AuthController@validateToken - [ID]:%s [User]:%s [IP]%s", updatedUser.id, updatedUser.username, ip);
  
          res.json({
            status: 200,
            message: "Token Already Expired.",
            result: true
          });
        }
      }
    } catch (err) {
      res.json({
        status: 401,
        err: err,
        message: "Failed to signout account."
      });
    }
  },

  authorization: (req, res, next) => {
    if (req.user) {
      next();
    } else {
      return res.status(401).json({ message: 'Unauthorized user!' });
    }
  },
};