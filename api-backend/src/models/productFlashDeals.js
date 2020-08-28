'use strict';
module.exports = (sequelize, DataTypes) => {
  const ProductFlashDeals = sequelize.define('ProductFlashDeals', {
    'id': {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    'title': {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    'user_id': {
      type: DataTypes.INTEGER(11),
      references: {
        model: 'users',
        key: 'id'
      },
      comment: 'refd to users.id',
      allowNull: false
    },
    'date_from': {
      type: 'DATE',
      allowNull: false,
      defaultValue: sequelize.NOW
    },
    'date_to': {
      type: 'DATE',
      allowNull: false,
      defaultValue: sequelize.NOW
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
    'is_active': {
      type: DataTypes.SMALLINT(1),
      allowNull: false,
      defaultValue: '1'
    },
    'is_deleted': {
      type: DataTypes.SMALLINT(1),
      allowNull: false,
      defaultValue: '0'
    }
  }, {
    tableName: "product_flash_deals",
    timestamps: false
  });
  
  ProductFlashDeals.associate = (models) => {
    ProductFlashDeals.belongsTo(models.Users, {
      foreignKey: 'user_id',
      as: 'users'
    });
    ProductFlashDeals.hasMany(models.ProductFlashDealDetails, {
      foreignKey: 'product_flash_deal_id',
      as: 'productFlashDealDetails'
    });
  };

  return ProductFlashDeals;
};