const { NO, YES } = require("./constant-helper");

module.exports = {
  getStatus: (value) => {
    return new Promise((resolve, reject) => {
      try {
        let data;
        switch (value) {
          case NO:
            data = "No";
            break;
          case YES:
            data = "Yes";
            break;
        }
        return data;
      } catch (err) {
        reject(err);
      }
    });
  },

  generateReferralCode: () => {
    return Math.random().toString(36).substr(2, 8).toUpperCase();
  },
};
