const Model = require("../models");
const { ErrorHandler, handleSuccess } = require("../helpers/response-helper");
const { NO, YES } = require("../helpers/constant-helper");

module.exports = {
  /**
   * Create
   * @routes POST /productVariations/create
   */
  create: async (req, res, next) => {
    const params = req.body;
    let errors = [],
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
      params.created_at = moment().utc(8).format("YYYY-MM-DD HH:mm:ss");

      if (_.isEmpty(params.name)) errors.push("Name is required.");
      if (_.isEmpty(params.details) || params.details.length < 1)
        errors.push("Details is required.");
      if (errors.length > 0) {
        throw new ErrorHandler(400, errors);
      }

      // Validate Data
      criteria = { where: { name: params.name } };
      data = await Model.ProductVariations.findAll(criteria);
      if (!_.isEmpty(data[0])) {
        errors.push("Data already exist.");
        throw new ErrorHandler(500, errors);
      }

      // Pre-setting variables
      initialValues = _.pick(params, ["name", "created_at"]);

      await Model.ProductVariations.create(initialValues)
        .then(() => Model.ProductVariations.findOrCreate(criteria))
        .then(([finalData, created]) => {
          let plainData = finalData.get({ plain: true });

          // 1. Set and filtering Bulk Data of Product Variant Details
          const productVariationDetails = params.details;
          let productVariationDetailsInitialValue = [];
          productVariationDetails.forEach((element) => {
            let productVariationDetailsData = {
              code: element.code,
              name: element.name,
              product_variation_id: plainData.id,
            };
            productVariationDetailsInitialValue.push(
              productVariationDetailsData
            );
          });

          // 2. Saving Bulk Product Variant Details
          Model.ProductVariationDetails.bulkCreate(
            productVariationDetailsInitialValue
          ).then((response) => {
            handleSuccess(res, {
              statusCode: 201,
              message: "Successfully created data.",
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
   * @route PUT /productVariations/update/:id
   */
  update: async (req, res, next) => {
    const params = req.body;
    let errors = [],
      initialValues,
      data,
      criteria;

    try {
      // Validators
      if (_.isEmpty(params)) {
        errors.push("Invalid Parameter.");
        throw new ErrorHandler(400, errors);
      }

      // Override variables
      params.updated_at = moment().utc(8).format("YYYY-MM-DD HH:mm:ss");

      // Validate Data
      criteria = { where: { is_deleted: NO } };
      data = await Model.ProductVariations.findByPk(req.params.id);
      if (_.isEmpty(data)) {
        errors.push("Data doesn't exist.");
        throw new ErrorHandler(500, errors);
      }

      // Pre-setting variables
      initialValues = _.pick(params, ["name"]);

      await data.update(initialValues).then(() =>
        Model.ProductVariations.findByPk(data.id, criteria).then(
          async (finalData) => {
            let plainData = finalData.get({ plain: true });

            if (params.details) {
              // 1. Set and filtering bulk data of product variation details
              const productVariationDetails = params.details;
              let productVariationDetailsInitialUpdateValue = [];
              let productVariationDetailsInitialCreateValue = [];
              let existingIds = [];
              productVariationDetails.forEach((element) => {
                let productVariationDetailsData = {
                  id: element.id,
                  code: element.code,
                  name: element.name,
                  product_variation_id: plainData.id,
                };

                if (_.isUndefined(element.id)) {
                  productVariationDetailsInitialCreateValue.push(
                    _.omit(productVariationDetailsData, ["id"])
                  );
                } else {
                  productVariationDetailsInitialUpdateValue.push(
                    productVariationDetailsData
                  );
                  existingIds.push(element.id);
                }
              });

              // 2. UPDATE
              if (productVariationDetailsInitialUpdateValue.length > 0) {
                // 2.1 Update product variation details
                for (
                  let i = 0;
                  i < productVariationDetailsInitialUpdateValue.length;
                  i++
                ) {
                  let detailsUpdateValue =
                    productVariationDetailsInitialUpdateValue[i];
                  let dataDetails = await Model.ProductVariationDetails.findByPk(
                    detailsUpdateValue.id
                  );
                  if (!_.isEmpty(dataDetails)) {
                    // 2.1.1 Update product variation details
                    await dataDetails.update(detailsUpdateValue);
                  }
                }

                // 2.2 Delete product variation details
                let criteriaDetails = {
                  where: {
                    id: { $notIn: existingIds },
                    product_variation_id: plainData.id,
                    is_deleted: NO,
                  },
                };
                await Model.ProductVariationDetails.update(
                  { is_deleted: YES },
                  criteriaDetails
                );
              }

              // 3. CREATE
              if (productVariationDetailsInitialCreateValue.length > 0) {
                // 3.1 Create bulk product variation details
                await Model.ProductVariationDetails.bulkCreate(
                  productVariationDetailsInitialCreateValue
                );
              }
            }

            handleSuccess(res, {
              statusCode: 200,
              message: "Successfully updated data.",
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
   * Delete
   * @route PUT /productVariations/delete/:id
   */
  delete: async (req, res, next) => {
    let errors = [],
      data;

    try {
      // Validate Data
      data = await Model.ProductVariations.findByPk(req.params.id);
      if (_.isEmpty(data)) {
        errors.push("Data doesn't exist.");
        throw new ErrorHandler(500, errors);
      }
      let finalData = await data.update({ is_deleted: YES });

      handleSuccess(res, {
        statusCode: 200,
        message: "Successfully deleted data.",
        result: finalData,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Find all
   * @route GET /productVariations
   */
  findAll: async (req, res, next) => {
    let errors = [],
      data,
      criteria;

    try {
      // Validate Data
      criteria = { where: { is_deleted: NO } };
      data = await Model.ProductVariations.findAll(criteria);
      if (_.isEmpty(data[0])) {
        errors.push("No data found.");
        throw new ErrorHandler(500, errors);
      }

      handleSuccess(res, {
        statusCode: 200,
        message: "Successfully find all data.",
        result: data,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Find by id
   * @route GET /productVariations/:id
   */
  findById: async (req, res, next) => {
    let errors = [],
      data,
      criteria;

    try {
      // Validate Data
      criteria = {
        where: { is_deleted: NO },
        include: [
          {
            model: Model.ProductVariationDetails,
            as: "productVariationDetails",
            attributes: ["id", "code", "name"],
            where: { is_deleted: NO },
            required: false,
          },
        ],
      };
      data = await Model.ProductVariations.findByPk(req.params.id, criteria);
      if (_.isEmpty(data)) {
        errors.push("No data found.");
        throw new ErrorHandler(500, errors);
      }

      handleSuccess(res, {
        statusCode: 200,
        message: "Successfully find data.",
        result: _.omit(data.get({ plain: true }), ["is_deleted"]),
      });
    } catch (err) {
      next(err);
    }
  },
};
