var functions = {};
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 465,
  secure: true,
  auth: {
    user: 'apikey',
    pass: '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'
  }
});
  
functions.sendPasswordResetEmail = async (userEmail, resetToken) => {
  try {
    const resetLink = `https://tourit.matz.pt/reset?token=${resetToken}`;

    const mailOptions = {
      from: '"Tour-It" <tourit@slayn.pt>',
      to: userEmail,
      subject: 'Pedido de Recuperação de Password',
      text: `Olá, clica no seguinte link para resetares a tua password: ${resetLink}`,
      html: `<p>Olá,</p><p>Clica no seguinte link para resetares a tua password:</p><a href="${resetLink}">Resetar Password</a>`
    };

    await transporter.sendMail(mailOptions);
    console.log('Email Enviado com Sucesso!');
  } catch (error) {
    console.error('Erro ao enviar email:', error);
  }
};

functions.generateToken = async() => {
    const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
  
    let token = '';
  
    for (let i = 0; i < 4; i++) {
      token += letters[Math.floor(Math.random() * letters.length)];
    }
  
    for (let i = 0; i < 4; i++) {
      token += numbers[Math.floor(Math.random() * numbers.length)];
    }
  
    token = token.split('').sort(() => 0.5 - Math.random()).join('');
  
    return token;
};
  

module.exports = functions;
