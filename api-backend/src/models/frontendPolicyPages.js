'use strict';
module.exports = (sequelize, DataTypes) => {
  const FrontendPolicyPages = sequelize.define('FrontendPolicyPages', {
    'id': {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    'description': {
      type: DataTypes.TEXT,
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
      comment: '1=Terms and Conditions, 2=Privacy Policy, 3=Support Policy, 4=Return Policy, 5=Seller Policy',
      allowNull: false,
      defaultValue: '0'
    },
    'is_deleted': {
      type: DataTypes.SMALLINT(1),
      allowNull: false,
      defaultValue: '0'
    }
  }, {
    tableName: "frontend_policy_pages",
    timestamps: false
  });
  FrontendPolicyPages.associate = (models) => {};
  return FrontendPolicyPages;
};