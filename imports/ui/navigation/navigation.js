import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Accounts } from 'meteor/accounts-base';

import './navigation.html';

Template.navigation.events({
    'click .logout_control' : function(event) {
        event.preventDefault();
        Meteor.logout();
        Router.go('http://aficionadoventures.com');
    }
});

Template.navigation.helpers({
    currentUser : function() {
        return Meteor.userId();
    },
});
