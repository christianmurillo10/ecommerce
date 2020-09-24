const Model = require('../models');
const InventoriesController = require("./InventoriesController");
const ProductFlashDealDetailsController = require("./ProductFlashDealDetailsController");
const {
  NO,
  YES,
  SO_STATUS_CLOSED,
  SO_STATUS_DELIVERED,
  SO_STATUS_ON_PROCESS,
  SO_STATUS_APPROVED,
  SO_STATUS_REVIEWED,
  SO_STATUS_OPEN,
  SO_STATUS_CANCELLED,
  SO_STATUS_FAILED,
  SO_DETAILS_STATUS_CLAIMED,
  SO_DETAILS_STATUS_ON_GOING,
  SO_DETAILS_STATUS_PENDING,
  SO_DETAILS_STATUS_RETURNED,
  SO_DETAILS_STATUS_CANCELLED,
  SO_DETAILS_STATUS_FAILED
} = require('../helpers/constant-helper');

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
    params.total_balance_amount = params.total_amount;
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
        where: { order_no: params.order_no, is_deleted: NO },
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
        'total_balance_amount', 
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
                variant_details: JSON.stringify(element.variant_details),
                remarks: element.remarks,
                quantity: element.quantity,
                rate_amount: element.rate_amount,
                discount_percentage: element.discount_percentage,
                discount_amount: element.discount_amount,
                total_discount_amount: element.total_discount_amount,
                amount: element.amount,
                product_id: element.product_id,
                product_flash_deal_detail_id: element.product_flash_deal_detail_id,
                sales_order_id: plainData.id,
                discount_type: element.discount_type,
                claim_type: element.claim_type,
                is_flash_deal: element.is_flash_deal,
              }
              salesOrderDetailsInitialValue.push(salesOrderDetailsData);
            });
            
            // 2. Saving Bulk Sales Order Details
            Model.SalesOrderDetails.bulkCreate(salesOrderDetailsInitialValue)
              .then(async response => {
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
    params.total_balance_amount = params.total_amount;

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
                variant_details: JSON.stringify(element.variant_details),
                remarks: element.remarks,
                quantity: element.quantity,
                rate_amount: element.rate_amount,
                discount_percentage: element.discount_percentage,
                discount_amount: element.discount_amount,
                total_discount_amount: element.total_discount_amount,
                amount: element.amount,
                product_id: element.product_id,
                product_flash_deal_detail_id: element.product_flash_deal_detail_id,
                sales_order_id: plainData.id,
                discount_type: element.discount_type,
                claim_type: element.claim_type,
                is_flash_deal: element.is_flash_deal,
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
              // 2.1 Update sales order details
              for (let i = 0; i < salesOrderDetailsInitialUpdateValue.length; i++) {
                let detailsUpdateValue = salesOrderDetailsInitialUpdateValue[i];
                let dataDetails = await Model.SalesOrderDetails.findByPk(detailsUpdateValue.id);
                if (!_.isEmpty(dataDetails)) {
                  // 2.1.1 Update sales order details
                  await dataDetails.update(detailsUpdateValue);
                }
              }

              // 2.2 Delete sales order details
              let criteriaDetails = { where: { id: { $notIn: existingIds }, sales_order_id: plainData.id, is_deleted: NO } };
              await Model.SalesOrderDetails.update({ is_deleted: YES }, criteriaDetails);
            }

            // 3. CREATE
            if (salesOrderDetailsInitialCreateValue.length > 0) {
              // 3.1 Create bulk sales order details
              await Model.SalesOrderDetails.bulkCreate(salesOrderDetailsInitialCreateValue);
            }

            res.json({
              status: 200,
              message: "Successfully updated data.",
              result: _.omit(plainData, ['is_deleted'])
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
   * Update Return
   * @route PUT /salesOrders/updateReturn/:id
   * @param req
   * @param res
   * @returns {never}
   */
  updateReturn: async (req, res) => {
    const params = req.body;
    let criteria, initialValues, data;

    if (_.isUndefined(params))
      return res.badRequest({ err: "Invalid Parameter: [params]" });
    if (_.isEmpty(params))
      return res.badRequest({ err: "Empty Parameter: [params]" });

    try {
      // 1. Set and filtering Bulk Data of Sales Order Details
      const salesOrderDetails = params.details;
      let salesOrderDetailsInitialUpdateValue = [];
      
      salesOrderDetails.forEach(element => {
        let salesOrderDetailsData = {
          id: element.id,
          return_remarks: element.return_remarks,
          quantity_returned: element.quantity_returned,
          updated_at: params.updated_at,
          is_with_return: parseInt(element.quantity_returned) === 0 ? NO : YES
        }
  
        salesOrderDetailsInitialUpdateValue.push(salesOrderDetailsData);
      });
      
      // Override variables
      params.updated_at = moment().utc(8).format('YYYY-MM-DD HH:mm:ss');
      params.user_id = req.user.id.toLocaleString();
      params.is_with_return = salesOrderDetailsInitialUpdateValue.some(element => element.quantity_returned > 0) ? YES : NO;

      // Pre-setting variables
      criteria = { include: [{ model: Model.Customers, as: 'customers', attributes: ['customer_no', 'firstname', 'middlename', 'lastname'] }] };
      initialValues = _.pick(params, [
        'updated_at',
        'is_with_return'
      ]);
      // Execute findByPk query
      data = await Model.SalesOrders.findByPk(req.params.id, criteria);
      if (!_.isEmpty(data)) {
        await data.update(initialValues)
          .then(() => Model.SalesOrders.findByPk(data.id, criteria)
          .then(async finalData => {
            let plainData = finalData.get({ plain: true });
            
            // 2. UPDATE
            if (salesOrderDetailsInitialUpdateValue.length > 0) {
              // 2.1 Update sales order details
              for (let i = 0; i < salesOrderDetailsInitialUpdateValue.length; i++) {
                let detailsUpdateValue = salesOrderDetailsInitialUpdateValue[i];
                let dataDetails = await Model.SalesOrderDetails.findByPk(detailsUpdateValue.id);
                if (!_.isEmpty(dataDetails) && parseInt(dataDetails.quantity_returned) !== parseInt(detailsUpdateValue.quantity_returned)) {
                  // 2.1.1 Update inventory
                  if (dataDetails.quantity_returned === 0) {
                    await InventoriesController.updateQuantityReturnedAndOut({
                      sku: dataDetails.sku,
                      old_quantity: 0,
                      new_quantity: detailsUpdateValue.quantity_returned,
                      product_id: dataDetails.product_id,
                      user_id: params.user_id,
                      type: 'INSERT'
                    });
                  } else {
                    await InventoriesController.updateQuantityReturnedAndOut({
                      sku: dataDetails.sku,
                      old_quantity: dataDetails.quantity_returned,
                      new_quantity: detailsUpdateValue.quantity_returned,
                      product_id: dataDetails.product_id,
                      user_id: params.user_id,
                      type: 'UPDATE'
                    });
                  }

                  // 2.1.2 Update sales order details
                  await dataDetails.update(detailsUpdateValue);
                }
              }
            }

            res.json({
              status: 200,
              message: "Successfully updated data.",
              result: _.omit(plainData, ['is_deleted'])
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
   * Update Status
   * @route PUT /salesOrders/updateStatus/:id
   * @param req
   * @param res
   * @returns {never}
   */
  updateStatus: async (req, res) => {
    const params = req.body;
    let criteria, initialValues, data;

    if (_.isUndefined(params))
      return res.badRequest({ err: "Invalid Parameter: [params]" });
    if (_.isEmpty(params))
      return res.badRequest({ err: "Empty Parameter: [params]" });

    // Override variables
    params.updated_at = moment().utc(8).format('YYYY-MM-DD HH:mm:ss');
    params.user_id = req.user.id.toLocaleString();
    switch(params.status) {
      case SO_STATUS_DELIVERED:
        params.date_delivered = params.date;
        break;
      case SO_STATUS_ON_PROCESS:
        params.date_delivery = params.date;
        break;
      case SO_STATUS_APPROVED:
        params.date_approved = params.date;
        params.approved_by = params.employee_id;
        break;
      case SO_STATUS_REVIEWED:
        params.reviewed_by = params.employee_id;
        break;
    }

    try {
      // Pre-setting variables
      criteria = { include: [{ model: Model.Customers, as: 'customers', attributes: ['customer_no', 'firstname', 'middlename', 'lastname'] }] };
      initialValues = _.pick(params, [
        'status',
        'date_approved',
        'date_delivery',
        'date_delivered',
        'updated_at'
      ]);
      // Execute findByPk query
      data = await Model.SalesOrders.findByPk(req.params.id, criteria);
      if (!_.isEmpty(data)) {
        const oldStatus = data.status;
        await data.update(initialValues)
          .then(() => Model.SalesOrders.findByPk(data.id, criteria)
          .then(async finalData => {
            let plainData = finalData.get({ plain: true });
            let status = plainData.status;
            const enableDeleteInventoryQuantityByStatus = [SO_STATUS_ON_PROCESS, SO_STATUS_APPROVED];

            // Update inventory and product flash deal
            switch(status) {
              case SO_STATUS_DELIVERED:
                let criteriaDeliveredDetails = { attributes: ['id', 'sku', 'quantity', 'product_id', 'product_flash_deal_detail_id'], where: { sales_order_id: plainData.id, status: SO_DETAILS_STATUS_ON_GOING, is_deleted: NO } };
                let dataDeliveredDetails = await Model.SalesOrderDetails.findAll(criteriaDeliveredDetails);
                await Model.SalesOrderDetails.update({ status: SO_DETAILS_STATUS_CLAIMED }, criteriaDeliveredDetails);
                
                for (let i = 0; i < dataDeliveredDetails.length; i++) {
                  let details = dataDeliveredDetails[i];
                  await InventoriesController.updateQuantityOutAndReserved({
                    sku: details.sku,
                    new_quantity: details.quantity,
                    product_id: details.product_id,
                    user_id: params.user_id
                  });
                }
                break;
              case SO_STATUS_ON_PROCESS:
                let criteriaOnProcessDetails = { where: { sales_order_id: plainData.id, is_deleted: NO } };
                await Model.SalesOrderDetails.update({ status: SO_DETAILS_STATUS_ON_GOING}, criteriaOnProcessDetails);
                break;
              case SO_STATUS_APPROVED:
                let criteriaAprovedDetails = { attributes: ['id', 'sku', 'quantity', 'product_id', 'product_flash_deal_detail_id'], where: { sales_order_id: plainData.id, is_deleted: NO }, raw: true };
                let dataApprovedDetails = await Model.SalesOrderDetails.findAll(criteriaAprovedDetails);

                for (let i = 0; i < dataApprovedDetails.length; i++) {
                  let details = dataApprovedDetails[i];
                  await InventoriesController.updateQuantityReservedAndAvailable({
                    sku: details.sku,
                    old_quantity: 0,
                    new_quantity: details.quantity,
                    product_id: details.product_id,
                    user_id: params.user_id,
                    type: 'INSERT'
                  });
                  await ProductFlashDealDetailsController.updateQuantitySoldAndAvailable({
                    id: details.product_flash_deal_detail_id,
                    old_quantity: 0,
                    new_quantity: details.quantity,
                    type: 'INSERT'
                  });
                }
                break;
              case SO_STATUS_CANCELLED:
                let criteriaCancelledDetails = { attributes: ['id', 'sku', 'quantity', 'product_id', 'product_flash_deal_detail_id'], where: { sales_order_id: plainData.id, is_deleted: NO } };
                await Model.SalesOrderDetails.update({ status: SO_DETAILS_STATUS_CANCELLED }, criteriaCancelledDetails);

                if (enableDeleteInventoryQuantityByStatus.includes(oldStatus)) {
                  let dataCancelledDetails = await Model.SalesOrderDetails.findAll(criteriaCancelledDetails);
                  for (let i = 0; i < dataCancelledDetails.length; i++) {
                    let details = dataCancelledDetails[i];
                    await InventoriesController.updateQuantityReservedAndAvailable({
                      sku: details.sku,
                      old_quantity: details.quantity,
                      new_quantity: 0,
                      product_id: details.product_id,
                      user_id: params.user_id,
                      type: 'DELETE'
                    });
                    await ProductFlashDealDetailsController.updateQuantitySoldAndAvailable({
                      id: details.product_flash_deal_detail_id,
                      old_quantity: details.quantity,
                      new_quantity: 0,
                      type: 'DELETE'
                    });
                  }
                }
                break;
              case SO_STATUS_FAILED:
                let criteriaFailedDetails = { attributes: ['id', 'sku', 'quantity', 'product_id', 'product_flash_deal_detail_id'], where: { sales_order_id: plainData.id, is_deleted: NO } };
                await Model.SalesOrderDetails.update({ status: SO_DETAILS_STATUS_FAILED }, criteriaFailedDetails);

                if (enableDeleteInventoryQuantityByStatus.includes(oldStatus)) {
                  let dataFailedDetails = await Model.SalesOrderDetails.findAll(criteriaFailedDetails);
                  for (let i = 0; i < dataFailedDetails.length; i++) {
                    let details = dataFailedDetails[i];
                    await InventoriesController.updateQuantityReservedAndAvailable({
                      sku: details.sku,
                      old_quantity: details.quantity,
                      new_quantity: 0,
                      product_id: details.product_id,
                      user_id: params.user_id,
                      type: 'DELETE'
                    });
                    await ProductFlashDealDetailsController.updateQuantitySoldAndAvailable({
                      id: details.product_flash_deal_detail_id,
                      old_quantity: details.quantity,
                      new_quantity: 0,
                      type: 'DELETE'
                    });
                  }
                }
                break;
            }

            res.json({
              status: 200,
              message: "Successfully updated data.",
              result: plainData
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
      query = `SELECT * FROM sales_orders WHERE CONCAT(order_no) LIKE ? AND is_deleted = ${NO};`;
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
      criteria = { 
        where: { is_deleted: NO },
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
        where: { customer_id: params.customerId, is_deleted: NO },
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
        where: { status: params.status, is_deleted: NO },
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
        where: { is_deleted: NO },
        include: [
          { model: Model.Customers, as: 'customers', attributes: ['customer_no', 'firstname', 'middlename', 'lastname', 'email', 'primary_address', 'contact_no'] },
          { model: Model.Employees, as: 'reviewedBy', attributes: ['employee_no', 'firstname', 'middlename', 'lastname'] },
          { model: Model.Employees, as: 'approvedBy', attributes: ['employee_no', 'firstname', 'middlename', 'lastname'] },
          { 
            model: Model.SalesOrderDetails, as: "salesOrderDetails", 
            attributes: [
              'id', 
              'sku', 
              'variant_details', 
              'remarks', 
              'return_remarks', 
              'quantity', 
              'quantity_returned', 
              'rate_amount', 
              'discount_percentage', 
              'discount_amount', 
              'total_discount_amount', 
              'amount',
              'product_id',
              'date',
              'discount_type',
              'claim_type',
              'status',
              'is_flash_deal'
            ], 
            where: { is_deleted: NO },
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

  /**
   * Count all
   * @route GET /salesOrders/count/all
   * @param req
   * @param res
   * @returns {never}
   */
  countAll: async (req, res) => {
    let count, criteria;

    try {
      // Pre-setting variables
      criteria = { where: { is_deleted: NO } };
      // Execute findAll query
      count = await Model.SalesOrders.count(criteria);
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

  /**
   * Public Functions
   */

  /**
   * Update Total Amount Balance and Paid Status
   */
  updateTotalAmountBalanceAndPaidStatus: async (obj) => {
    return new Promise(async (resolve, reject) => {
      try {
        let initialValues, data, criteria;
        // Pre-setting variables
        criteria = { where: { id: obj.sales_order_id, is_fully_paid: NO, is_deleted: NO } };
        // Execute findOne query
        data = await Model.SalesOrders.findOne(criteria);
        if (!_.isEmpty(data)) {
          const updatedAt = moment().utc(8).format('YYYY-MM-DD HH:mm:ss');
          const computedTotalBalanceAmount = parseFloat(data.total_balance_amount) - parseFloat(obj.amount);
          const totalBalanceAmount = computedTotalBalanceAmount > 0 ? computedTotalBalanceAmount : 0;
          const isFullyPaid = computedTotalBalanceAmount > 0 ? NO : YES;

          initialValues = { total_balance_amount: totalBalanceAmount, updated_at: updatedAt, is_paid: YES, is_fully_paid: isFullyPaid };

          data.update(initialValues)
            .then(response => {
              resolve({
                status: 200,
                message: "Successfully update data.",
                result: true
              });
            });
        } else {
          resolve({
            status: 200,
            message: "Data doesn't exist.",
            result: false
          });
        }
      } catch (err) {
        resolve({
          status: 401,
          err: err,
          message: "Failed to find data."
        });
      }
    });
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
      criteria = { attributes: ['order_no'], where: { order_no: { $ne: null }, is_deleted: NO }, order: [ [ 'id', 'DESC' ]] };
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