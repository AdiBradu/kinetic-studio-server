const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  port: 465,              
  host: "smtp.kineticstudio.ro",
     auth: {
          user: 'comenzi@kineticstudio.ro',
          pass: 'COntrica@6122c',
       },
  secure: true,
});

module.exports = transporter;