'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('product_categories', [
      {
        name: 'Accessories',
        description: 'Accessories',
        created_at: new Date(),
        updated_at: new Date(),
        is_deleted: 0
      },
      {
        name: 'Helmets',
        description: 'Helmets',
        created_at: new Date(),
        updated_at: new Date(),
        is_deleted: 0
      },
      {
        name: 'Parts',
        description: 'Parts',
        created_at: new Date(),
        updated_at: new Date(),
        is_deleted: 0
      },
      {
        name: 'Riding Gear',
        description: 'Riding Gear',
        created_at: new Date(),
        updated_at: new Date(),
        is_deleted: 0
      },
      {
        name: 'Tires',
        description: 'Tires',
        created_at: new Date(),
        updated_at: new Date(),
        is_deleted: 0
      }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('product_categories', null, {});
  }
};
