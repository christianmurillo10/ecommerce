const Model = require('../models');
const SalesOrdersController = require("./SalesOrdersController");
const CustomerBalanceController = require("./CustomerBalanceController");
const { NO, YES } = require('../helpers/constant-helper');

module.exports = {
  /**
   * Create
   * @param req
   * @param res
   * @returns {Promise<void>}
   * @routes POST /payments/create
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
    params.reference_no = await generateReferenceNo();
    params.vat_amount = params.vat_amount ? params.vat_amount.toLocaleString() : null;
    params.amount = params.amount ? params.amount.toLocaleString() : null;
    params.customer_id = params.customer_id ? params.customer_id.toLocaleString() : null;
    params.sales_order_id = params.sales_order_id ? params.sales_order_id.toLocaleString() : null;
    params.bank_id = params.bank_id ? params.bank_id.toLocaleString() : null;
    params.customer_credit_debit_card_id = params.customer_credit_debit_card_id ? params.customer_credit_debit_card_id.toLocaleString() : null;
    params.payment_method_type = params.payment_method_type ? params.payment_method_type.toLocaleString() : null;
    params.is_with_vat = params.is_with_vat ? params.is_with_vat.toLocaleString() : null;

    try {
      // Validators
      if (_.isEmpty(params.reference_no)) return res.json({ status: 200, message: "Reference No. is required.", result: false });
      if (_.isEmpty(params.amount)) return res.json({ status: 200, message: "Amount is required.", result: false });
      if (_.isEmpty(params.customer_id)) return res.json({ status: 200, message: "Customer is required.", result: false });
      if (_.isEmpty(params.sales_order_id)) return res.json({ status: 200, message: "Sales Order is required.", result: false });
      if (_.isEmpty(params.date)) return res.json({ status: 200, message: "Date is required.", result: false });
      if (_.isEmpty(params.payment_method_type)) return res.json({ status: 200, message: "Payment Method is required.", result: false });

      // Pre-setting variables
      criteria = { 
        where: { reference_no: params.reference_no },
        include: [
          { model: Model.Customers, as: 'customers', attributes: ['customer_no', 'firstname', 'middlename', 'lastname'] },
          { model: Model.SalesOrders, as: 'salesOrders', attributes: ['order_no'] }
        ]
      };
      initialValues = _.pick(params, [
        'reference_no', 
        'or_no', 
        'remarks', 
        'vat_amount', 
        'amount',
        'customer_id',
        'sales_order_id',
        'bank_id',
        'customer_credit_debit_card_id',
        'date',
        'created_at',
        'payment_method',
        'is_with_vat'
      ]);
      // Execute findAll query
      data = await Model.Payments.findAll(criteria);
      if (_.isEmpty(data[0])) {
        await Model.Payments.create(initialValues)
          .then(() => Model.Payments.findOrCreate(criteria))
          .then(async ([finalData, created]) => {
            let plainData = finalData.get({ plain: true });

            // Update sales order total balance amount and paid status
            await SalesOrdersController.updateTotalAmountBalanceAndPaidStatus({
              sales_order_id: params.sales_order_id,
              amount: params.amount,
              type: "INSERT",
            });

            // Insert customer balance
            await CustomerBalanceController.insertCreditBalanceOverpaymentAndAmount({
              customer_id: params.customer_id,
              sales_order_id: params.sales_order_id,
              payment_id: plainData.id,
              amount: params.amount,
            });

            res.json({
              status: 200,
              message: "Successfully created data.",
              result: _.omit(plainData, ["is_deleted"])
            });
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
   * @route PUT /payments/update/:id
   * @param req
   * @param res
   * @returns {never}
   */
  update: async (req, res) => {
    const params = req.body;
    let initialValues, data, criteria;

    if (_.isUndefined(params))
      return res.badRequest({ err: "Invalid Parameter: [params]" });
    if (_.isEmpty(params))
      return res.badRequest({ err: "Empty Parameter: [params]" });

    // Override variables
    params.updated_at = moment().utc(8).format("YYYY-MM-DD HH:mm:ss");

    try {
      // Pre-setting variables
      criteria = { 
        where: { is_deleted: NO },
        include: [
          { model: Model.Customers, as: 'customers', attributes: ['customer_no', 'firstname', 'middlename', 'lastname'] },
          { model: Model.SalesOrders, as: 'salesOrders', attributes: ['order_no'] }
        ]
      };
      initialValues = _.pick(params, [ 
        'or_no', 
        'remarks', 
        'vat_amount', 
        'amount',
        'customer_id',
        'sales_order_id',
        'bank_id',
        'customer_credit_debit_card_id',
        'date',
        'updated_at',
        'payment_method',
        'is_with_vat'
      ]);

      // Execute findByPk query
      data = await Model.Payments.findByPk(req.params.id);
      if (!_.isEmpty(data)) {
        await data.update(initialValues).then(() =>
          Model.Payments.findByPk(data.id, criteria).then(
            async (finalData) => {
              let plainData = finalData.get({ plain: true });
              res.json({
                status: 200,
                message: "Successfully updated data.",
                result: _.omit(plainData, ['is_deleted'])
              });
            }
          )
        );
      } else {
        res.json({
          status: 200,
          message: "Data doesn't exist.",
          result: false,
        });
      }
    } catch (err) {
      res.json({
        status: 401,
        err: err,
        message: "Failed updating data.",
      });
    }
  },

  /**
   * Delete
   * @route PUT /payments/delete/:id
   * @param req
   * @param res
   * @returns {never}
   */
  delete: async (req, res) => {
    let data;

    try {
      // Execute findByPk query
      data = await Model.Payments.findByPk(req.params.id);
      if (!_.isEmpty(data)) {
        // Update sales order total balance amount and paid status
        await SalesOrdersController.updateTotalAmountBalanceAndPaidStatus({
          sales_order_id: data.sales_order_id,
          amount: data.amount,
          type: "DELETE",
        });

        await CustomerBalanceController.insertDebitBalanceAndAmount({
          remarks: `DELETE PAYMENT FOR ${data.reference_no}`,
          amount: data.amount, 
          customer_id: data.customer_id, 
          sales_order_id: data.sales_order_id, 
        });

        let finalData = await data.update({ is_deleted: YES });
        
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
   * @route POST /payments/search/:value
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
      query = `SELECT * FROM payments WHERE CONCAT(reference_no) LIKE ? AND is_deleted = ${NO};`;
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
   * @route GET /payments
   * @param req
   * @param res
   * @returns {never}
   */
  findAll: async (req, res) => {
    let data, criteria;

    try {
      // Pre-setting variables
      criteria = { 
        where: { is_deleted: NO },
        include: [
          { model: Model.Customers, as: 'customers', attributes: ['customer_no', 'firstname', 'middlename', 'lastname'] },
          { model: Model.SalesOrders, as: 'salesOrders', attributes: ['order_no'] }
        ]
      };
      // Execute findAll query
      data = await Model.Payments.findAll(criteria);
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
   * @route GET /payments/:id
   * @param req
   * @param res
   * @returns {never}
   */
  findById: async (req, res) => {
    let data, criteria;

    try {
      criteria = {
        where: { is_deleted: NO },
        include: [
          { model: Model.Customers, as: 'customers', attributes: ['customer_no', 'firstname', 'middlename', 'lastname'] },
          { model: Model.SalesOrders, as: 'salesOrders', attributes: ['order_no'] }
        ]
      };
      // Execute findAll query
      data = await Model.Payments.findByPk(req.params.id);
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
};

/**
 * Other Functions
 */
const generateReferenceNo = () => {
  return new Promise(async (resolve, reject) => {
    let data, criteria, value;

    try {
      let date = moment().utc(8).format('YYYY-MM-DD');
      date = date.split('-').join('');
      // Pre-setting variables
      criteria = { attributes: ['reference_no'], where: { reference_no: { $ne: null }, is_deleted: NO }, order: [ [ 'id', 'DESC' ]] };
      // Execute findOne query
      data = await Model.Payments.findOne(criteria);
      if (_.isEmpty(data)) {
        value = `PM${date}-000001`;
      } else {
        let numLength = 6;
        let stringNumber = data.reference_no.substring(11);
        let newNumber = (parseInt(stringNumber) + 1);
        let leadingZero = Array(numLength - (newNumber.toString().length) + 1).join(0);
        value = `PM${date}-${leadingZero}${newNumber}`;
      }
      resolve(value);
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
}