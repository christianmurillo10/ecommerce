const Model = require("../models");
const { NO, YES } = require("../helpers/constant-helper");

module.exports = {
  /**
   * Create
   * @param req
   * @param res
   * @returns {Promise<void>}
   * @routes POST /productVariations/create
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
    params.created_at = moment().utc(8).format("YYYY-MM-DD HH:mm:ss");

    try {
      // Validators
      if (_.isEmpty(params.name))
        return res.json({
          status: 200,
          message: "Name is required.",
          result: false,
        });

      // Pre-setting variables
      criteria = { where: { name: params.name } };
      initialValues = _.pick(params, ["name", "created_at"]);
      // Execute findAll query
      data = await Model.ProductVariations.findAll(criteria);
      if (_.isEmpty(data[0])) {
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
            ).then(async (response) => {
              res.json({
                status: 200,
                message: "Successfully created data.",
                result: _.omit(plainData, ["is_deleted"]),
              });
            });
          });
      } else {
        res.json({
          status: 200,
          message: "Data already exist.",
          result: false,
        });
      }
    } catch (err) {
      res.json({
        status: 401,
        err: err,
        message: "Failed creating data.",
      });
    }
  },

  /**
   * Update
   * @route PUT /productVariations/update/:id
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
      criteria = { where: { is_deleted: NO } };
      initialValues = _.pick(params, ["name"]);

      // Execute findByPk query
      data = await Model.ProductVariations.findByPk(req.params.id);
      if (!_.isEmpty(data)) {
        await data.update(initialValues).then(() =>
          Model.ProductVariations.findByPk(data.id, criteria).then(
            async (finalData) => {
              let plainData = finalData.get({ plain: true });
  
              // 1. Set and filtering bulk data of product variation details
              const productVariationDetails = params.details;
              let productVariationDetailsInitialUpdateValue = [];
              let productVariationDetailsInitialCreateValue = [];
              let existingIds = [];
              productVariationDetails.forEach(element => {
                let productVariationDetailsData = {
                  id: element.id,
                  code: element.code,
                  name: element.name,
                  product_variation_id: plainData.id,
                }
  
                if (_.isUndefined(element.id)) {
                  productVariationDetailsInitialCreateValue.push(_.omit(productVariationDetailsData, ["id"]));
                } else {
                  productVariationDetailsInitialUpdateValue.push(productVariationDetailsData);
                  existingIds.push(element.id);
                }
              });
            
              // 2. UPDATE
              if (productVariationDetailsInitialUpdateValue.length > 0) {
                // 2.1 Update product variation details
                for (let i = 0; i < productVariationDetailsInitialUpdateValue.length; i++) {
                  let detailsUpdateValue = productVariationDetailsInitialUpdateValue[i];
                  let dataDetails = await Model.ProductVariationDetails.findByPk(detailsUpdateValue.id);
                  if (!_.isEmpty(dataDetails)) {
                    // 2.1.1 Update product variation details
                    await dataDetails.update(detailsUpdateValue);
                  }
                }
  
                // 2.2 Delete product variation details
                let criteriaDetails = { where: { id: { $notIn: existingIds }, product_variation_id: plainData.id, is_deleted: NO } };
                await Model.ProductVariationDetails.update({ is_deleted: YES }, criteriaDetails);
              }

              // 3. CREATE
              if (productVariationDetailsInitialCreateValue.length > 0) {
                // 3.1 Create bulk product variation details
                await Model.ProductVariationDetails.bulkCreate(productVariationDetailsInitialCreateValue);
              }
  
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
   * @route PUT /productVariations/delete/:id
   * @param req
   * @param res
   * @returns {never}
   */
  delete: async (req, res) => {
    let data;

    try {
      // Execute findByPk query
      data = await Model.ProductVariations.findByPk(req.params.id);
      if (!_.isEmpty(data)) {
        let finalData = await data.update({ is_deleted: YES });
        res.json({
          status: 200,
          message: "Successfully deleted data.",
          result: finalData,
        });
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
        message: "Failed deleting data.",
      });
    }
  },

  /**
   * Search
   * @route POST /productVariations/search/:value
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
      query = `SELECT 
                id, 
                name, 
                created_at, 
                updated_at 
              FROM product_variations 
              WHERE CONCAT(name) LIKE ? AND is_deleted = ${NO};`;
      // Execute native query
      data = await Model.sequelize.query(query, {
        replacements: [`%${params.value}%`],
        type: Model.sequelize.QueryTypes.SELECT,
      });
      if (!_.isEmpty(data)) {
        res.json({
          status: 200,
          message: "Successfully searched data.",
          result: data,
        });
      } else {
        res.json({
          status: 200,
          message: "No Data Found.",
          result: false,
        });
      }
    } catch (err) {
      res.json({
        status: 401,
        err: err,
        message: "Failed to search data.",
      });
    }
  },

  /**
   * Find all
   * @route GET /productVariations
   * @param req
   * @param res
   * @returns {never}
   */
  findAll: async (req, res) => {
    let data, criteria;

    try {
      // Pre-setting variables
      criteria = { where: { is_deleted: NO } };
      // Execute findAll query
      data = await Model.ProductVariations.findAll(criteria);
      if (!_.isEmpty(data[0])) {
        res.json({
          status: 200,
          message: "Successfully find all data.",
          result: data,
        });
      } else {
        res.json({
          status: 200,
          message: "No Data Found.",
          result: false,
        });
      }
    } catch (err) {
      res.json({
        status: 401,
        err: err,
        message: "Failed to find all data.",
      });
    }
  },

  /**
   * Find by id
   * @route GET /productVariations/:id
   * @param req
   * @param res
   * @returns {never}
   */
  findById: async (req, res) => {
    let data, criteria;

    try {
      // Pre-setting variables
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
      // Execute findAll query
      data = await Model.ProductVariations.findByPk(req.params.id, criteria);
      if (!_.isEmpty(data)) {
        res.json({
          status: 200,
          message: "Successfully find data.",
          result: _.omit(data.get({ plain: true }), ["is_deleted"]),
        });
      } else {
        res.json({
          status: 200,
          message: "No Data Found.",
          result: false,
        });
      }
    } catch (err) {
      res.json({
        status: 401,
        err: err,
        message: "Failed to find data.",
      });
    }
  },
};
