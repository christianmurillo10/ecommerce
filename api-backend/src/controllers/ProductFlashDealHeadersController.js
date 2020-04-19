const Model = require('../models');

module.exports = {
  /**
   * Create
   * @param req
   * @param res
   * @returns {Promise<void>}
   * @routes POST /productFlashDealHeaders/create
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
    params.user_id = req.user.id.toLocaleString();

    try {
      // Validators
      if (_.isEmpty(params.title)) return res.json({ status: 200, message: "Title is required.", result: false });
      if (_.isEmpty(params.date_from)) return res.json({ status: 200, message: "Date From is required.", result: false });
      if (_.isEmpty(params.date_to)) return res.json({ status: 200, message: "Date To is required.", result: false });

      // Pre-setting variables
      criteria = { where: { title: params.title } };
      initialValues = _.pick(params, ['title', 'date_from', 'date_to', 'user_id', 'created_at']);
      // Execute findAll query
      data = await Model.ProductFlashDealHeaders.findAll(criteria);
      if (_.isEmpty(data[0])) {
        let finalData = await Model.ProductFlashDealHeaders.create(initialValues);
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
   * @route PUT /productFlashDealHeaders/update/:id
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
      initialValues = _.pick(params, ['title', 'date_from', 'date_to', 'is_active']);
      // Execute findByPk query
      data = await Model.ProductFlashDealHeaders.findByPk(req.params.id);
      if (!_.isEmpty(data)) {
        let finalData = await data.update(initialValues);
        res.json({
          status: 200,
          message: "Successfully updated data.",
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
        message: "Failed updating data."
      });
    }
  },

  /**
   * Delete
   * @route PUT /productFlashDealHeaders/delete/:id
   * @param req
   * @param res
   * @returns {never}
   */
  delete: async (req, res) => {
    let data;

    try {
      // Execute findByPk query
      data = await Model.ProductFlashDealHeaders.findByPk(req.params.id);
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
   * @route POST /productFlashDealHeaders/search/:value
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
      query = `SELECT id, title, date_from, date_to, created_at, updated_at, is_active FROM product_flash_deal_headers WHERE CONCAT(title) LIKE ? AND is_deleted = 0;`;
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
   * @route GET /productFlashDealHeaders
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
      data = await Model.ProductFlashDealHeaders.findAll(criteria);
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
   * @route GET /productFlashDealHeaders/findOne/todayFlashDeal
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
          is_active: 1, 
          is_deleted: 0
        },
        order: [ ['id', 'DESC'] ],
        include: [
          { 
            model: Model.ProductFlashDealDetails, 
            as: "productFlashDealDetails", 
            attributes: [ 'id', 'discount_value', 'base_price_amount', 'current_price_amount', 'product_id', 'discount_type'],
            where: { is_deleted: 0 },
            order: [ ['id', 'ASC'] ],
            include: [
              { 
                model: Model.Products, 
                as: "products", 
                attributes: ['name', 'unit'],
                where: { is_published: 1, is_deleted: 0 },
                include: [
                  { 
                    model: Model.ProductImages, as: "productImages", 
                    attributes: ['file_name', 'order', 'type'],
                    where: { type: 4, is_deleted: 0 },
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
      data = await Model.ProductFlashDealHeaders.findOne(criteria);
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
   * @route GET /productFlashDealHeaders/:id
   * @param req
   * @param res
   * @returns {never}
   */
  findById: async (req, res) => {
    let data;

    try {
      // Execute findAll query
      data = await Model.ProductFlashDealHeaders.findByPk(req.params.id);
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