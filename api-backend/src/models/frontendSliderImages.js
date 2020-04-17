'use strict';
module.exports = (sequelize, DataTypes) => {
  const FrontendSliderImages = sequelize.define('FrontendSliderImages', {
    'id': {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    'file_name': {
      type: DataTypes.STRING(100),
      comment: '(850x315)',
      allowNull: false,
    },
    'url': {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    'order': {
      type: DataTypes.INTEGER(11),
      allowNull: false
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
    'is_published': {
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
    tableName: "frontend_slider_images",
    timestamps: false
  });

  FrontendSliderImages.associate = (models) => {
    FrontendSliderImages.belongsTo(models.Users, {
      foreignKey: 'user_id',
      as: 'users'
    });
  };

  return FrontendSliderImages;
};