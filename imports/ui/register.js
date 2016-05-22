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
            }
        });

        Meteor.call('sendOTP', template.find('[name="phone"]').value, 112358);
    },
});

