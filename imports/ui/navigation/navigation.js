import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Accounts } from 'meteor/accounts-base';

import './navigation.html';

Template.navigation.events({
	'submit [data-id="searchForm"]' : function(event, template) {
		event.preventDefault();

		let tmp = $('[name="searchInput"]').val();
		if (tmp) {
			let query = '';
			tmp = tmp.split(' ').sort();
			for (let i = 0; i < tmp.length; i++) {
				query = query + '"' + tmp[i].trim() + '" ';
			}
			query = query.trim();

			Router.go('/search?q=' + query);
		}
	},
});

Template.navigation.helpers({
	// TODO(hatim)
});
