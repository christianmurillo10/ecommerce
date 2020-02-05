const bcrypt = require('bcrypt');

module.exports = {
  hashPassword: (password) => {
    return new Promise((resolve, reject) => {
      try {
        bcrypt.hash(password, 10, (err, hash) => {
          if (err) return reject(err);
          resolve(hash);
        });
      } catch (err) {
        reject(err);
      }
    });
  },

  comparePassword: (password, hashPassword) => {
    return new Promise((resolve, reject) => {
      try {
        bcrypt.compare(password, hashPassword, (err, match) => {
          if (err) return reject(err);
          resolve(match);
        });
      } catch (err) {
        reject(err);
      }
    });
  }
};