'use strict';

module.exports = (sequelize, DataTypes) => {
  const Employees = sequelize.define('Employees', {
    'id': {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    'employee_no': {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    'firstname': {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    'middlename': {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    'lastname': {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    'email': {
      type: DataTypes.STRING(100), 
      allowNull: false
    },
    'primary_address': {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    'secondary_address': {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    'contact_no': {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    'date_hired': {
      type: 'DATE',
      allowNull: false,
      defaultValue: sequelize.NOW
    },
    'date_endo': {
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
    'gender_type': {
      type: DataTypes.SMALLINT(1),
      comment: '1=Male, 2=Female, 3=Other',
      allowNull: true,
      defaultValue: '0'
    },
    'is_active': {
      type: DataTypes.SMALLINT(1),
      allowNull: false,
      defaultValue: '1'
    },
    'is_deleted': {
      type: DataTypes.SMALLINT(1),
      allowNull: false,
      defaultValue: '0'
    }
  }, {
    tableName: "employees",
    timestamps: false
  });
  Employees.associate = (models) => {};

  return Employees;
};