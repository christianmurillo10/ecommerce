'use strict';
const bcrypt = require('../helpers/bcrypt-helper');

module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define('Users', {
    'id': {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    'email': {
      type: DataTypes.STRING(100), 
      allowNull: false
    },
    'username': {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    'password': {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    'role_id': {
      type: DataTypes.INTEGER(11),
      references: {
        model: 'roles',
        key: 'id'
      },
      comment: 'refd to roles.id',
      allowNull: false
    },
    'created_at': {
      type: 'TIMESTAMP',
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    'updated_at': {
      type: 'TIMESTAMP',
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    'permission_type': {
      type: DataTypes.SMALLINT(1),
      comment: '1=Role Permissions 2=User Permissions',
      allowNull: false,
      defaultValue: '1'
    },
    'is_logged': {
      type: DataTypes.SMALLINT(1),
      comment: '0=No 1=Yes',
      allowNull: false,
      defaultValue: '0'
    },
    'is_active': {
      type: DataTypes.SMALLINT(1),
      comment: '0=No 1=Yes',
      allowNull: false,
      defaultValue: '1'
    },
    'is_deleted': {
      type: DataTypes.SMALLINT(1),
      allowNull: false,
      defaultValue: '0'
    }
  }, {
    tableName: "users",
    timestamps: false
  });

  Users.associate = (models) => {
    Users.belongsTo(models.Roles, {
      foreignKey: 'role_id',
      as: 'roles'
    });
  };

  Users.beforeCreate(async (value, options) => {
    value.password = await bcrypt.hashPassword(value.password);
  });

  return Users;
};