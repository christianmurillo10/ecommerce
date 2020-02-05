'use strict';
module.exports = (sequelize, DataTypes) => {
  const ProductImages = sequelize.define('ProductImages', {
    'id': {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    'file_name': {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    'color': {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    'order': {
      type: DataTypes.INTEGER(11),
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
    tableName: "product_images",
    timestamps: false
  });

  ProductImages.associate = (models) => {
    ProductImages.belongsTo(models.Products, {
      foreignKey: 'product_id',
      as: 'products'
    });
    ProductImages.belongsTo(models.Users, {
      foreignKey: 'user_id',
      as: 'users'
    });
  };

  return ProductImages;
};