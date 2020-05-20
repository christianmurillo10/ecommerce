'use strict';
module.exports = (sequelize, DataTypes) => {
  const CustomerCarts = sequelize.define('CustomerCarts', {
    'id': {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    'sku': {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    'quantity': {
      type: DataTypes.INTEGER(12),
      allowNull: false,
      defaultValue: '0'
    },
    'price_amount': {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: '0.00'
    },
    'discount_amount': {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
      defaultValue: '0.00'
    },
    'total_price_amount': {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: '0.00'
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
    'customer_id': {
      type: DataTypes.INTEGER(11),
      references: {
        model: 'customers',
        key: 'id'
      },
      comment: 'refd to customers.id',
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
    }
  }, {
    tableName: "customer_carts",
    timestamps: false
  });
  
  CustomerCarts.associate = (models) => {
    CustomerCarts.belongsTo(models.Products, {
      foreignKey: 'product_id',
      as: 'products'
    });
    CustomerCarts.belongsTo(models.Customers, {
      foreignKey: 'customer_id',
      as: 'customers'
    });
  };

  return CustomerCarts;
};