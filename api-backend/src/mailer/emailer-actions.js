const Emailer = require("./emailer-handler");
const env = process.env.NODE_ENV || "development";
const config = require("../config/config.json")[env];

module.exports = {
  sendEmailRegistrationConfirmation: data => {
    return new Promise(async (resolve, reject) => {
      try {
        let subject = "E-COMMERCE REGISTRATION CONFIRMATION";
        let message = `
              <h4>Thank you for joining E-Commerce.</h4>
              <h4>Note: <i>Please click the url below for verification of your account.</i></h4>
              <p>Url: <a href="${config.websiteUrl}/registration/confirmation">${config.websiteUrl}/registration/confirmation</a></p>
            `;
        let mailOptions = {
          from: "",
          to: data.email,
          subject: subject,
          html: message
        };
        let emailResponse = await Emailer.sendMail(mailOptions);
        resolve(emailResponse);
      } catch (err) {
        console.log(err);
        reject(err);
      }
    });
  },
};

/**
 * Other Functions
 */
const setUrl = env => {
  try {
    let url;
    switch (env) {
      case 'development':
        url = 'http://localhost:4040';
        break;
      case 'testing':
        url = 'http://nightly.ark.com.ph';
        break;
      default:
        url = 'http://ark.com.ph';
    }

    return url;
  } catch (err) {
    console.log(err);
    return false;
  }
};
