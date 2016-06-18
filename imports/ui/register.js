import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Accounts } from 'meteor/accounts-base';

import './body.html';

Template.register.events({
    'submit form' : function(event, template) {
        event.preventDefault();

        let user = {
            email : template.find('[name="email"]').value,
            password : template.find('[name="password"]').value,
            phone : template.find('[name="phone"]').value,
        }

        Accounts.createUser(user, (error) => {
            if (error) {
                console.log('Error in createUser');
            } else {
                console.log('No error in createUser');
                console.log('Now sending verification email');
                Meteor.call('sendVerificationLink', (error, response) => {
                    if (error) {
                        console.log('Error in sendVerificationLink');
                    } else {
                        console.log('No error in sendVerificationLink');
                    }
                });
                Meteor.call('sendOTP');
                Router.go('/dashboard');
            }
        });
    },
});

Template.phoneVerif.events({
    'submit form' : function(event, template) {
        event.preventDefault();

        let inputOTP = template.find('[name="inputOtp"]').value;
        Meteor.call('verifyOTP', Meteor.userId(), inputOTP);
    },
});
