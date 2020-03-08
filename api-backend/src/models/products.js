'use strict';
module.exports = (sequelize, DataTypes) => {
  const Products = sequelize.define('Products', {
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
    'vat_amount': {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: '0.00'
    },
    'discount_amount': {
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
    'vat_type': {
      type: DataTypes.SMALLINT(1),
      comment: '1=Amount 2=Percentage',
      allowNull: false,
      defaultValue: '1'
    },
    'discount_type': {
      type: DataTypes.SMALLINT(1),
      comment: '1=Amount 2=Percentage',
      allowNull: false,
      defaultValue: '1'
    },
    'is_today_deal': {
      type: DataTypes.SMALLINT(1),
      allowNull: false,
      defaultValue: '0'
    },
    'is_featured': {
      type: DataTypes.SMALLINT(1),
      allowNull: false,
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
    Products.hasOne(models.Inventories, {
      foreignKey: 'product_id',
      as: 'inventories'
    });
  };

  return Products;
};