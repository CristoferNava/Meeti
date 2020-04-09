const nodeMailer = require('nodemailer');
const util = require('util');
const fs = require('fs');
const ejs = require('ejs');
const emailConfig = require('../config/emails');

let transport = nodeMailer.createTransport({
  host: emailConfig.host,
  port: emailConfig.port,
  auth: {
    user: emailConfig.user,
    pass: emailConfig.pass
  }
});

exports.sendEmail = async (options) => {
  // Leemos el template para el email
  const file = `${__dirname}/../views/emails/${options.file}.ejs`
  // const file = __dirname + `/../views/emails/${options.archivo}.ejs`;
  
  // Compilamos el archivo
  const compiled = ejs.compile(fs.readFileSync(file, 'utf8'));

  // Creamos el HTML
  const html = compiled({url: options.url});

  // Configuramos las opciones del email
  const emailOptions = {
    from: 'Meeti <noreply@meeti.com>',
    to: options.user.email,
    subject: options.subject,
    html
  };

  // Enviamos el email
  const sendEmail = util.promisify(transport.sendMail, transport);
  return sendEmail.call(transport, emailOptions);
};