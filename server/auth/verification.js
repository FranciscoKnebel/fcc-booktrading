var User = require('../models/user');

module.exports = function (nev, env) {
	nev.configure({
		verificationURL: env.ROOT_URL + '/verify/${URL}',
		persistentUserModel: User,
		tempUserCollection: 'unverifiedusers',

		expirationTime: 86400,
		transportOptions: {
			service: 'Gmail',
			auth: {
				user: env.TRANSPORTER_EMAIL,
				pass: env.TRANSPORTER_PASS
			}
		},
		verifyMailOptions: {
			from: env.TRANSPORTER_NAME + ' <' + env.TRANSPORTER_EMAIL + '>',
			subject: 'Please confirm account - Troca de Livros',
			html: '<h2>' + env.PROGRAM_TITLE + '</h2><hr><p>Olá! Thanks for signing up.</p><p>Click the following link to confirm your account:</p><p><a href="${URL}" target="_blank">${URL}</a></p><p>If you have not signed up at our site, you can safely ignore this e-mail.</p>',
			text: 'Please confirm your account by clicking the following link: ${URL}'
		},
		shouldSendConfirmation: true,
		confirmMailOptions: {
			from: env.TRANSPORTER_NAME + ' <' + env.TRANSPORTER_EMAIL + '>',
			subject: 'Successfully verified! - Troca de Livros',
			html: '<h2>' + env.PROGRAM_TITLE + '</h2><hr><p>Your account has been successfully verified!</p><p>Login at <a href="' + env.ROOT_URL + '" target="_blank">' + env.ROOT_URL + '</a>.</p><p>If you have not signed up at our site, you can contact us at ' + env.CONTACT_EMAIL + '.</p>',
			text: 'Your account has been successfully verified.'
		}
	}, function (result, options) {
		nev.generateTempUserModel(User, function () {});
	});
};
