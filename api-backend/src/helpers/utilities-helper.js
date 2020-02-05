const NO = 'No';
const YES = 'Yes';

module.exports = {
  NO: 0,
  YES: 1,

  getStatus: (value) => {
    return new Promise((resolve, reject) => {
      try {
        let data;
        switch (value) {
          case 0:
            data = NO;
            break;
          case 1:
            data = YES;
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
  }
};