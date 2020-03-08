'use strict';
module.exports = (sequelize, DataTypes) => {
  const ProductCategories = sequelize.define('ProductCategories', {
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
    'description': {
      type: DataTypes.TEXT,
      allowNull: true
    },
    'icon_file_name': {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'image (32x32)'
    },
    'banner_file_name': {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'image (968x230)'
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
    'is_featured': {
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
    tableName: "product_categories",
    timestamps: false
  });
  ProductCategories.associate = (models) => {
    ProductCategories.hasMany(models.ProductSubCategories, {
      foreignKey: 'product_category_id',
      as: 'productSubCategories'
    });
    ProductCategories.hasMany(models.ProductSubSubCategories, {
      foreignKey: 'product_category_id',
      as: 'productSubSubCategories'
    });
  };
  return ProductCategories;
};