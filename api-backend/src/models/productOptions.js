'use strict';
module.exports = (sequelize, DataTypes) => {
  const ProductOptions = sequelize.define('ProductOptions', {
    'id': {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    'title': {
      type: DataTypes.STRING(100),
      comment: 'ex: color, sizes, variations',
      allowNull: false
    },
    'values': {
      type: DataTypes.TEXT,
      allowNull: true
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
    tableName: "product_options",
    timestamps: false
  });

  ProductOptions.associate = (models) => {
    ProductOptions.belongsTo(models.Users, {
      foreignKey: 'user_id',
      as: 'users'
    });
    ProductOptions.belongsTo(models.Products, {
      foreignKey: 'product_id',
      as: 'products'
    });
  };

  return ProductOptions;
};