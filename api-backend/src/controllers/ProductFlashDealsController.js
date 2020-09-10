const Model = require('../models');
const { 
  NO, 
  YES,
  PRODUCT_IMAGES_TYPE_MAIN,
  PRODUCT_IMAGES_TYPE_THUMBNAIL,
  PRODUCT_IMAGES_TYPE_FEATURED,
  PRODUCT_IMAGES_TYPE_FASH_DEAL
} = require('../helpers/constant-helper');

module.exports = {
  /**
   * Create
   * @param req
   * @param res
   * @returns {Promise<void>}
   * @routes POST /productFlashDeals/create
   */
  create: async (req, res) => {
    const params = req.body;
    let criteria, criteriaFindExistingDate, initialValues, data, dataFindExistingDate;

    // Validators
    if (_.isUndefined(params))
      return res.badRequest({ err: "Invalid Parameter: [params]" });
    if (_.isEmpty(params))
      return res.badRequest({ err: "Empty Parameter: [params]" });

    // Override variables
    params.created_at = moment().utc(8).format('YYYY-MM-DD HH:mm:ss');
    params.user_id = req.user.id.toLocaleString();

    try {
      // Validators
      if (_.isEmpty(params.title)) return res.json({ status: 200, message: "Title is required.", result: false });
      if (_.isEmpty(params.date_from)) return res.json({ status: 200, message: "Date From is required.", result: false });
      if (_.isEmpty(params.date_to)) return res.json({ status: 200, message: "Date To is required.", result: false });

      // Pre-setting variables
      criteria = { where: { title: params.title } };
      criteriaFindExistingDate = { 
        attributes: ['id', 'title', 'date_from', 'date_to'],
        where: { 
          date_from: { $lte: params.date_from },
          date_to: { $gte: params.date_from },
          is_deleted: NO
        },
      };
      initialValues = _.pick(params, ['title', 'date_from', 'date_to', 'user_id', 'created_at']);
      // Pre-setting variables
      // Execute findAll query
      data = await Model.ProductFlashDeals.findAll(criteria);
      if (_.isEmpty(data[0])) {
        dataFindExistingDate = await Model.ProductFlashDeals.findOne(criteriaFindExistingDate);
        if (_.isEmpty(dataFindExistingDate)) {
          let finalData = await Model.ProductFlashDeals.create(initialValues);
          res.json({
            status: 200,
            message: "Successfully created data.",
            result: _.omit(finalData.get({ plain: true }), ['is_deleted'])
          });
        } else {
          res.json({
            status: 200,
            message: "Date already exist.",
            result: false
          });
        }
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
   * @route PUT /productFlashDeals/update/:id
   * @param req
   * @param res
   * @returns {never}
   */
  update: async (req, res) => {
    const params = req.body;
    let criteria, initialValues, data, dataFindExistingDate;

    if (_.isUndefined(params))
      return res.badRequest({ err: "Invalid Parameter: [params]" });
    if (_.isEmpty(params))
      return res.badRequest({ err: "Empty Parameter: [params]" });

    try {
      // Pre-setting variables
      criteria = { 
        attributes: ['id', 'title', 'date_from', 'date_to'],
        where: { 
          date_from: { $lte: params.date_from },
          date_to: { $gte: params.date_from },
          is_deleted: NO
        },
      };
      initialValues = _.pick(params, ['title', 'date_from', 'date_to', 'is_active']);
      // Execute findByPk query
      data = await Model.ProductFlashDeals.findByPk(req.params.id);
      if (!_.isEmpty(data)) {
        dataFindExistingDate = await Model.ProductFlashDeals.findOne(criteria);
        if (_.isEmpty(dataFindExistingDate)) {
          let finalData = await data.update(initialValues);
          res.json({
            status: 200,
            message: "Successfully updated data.",
            result: finalData
          });
        } else {
          res.json({
            status: 200,
            message: "Date already exist.",
            result: false
          });
        }
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
   * @route PUT /productFlashDeals/delete/:id
   * @param req
   * @param res
   * @returns {never}
   */
  delete: async (req, res) => {
    let data;

    try {
      // Execute findByPk query
      data = await Model.ProductFlashDeals.findByPk(req.params.id);
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
   * @route POST /productFlashDeals/search/:value
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
      query = `SELECT id, title, date_from, date_to, created_at, updated_at, is_active FROM product_flash_deals WHERE CONCAT(title) LIKE ? AND is_deleted = ${NO};`;
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
   * @route GET /productFlashDeals
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
      data = await Model.ProductFlashDeals.findAll(criteria);
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
   * Find all
   * @route GET /productFlashDeals/findOne/todayFlashDeal
   * @param req
   * @param res
   * @returns {never}
   */
  findTodayFlashDeal: async (req, res) => {
    let data, criteria;

    try {
      let dateToday = moment().utc(8).format('YYYY-MM-DD');
      // Pre-setting variables
      criteria = { 
        attributes: ['id', 'title', 'date_from', 'date_to'],
        where: { 
          date_from: { $lte: dateToday },
          date_to: { $gte: dateToday },
          is_active: YES, 
          is_deleted: NO
        },
        order: [ ['id', 'DESC'] ],
        include: [
          { 
            model: Model.ProductFlashDealDetails, 
            as: "productFlashDealDetails", 
            attributes: [ 'id', 'discount_percentage', 'discount_amount', 'base_price_amount', 'current_price_amount', 'product_id', 'discount_type'],
            where: { is_deleted: NO },
            order: [ ['id', 'ASC'] ],
            include: [
              { 
                model: Model.Products, 
                as: "products", 
                attributes: ['name', 'unit'],
                where: { is_published: YES, is_deleted: NO },
                include: [
                  { 
                    model: Model.ProductImages, as: "productImages", 
                    attributes: ['file_name', 'order', 'type'],
                    where: { type: PRODUCT_IMAGES_TYPE_FASH_DEAL, is_deleted: NO },
                    order: [ ['id', 'ASC'] ],
                    separate: true,
                    required: false 
                  },
                ],
                required: false 
              },
            ],
            separate: true,
            required: false 
          },
        ]
      };
      // Execute findAll query
      data = await Model.ProductFlashDeals.findOne(criteria);
      if (!_.isEmpty(data)) {
        res.json({
          status: 200,
          message: "Successfully find data.",
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
        message: "Failed to find data."
      });
    }
  },

  /**
   * Find by id
   * @route GET /productFlashDeals/:id
   * @param req
   * @param res
   * @returns {never}
   */
  findById: async (req, res) => {
    let data;

    try {
      // Execute findAll query
      data = await Model.ProductFlashDeals.findByPk(req.params.id);
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