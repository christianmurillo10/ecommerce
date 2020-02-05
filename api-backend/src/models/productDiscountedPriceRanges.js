'use strict';
module.exports = (sequelize, DataTypes) => {
  const ProductDiscountedPriceRanges = sequelize.define('ProductDiscountedPriceRanges', {
    'id': {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    'quantity_from': {
      type: DataTypes.INTEGER(12),
      allowNull: false,
      defaultValue: '0'
    },
    'quantity_to': {
      type: DataTypes.INTEGER(12),
      allowNull: false,
      defaultValue: '0'
    },
    'price': {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: '0.00'
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
    tableName: "product_discounted_price_ranges",
    timestamps: false
  });
  
  ProductDiscountedPriceRanges.associate = (models) => {
    ProductDiscountedPriceRanges.belongsTo(models.Products, {
      foreignKey: 'product_id',
      as: 'products'
    });
  };

  return ProductDiscountedPriceRanges;
};