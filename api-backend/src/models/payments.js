'use strict';
module.exports = (sequelize, DataTypes) => {
  const Payments = sequelize.define('Payments', {
    'id': {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    'reference_no': {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    'or_no': {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    'remarks': {
      type: DataTypes.TEXT,
      allowNull: true
    },
    'vat_amount': {
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
    'bank_id': {
      type: DataTypes.INTEGER(11),
      references: {
        model: 'banks',
        key: 'id'
      },
      comment: 'refd to banks.id',
      allowNull: true
    },
    'customer_credit_debit_card_id': {
      type: DataTypes.INTEGER(11),
      references: {
        model: 'customer_credit_debit_cards',
        key: 'id'
      },
      comment: 'refd to customer_credit_debit_cards.id',
      allowNull: true
    },
    'date': {
      type: 'DATE',
      allowNull: false,
      defaultValue: sequelize.NOW
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
    'payment_method_type': {
      type: DataTypes.SMALLINT(1),
      comment: '1=Cash 2=Deposit 3=Credit Card 4=Bank Transfer 5=E-Wallet 6=Cheque 7=PDC',
      allowNull: false,
      defaultValue: '1'
    },
    'is_with_vat': {
      type: DataTypes.SMALLINT(1),
      allowNull: true,
      defaultValue: '0'
    },
    'is_deleted': {
      type: DataTypes.SMALLINT(1),
      allowNull: false,
      defaultValue: '0'
    }
  }, {
    tableName: "payments",
    timestamps: false
  });
  
  Payments.associate = (models) => {
    Payments.belongsTo(models.Customers, {
      foreignKey: 'customer_id',
      as: 'customers'
    });
    Payments.belongsTo(models.SalesOrders, {
      foreignKey: 'sales_order_id',
      as: 'salesOrders'
    });
    Payments.belongsTo(models.Banks, {
      foreignKey: 'bank_id',
      as: 'banks'
    });
    Payments.belongsTo(models.CustomerCreditDebitCards, {
      foreignKey: 'customer_credit_debit_card_id',
      as: 'customerCreditDebitCards'
    });
  };

  return Payments;
};