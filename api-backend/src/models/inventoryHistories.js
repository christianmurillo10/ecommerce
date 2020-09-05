'use strict';
module.exports = (sequelize, DataTypes) => {
  const InventoryHistories = sequelize.define('InventoryHistories', {
    'id': {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    'quantity_in': {
      type: DataTypes.INTEGER(12),
      allowNull: false,
      defaultValue: '0'
    },
    'quantity_out': {
      type: DataTypes.INTEGER(12),
      allowNull: false,
      defaultValue: '0'
    },
    'quantity_reserved': {
      type: DataTypes.INTEGER(12),
      allowNull: false,
      defaultValue: '0'
    },
    'quantity_returned': {
      type: DataTypes.INTEGER(12),
      allowNull: false,
      defaultValue: '0'
    },
    'quantity_available': {
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
    'inventory_id': {
      type: DataTypes.INTEGER(11),
      references: {
        model: 'inventories',
        key: 'id'
      },
      comment: 'refd to inventories.id',
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
    tableName: "inventory_histories",
    timestamps: false
  });
  
  InventoryHistories.associate = (models) => {
    InventoryHistories.belongsTo(models.Users, {
      foreignKey: 'user_id',
      as: 'users'
    });
    InventoryHistories.belongsTo(models.Inventories, {
      foreignKey: 'inventory_id',
      as: 'inventories'
    });
  };

  return InventoryHistories;
};