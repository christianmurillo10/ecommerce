'use strict';
module.exports = (sequelize, DataTypes) => {
  const SalesOrderShippingDetails = sequelize.define('SalesOrderShippingDetails', {
    'id': {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    'shipping_no': {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    'address': {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    'amount': {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: '0.00'
    },
    'shipping_method_id': {
      type: DataTypes.INTEGER(11),
      references: {
        model: 'shipping_methods',
        key: 'id'
      },
      comment: 'refd to shipping_methods.id',
      allowNull: false
    },
    'shipping_method_rate_id': {
      type: DataTypes.INTEGER(11),
      references: {
        model: 'shipping_method_rates',
        key: 'id'
      },
      comment: 'refd to shipping_method_rates.id',
      allowNull: false
    },
    'sales_order_id': {
      type: DataTypes.INTEGER(11),
      references: {
        model: 'sales_orders',
        key: 'id'
      },
      comment: 'refd to sales_orders.id',
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
    tableName: "sales_order_shipping_details",
    timestamps: false
  });
  
  SalesOrderShippingDetails.associate = (models) => {
    SalesOrderShippingDetails.belongsTo(models.ShippingMethods, {
      foreignKey: 'shipping_method_id',
      as: 'shippingMethods'
    });
    SalesOrderShippingDetails.belongsTo(models.ShippingMethodRates, {
      foreignKey: 'shipping_method_rate_id',
      as: 'shippingMethodRates'
    });
    SalesOrderShippingDetails.belongsTo(models.SalesOrders, {
      foreignKey: 'sales_order_id',
      as: 'salesOrders'
    });
  };

  return SalesOrderShippingDetails;
};