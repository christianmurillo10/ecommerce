const Model = require("../models");
const { ErrorHandler, handleSuccess } = require("../helpers/response-helper");
const InventoriesController = require("./InventoriesController");
const ProductFlashDealsController = require("./ProductFlashDealsController");
const ProductFlashDealDetailsController = require("./ProductFlashDealDetailsController");
const CustomerBalanceController = require("./CustomerBalanceController");
const SalesOrderShippingDetailsController = require("./SalesOrderShippingDetailsController");
const {
  NO,
  YES,
  DISCOUNT_TYPE_AMOUNT,
  DISCOUNT_TYPE_PERCENTAGE,
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
  SO_DETAILS_STATUS_FAILED,
} = require("../helpers/constant-helper");

module.exports = {
  /**
   * Create
   * @routes POST /salesOrders/create
   */
  create: async (req, res, next) => {
    let params = req.body;
    let errors = [],
      message = "Successfully created data.",
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
      params.order_no = await generateOrderNo();
      params.created_at = moment().utc(8).format("YYYY-MM-DD HH:mm:ss");
      params.customer_id = params.customer_id
        ? params.customer_id.toLocaleString()
        : null;
      params.payment_method_type = params.payment_method_type
        ? params.payment_method_type.toLocaleString()
        : null;
      params.is_with_vat = params.is_with_vat
        ? params.is_with_vat.toLocaleString()
        : null;

      if (_.isEmpty(params.order_no)) errors.push("Order No. is required.");
      if (_.isEmpty(params.customer_id)) errors.push("Customer is required.");
      if (_.isEmpty(params.date_ordered))
        errors.push("Date Ordered is required.");
      if (_.isEmpty(params.payment_method_type))
        errors.push("Payment Method is required.");
      if (_.isEmpty(params.details) || params.details.length < 1)
        errors.push("Details is required.");
      if (_.isEmpty(params.shippingDetails))
        errors.push("Shipping Details is required.");
      if (errors.length > 0) {
        throw new ErrorHandler(400, errors);
      }

      // Validate Data
      criteria = {
        where: { order_no: params.order_no, is_deleted: NO },
        include: [
          {
            model: Model.Customers,
            as: "customers",
            attributes: ["customer_no", "firstname", "middlename", "lastname"],
          },
        ],
      };
      data = await Model.SalesOrders.findAll(criteria);
      if (!_.isEmpty(data[0])) {
        errors.push("Data already exist.");
        throw new ErrorHandler(409, errors);
      }

      // Set Parameters
      params = await setSalesOrderParameters(params);

      // Pre-setting variables
      initialValues = _.pick(params, [
        "order_no",
        "remarks",
        "sub_total_amount",
        "vat_amount",
        "shipping_fee_amount",
        "total_discount_amount",
        "total_amount",
        "total_balance_amount",
        "customer_id",
        "date_ordered",
        "created_at",
        "payment_method_type",
        "status",
        "is_with_vat",
      ]);

      await Model.SalesOrders.create(initialValues)
        .then(() => Model.SalesOrders.findOrCreate(criteria))
        .then(async ([finalData, created]) => {
          let plainData = finalData.get({ plain: true });

          // // 1. Insert Sales Order Shipping Details
          // await SalesOrderShippingDetailsController.insertSalesOrderShippingDetails(
          //   params.shippingDetails
          // );

          // 2. Set and filtering Bulk Data of Sales Order Details
          let salesOrderDetailsInitialValue = [];
          let salesOrderDetails = params.details;
          salesOrderDetails.forEach((element) => {
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
              product_flash_deal_detail_id:
                element.product_flash_deal_detail_id,
              sales_order_id: plainData.id,
              discount_type: element.discount_type,
              claim_type: element.claim_type,
              is_flash_deal: element.is_flash_deal,
            };
            salesOrderDetailsInitialValue.push(salesOrderDetailsData);
          });

          // 2. Saving Bulk Sales Order Details
          Model.SalesOrderDetails.bulkCreate(
            salesOrderDetailsInitialValue
          ).then(async (response) => {
            handleSuccess(res, {
              statusCode: 201,
              message: message,
              result: _.omit(plainData, ["is_deleted"]),
            });
          });
        });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Update
   * @route PUT /salesOrders/update/:id
   */
  update: async (req, res, next) => {
    let params = req.body;
    let errors = [],
      message = "Successfully updated data.",
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
      params.updated_at = moment().utc(8).format("YYYY-MM-DD HH:mm:ss");
      params.total_balance_amount = params.total_amount;

      // Validate Data
      criteria = {
        include: [
          {
            model: Model.Customers,
            as: "customers",
            attributes: ["customer_no", "firstname", "middlename", "lastname"],
          },
        ],
      };
      data = await Model.SalesOrders.findByPk(req.params.id, criteria);
      if (_.isEmpty(data)) {
        errors.push("Data doesn't exist.");
        throw new ErrorHandler(404, errors);
      }

      // Set Parameters
      params = await setSalesOrderParameters(params);

      // Pre-setting variables
      initialValues = _.pick(params, [
        "remarks",
        "sub_total_amount",
        "vat_amount",
        "shipping_fee_amount",
        "total_discount_amount",
        "total_amount",
        "total_balance_amount",
        "customer_id",
        "reviewed_by",
        "approved_by",
        "date_ordered",
        "date_approved",
        "date_delivery",
        "date_delivered",
        "updated_at",
        "payment_method_type",
        "status",
        "is_with_vat",
        "is_paid",
        "is_fully_paid",
        "is_with_return",
        "is_viewed",
      ]);

      await data.update(initialValues).then(() =>
        Model.SalesOrders.findByPk(data.id, criteria).then(
          async (finalData) => {
            let plainData = finalData.get({ plain: true });

            // // 1. Insert Sales Order Shipping Details
            // await SalesOrderShippingDetailsController.insertSalesOrderShippingDetails(
            //   params.shippingDetails
            // );

            const salesOrderDetails = params.details;
            if (salesOrderDetails) {
              // 2. Set and filtering Bulk Data of Sales Order Details
              let salesOrderDetailsInitialUpdateValue = [];
              let salesOrderDetailsInitialCreateValue = [];
              let existingIds = [];
              salesOrderDetails.forEach((element) => {
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
                  product_flash_deal_detail_id:
                    element.product_flash_deal_detail_id,
                  sales_order_id: plainData.id,
                  discount_type: element.discount_type,
                  claim_type: element.claim_type,
                  is_flash_deal: element.is_flash_deal,
                };

                if (_.isUndefined(element.id)) {
                  salesOrderDetailsInitialCreateValue.push(
                    _.omit(salesOrderDetailsData, ["id"])
                  );
                } else {
                  salesOrderDetailsInitialUpdateValue.push(
                    salesOrderDetailsData
                  );
                  existingIds.push(element.id);
                }
              });

              // 3. UPDATE
              if (salesOrderDetailsInitialUpdateValue.length > 0) {
                // 3.1 Update sales order details
                for (
                  let i = 0;
                  i < salesOrderDetailsInitialUpdateValue.length;
                  i++
                ) {
                  let detailsUpdateValue =
                    salesOrderDetailsInitialUpdateValue[i];
                  let dataDetails = await Model.SalesOrderDetails.findByPk(
                    detailsUpdateValue.id
                  );
                  if (!_.isEmpty(dataDetails)) {
                    // 3.1.1 Update sales order details
                    await dataDetails.update(detailsUpdateValue);
                  }
                }

                // 3.2 Delete sales order details
                let criteriaDetails = {
                  where: {
                    id: { $notIn: existingIds },
                    sales_order_id: plainData.id,
                    is_deleted: NO,
                  },
                };
                await Model.SalesOrderDetails.update(
                  { is_deleted: YES },
                  criteriaDetails
                );
              }

              // 4. CREATE
              if (salesOrderDetailsInitialCreateValue.length > 0) {
                // 4.1 Create bulk sales order details
                await Model.SalesOrderDetails.bulkCreate(
                  salesOrderDetailsInitialCreateValue
                );
              }
            }

            handleSuccess(res, {
              statusCode: 200,
              message: message,
              result: _.omit(plainData, ["is_deleted"]),
            });
          }
        )
      );
    } catch (err) {
      next(err);
    }
  },

  /**
   * Update Return
   * @route PUT /salesOrders/updateReturn/:id
   */
  updateReturn: async (req, res, next) => {
    const params = req.body;
    let errors = [],
      message = "Successfully updated data.",
      criteria,
      initialValues,
      data;

    try {
      // Validators
      if (_.isEmpty(params)) {
        errors.push("Invalid Parameter.");
        throw new ErrorHandler(400, errors);
      }
      if (_.isEmpty(params.details) || params.details.length < 1) {
        errors.push("Details is required.");
        throw new ErrorHandler(400, errors);
      }

      // 1. Set and filtering Bulk Data of Sales Order Details
      const salesOrderDetails = params.details;
      let salesOrderDetailsInitialUpdateValue = [];

      salesOrderDetails.forEach((element) => {
        let salesOrderDetailsData = {
          id: element.id,
          return_remarks: element.return_remarks,
          quantity_returned: element.quantity_returned,
          updated_at: params.updated_at,
          is_with_return: parseInt(element.quantity_returned) === 0 ? NO : YES,
        };

        salesOrderDetailsInitialUpdateValue.push(salesOrderDetailsData);
      });

      // Override variables
      params.updated_at = moment().utc(8).format("YYYY-MM-DD HH:mm:ss");
      params.user_id = req.user.id.toLocaleString();
      params.is_with_return = salesOrderDetailsInitialUpdateValue.some(
        (element) => element.quantity_returned > 0
      )
        ? YES
        : NO;

      // Validate Data
      criteria = {
        include: [
          {
            model: Model.Customers,
            as: "customers",
            attributes: ["customer_no", "firstname", "middlename", "lastname"],
          },
        ],
      };
      data = await Model.SalesOrders.findByPk(req.params.id, criteria);
      if (_.isEmpty(data)) {
        errors.push("Data doesn't exist.");
        throw new ErrorHandler(404, errors);
      }

      // Pre-setting variables
      initialValues = _.pick(params, ["updated_at", "is_with_return"]);

      await data.update(initialValues).then(() =>
        Model.SalesOrders.findByPk(data.id, criteria).then(
          async (finalData) => {
            let plainData = finalData.get({ plain: true });

            // 2. UPDATE
            if (salesOrderDetailsInitialUpdateValue.length > 0) {
              // 2.1 Update sales order details
              for (
                let i = 0;
                i < salesOrderDetailsInitialUpdateValue.length;
                i++
              ) {
                let detailsUpdateValue = salesOrderDetailsInitialUpdateValue[i];
                let dataDetails = await Model.SalesOrderDetails.findByPk(
                  detailsUpdateValue.id
                );
                if (
                  !_.isEmpty(dataDetails) &&
                  parseInt(dataDetails.quantity_returned) !==
                    parseInt(detailsUpdateValue.quantity_returned)
                ) {
                  // 2.1.1 Update inventory
                  if (dataDetails.quantity_returned === 0) {
                    await InventoriesController.updateQuantityReturnedAndOut({
                      sku: dataDetails.sku,
                      old_quantity: 0,
                      new_quantity: detailsUpdateValue.quantity_returned,
                      product_id: dataDetails.product_id,
                      user_id: params.user_id,
                      type: "INSERT",
                    });
                  } else {
                    await InventoriesController.updateQuantityReturnedAndOut({
                      sku: dataDetails.sku,
                      old_quantity: dataDetails.quantity_returned,
                      new_quantity: detailsUpdateValue.quantity_returned,
                      product_id: dataDetails.product_id,
                      user_id: params.user_id,
                      type: "UPDATE",
                    });
                  }

                  // 2.1.2 Update sales order details
                  await dataDetails.update(detailsUpdateValue);
                }
              }
            }

            handleSuccess(res, {
              statusCode: 200,
              message: message,
              result: _.omit(plainData, ["is_deleted"]),
            });
          }
        )
      );
    } catch (err) {
      next(err);
    }
  },

  /**
   * Update Status
   * @route PUT /salesOrders/updateStatus/:id
   */
  updateStatus: async (req, res, next) => {
    const params = req.body;
    let errors = [],
      message = "Successfully updated data.",
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
      params.updated_at = moment().utc(8).format("YYYY-MM-DD HH:mm:ss");
      params.user_id = req.user.id.toLocaleString();
      params.employee_id = params.employee_id
        ? params.employee_id.toLocaleString()
        : null;
      params.status = params.status ? params.status.toLocaleString() : null;

      if (_.isEmpty(params.status)) errors.push("Status is required.");

      switch (parseInt(params.status)) {
        case SO_STATUS_DELIVERED:
          if (_.isEmpty(params.date)) {
            errors.push("Date Delivered is required.");
          } else {
            params.date_delivered = params.date;
          }
          break;
        case SO_STATUS_ON_PROCESS:
          if (_.isEmpty(params.date)) {
            errors.push("Date Delivery is required.");
          } else {
            params.date_delivery = params.date;
          }
          break;
        case SO_STATUS_APPROVED:
          if (_.isEmpty(params.date)) {
            errors.push("Date Approved is required.");
          }
          if (_.isEmpty(params.employee_id)) {
            errors.push("Approved By is required.");
          } else {
            params.date_approved = params.date;
            params.approved_by = params.employee_id;
          }
          break;
        case SO_STATUS_REVIEWED:
          if (_.isEmpty(params.employee_id)) {
            errors.push("Reviewed By is required.");
          } else {
            params.reviewed_by = params.employee_id;
          }
          break;
      }

      if (errors.length > 0) {
        throw new ErrorHandler(400, errors);
      }

      // Validate Data
      criteria = {
        include: [
          {
            model: Model.Customers,
            as: "customers",
            attributes: ["customer_no", "firstname", "middlename", "lastname"],
          },
        ],
      };
      data = await Model.SalesOrders.findByPk(req.params.id, criteria);
      if (_.isEmpty(data)) {
        errors.push("Data doesn't exist.");
        throw new ErrorHandler(404, errors);
      }

      // Pre-setting variables
      initialValues = _.pick(params, [
        "status",
        "date_approved",
        "date_delivery",
        "date_delivered",
        "updated_at",
      ]);

      const oldStatus = data.status;
      await data.update(initialValues).then(() =>
        Model.SalesOrders.findByPk(data.id, criteria).then(
          async (finalData) => {
            let plainData = finalData.get({ plain: true });
            let status = plainData.status;
            const enableDeleteInventoryQuantityByStatus = [
              SO_STATUS_ON_PROCESS,
              SO_STATUS_APPROVED,
            ];

            // Update inventory and product flash deal
            switch (status) {
              case SO_STATUS_DELIVERED:
                let criteriaDeliveredDetails = {
                  attributes: [
                    "id",
                    "sku",
                    "quantity",
                    "product_id",
                    "product_flash_deal_detail_id",
                  ],
                  where: {
                    sales_order_id: plainData.id,
                    status: SO_DETAILS_STATUS_ON_GOING,
                    is_deleted: NO,
                  },
                };
                let dataDeliveredDetails = await Model.SalesOrderDetails.findAll(
                  criteriaDeliveredDetails
                );
                await Model.SalesOrderDetails.update(
                  { status: SO_DETAILS_STATUS_CLAIMED },
                  criteriaDeliveredDetails
                );

                for (let i = 0; i < dataDeliveredDetails.length; i++) {
                  let details = dataDeliveredDetails[i];
                  await InventoriesController.updateQuantityOutAndReserved({
                    sku: details.sku,
                    new_quantity: details.quantity,
                    product_id: details.product_id,
                    user_id: params.user_id,
                  });
                }
                break;
              case SO_STATUS_ON_PROCESS:
                let criteriaOnProcessDetails = {
                  where: { sales_order_id: plainData.id, is_deleted: NO },
                };
                await Model.SalesOrderDetails.update(
                  { status: SO_DETAILS_STATUS_ON_GOING },
                  criteriaOnProcessDetails
                );
                break;
              case SO_STATUS_APPROVED:
                let criteriaAprovedDetails = {
                  attributes: [
                    "id",
                    "sku",
                    "quantity",
                    "product_id",
                    "product_flash_deal_detail_id",
                  ],
                  where: { sales_order_id: plainData.id, is_deleted: NO },
                  raw: true,
                };
                let dataApprovedDetails = await Model.SalesOrderDetails.findAll(
                  criteriaAprovedDetails
                );

                await CustomerBalanceController.insertDebitBalanceAndAmount({
                  amount: plainData.total_amount,
                  customer_id: plainData.customer_id,
                  sales_order_id: plainData.id,
                });

                for (let i = 0; i < dataApprovedDetails.length; i++) {
                  let details = dataApprovedDetails[i];
                  await InventoriesController.updateQuantityReservedAndAvailable(
                    {
                      sku: details.sku,
                      old_quantity: 0,
                      new_quantity: details.quantity,
                      product_id: details.product_id,
                      user_id: params.user_id,
                      type: "INSERT",
                    }
                  );
                  await ProductFlashDealDetailsController.updateQuantitySoldAndAvailable(
                    {
                      id: details.product_flash_deal_detail_id,
                      old_quantity: 0,
                      new_quantity: details.quantity,
                      type: "INSERT",
                    }
                  );
                }
                break;
              case SO_STATUS_CANCELLED:
                let criteriaCancelledDetails = {
                  attributes: [
                    "id",
                    "sku",
                    "quantity",
                    "product_id",
                    "product_flash_deal_detail_id",
                  ],
                  where: { sales_order_id: plainData.id, is_deleted: NO },
                };
                await Model.SalesOrderDetails.update(
                  { status: SO_DETAILS_STATUS_CANCELLED },
                  criteriaCancelledDetails
                );

                if (enableDeleteInventoryQuantityByStatus.includes(oldStatus)) {
                  let dataCancelledDetails = await Model.SalesOrderDetails.findAll(
                    criteriaCancelledDetails
                  );
                  for (let i = 0; i < dataCancelledDetails.length; i++) {
                    let details = dataCancelledDetails[i];
                    await InventoriesController.updateQuantityReservedAndAvailable(
                      {
                        sku: details.sku,
                        old_quantity: details.quantity,
                        new_quantity: 0,
                        product_id: details.product_id,
                        user_id: params.user_id,
                        type: "DELETE",
                      }
                    );
                    await ProductFlashDealDetailsController.updateQuantitySoldAndAvailable(
                      {
                        id: details.product_flash_deal_detail_id,
                        old_quantity: details.quantity,
                        new_quantity: 0,
                        type: "DELETE",
                      }
                    );
                  }
                }
                break;
              case SO_STATUS_FAILED:
                let criteriaFailedDetails = {
                  attributes: [
                    "id",
                    "sku",
                    "quantity",
                    "product_id",
                    "product_flash_deal_detail_id",
                  ],
                  where: { sales_order_id: plainData.id, is_deleted: NO },
                };
                await Model.SalesOrderDetails.update(
                  { status: SO_DETAILS_STATUS_FAILED },
                  criteriaFailedDetails
                );

                if (enableDeleteInventoryQuantityByStatus.includes(oldStatus)) {
                  let dataFailedDetails = await Model.SalesOrderDetails.findAll(
                    criteriaFailedDetails
                  );
                  for (let i = 0; i < dataFailedDetails.length; i++) {
                    let details = dataFailedDetails[i];
                    await InventoriesController.updateQuantityReservedAndAvailable(
                      {
                        sku: details.sku,
                        old_quantity: details.quantity,
                        new_quantity: 0,
                        product_id: details.product_id,
                        user_id: params.user_id,
                        type: "DELETE",
                      }
                    );
                    await ProductFlashDealDetailsController.updateQuantitySoldAndAvailable(
                      {
                        id: details.product_flash_deal_detail_id,
                        old_quantity: details.quantity,
                        new_quantity: 0,
                        type: "DELETE",
                      }
                    );
                  }
                }
                break;
            }

            handleSuccess(res, {
              statusCode: 200,
              message: message,
              result: plainData,
            });
          }
        )
      );
    } catch (err) {
      next(err);
    }
  },

  /**
   * Delete
   * @route PUT /salesOrders/delete/:id
   */
  delete: async (req, res, next) => {
    let errors = [],
      message = "Successfully deleted data.",
      data;

    try {
      // Validate Data
      data = await Model.SalesOrders.findByPk(req.params.id);
      if (_.isEmpty(data)) {
        errors.push("Data doesn't exist.");
        throw new ErrorHandler(404, errors);
      }
      let finalData = await data.update({ is_deleted: YES });

      handleSuccess(res, {
        statusCode: 200,
        message: message,
        result: finalData,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Find all
   * @route GET /salesOrders
   */
  findAll: async (req, res, next) => {
    let errors = [],
      message = "Successfully find all data.",
      data,
      criteria;

    try {
      // Validate Data
      criteria = {
        where: { is_deleted: NO },
        include: [
          {
            model: Model.Customers,
            as: "customers",
            attributes: ["customer_no", "firstname", "middlename", "lastname"],
          },
        ],
      };
      data = await Model.SalesOrders.findAll(criteria);
      if (_.isEmpty(data[0])) {
        message = "No data found.";
      }

      handleSuccess(res, {
        statusCode: 200,
        message: message,
        result: data,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Find all by customer id
   * @route GET /salesOrders/findAllbyCustomerId/:customerId
   */
  findAllbyCustomerId: async (req, res, next) => {
    const params = req.params;
    let errors = [],
      message = "Successfully find all data.",
      data,
      criteria;

    try {
      // Validate Data
      criteria = {
        where: { customer_id: params.customerId, is_deleted: NO },
        include: [
          {
            model: Model.Customers,
            as: "customers",
            attributes: ["customer_no", "firstname", "middlename", "lastname"],
          },
        ],
      };
      data = await Model.SalesOrders.findAll(criteria);
      if (_.isEmpty(data[0])) {
        message = "No data found.";
      }

      handleSuccess(res, {
        statusCode: 200,
        message: message,
        result: data,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Find all by status
   * @route GET /salesOrders/findAllbyStatus/:status
   */
  findAllbyStatus: async (req, res, next) => {
    const params = req.params;
    let errors = [],
      message = "Successfully find all data.",
      data,
      criteria;

    try {
      // Validate Data
      criteria = {
        where: { status: params.status, is_deleted: NO },
        include: [
          {
            model: Model.Customers,
            as: "customers",
            attributes: ["customer_no", "firstname", "middlename", "lastname"],
          },
        ],
      };
      data = await Model.SalesOrders.findAll(criteria);
      if (_.isEmpty(data[0])) {
        message = "No data found.";
      }

      handleSuccess(res, {
        statusCode: 200,
        message: message,
        result: data,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Find by id
   * @route GET /salesOrders/:id
   */
  findById: async (req, res, next) => {
    let errors = [],
      message = "Successfully find data.",
      data,
      criteria;

    try {
      // Validate Data
      criteria = {
        where: { is_deleted: NO },
        include: [
          {
            model: Model.Customers,
            as: "customers",
            attributes: [
              "customer_no",
              "firstname",
              "middlename",
              "lastname",
              "email",
              "primary_address",
              "contact_no",
            ],
          },
          {
            model: Model.Employees,
            as: "reviewedBy",
            attributes: ["employee_no", "firstname", "middlename", "lastname"],
          },
          {
            model: Model.Employees,
            as: "approvedBy",
            attributes: ["employee_no", "firstname", "middlename", "lastname"],
          },
          {
            model: Model.SalesOrderDetails,
            as: "salesOrderDetails",
            attributes: [
              "id",
              "sku",
              "variant_details",
              "remarks",
              "return_remarks",
              "quantity",
              "quantity_returned",
              "rate_amount",
              "discount_percentage",
              "discount_amount",
              "total_discount_amount",
              "amount",
              "product_id",
              "date",
              "discount_type",
              "claim_type",
              "status",
              "is_flash_deal",
            ],
            where: { is_deleted: NO },
            include: [
              {
                model: Model.Products,
                as: "products",
                attributes: ["name", "description"],
              },
            ],
            required: false,
          },
        ],
      };
      data = await Model.SalesOrders.findByPk(req.params.id, criteria);
      if (_.isEmpty(data)) {
        errors.push("Data doesn't exist.");
        throw new ErrorHandler(404, errors);
      }

      handleSuccess(res, {
        statusCode: 200,
        message: message,
        result: _.omit(data.get({ plain: true }), ["is_deleted"]),
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Count all
   * @route GET /salesOrders/count/all
   */
  countAll: async (req, res, next) => {
    let errors = [],
      message = "Successfully count all data.",
      count,
      criteria;

    try {
      criteria = { where: { is_deleted: NO } };
      count = await Model.SalesOrders.count(criteria);

      handleSuccess(res, {
        statusCode: 200,
        message: message,
        result: count,
      });
    } catch (err) {
      next(err);
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
        let initialValues,
          data,
          criteria,
          computedTotalBalanceAmount,
          totalBalanceAmount;

        // Validate Data
        criteria = { where: { id: obj.sales_order_id, is_deleted: NO } };
        data = await Model.SalesOrders.findOne(criteria);
        if (_.isEmpty(data)) {
          resolve(false);
        }

        switch (obj.type) {
          case "INSERT":
            computedTotalBalanceAmount =
              parseFloat(data.total_balance_amount) - parseFloat(obj.amount);
            totalBalanceAmount =
              computedTotalBalanceAmount > 0 ? computedTotalBalanceAmount : 0;
            break;
          case "DELETE":
            computedTotalBalanceAmount =
              parseFloat(data.total_balance_amount) + parseFloat(obj.amount);
            totalBalanceAmount = computedTotalBalanceAmount;
            break;
        }

        const updatedAt = moment().utc(8).format("YYYY-MM-DD HH:mm:ss");
        const isPaid =
          parseFloat(data.total_amount) === totalBalanceAmount ? NO : YES;
        const isFullyPaid = computedTotalBalanceAmount > 0 ? NO : YES;

        initialValues = {
          total_balance_amount: totalBalanceAmount,
          updated_at: updatedAt,
          is_paid: isPaid,
          is_fully_paid: isFullyPaid,
        };
        data.update(initialValues).then((response) => {
          resolve(true);
        });
      } catch (err) {
        reject(err);
      }
    });
  },
};

/**
 * Private Functions
 */
const generateOrderNo = () => {
  return new Promise(async (resolve, reject) => {
    let data, criteria, value;

    try {
      let date = moment().utc(8).format("YYYY-MM-DD");
      date = date.split("-").join("");
      // Pre-setting variables
      criteria = {
        attributes: ["order_no"],
        where: { order_no: { $ne: null }, is_deleted: NO },
        order: [["id", "DESC"]],
      };
      // Execute findOne query
      data = await Model.SalesOrders.findOne(criteria);
      if (_.isEmpty(data)) {
        value = `SO${date}-000001`;
      } else {
        let numLength = 6;
        let stringNumber = data.order_no.substring(11);
        let newNumber = parseInt(stringNumber) + 1;
        let leadingZero = Array(
          numLength - newNumber.toString().length + 1
        ).join(0);
        value = `SO${date}-${leadingZero}${newNumber}`;
      }
      resolve(value);
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
};

const setSalesOrderParameters = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Setting data of sales order details
      const todayFlashDeal = await ProductFlashDealsController.getTodayFlashDeal();
      // let salesOrderDetails = params.details;
      params.sub_total_amount = 0;
      params.vat_amount = null;
      params.shipping_fee_amount = null;
      params.total_discount_amount = null;
      params.total_amount = 0;
      params.total_balance_amount = 0;

      // Override sales order details value
      for (let index = 0; index < params.details.length; index++) {
        const details = params.details[index];
        const inventoryDataBySKU = await InventoriesController.getDataBySKU(
          details.sku
        );
        const rateAmount = parseFloat(inventoryDataBySKU.price_amount);
        const quantity = parseFloat(details.quantity);

        // Computation for discount amount via Flash Deal
        if (
          details.is_flash_deal &&
          todayFlashDeal &&
          todayFlashDeal.productFlashDealDetails
        ) {
          const productFlashDeal = todayFlashDeal.productFlashDealDetails.find(
            (detail) => detail.product_id === details.product_id
          );
          const discountPercentage = parseFloat(
            productFlashDeal.discount_percentage
          );

          params.details[index].discount_percentage = discountPercentage;
          params.details[index].discount_amount =
            productFlashDeal.discount_amount;
          params.details[index].product_flash_deal_detail_id =
            productFlashDeal.id;
          params.details[index].discount_type = productFlashDeal.discount_type;
        }

        // Computation for standard amount
        const discountAmount =
          details.discount_type === DISCOUNT_TYPE_PERCENTAGE
            ? (rateAmount * details.discount_percentage) / 100
            : details.discount_amount;

        params.details[index].discount_amount = discountAmount;
        params.details[index].total_discount_amount = details.discount_amount
          ? details.discount_amount * quantity
          : 0;
        params.details[index].rate_amount = rateAmount;
        params.details[index].amount = rateAmount * quantity;

        // Computation for sales order amount
        params.sub_total_amount += params.details[index].amount;
        params.total_discount_amount +=
          params.details[index].total_discount_amount;
      }

      params.vat_amount = params.is_with_vat
        ? (params.sub_total_amount * 12) / 100
        : null;
      params.total_amount =
        params.sub_total_amount -
        (params.vat_amount +
          params.shipping_fee_amount +
          params.total_discount_amount);
      params.total_balance_amount = params.total_amount;

      resolve(params);
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
};
