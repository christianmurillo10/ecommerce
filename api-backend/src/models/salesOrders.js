'use strict';
module.exports = (sequelize, DataTypes) => {
  const SalesOrders = sequelize.define('SalesOrders', {
    'id': {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    'order_no': {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    'remarks': {
      type: DataTypes.TEXT,
      allowNull: true
    },
    'sub_total_amount': {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: '0.00'
    },
    'vat_amount': {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
      defaultValue: '0.00'
    },
    'shipping_fee_amount': {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
      defaultValue: '0.00'
    },
    'total_discount_amount': {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
      defaultValue: '0.00'
    },
    'total_amount': {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: '0.00'
    },
    'total_balance_amount': {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
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
    'reviewed_by': {
      type: DataTypes.INTEGER(11),
      references: {
        model: 'employees',
        key: 'id'
      },
      comment: 'refd to employees.id',
      allowNull: true
    },
    'approved_by': {
      type: DataTypes.INTEGER(11),
      references: {
        model: 'employees',
        key: 'id'
      },
      comment: 'refd to employees.id',
      allowNull: true
    },
    'date_ordered': {
      type: 'DATE',
      allowNull: false,
      defaultValue: sequelize.NOW
    },
    'date_approved': {
      type: 'DATE',
      allowNull: true,
      defaultValue: sequelize.NOW
    },
    'date_delivery': {
      type: 'DATE',
      allowNull: true,
      defaultValue: sequelize.NOW
    },
    'date_delivered': {
      type: 'DATE',
      allowNull: true,
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
      allowNull: true,
      defaultValue: '1'
    },
    'status': {
      type: DataTypes.SMALLINT(1),
      comment: '1=Closed 2=Delivered 3=On Process 4=Approved 5=For Review 6=Open 7=Cancelled 8=Failed',
      allowNull: true,
      defaultValue: '6'
    },
    'is_with_vat': {
      type: DataTypes.SMALLINT(1),
      allowNull: true,
      defaultValue: '0'
    },
    'is_paid': {
      type: DataTypes.SMALLINT(1),
      allowNull: false,
      defaultValue: '0'
    },
    'is_fully_paid': {
      type: DataTypes.SMALLINT(1),
      allowNull: false,
      defaultValue: '0'
    },
    'is_with_return': {
      type: DataTypes.SMALLINT(1),
      allowNull: true,
      defaultValue: '0'
    },
    'is_viewed': {
      type: DataTypes.SMALLINT(1),
      allowNull: false,
      defaultValue: '0'
    },
    'is_deleted': {
      type: DataTypes.SMALLINT(1),
      allowNull: false,
      defaultValue: '0'
    }
  }, {
    tableName: "sales_orders",
    timestamps: false
  });
  
  SalesOrders.associate = (models) => {
    SalesOrders.belongsTo(models.Customers, {
      foreignKey: 'customer_id',
      as: 'customers'
    });
    SalesOrders.belongsTo(models.Employees, {
      foreignKey: 'reviewed_by',
      as: 'reviewedBy'
    });
    SalesOrders.belongsTo(models.Employees, {
      foreignKey: 'approved_by',
      as: 'approvedBy'
    });
  };

  return SalesOrders;
};