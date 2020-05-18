'use strict';
module.exports = (sequelize, DataTypes) => {
  const ShippingMethodRates = sequelize.define('ShippingMethodRates', {
    'id': {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    'rate_amount': {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: '0.00'
    },
    'subtotal_amount_from': {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
      defaultValue: '0.00'
    },
    'subtotal_amount_to': {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
      defaultValue: '0.00'
    },
    'quantity_from': {
      type: DataTypes.INTEGER(12),
      allowNull: true,
      defaultValue: '0'
    },
    'quantity_to': {
      type: DataTypes.INTEGER(12),
      allowNull: true,
      defaultValue: '0'
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
    tableName: "shipping_method_rates",
    timestamps: false
  });
  
  ShippingMethodRates.associate = (models) => {
    ShippingMethodRates.belongsTo(models.ShippingMethods, {
      foreignKey: 'shipping_method_id',
      as: 'shippingMethods'
    });
  };

  return ShippingMethodRates;
};