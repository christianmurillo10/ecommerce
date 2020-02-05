var nodemailer = require('nodemailer');
var emailerConfig = require('../json/emailerConfig.json');
var transporter = nodemailer.createTransport(emailerConfig.transporter);

module.exports = {
  sendMail: (data) => {
    return new Promise(async (resolve, reject) => {
      try {
        let mailOptions = data;
        mailOptions.from = emailerConfig.transporter.auth.user;
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
            reject(error);
          } else {
            console.log('Email sent: ' + info.response);
            resolve('Email sent: ' + info.response)
          }
        });
      } catch (err) {
        console.log(err);
        reject(err);
      }
    });
  }
}