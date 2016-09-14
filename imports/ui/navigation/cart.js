import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Accounts } from 'meteor/accounts-base';

import './cart.html';

Template.cart.onCreated(function() {
	Template.instance().user_cart = new ReactiveVar([]);
});

Template.cart.helpers({
	user_cart : function() {
		return Template.instance().user_cart.get();
	},
});

Template.cart.events({
	'show.bs.modal #modalCart' : function(event, template) {
		let tmpl = Template.instance();
		Meteor.call('fetch_cart', function(error, results) {
			if (!error) {
				tmpl.user_cart.set(results);
			}
		});
	},
});
