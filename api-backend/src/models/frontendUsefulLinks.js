'use strict';
module.exports = (sequelize, DataTypes) => {
  const FrontendUsefulLinks = sequelize.define('FrontendUsefulLinks', {
    'id': {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    'name': {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    'url': {
      type: DataTypes.STRING(255),
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
    'is_deleted': {
      type: DataTypes.SMALLINT(1),
      allowNull: false,
      defaultValue: '0'
    }
  }, {
    tableName: "frontend_useful_links",
    timestamps: false
  });
  FrontendUsefulLinks.associate = (models) => {};
  return FrontendUsefulLinks;
};