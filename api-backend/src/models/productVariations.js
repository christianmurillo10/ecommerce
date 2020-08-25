'use strict';
module.exports = (sequelize, DataTypes) => {
  const ProductVariations = sequelize.define('ProductVariations', {
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
    tableName: "product_variations",
    timestamps: false
  });

  ProductVariations.associate = (models) => {
    ProductVariations.hasMany(models.ProductVariationDetails, {
      foreignKey: 'product_variation_id',
      as: 'productVariationDetails'
    });
  };

  return ProductVariations;
};