'use strict';
module.exports = (sequelize, DataTypes) => {
  const CustomerCreditDebitCards = sequelize.define('CustomerCreditDebitCards', {
    'id': {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    'card_no': {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    'security_code': {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    'firstname': {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    'lastname': {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    'date_expired': {
      type: DataTypes.STRING(5),
      comment: '(MM/YY)',
      allowNull: false
    },
    'bank_id': {
      type: DataTypes.INTEGER(11),
      references: {
        model: 'banks',
        key: 'id'
      },
      comment: 'refd to banks.id',
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
    },
    'type': {
      type: DataTypes.SMALLINT(1),
      comment: '1=Credit 2=Debit',
      allowNull: false,
      defaultValue: '1'
    },
    'is_deleted': {
      type: DataTypes.SMALLINT(1),
      allowNull: false,
      defaultValue: '0'
    }
  }, {
    tableName: "customer_credit_debit_cards",
    timestamps: false
  });
  
  CustomerCreditDebitCards.associate = (models) => {
    CustomerCreditDebitCards.belongsTo(models.Banks, {
      foreignKey: 'bank_id',
      as: 'banks'
    });
    CustomerCreditDebitCards.belongsTo(models.Customers, {
      foreignKey: 'customer_id',
      as: 'customers'
    });
  };

  return CustomerCreditDebitCards;
};