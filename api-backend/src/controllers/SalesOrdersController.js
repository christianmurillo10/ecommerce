const Model = require('../models');
const InventoriesController = require("./InventoriesController");

module.exports = {
  /**
   * Create
   * @param req
   * @param res
   * @returns {Promise<void>}
   * @routes POST /salesOrders/create
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
    params.order_no = await generateOrderNo();
    params.created_at = moment().utc(8).format('YYYY-MM-DD HH:mm:ss');
    params.sub_total_amount = params.sub_total_amount.toLocaleString();
    params.vat_amount = params.vat_amount === null ? null : params.vat_amount.toLocaleString();
    params.shipping_fee_amount = params.shipping_fee_amount === null ? null : params.shipping_fee_amount.toLocaleString();
    params.total_discount_amount = params.total_discount_amount === null ? null : params.total_discount_amount.toLocaleString();
    params.total_amount = params.total_amount === null ? null : params.total_amount.toLocaleString();
    params.customer_id = params.customer_id === undefined ? null : params.customer_id.toLocaleString();
    params.payment_method_type = params.payment_method_type === undefined ? null : params.payment_method_type.toLocaleString();
    params.is_with_vat = params.is_with_vat === undefined ? null : params.is_with_vat.toLocaleString();

    try {
      // Validators
      if (_.isEmpty(params.order_no)) return res.json({ status: 200, message: "Order No. is required.", result: false });
      if (_.isEmpty(params.sub_total_amount)) return res.json({ status: 200, message: "Sub-total Amount is required.", result: false });
      if (_.isEmpty(params.total_amount)) return res.json({ status: 200, message: "Total Amount is required.", result: false });
      if (_.isEmpty(params.customer_id)) return res.json({ status: 200, message: "Customer is required.", result: false });
      if (_.isEmpty(params.date_ordered)) return res.json({ status: 200, message: "Date Ordered is required.", result: false });
      if (_.isEmpty(params.payment_method_type)) return res.json({ status: 200, message: "Payment Method is required.", result: false });

      // Pre-setting variables
      criteria = { 
        where: { order_no: params.order_no, is_deleted: 0 },
        include: [{ model: Model.Customers, as: 'customers', attributes: ['customer_no', 'firstname', 'middlename', 'lastname'] }]
      };
      initialValues = _.pick(params, [
        'order_no', 
        'remarks', 
        'sub_total_amount', 
        'vat_amount', 
        'shipping_fee_amount', 
        'total_discount_amount', 
        'total_amount', 
        'customer_id', 
        'date_ordered', 
        'created_at',
        'payment_method_type',
        'status',
        'is_with_vat'
      ]);
      // Execute findAll query
      data = await Model.SalesOrders.findAll(criteria);
      if (_.isEmpty(data[0])) {
        await Model.SalesOrders.create(initialValues)
          .then(() => Model.SalesOrders.findOrCreate(criteria))
          .then(async ([finalData, created]) => {
            let plainData = finalData.get({ plain: true });

            // 1. Set and filtering Bulk Data of Sales Order Details
            const salesOrderDetails = params.details;
            let salesOrderDetailsInitialValue = [];
            salesOrderDetails.forEach(element => {
              let salesOrderDetailsData = {
                sku: element.sku,
                option_details: JSON.stringify(element.option_details),
                remarks: element.remarks,
                quantity: element.quantity,
                rate_amount: element.rate_amount,
                discount_amount: element.discount_amount,
                amount: element.amount,
                product_id: element.product_id,
                sales_order_id: plainData.id,
                claim_type: element.claim_type,
              }
              salesOrderDetailsInitialValue.push(salesOrderDetailsData);
            });
            
            // 2. Saving Bulk Sales Order Details
            Model.SalesOrderDetails.bulkCreate(salesOrderDetailsInitialValue)
              .then(async response => {
                for (let i = 0; i < salesOrderDetailsInitialValue.length; i++) {
                  let details = salesOrderDetailsInitialValue[i];
                  // 2.1 Update inventory stocks
                  await InventoriesController.updateStockReservedAndAvailable({
                    sku: details.sku,
                    old_quantity: 0,
                    new_quantity: details.quantity,
                    product_id: details.product_id,
                    type: 'INSERT'
                  });
                }
                
                res.json({
                  status: 200,
                  message: "Successfully created data.",
                  result: _.omit(plainData, ["is_deleted"])
                });
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
   * @route PUT /salesOrders/update/:id
   * @param req
   * @param res
   * @returns {never}
   */
  update: async (req, res) => {
    const params = req.body;
    let criteria, initialValues, data;

    if (_.isUndefined(params))
      return res.badRequest({ err: "Invalid Parameter: [params]" });
    if (_.isEmpty(params))
      return res.badRequest({ err: "Empty Parameter: [params]" });

    // Override variables
    params.updated_at = moment().utc(8).format('YYYY-MM-DD HH:mm:ss');

    try {
      // Pre-setting variables
      criteria = { include: [{ model: Model.Customers, as: 'customers', attributes: ['customer_no', 'firstname', 'middlename', 'lastname'] }] };
      initialValues = _.pick(params, [
        'remarks', 
        'sub_total_amount', 
        'vat_amount', 
        'shipping_fee_amount', 
        'total_discount_amount', 
        'total_amount', 
        'total_balance_amount', 
        'customer_id', 
        'reviewed_by', 
        'approved_by', 
        'date_ordered', 
        'date_approved', 
        'date_delivery', 
        'date_delivered', 
        'updated_at',
        'payment_method_type',
        'status',
        'is_with_vat',
        'is_paid',
        'is_fully_paid',
        'is_with_return',
        'is_viewed'
      ]);
      // Execute findByPk query
      data = await Model.SalesOrders.findByPk(req.params.id, criteria);
      if (!_.isEmpty(data)) {
        await data.update(initialValues)
          .then(() => Model.SalesOrders.findByPk(data.id, criteria)
          .then(async finalData => {
            let promises = [];
            let plainData = finalData.get({ plain: true });

            // 1. Set and filtering Bulk Data of Sales Order Details
            const salesOrderDetails = params.details;
            let salesOrderDetailsInitialUpdateValue = [];
            let salesOrderDetailsInitialCreateValue = [];
            let existingIds = [];
            salesOrderDetails.forEach(element => {
              let salesOrderDetailsData = {
                id: element.id,
                sku: element.sku,
                option_details: JSON.stringify(element.option_details),
                remarks: element.remarks,
                quantity: element.quantity,
                rate_amount: element.rate_amount,
                discount_amount: element.discount_amount,
                amount: element.amount,
                product_id: element.product_id,
                sales_order_id: plainData.id,
                claim_type: element.claim_type,
              }

              if (_.isUndefined(element.id)) {
                salesOrderDetailsInitialCreateValue.push(_.omit(salesOrderDetailsData, ["id"]));
              } else {
                salesOrderDetailsInitialUpdateValue.push(salesOrderDetailsData);
                existingIds.push(element.id);
              }
            });
            
            // 2. UPDATE
            if (salesOrderDetailsInitialUpdateValue.length > 0) {
              // 2.1 Update sales order details and inventory
              for (let i = 0; i < salesOrderDetailsInitialUpdateValue.length; i++) {
                let detailsUpdateValue = salesOrderDetailsInitialUpdateValue[i];
                let dataDetails = await Model.SalesOrderDetails.findByPk(detailsUpdateValue.id);
                if (!_.isEmpty(dataDetails)) {
                  // 2.1.1 Update inventory stocks
                  if (detailsUpdateValue.product_id === dataDetails.product_id) {
                    await InventoriesController.updateStockReservedAndAvailable({
                      sku: detailsUpdateValue.sku,
                      old_quantity: dataDetails.quantity,
                      new_quantity: detailsUpdateValue.quantity,
                      product_id: detailsUpdateValue.product_id,
                      type: 'UPDATE'
                    });
                  } else {
                    await InventoriesController.updateStockReservedAndAvailable({
                      sku: detailsUpdateValue.sku,
                      old_quantity: 0,
                      new_quantity: detailsUpdateValue.quantity,
                      product_id: detailsUpdateValue.product_id,
                      type: 'INSERT'
                    });
                    await InventoriesController.updateStockReservedAndAvailable({
                      sku: dataDetails.sku,
                      old_quantity: dataDetails.quantity,
                      new_quantity: 0,
                      product_id: dataDetails.product_id,
                      type: 'DELETE'
                    });
                  }
                  // 2.1.2 Update sales order details
                  await dataDetails.update(detailsUpdateValue);
                }
              }
              
              // 2.2 Find to be deleted sales order details
              let criteriaDeletedDetails = { attributes: ['id', 'sku', 'quantity', 'product_id'], where: { id: { $notIn: existingIds }, sales_order_id: plainData.id, is_deleted: 0 }, raw: true };
              let deletedDetailsData = await Model.SalesOrderDetails.findAll(criteriaDeletedDetails);
              for (let i = 0; i < deletedDetailsData.length; i++) {
                let deletedDetails = deletedDetailsData[i];
                // 2.2.1 Update inventory stocks
                await InventoriesController.updateStockReservedAndAvailable({
                  sku: deletedDetails.sku,
                  old_quantity: deletedDetails.quantity,
                  new_quantity: 0,
                  product_id: deletedDetails.product_id,
                  type: 'DELETE'
                });
              }

              // 2.3 Delete sales order details
              let criteriaDetails = { where: { id: { $notIn: existingIds }, sales_order_id: plainData.id, is_deleted: 0 } };
              await Model.SalesOrderDetails.update({ is_deleted : 1 }, criteriaDetails);
            }

            // 3. CREATE
            if (salesOrderDetailsInitialCreateValue.length > 0) {
              // 3.1 Create bulk sales order details
              promises.push(Model.SalesOrderDetails.bulkCreate(salesOrderDetailsInitialCreateValue));
              for (let j = 0; j < salesOrderDetailsInitialCreateValue.length; j++) {
                let detailsCreateValue = salesOrderDetailsInitialCreateValue[j];
                // 3.1.1 Update inventory stocks
                await InventoriesController.updateStockReservedAndAvailable({
                  sku: detailsCreateValue.sku,
                  old_quantity: 0,
                  new_quantity: detailsCreateValue.quantity,
                  product_id: detailsCreateValue.product_id,
                  type: 'INSERT'
                });
              }
            }

            // 4. Query promises
            Promise.all(promises).then(() => {
              res.json({
                status: 200,
                message: "Successfully updated data.",
                result: _.omit(plainData, ['is_deleted'])
              });
            }, (err) => {
              res.json({
                status: 401,
                err: err,
                message: "Failed updating data."
              });
            });
          }));
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
   * @route PUT /salesOrders/delete/:id
   * @param req
   * @param res
   * @returns {never}
   */
  delete: async (req, res) => {
    let data;

    try {
      // Execute findByPk query
      data = await Model.SalesOrders.findByPk(req.params.id);
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
   * @route POST /salesOrders/search/:value
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
      query = `SELECT * FROM sales_orders WHERE CONCAT(order_no) LIKE ? AND is_deleted = 0;`;
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
   * @route GET /salesOrders
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
      data = await Model.SalesOrders.findAll(criteria);
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
   * Find all by customer id
   * @route GET /salesOrders/findAllbyCustomerId/:customerId
   * @param req
   * @param res
   * @returns {never}
   */
  findAllbyCustomerId: async (req, res) => {
    const params = req.params;
    let data, criteria;

    try {
      // Pre-setting variables
      criteria = { 
        where: { customer_id: params.customerId, is_deleted: 0 },
        include: [{ model: Model.Customers, as: 'customers', attributes: ['customer_no', 'firstname', 'middlename', 'lastname'] }]
      };
      // Execute findAll query
      data = await Model.SalesOrders.findAll(criteria);
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
   * Find all by status
   * @route GET /salesOrders/findAllbyStatus/:status
   * @param req
   * @param res
   * @returns {never}
   */
  findAllbyStatus: async (req, res) => {
    const params = req.params;
    let data, criteria;

    try {
      // Pre-setting variables
      criteria = { 
        where: { status: params.status, is_deleted: 0 },
        include: [{ model: Model.Customers, as: 'customers', attributes: ['customer_no', 'firstname', 'middlename', 'lastname'] }]
      };
      // Execute findAll query
      data = await Model.SalesOrders.findAll(criteria);
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
   * @route GET /salesOrders/:id
   * @param req
   * @param res
   * @returns {never}
   */
  findById: async (req, res) => {
    let data;

    try {
      // Pre-setting variables
      criteria = {
        where: { is_deleted: 0 },
        include: [
          { model: Model.Customers, as: 'customers', attributes: ['customer_no', 'firstname', 'middlename', 'lastname'] },
          { model: Model.Employees, as: 'reviewedBy', attributes: ['employee_no', 'firstname', 'middlename', 'lastname'] },
          { model: Model.Employees, as: 'approvedBy', attributes: ['employee_no', 'firstname', 'middlename', 'lastname'] },
          { 
            model: Model.SalesOrderDetails, as: "salesOrderDetails", 
            attributes: [
              'id', 
              'sku', 
              'option_details', 
              'remarks', 
              'quantity', 
              'rate_amount', 
              'discount_amount', 
              'amount',
              'product_id',
              'date',
              'claim_type',
              'status'
            ], 
            where: { is_deleted: 0 },
            include: [
              { model: Model.Products, as: "products", attributes: ['name', 'description'] }
            ],
            required: false 
          },
        ]
      };
      // Execute findAll query
      data = await Model.SalesOrders.findByPk(req.params.id, criteria);
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
const generateOrderNo = () => {
  return new Promise(async (resolve, reject) => {
    let data, criteria, value;

    try {
      let date = moment().utc(8).format('YYYY-MM-DD');
      date = date.split('-').join('');
      // Pre-setting variables
      criteria = { attributes: ['order_no'], where: { order_no: { $ne: null }, is_deleted: 0 }, order: [ [ 'id', 'DESC' ]] };
      // Execute findOne query
      data = await Model.SalesOrders.findOne(criteria);
      if (_.isEmpty(data)) {
        value = `SO${date}-000001`;
      } else {
        let numLength = 6;
        let stringNumber = data.order_no.substring(11);
        let newNumber = (parseInt(stringNumber) + 1);
        let leadingZero = Array(numLength - (newNumber.toString().length) + 1).join(0);
        value = `SO${date}-${leadingZero}${newNumber}`;
      }
      resolve(value);
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
}