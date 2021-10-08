const nodemailer = require('nodemailer')
require('dotenv/config')

async function enviarEmail(email, link, userName) {
	var transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: 'fatecaacccampinas@gmail.com',
			pass: process.env.PASSWORD_FATEC_GMAIL,
		},
	})

	var mailOptions = {
		from: 'Fatec Campinas - AACC',
		to: email,
		subject: '🥳 Sua AACC foi atualizada! | Fatec Campinas AACC',
		html: `
                <!DOCTYPE html><html> <head> <meta charset="utf-8"/> <meta http-equiv="x-ua-compatible" content="ie=edge"/> <title>Atividade Atualizada - Fatec Campinas AACC</title> <meta name="viewport" content="width=device-width, initial-scale=1"/> <style type="text/css"> @media screen{@font-face{font-family: "Source Sans Pro"; font-style: normal; font-weight: 400; src: local("Source Sans Pro Regular"), local("SourceSansPro-Regular"), url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format("woff");}@font-face{font-family: "Source Sans Pro"; font-style: normal; font-weight: 700; src: local("Source Sans Pro Bold"), local("SourceSansPro-Bold"), url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format("woff");}}body, table, td, a{-ms-text-size-adjust: 100%; /* 1 */ -webkit-text-size-adjust: 100%; /* 2 */}table, td{mso-table-rspace: 0pt; mso-table-lspace: 0pt;}img{-ms-interpolation-mode: bicubic;}a[x-apple-data-detectors]{font-family: inherit !important; font-size: inherit !important; font-weight: inherit !important; line-height: inherit !important; color: inherit !important; text-decoration: none !important;}div[style*="margin: 16px 0;"]{margin: 0 !important;}body{width: 100% !important; height: 100% !important; padding: 0 !important; margin: 0 !important;}table{border-collapse: collapse !important;}a{color: #1a82e2;}img{height: auto; line-height: 100%; text-decoration: none; border: 0; outline: none;}</style> </head> <body style="background-color: #e9ecef"> <div class="preheader" style=" display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #fff; opacity: 0; " > Novo status AACC - Fatec Campinas </div><table border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td align="center" bgcolor="#e9ecef"> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px" > <tr> <td align="center" valign="top" style="padding: 36px 24px"> <a href="https://www.fateccampinas.com.br/site/" target="_blank" style="display: inline-block" > <img src="https://upload.wikimedia.org/wikipedia/commons/f/f9/Fatec_Campinas_logo.png" alt="Logo" border="0" width="80" style=" display: block; width: 80px; max-width: 80px; min-width: 80px; "/> </a> </td></tr></table> </td></tr><tr> <td align="center" bgcolor="#e9ecef"> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px" > <tr> <td align="left" bgcolor="#ffffff" style=" padding: 36px 24px 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; border-top: 3px solid #d4dadf; " > <h1 style=" margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px; " > 😄 Olá ${userName}, sua atividade de AACC foi atualizada! </h1> </td></tr></table> </td></tr><tr> <td align="center" bgcolor="#e9ecef"> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px" > <tr> <td align="left" bgcolor="#ffffff" style=" padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; " > <p style="margin: 0"> Toque no botão abaixo para conferir suas atividades! </p></td></tr><tr> <td align="left" bgcolor="#ffffff"> <table border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td align="center" bgcolor="#ffffff" style="padding: 12px"> <table border="0" cellpadding="0" cellspacing="0"> <tr> <td align="center" bgcolor="#1a82e2" style="border-radius: 6px" > <a href="${link}target"="_blank" style=" display: inline-block; padding: 16px 36px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 6px; " >Minhas Atividade</a > </td></tr></table> </td></tr></table> </td></tr><tr> <td align="left" bgcolor="#ffffff" style=" padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; " > <p style="margin: 0"> Se isso não funcionar, copie e cole o seguinte link no seu navegador: </p><p style="margin: 0"> <a href="${link}target"="_blank">${link}</a> </p></td></tr><tr> <td align="left" bgcolor="#ffffff" style=" padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; border-bottom: 3px solid #d4dadf; " > <p style="margin: 0"> Com carinho seus amigos da Fatec Campinas,<br/>Valeu! </p></td></tr></table> </td></tr><tr> <td align="center" bgcolor="#e9ecef" style="padding: 24px"> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px" > <tr> <td align="center" bgcolor="#e9ecef" style=" padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666; " > <p style="margin: 0"> Caso você não tenha interesse em acessar o sistema pode descartar esse email com segurança. </p></td></tr><tr> <td align="center" bgcolor="#e9ecef" style=" padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666; " > <p style="margin: 0"> Av. Cônego Antônio Roccato, 593 - Jardim Santa Monica, Campinas - SP, 13082-015 </p></td></tr></table> </td></tr></table> </body></html>
            `,
	}

	await transporter.sendMail(mailOptions, (error, info) => {
		if (!error) {
			return info
		} else {
			return error
		}
	})
}

module.exports = {enviarEmail}
