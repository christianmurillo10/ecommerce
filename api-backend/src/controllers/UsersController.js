const Model = require('../models');

module.exports = {
  /**
   * Create user
   * @param req
   * @param res
   * @returns {Promise<void>}
   * @routes POST /user/create
   */
  create: async (req, res) => {
    const params = req.body;
    const usernameChecker = /^[-\w ]+$/;
    const emailChecker = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let criteria, initialValues, data;

    // Validators
    if (_.isUndefined(params))
      return res.badRequest({ err: "Invalid Parameter: [params]" });
    if (_.isEmpty(params))
      return res.badRequest({ err: "Empty Parameter: [params]" });

    // Override variables
    params.created_at = moment().utc(8).format('YYYY-MM-DD HH:mm:ss');
    params.role_id = _.isUndefined(params.role_id) ? 1 : params.role_id;

    try {
      // Validators
      if (_.isEmpty(params.username)) return res.json({ status: 200, message: "Username is required.", result: false });
      if (_.isEmpty(params.password)) return res.json({ status: 200, message: "Password is required.", result: false });
      if (_.isEmpty(params.email)) return res.json({ status: 200, message: "Email is required.", result: false });
      if (params.username.length > 30) return res.json({ status: 200, message: "Username exceed 30 characters.", result: false });
      if (params.username.length < 6) return res.json({ status: 200, message: "The username must be at least 6 characters.", result: false });
      if (!usernameChecker.test(params.username)) return res.json({ status: 200, message: "Invalid username format.", result: false });
      if (!emailChecker.test(params.email)) return res.json({ status: 200, message: "Invalid email format.", result: false });

      // Pre-setting variables
      criteria = { where: { $or: [{ email: params.email }, { username: params.username }] } };
      initialValues = _.pick(params, ['email', 'username', 'password', 'role_id', 'created_at']);
      // Execute findAll query
      data = await Model.Users.findAll(criteria);
      if (_.isEmpty(data[0])) {
        let finalData = await Model.Users.create(initialValues);
        res.json({
          status: 200,
          message: "Successfully created an account.",
          result: _.omit(finalData.get({ plain: true }), ['password', 'is_deleted'])
        });
      } else {
        res.json({
          status: 200,
          message: "User already exist.",
          result: false
        });
      }
    } catch (err) {
      res.json({
        status: 401,
        err: err,
        message: "Failed creating an account."
      });
    }
  },

  /**
   * Update user
   * @route PUT /user/update/:id
   * @param req
   * @param res
   * @returns {never}
   */
  update: async (req, res) => {
    const params = req.body;
    let initialValues, data;

    if (_.isUndefined(params))
      return res.badRequest({ err: "Invalid Parameter: [params]" });
    if (_.isEmpty(params))
      return res.badRequest({ err: "Empty Parameter: [params]" });

    try {
      // Pre-setting variables
      initialValues = _.pick(params, ['email', 'username', 'password', 'role_id']);
      // Execute findByPk query
      data = await Model.Users.findByPk(req.params.id);
      if (!_.isEmpty(data)) {
        let finalData = await data.update(initialValues);
        res.json({
          status: 200,
          message: "Successfully updated an account.",
          result: finalData
        });
      } else {
        res.json({
          status: 200,
          message: "User doesn't exist.",
          result: false
        });
      }
    } catch (err) {
      res.json({
        status: 401,
        err: err,
        message: "Failed updating an account."
      });
    }
  },

  /**
   * Delete user
   * @route PUT /user/delete/:id
   * @param req
   * @param res
   * @returns {never}
   */
  delete: async (req, res) => {
    let data;

    try {
      // Execute findByPk query
      data = await Model.Users.findByPk(req.params.id);
      if (!_.isEmpty(data)) {
        let finalData = await data.update({ is_deleted: 1 });
        res.json({
          status: 200,
          message: "Successfully deleted an account.",
          result: finalData
        });
      } else {
        res.json({
          status: 200,
          message: "User doesn't exist.",
          result: false
        });
      }
    } catch (err) {
      res.json({
        status: 401,
        err: err,
        message: "Failed deleting an account."
      });
    }
  },

  /**
   * Search users
   * @route POST /user/search/:value
   * @param req
   * @param res
   * @returns {never}
   */
  search: async (req, res) => {
    const params = req.params;
    let query, data;

    if (_.isUndefined(params))
      return res.badRequest({ err: "Invalid Parameter: [params]" });
    if (_.isEmpty(params))
      return res.badRequest({ err: "Empty Parameter: [params]" });

    try {
      // Pre-setting variables
      query = `SELECT id, email, username, role_id, created_at, updated_at, permission_type, is_logged, is_active FROM users WHERE CONCAT(email, username) LIKE ? AND is_deleted = 0;`;
      // Execute native query
      data = await Model.sequelize.query(query, {
        replacements: [`%${params.value}%`],
        type: Model.sequelize.QueryTypes.SELECT
      });
      if (!_.isEmpty(data)) {
        res.json({
          status: 200,
          message: "Successfully searched data.",
          result: data
        });
      } else {
        res.json({
          status: 200,
          message: "No Data Found.",
          result: false
        });
      }
    } catch (err) {
      res.json({
        status: 401,
        err: err,
        message: "Failed to search data."
      });
    }
  },

  /**
   * Find all users
   * @route GET /user
   * @param req
   * @param res
   * @returns {never}
   */
  findAll: async (req, res) => {
    let data, criteria;

    try {
      // Pre-setting variables
      criteria = { where: { is_deleted: 0 }, include: [{ model: Model.Roles, as: 'roles' }] };
      // Execute findAll query
      data = await Model.Users.findAll(criteria);
      if (!_.isEmpty(data[0])) {
        res.json({
          status: 200,
          message: "Successfully find all data.",
          result: data
        });
      } else {
        res.json({
          status: 200,
          message: "No Data Found.",
          result: false
        });
      }
    } catch (err) {
      res.json({
        status: 401,
        err: err,
        message: "Failed to find all data."
      });
    }
  },

  /**
   * Find user by id
   * @route GET /user/:id
   * @param req
   * @param res
   * @returns {never}
   */
  findById: async (req, res) => {
    let data, criteria;

    try {
      // Pre-setting variables
      criteria = { include: [{ model: Model.Roles, as: 'roles' }] };
      // Execute findAll query
      data = await Model.Users.findByPk(req.params.id, criteria);
      if (!_.isEmpty(data)) {
        res.json({
          status: 200,
          message: "Successfully find data.",
          result: _.omit(data.get({ plain: true }), ['password', 'is_deleted'])
        });
      } else {
        res.json({
          status: 200,
          message: "No Data Found.",
          result: false
        });
      }
    } catch (err) {
      res.json({
        status: 401,
        err: err,
        message: "Failed to find data."
      });
    }
  },
};