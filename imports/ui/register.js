import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Accounts } from 'meteor/accounts-base';

import './body.html';
import './pages/pages.js';
import './components/components.js';

Template.register.onCreated(function() {
    let template = Template.instance();
    template.first_step_done = new ReactiveVar(false);
    template.error_reg = new ReactiveVar("");
    template.skip_allowed = new ReactiveVar(false);
    template.status_message = new ReactiveVar("");
});

Template.register.events({
    'submit form' : function(event, template) {
        event.preventDefault();
        
        if (!template.first_step_done.get()) {
            let user = {
                name : template.find('[name="name"]').value,
                username : template.find('[name="username"]').value,

                password : template.find('[name="password"]').value,
                role : template.find('[name="role"]').value,

                city : template.find('[name="city"]').value,
                state : template.find('[name="state"]').value,
            };

            email = template.find('[name="email"]').value;
            if (email) {
                user.email = email;
            }

            phone = template.find('[name="phone"]').value;
            if (phone) {
                user.phone = phone;
            }

            Accounts.createUser(user, function(error) {
                if (error) {
                    template.error_reg.set('Error occurred: ' + error.reason);
                } else {
                    if (email && phone) {
                        Meteor.call('sendVerificationLink', function(error, response) {
                            if (!error) {
                                    Meteor.call('sendOTP', function(error) {
                                            template.status_message.set("Enter OTP sent to your number.");
                                            template.skip_allowed.set(true);
                                            template.first_step_done.set(true);
                                            $('[name="name"]').attr('disabled', '');
                                            $('[name="email"]').attr('disabled', '');
                                            $('[name="password"]').attr('disabled', '');
                                            $('[name="role"]').attr('disabled', '');
                                            $('[name="phone"]').attr('disabled', '');
                                            $('[name="city"]').attr('disabled', '');
                                            $('[name="state"]').attr('disabled', '');   
                                    });
                            }
                        });
                    } else if (email && !phone) {
                        Meteor.call('sendVerificationLink', function(error, response) {
                            if (!error) {
                                    template.status_message.set("Phone not specified.");
                                    template.status_message.set("");
                                    Router.go('/dashboard');
                            }
                        });
                    } else if (!email && phone) {
                        Meteor.call('sendOTP', function(error) {
                                template.status_message.set("Enter OTP sent to your number.");
                                template.skip_allowed.set(true);
                                template.first_step_done.set(true);
                                $('[name="name"]').attr('disabled', '');
                                $('[name="email"]').attr('disabled', '');
                                $('[name="password"]').attr('disabled', '');
                                $('[name="role"]').attr('disabled', '');
                                $('[name="phone"]').attr('disabled', '');
                                $('[name="city"]').attr('disabled', '');
                                $('[name="state"]').attr('disabled', '');   
                        });
                    } else {
                        template.status_message.set("");
                        Router.go('/dashboard');
                    }
                }
            });
            template.status_message.set("Storing your details safely...");
        } else {
            let input_otp = template.find('[name="otp_value"]').value;
            Meteor.call('verifyOTP', Meteor.userId(), input_otp, function(error, response) {
                if (error) {
                    template.error_reg.set("Error occurred: " + error.reason);
                } else {
                    template.status_message.set("");
                    Router.go('/dashboard');
                }
            });
        }
    },
    'click #skip' : function(event, template) {
        event.preventDefault();
        template.status_message.set("");
        Router.go('/dashboard');
    },
});

Template.register.helpers({
    error_first_step : function() {
        return Template.instance().error_reg.get();
    },
    verification : function() {
        if (Template.instance().first_step_done.get()) {
            return "verification";
        }
    },
    status_message : function() {
        return Template.instance().status_message.get();
    },
    skip_allow : function() {
        return Template.instance().skip_allowed.get();
    }
});
