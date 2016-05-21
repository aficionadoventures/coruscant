import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

Meteor.methods({
    sendVerificationLink() {
        let userId = Meteor.userId();
        console.log('About to send verification email');
        if (userId) {
            return Accounts.sendVerificationEmail(userId);
        }
    }
});
