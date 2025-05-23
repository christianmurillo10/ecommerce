'use strict';
module.exports = (sequelize, DataTypes) => {
  const ProductSubSubCategories = sequelize.define('ProductSubSubCategories', {
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
    'product_sub_category_id': {
      type: DataTypes.INTEGER(11),
      references: {
        model: 'product_sub_categories',
        key: 'id'
      },
      comment: 'refd to product_sub_categories.id',
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
    tableName: "product_sub_sub_categories",
    timestamps: false
  });
  
  ProductSubSubCategories.associate = (models) => {
    ProductSubSubCategories.belongsTo(models.ProductCategories, {
      foreignKey: 'product_category_id',
      as: 'productCategories'
    });
    ProductSubSubCategories.belongsTo(models.ProductSubCategories, {
      foreignKey: 'product_sub_category_id',
      as: 'productSubCategories'
    });
  };

  return ProductSubSubCategories;
};