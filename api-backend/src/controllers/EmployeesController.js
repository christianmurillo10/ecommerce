const Model = require('../models');
const path = require('path');

module.exports = {
  /**
   * Create
   * @param req
   * @param res
   * @returns {Promise<void>}
   * @routes POST /employees/create
   */
  create: async (req, res) => {
    const params = req.body;
    let criteria, initialValues, data;

    // Validators
    if (_.isUndefined(params))
      return res.badRequest({ err: "Invalid Parameter: [params]" });
    if (_.isEmpty(params))
      return res.badRequest({ err: "Empty Parameter: [params]" });

    // Override variables
    params.created_at = moment().utc(8).format('YYYY-MM-DD HH:mm:ss');
    params.gender_type = params.gender_type === null ? null : params.gender_type.toLocaleString();
    params.employee_no = await generateEmployeeNo();

    try {
      // Validators
      if (_.isEmpty(params.firstname)) return res.json({ status: 200, message: "Firstname required.", result: false });
      if (_.isEmpty(params.lastname)) return res.json({ status: 200, message: "Lastname required.", result: false });
      if (_.isEmpty(params.email)) return res.json({ status: 200, message: "Email required.", result: false });
      if (_.isEmpty(params.primary_address)) return res.json({ status: 200, message: "Primary Address required.", result: false });
      if (_.isEmpty(params.contact_no)) return res.json({ status: 200, message: "Contact No. required.", result: false });
      if (_.isEmpty(params.date_hired)) return res.json({ status: 200, message: "Date Hired required.", result: false });

      // Pre-setting variables
      criteria = { where: { email: params.email } };
      initialValues = _.pick(params, [
        'employee_no', 
        'firstname', 
        'middlename', 
        'lastname', 
        'email', 
        'primary_address', 
        'secondary_address', 
        'contact_no', 
        'date_hired', 
        'gender_type', 
        'created_at'
      ]);
      // Execute findAll query
      data = await Model.Employees.findAll(criteria);
      if (_.isEmpty(data[0])) {
        let finalData = await Model.Employees.create(initialValues);
        res.json({
          status: 200,
          message: "Successfully created data.",
          result: _.omit(finalData.get({ plain: true }), ['is_deleted'])
        });
      } else {
        res.json({
          status: 200,
          message: "Data already exist.",
          result: false
        });
      }
    } catch (err) {
      res.json({
        status: 401,
        err: err,
        message: "Failed creating data."
      });
    }
  },

  /**
   * Update
   * @route PUT /employees/update/:id
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

    // Override variables
    params.updated_at = moment().utc(8).format('YYYY-MM-DD HH:mm:ss');

    try {
      // Pre-setting variables
      initialValues = _.pick(params, [
        'employee_no', 
        'firstname', 
        'middlename', 
        'lastname', 
        'email', 
        'primary_address', 
        'secondary_address', 
        'contact_no', 
        'date_hired', 
        'date_endo', 
        'gender_type', 
        'updated_at',
        'is_active'
      ]);
      // Execute findByPk query
      data = await Model.Employees.findByPk(req.params.id);
      if (!_.isEmpty(data)) {
        let finalData = await data.update(initialValues);
        res.json({
          status: 200,
          message: "Successfully updated data.",
          result: _.omit(finalData.get({ plain: true }), ['is_deleted'])
        });
      } else {
        res.json({
          status: 200,
          message: "Data doesn't exist.",
          result: false
        });
      }
    } catch (err) {
      res.json({
        status: 401,
        err: err,
        message: "Failed updating data."
      });
    }
  },

  /**
   * Delete
   * @route PUT /employees/delete/:id
   * @param req
   * @param res
   * @returns {never}
   */
  delete: async (req, res) => {
    let data;

    try {
      // Execute findByPk query
      data = await Model.Employees.findByPk(req.params.id);
      if (!_.isEmpty(data)) {
        let finalData = await data.update({ is_deleted: 1 });
        res.json({
          status: 200,
          message: "Successfully deleted data.",
          result: finalData
        });
      } else {
        res.json({
          status: 200,
          message: "Data doesn't exist.",
          result: false
        });
      }
    } catch (err) {
      res.json({
        status: 401,
        err: err,
        message: "Failed deleting data."
      });
    }
  },

  /**
   * Search
   * @route POST /employees/search/:value
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
      query = `SELECT * FROM employees WHERE CONCAT(employee_no) LIKE ? AND is_deleted = 0;`;
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
   * Find all
   * @route GET /employees
   * @param req
   * @param res
   * @returns {never}
   */
  findAll: async (req, res) => {
    let data, criteria;

    try {
      // Pre-setting variables
      criteria = { where: { is_deleted: 0 } };
      // Execute findAll query
      data = await Model.Employees.findAll(criteria);
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
   * Find by id
   * @route GET /employees/:id
   * @param req
   * @param res
   * @returns {never}
   */
  findById: async (req, res) => {
    let data;

    try {
      // Execute findAll query
      data = await Model.Employees.findByPk(req.params.id);
      if (!_.isEmpty(data)) {
        res.json({
          status: 200,
          message: "Successfully find data.",
          result: _.omit(data.get({ plain: true }), ['is_deleted'])
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

  /**
   * Count all by status and is active
   * @route GET /employees/countAllByIsActive/:isActive
   * @param req
   * @param res
   * @returns {never}
   */
  countAllByIsActive: async (req, res) => {
    let count, criteria;

    try {
      // Pre-setting variables
      criteria = { where: { is_active: req.params.isActive, is_deleted: 0 } };
      // Execute findAll query
      count = await Model.Employees.count(criteria);
      res.json({
        status: 200,
        message: "Successfully count all data.",
        result: count
      });
    } catch (err) {
      res.json({
        status: 401,
        err: err,
        message: "Failed to count all data."
      });
    }
  },
};

const generateEmployeeNo = () => {
  return new Promise(async (resolve, reject) => {
    let data, criteria, value;

    try {
      // Pre-setting variables
      criteria = { attributes: ['employee_no'], where: { employee_no: { $ne: null }, is_deleted: 0 }, order: [ [ 'id', 'DESC' ]] };
      // Execute findOne query
      data = await Model.Employees.findOne(criteria);
      if (_.isEmpty(data)) {
        value = 'E000001';
      } else {
        let numLength = 6;
        let stringNumber = data.employee_no.substring(1);
        let newNumber = (parseInt(stringNumber) + 1);
        let leadingZero = Array(numLength - (newNumber.toString().length) + 1).join(0);
        value = 'E' + leadingZero + newNumber;
      }
      resolve(value);
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
}