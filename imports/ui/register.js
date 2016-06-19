import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Accounts } from 'meteor/accounts-base';

import './body.html';

Template.register.onCreated(function() {
    let template = Template.instance();
    template.first_step_done = new ReactiveVar(false);
    template.error_occurred = new ReactiveVar(false);
    template.error_reg = new ReactiveVar("");
});

Template.register.events({
    'submit form' : function(event, template) {
        event.preventDefault();
        
        if (!template.first_step_done.get()) {
            let user = {
                name : template.find('[name="name"]').value,
                email : template.find('[name="email"]').value,
                password : template.find('[name="password"]').value,
                role : template.find('[name="role"]').value,
                phone : template.find('[name="phone"]').value,
                city : template.find('[name="city"]').value,
                state : template.find('[name="state"]').value,
            };

            console.log(user);
            Accounts.createUser(user, function(error) {
                if (error) {
                    template.error_reg.set('Error occurred: ' + error.reason);
                    template.error_occurred.set(true);
                } else {
                    console.log('Sending verification email...');
                    Meteor.call('sendVerificationLink', function(error, response) {
                        if (!error) {
                            console.log('Sending OTP...');
                            Meteor.call('sendOTP', function(error, response) {
                                if (error) {
                                    template.error_reg.set('Error occurred: ' + error.reason);
                                } else {
                                    console.log('Should enter OTP now...');
                                    template.first_step_done.set(true);
                                    $('[name="name"]').attr('disabled', '');
                                    $('[name="email"]').attr('disabled', '');
                                    $('[name="password"]').attr('disabled', '');
                                    $('[name="role"]').attr('disabled', '');
                                    $('[name="phone"]').attr('disabled', '');
                                    $('[name="city"]').attr('disabled', '');
                                    $('[name="state"]').attr('disabled', '');   
                                }
                            });
                        }
                    });
                }
            });
        } else {
            let input_otp = template.find('[name="otp_value"]').value;
            console.log('Verifying OTP...');
            Meteor.call('verifyOTP', Meteor.userId(), input_otp, function(error, response) {
                if (error) {
                    template.error_reg.set("Error occurred: " + error.reason);
                } else {
                    Router.go('/dashboard');
                }
            });
        }
    },
});

Template.register.helpers({
    error_first_step : function() {
        console.log('in error_first_step...');
        return Template.instance().error_reg.get();
    },
    verification : function() {
        console.log('in verification...');
        if (Template.instance().first_step_done.get()) {
            return "verification";
        }
    }
});
