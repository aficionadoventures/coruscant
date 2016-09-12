import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Accounts } from 'meteor/accounts-base';

import './search_results.html';

Template.search_results.onCreated(function() {
	let template = Template.instance();
	template.results = new ReactiveVar([]);
	template.search_done = new ReactiveVar(false);
	template.number_results = new ReactiveVar(0);
});

Template.search_results.helpers({
	search_complete : function() {
		return Template.instance().search_done.get()
	},

	results : function() {
		return Template.instance().results.get();
	},

	results_number : function() {
		var num = Template.instance().number_results.get();
		if (num == 0) {
			return "No results found in the database";
		} else {
			return "Found " + num + " results in the database";
		}
	},
});

Template.search_results.events({
	'submit .search_input' : function(event, template) {
		event.preventDefault();

		var name_query = $('[name="name_query"]').val();

		Meteor.call('search_name', { name: name_query }, { returnStubValue: true },
			function(error, results) {
				template.search_done.set(true);
				template.results.set(results);
				template.number_results.set(results.length);
		});
	},

	'click #buy-now-button-1' : function(event, template) {
		event.preventDefault();
		console.log($(event.target).data('id'));
	},
});
