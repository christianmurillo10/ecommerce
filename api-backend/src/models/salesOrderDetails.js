'use strict';
module.exports = (sequelize, DataTypes) => {
  const SalesOrderDetails = sequelize.define('SalesOrderDetails', {
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
    'variant_details': {
      type: DataTypes.TEXT,
      allowNull: false
    },
    'remarks': {
      type: DataTypes.TEXT,
      allowNull: true
    },
    'quantity': {
      type: DataTypes.INTEGER(12),
      allowNull: false,
      defaultValue: '0'
    },
    'rate_amount': {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: '0.00'
    },
    'discount_percentage': {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
      defaultValue: '0.00'
    },
    'discount_amount': {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
      defaultValue: '0.00'
    },
    'total_discount_amount': {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
      defaultValue: '0.00'
    },
    'amount': {
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
    'sales_order_id': {
      type: DataTypes.INTEGER(11),
      references: {
        model: 'sales_orders',
        key: 'id'
      },
      comment: 'refd to sales_orders.id',
      allowNull: false
    },
    'date': {
      type: 'DATE',
      comment: 'Date for Claimed, Returned and Failed status',
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
    'discount_type': {
      type: DataTypes.SMALLINT(1),
      comment: '1=Amount 2=Percentage',
      allowNull: true,
      defaultValue: '1'
    },
    'claim_type': {
      type: DataTypes.SMALLINT(1),
      comment: '1=Delivery, 2=Pick up',
      allowNull: false,
      defaultValue: '1'
    },
    'status': {
      type: DataTypes.SMALLINT(1),
      comment: '1=Claimed 2=On Going 3=Pending 4=Returned 5=Cancelled 6=Failed',
      allowNull: false,
      defaultValue: '3'
    },
    'is_flash_deal': {
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
    tableName: "sales_order_details",
    timestamps: false
  });
  
  SalesOrderDetails.associate = (models) => {
    SalesOrderDetails.belongsTo(models.Products, {
      foreignKey: 'product_id',
      as: 'products'
    });
    SalesOrderDetails.belongsTo(models.SalesOrders, {
      foreignKey: 'sales_order_id',
      as: 'salesOrders'
    });
  };

  return SalesOrderDetails;
};