'use strict';
module.exports = (sequelize, DataTypes) => {
  const ProductFlashDealDetails = sequelize.define('ProductFlashDealDetails', {
    'id': {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    'discount_value': {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
      defaultValue: '0.00'
    },
    'base_price_amount': {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: '0.00'
    },
    'current_price_amount': {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: '0.00'
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
    'product_id': {
      type: DataTypes.INTEGER(11),
      references: {
        model: 'products',
        key: 'id'
      },
      comment: 'refd to products.id',
      allowNull: false
    },
    'header_id': {
      type: DataTypes.INTEGER(11),
      references: {
        model: 'product_flash_deal_headers',
        key: 'id'
      },
      comment: 'refd to product_flash_deal_headers.id',
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
    'discount_type': {
      type: DataTypes.SMALLINT(1),
      comment: '1=Amount 2=Percentage',
      allowNull: true,
      defaultValue: '1'
    },
    'is_deleted': {
      type: DataTypes.SMALLINT(1),
      allowNull: false,
      defaultValue: '0'
    }
  }, {
    tableName: "product_flash_deal_details",
    timestamps: false
  });
  
  ProductFlashDealDetails.associate = (models) => {
    ProductFlashDealDetails.belongsTo(models.Users, {
      foreignKey: 'user_id',
      as: 'users'
    });
    ProductFlashDealDetails.belongsTo(models.ProductFlashDealHeaders, {
      foreignKey: 'header_id',
      as: 'productFlashDealHeaders'
    });
  };

  return ProductFlashDealDetails;
};