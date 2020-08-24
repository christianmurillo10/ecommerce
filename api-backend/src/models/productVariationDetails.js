'use strict';
module.exports = (sequelize, DataTypes) => {
  const ProductVariationDetails = sequelize.define('ProductVariationDetails', {
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
    'user_id': {
      type: DataTypes.INTEGER(11),
      references: {
        model: 'users',
        key: 'id'
      },
      comment: 'refd to users.id',
      allowNull: false
    },
    'product_variation_id': {
      type: DataTypes.INTEGER(11),
      references: {
        model: 'product_variations',
        key: 'id'
      },
      comment: 'refd to product_variations.id',
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
    tableName: "product_variation_details",
    timestamps: false
  });
  ProductVariationDetails.associate = (models) => {
    ProductVariationDetails.belongsTo(models.Users, {
      foreignKey: 'user_id',
      as: 'users'
    });
    ProductVariationDetails.belongsTo(models.ProductVariations, {
      foreignKey: 'product_variation_id',
      as: 'productVariations'
    });
  };

  return ProductVariationDetails;
};