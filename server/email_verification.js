import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

Accounts.emailTemplates.from = "Aficionado Ventures <no-reply@aficionadoventures.com>";
Accounts.emailTemplates.siteName = "Aficionado Ventures";

Accounts.emailTemplates.verifyEmail = {
	subject : function() {
		return "[AVPL] Verify Your Email Address";
	},

	text : function(user, url) {
		let emailAddress = user.emails[0].address;
		let urlWithoutHash = url.replace('#/', '');
		let supportEmail = "support@aficionadoventures.com";
		let emailBody = `To verify your email address (${emailAddress}) visit the following link:\n\n${urlWithoutHash}\n\n If you did not request this verification, please ignore this email. If you feel something is wrong, please contact our support team: ${supportEmail}.`;

		return emailBody;
	},
}

Meteor.methods({
	sendVerificationLink : function() {
		if (Meteor.userId()) {
			console.log('INFO : Sending verification email to ' + Meteor.userId() + '...');
			return Accounts.sendVerificationEmail(userId);
		}
	},

	sendOTP : function() {
		let userId = Meteor.userId();
		let userOTP = Meteor.users.findOne({ '_id' : userId }).services.phone.verificationTokens[0].otp;
		let userPhone = Meteor.users.findOne({ '_id' : userId }).services.phone.verificationTokens[0].phone;

		console.log('INFO : Sending OTP to ' + Meteor.userId() + ' (' + userOTP + ') ...');
		Meteor.call('sendOTPDest', userPhone, userOTP);
	},

	verifyOTP : function(userId, inputOTP) {
		let userOTP = Meteor.users.findOne({ '_id' : userId }).services.phone.verificationTokens[0].otp;
		let userPhone = Meteor.users.findOne({ '_id' : userId }).services.phone.verificationTokens[0].phone;

		if (userOTP == inputOTP) {
			Meteor.users.update(
				{ '_id' : userId, 'phones.number' : userPhone },
				{ $set : { 'phones.$.verified' : true } }
			);
			console.log('INFO : OTP verification for ' + userId + ' was successful.');
			return 0;
		} else {
			console.log('INFO : OTP verification for ' + userId + ' failed (' + inputOTP + ').');
			return 1;
		}
	},
});
