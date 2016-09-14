import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Accounts } from 'meteor/accounts-base';

import './search_results.html';
import './details_modal.html';

Template.search_results.helpers({
	results : function() {
		return Template.instance().results.get();
	},

	n_results : function() {
		let num = Template.instance().results.get().length;
		if (num == 0) {
			return "No";
		} else {
			return num;
		}
	},

	details_template : function() {
		return Template.instance().details_template.get();
	},

	details_data : function() {
		return Template.instance().details_data.get();
	},
});

Template.search_results.events({
	'click [data-name="details_btn"]' : function(event, template) {
		event.preventDefault();
		let id = $(event.target).data('id');
		let tmp_results = Template.instance().results.get();

		if (id) {
			for (let i = 0; i < tmp_results.length; i++) {
				if (id === tmp_results[i]._id) {
					let tmp_sku = tmp_results[i];
					tmp_sku.attributes_details_btn = null;
					tmp_sku.attributes_cart_btn = {
						'data-id' : id,
						'data-name' : 'cart_btn',
					};
					Template.instance().details_data.set(tmp_sku);
					Template.instance().details_template.set('details_modal');
					break;
				}
			}
		}
	},

	'hidden.bs.modal #modalDetails' : function() {
		Template.instance().details_template.set("");
	}
});
