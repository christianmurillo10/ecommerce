'use strict';
module.exports = (sequelize, DataTypes) => {
  const SalesOrderReturns = sequelize.define('SalesOrderReturns', {
    'id': {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    'remarks': {
      type: DataTypes.TEXT,
      allowNull: false
    },
    'quantity': {
      type: DataTypes.INTEGER(12),
      allowNull: false,
      defaultValue: '0'
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
    'sales_order_id': {
      type: DataTypes.INTEGER(11),
      references: {
        model: 'sales_orders',
        key: 'id'
      },
      comment: 'refd to sales_orders.id',
      allowNull: false
    },
    'sales_order_detail_id': {
      type: DataTypes.INTEGER(11),
      references: {
        model: 'sales_order_details',
        key: 'id'
      },
      comment: 'refd to sales_order_details.id',
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
    tableName: "sales_order_returns",
    timestamps: false
  });
  
  SalesOrderReturns.associate = (models) => {
    SalesOrderReturns.belongsTo(models.Users, {
      foreignKey: 'user_id',
      as: 'users'
    });
    SalesOrderReturns.belongsTo(models.SalesOrders, {
      foreignKey: 'sales_order_id',
      as: 'salesOrders'
    });
    SalesOrderReturns.belongsTo(models.SalesOrderDetails, {
      foreignKey: 'sales_order_detail_id',
      as: 'salesOrderDetails'
    });
  };

  return SalesOrderReturns;
};