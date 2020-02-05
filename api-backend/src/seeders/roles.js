'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('roles', [
      {
        name: 'Superadministrator',
        description: 'Superadministrator',
        created_at: new Date(),
        updated_at: new Date(),
        is_deleted: 0
      }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('roles', null, {});
  }
};
