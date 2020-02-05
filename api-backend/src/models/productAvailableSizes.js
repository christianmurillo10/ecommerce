'use strict';
module.exports = (sequelize, DataTypes) => {
  const ProductAvailableSizes = sequelize.define('ProductAvailableSizes', {
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
    tableName: "product_available_sizes",
    timestamps: false
  });
  
  ProductAvailableSizes.associate = (models) => {
    ProductAvailableSizes.belongsTo(models.Users, {
      foreignKey: 'user_id',
      as: 'users'
    });
    ProductAvailableSizes.belongsTo(models.Products, {
      foreignKey: 'product_id',
      as: 'products'
    });
  };

  return ProductAvailableSizes;
};