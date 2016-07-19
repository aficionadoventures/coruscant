import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

Accounts.emailTemplates.from = "Aficionado Ventures <no-reply@aficionadoventures.com>";

Accounts.emailTemplates.siteName = "Aficionado Ventures";

Accounts.emailTemplates.verifyEmail = {
  subject() {
    return "[AVPL] Verify Your Email Address";
  },
  text( user, url ) {
    let emailAddress   = user.emails[0].address,
        urlWithoutHash = url.replace( '#/', '' ),
        supportEmail   = "support@aficionadoventures.com",
        emailBody      = `To verify your email address (${emailAddress}) visit the following link:\n\n${urlWithoutHash}\n\n If you did not request this verification, please ignore this email. If you feel something is wrong, please contact our support team: ${supportEmail}.`;

    return emailBody;
  }
}

Meteor.methods({
    sendVerificationLink() {
        let userId = Meteor.userId();
        console.log('About to send verification email');
        if (userId) {
            return Accounts.sendVerificationEmail(userId);
        }
    },
    sendOTP() {
        let userId = Meteor.userId();
        let userOTP = Meteor.users.findOne({'_id' : userId}).services.phone.verificationTokens[0].otp;
        let userPhone = Meteor.users.findOne({'_id' : userId}).services.phone.verificationTokens[0].phone;
        Meteor.call('sendOTPDest', userPhone, userOTP);
    },
    verifyOTP(userId, inputOTP) {
        let userOTP = Meteor.users.findOne({'_id' : userId}).services.phone.verificationTokens[0].otp;
        let userPhone = Meteor.users.findOne({'_id' : userId}).services.phone.verificationTokens[0].phone;
        if (userOTP == inputOTP) {
            Meteor.users.update({ '_id' : userId, 'phones.number' : userPhone }, {
                $set : { 'phones.$.verified' : true }
            });
            return 0;
        } else {
            console.log('Incorrect OTP entered for ', userPhone, '. Entered : ', inputOTP);
            return 1;
        }
    }
});

