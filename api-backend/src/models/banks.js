'use strict';
module.exports = (sequelize, DataTypes) => {
  const Banks = sequelize.define('Banks', {
    'id': {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    'code': {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    'name': {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    'description': {
      type: DataTypes.TEXT,
      allowNull: true
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
    'is_deleted': {
      type: DataTypes.SMALLINT(1),
      allowNull: false,
      defaultValue: '0'
    }
  }, {
    tableName: "banks",
    timestamps: false
  });
  Banks.associate = (models) => {};
  return Banks;
};