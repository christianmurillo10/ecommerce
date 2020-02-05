'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;

// additional config
config.operatorsAliases = {
  $in: Op.in,
  $notIn: Op.notIn,
  $like: Op.like,
  $notLike: Op.notLike,
  $between: Op.between,
  $notBetween: Op.notBetween,
  $and: Op.and,
  $or: Op.or,
};

console.info('Connecting to Sequelize Database.');
// if (config.use_env_variable) {
//   sequelize = new Sequelize(process.env[config.use_env_variable], config);
// } else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
// }

sequelize.authenticate()
  .then(() => {
    console.info('Connection has been established successfully.');
    console.info(`Date \t: ${new Date().toString()}`);
    console.info("Environment \t:", env);
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
