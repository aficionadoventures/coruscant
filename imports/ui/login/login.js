import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Accounts } from 'meteor/accounts-base';

import './login.html';

Template.login.events({
	'submit .login-input' : function(event, template) {
		event.preventDefault();

		let user = {
			username : $('[name=username]').val(),
		};
		var password = $('[name=password]').val();
		Meteor.loginWithPassword(user, password, function(error) {
			if (error) {
				console.log(error.reason);
			} else {
				Router.go('/dashboard');
			}
		});
	},
});
