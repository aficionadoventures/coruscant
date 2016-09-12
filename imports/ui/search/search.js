import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Accounts } from 'meteor/accounts-base';

import './search_results.html';

Template.search_results.helpers({
	results : function() {
		return Template.instance().results.get();
	},

	n_results : function() {
		if (Template.instance().n_results.get() == 0) {
			return "No results found in the database";
		} else {
			return "Found " + num + " results in the database";
		}
	},
});

Template.search_results.events({
	'click #buy-now-button-1' : function(event, template) {
		event.preventDefault();
		console.log($(event.target).data('id'));
	},
});
