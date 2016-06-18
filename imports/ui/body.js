import './body.html';

import { Template } from 'meteor/templating';
import { Vendors } from '../api/userdata.js';

Template.register.onCreated(function bodyOnCreated() {
    console.log('register created')
});

Template.upload.events({
    'change input' : function(event, template){ 
    const file = event.target.files[0]; //assuming 1 file only
    if (!file) return;

    const reader = new FileReader(); //create a reader according to HTML5 File API

    reader.onload = function(event){          
        const buffer = new Uint8Array(reader.result) // convert to binary
        Meteor.call('saveFile', buffer);
    }

    reader.readAsArrayBuffer(file); //read the file as arraybuffer
    },
});

Template.login.events({
    'submit .login-input' : function(event, template) {
        event.preventDefault();

        var email = $('[name=email]').val();
        var password = $('[name=password]').val();
        Meteor.loginWithPassword(email, password, (error) => {
            if (error) {
                console.log(error.reason);
            } else {
                Router.go('/dashboard');
            }
        });
    },
});

Template.dashboard.helpers({
    email_address : function() {
        return Meteor.user().emails[0].address;
    },
    currentUser : function() {
        return Meteor.userId();
    }
});

Template.navigation.events({
    'click .logout_control' : function(event) {
        event.preventDefault();
        Meteor.logout();
        Router.go('/');
    }
});

Template.navigation.helpers({
    currentUser : function() {
        return Meteor.userId();
    },
});