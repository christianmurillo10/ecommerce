'use strict';
module.exports = (sequelize, DataTypes) => {
  const Inventories = sequelize.define('Inventories', {
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
    'sku': {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    'quantity_in': {
      type: DataTypes.INTEGER(12),
      allowNull: false,
      defaultValue: '0'
    },
    'quantity_out': {
      type: DataTypes.INTEGER(12),
      allowNull: true,
      defaultValue: '0'
    },
    'quantity_reserved': {
      type: DataTypes.INTEGER(12),
      allowNull: true,
      defaultValue: '0'
    },
    'quantity_returned': {
      type: DataTypes.INTEGER(12),
      allowNull: true,
      defaultValue: '0'
    },
    'quantity_available': {
      type: DataTypes.INTEGER(12),
      allowNull: false,
      defaultValue: '0'
    },
    'unit': {
      type: DataTypes.STRING(100),
      comment: 'ex: kg, pc, etc.',
      allowNull: false
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
    tableName: "inventories",
    timestamps: false
  });
  
  Inventories.associate = (models) => {
    Inventories.belongsTo(models.Users, {
      foreignKey: 'user_id',
      as: 'users'
    });
    Inventories.belongsTo(models.Products, {
      foreignKey: 'product_id',
      as: 'products'
    });
  };

  return Inventories;
};