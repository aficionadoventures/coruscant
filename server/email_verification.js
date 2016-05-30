import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

Accounts.emailTemplates.from = "Aficionado Ventures <no-reply@aficionadoventures.com>";

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

