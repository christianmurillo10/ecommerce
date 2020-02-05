'use strict';
module.exports = (sequelize, DataTypes) => {
  const ProductSubCategories = sequelize.define('ProductSubCategories', {
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
    'product_category_id': {
      type: DataTypes.INTEGER(11),
      references: {
        model: 'product_categories',
        key: 'id'
      },
      comment: 'refd to product_categories.id',
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
    tableName: "product_sub_categories",
    timestamps: false
  });
  
  ProductSubCategories.associate = (models) => {
    ProductSubCategories.belongsTo(models.ProductCategories, {
      foreignKey: 'product_category_id',
      as: 'productCategories'
    });
  };

  return ProductSubCategories;
};