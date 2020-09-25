'use strict';
module.exports = (sequelize, DataTypes) => {
  const CustomerBalance = sequelize.define('CustomerBalance', {
    'id': {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    'remarks': {
      type: DataTypes.TEXT,
      allowNull: true
    },
    'debit': {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
      defaultValue: '0.00'
    },
    'credit': {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
      defaultValue: '0.00'
    },
    'balance': {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
      defaultValue: '0.00'
    },
    'overpayment': {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
      defaultValue: '0.00'
    },
    'amount': {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: '0.00'
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
    'sales_order_id': {
      type: DataTypes.INTEGER(11),
      references: {
        model: 'sales_orders',
        key: 'id'
      },
      comment: 'refd to sales_orders.id',
      allowNull: false
    },
    'payment_id': {
      type: DataTypes.INTEGER(11),
      references: {
        model: 'payments',
        key: 'id'
      },
      comment: 'refd to payments.id',
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
    'is_deleted': {
      type: DataTypes.SMALLINT(1),
      allowNull: false,
      defaultValue: '0'
    }
  }, {
    tableName: "customer_balance",
    timestamps: false
  });
  
  CustomerBalance.associate = (models) => {
    CustomerBalance.belongsTo(models.Customers, {
      foreignKey: 'customer_id',
      as: 'customers'
    });
    CustomerBalance.belongsTo(models.SalesOrders, {
      foreignKey: 'sales_order_id',
      as: 'salesOrders'
    });
    CustomerBalance.belongsTo(models.Payments, {
      foreignKey: 'payment_id',
      as: 'payments'
    });
  };

  return CustomerBalance;
};