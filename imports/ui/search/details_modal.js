import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Accounts } from 'meteor/accounts-base';

import './search_results.html';
import './details_modal.html';

Template.details_modal.onCreated(function() {
	Template.instance().quantity = new ReactiveVar(50);
	Template.instance().total_price = new ReactiveVar(Math.floor(parseFloat($('[data-name="total_price"]').data('price')) * 50));
});

Template.details_modal.helpers({
	quantity : function() {
		return Template.instance().quantity.get();
	},

	total_price : function() {
		return Template.instance().total_price.get();
	}
});

Template.details_modal.events({
	'click [data-name="quantity_up_btn"]' : function(event, template) {
		event.preventDefault();
		Template.instance().quantity.set(Template.instance().quantity.get() + 1);
		Template.instance().total_price.set(Math.floor(Template.instance().quantity.get() * parseFloat($('[data-name="total_price"]').data('price'))));
	},

	'click [data-name="quantity_down_btn"]' : function(event, template) {
		event.preventDefault();
		Template.instance().quantity.set(Template.instance().quantity.get() - 1);
		Template.instance().total_price.set(Math.floor(Template.instance().quantity.get() * parseFloat($('[data-name="total_price"]').data('price'))));
	},

	'click [data-name="cart_btn"]' : function(event, template) {
		event.preventDefault();
		Meteor.call('add_to_cart', {
			_id : $('[data-name="cart_btn"]').data('id'),
			quantity : Template.instance().quantity.get(),
		}, function(error, results) {
			Cart_Dep.changed();
		});
	},
});
