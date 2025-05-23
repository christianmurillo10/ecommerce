'use strict';
module.exports = (sequelize, DataTypes) => {
  const Products = sequelize.define('Products', {
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
    'description': {
      type: DataTypes.TEXT,
      allowNull: true
    },
    'unit': {
      type: DataTypes.STRING(100),
      comment: 'ex: kg, pc, etc.',
      allowNull: false
    },
    'tags': {
      type: DataTypes.TEXT,
      allowNull: true
    },
    'price_amount': {
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
    'product_store_id': {
      type: DataTypes.INTEGER(11),
      references: {
        model: 'product_stores',
        key: 'id'
      },
      comment: 'refd to product_stores.id',
      allowNull: false
    },
    'product_brand_id': {
      type: DataTypes.INTEGER(11),
      references: {
        model: 'product_brands',
        key: 'id'
      },
      comment: 'refd to product_brands.id',
      allowNull: false
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
    'product_sub_sub_category_id': {
      type: DataTypes.INTEGER(11),
      references: {
        model: 'product_sub_sub_categories',
        key: 'id'
      },
      comment: 'refd to product_sub_sub_categories.id',
      allowNull: true
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
      allowNull: true,
      defaultValue: '0'
    },
    'is_published': {
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
    tableName: "products",
    timestamps: false
  });
  
  Products.associate = (models) => {
    Products.belongsTo(models.ProductStores, {
      foreignKey: 'product_store_id',
      as: 'productStores'
    });
    Products.belongsTo(models.ProductBrands, {
      foreignKey: 'product_brand_id',
      as: 'productBrands'
    });
    Products.belongsTo(models.ProductCategories, {
      foreignKey: 'product_category_id',
      as: 'productCategories'
    });
    Products.belongsTo(models.ProductSubCategories, {
      foreignKey: 'product_sub_category_id',
      as: 'productSubCategories'
    });
    Products.belongsTo(models.ProductSubSubCategories, {
      foreignKey: 'product_sub_sub_category_id',
      as: 'productSubSubCategories'
    });
    Products.belongsTo(models.Users, {
      foreignKey: 'user_id',
      as: 'users'
    });
    Products.hasMany(models.ProductImages, {
      foreignKey: 'product_id',
      as: 'productImages'
    });
    Products.hasMany(models.ProductVariants, {
      foreignKey: 'product_id',
      as: 'productVariants'
    });
    Products.hasMany(models.ProductFlashDealDetails, {
      foreignKey: 'product_id',
      as: 'productFlashDealDetails'
    });
    Products.hasMany(models.Inventories, {
      foreignKey: 'product_id',
      as: 'inventories'
    });
  };

  return Products;
};