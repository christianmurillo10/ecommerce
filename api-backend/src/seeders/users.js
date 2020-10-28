'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('users', [
      {
        email: 'admin@mail.com',
        username: 'admin',
        password: '$2b$10$PjNaNAV3jschHk7dZurCPOr6hjY4WeJDuWR7g1bvqnAvdECIJ7C.K',
        role_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
        permission_type: 1,
        is_logged: 0,
        is_active: 1,
        is_deleted: 0
      }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {});
  }
};
