module.exports = function(app) {
  const nodemailer = require('nodemailer');

  app.get("/api/email/:emailId/:password", function(req, res) {
    var emailId = req.params["emailId"];
    var password = req.params["password"];
    console.log(emailId + " " + password);

    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: "webdev.summer.project@gmail.com",
        pass: "10Ronaldinho"
      }
    });

    let mailOptions = {
        from: '"Lotus Lab" <webdev.summer.project@gmail.com>', // sender address
        to: emailId, // list of receivers
        subject: 'Forgot password', // Subject line
        text: 'You\'re receiving this email because you requested to send your password. The password for your email ' + emailId + ' ' + 'is' + ' ' + password, // plain text body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
    });

  });
}
