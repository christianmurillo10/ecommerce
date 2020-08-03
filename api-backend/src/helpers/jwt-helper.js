const jwt = require("jsonwebtoken");
const jwtSecret = "fGeyJpZCI6NCwiaWF0IjoxNDk0ODY3NDQ0LCJleHAiOjE0OTQ4NzgyNDR9";

module.exports = {
  generateToken: (payload) => {
    return new Promise((resolve, reject) => {
      try {
        let token,
          data = { id: payload.id, type: payload.type },
          expiration = { expiresIn: "1d" };
        token = jwt.sign(data, jwtSecret, expiration);
        resolve(token);
      } catch (err) {
        reject(err);
      }
    });
  },

  verifyToken: (token, callback) => {
    return new Promise((resolve, reject) => {
      try {
        let data = jwt.verify(token, jwtSecret, {}, callback);
        resolve(data);
      } catch (err) {
        resolve(null);
      }
    });
  },
};
