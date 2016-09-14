import { Meteor } from 'meteor/meteor';
import { Plivo } from 'meteor/pfafman:plivo';
import { Accounts } from 'meteor/accounts-base';
import { Random } from 'meteor/random';

import { Products } from '../imports/api/userdata.js';

import '../imports/route/route.js';
import '../imports/route/configure.js';
import '../imports/api/userdata.js';

import './email_verification.js';


Meteor.startup(function () {
	console.log('Server starting up ...');
});

Meteor.methods({
	'sendOTPDest' : function(dest, otp_val) {
		plivo = Plivo.RestAPI({
			authId : process.env.PLIVO_AUTH_ID,
			authToken : process.env.PLIVO_AUTH_TOKEN,
		});
		let params_sms = {
			src : process.env.PLIVO_SRC,
			dst : dest,
			text : 'OTP : ' + otp_val,
			type : 'sms',
			url : 'http://aficionadoventures.com/',
			method : 'GET',
			log : 'false',
		};

		plivo.send_message(params_sms, function(status_sms, response) {
			console.log('INFO : Plivo\tstatus: ' + status_sms + ';\n\tAPI response: ', response);
		});
	},

	'search_name' : function(query) {
		let array = Products.find({ $text : { $search: query } }).fetch();
		let results = [];
		for (let i = 0; i < array.length; i++) {
			let tmp = {
				_id : array[i]._id,
				category : array[i].category,
				brand : array[i].brand,
				name : array[i].name,
				packaging : array[i].packaging,
				img : array[i].img,
				price : Math.floor(array[i].price) + (Math.floor((array[i].price - Math.floor(array[i].price)) * 100) / 100),
				vendor : Meteor.users.find({_id : array[i].vendor}).fetch()[0].name,
				origin : Meteor.users.find({_id : array[i].vendor}).fetch()[0].location.city,

				attributes_details_btn : {
					'data-id' : array[i]._id,
					'data-name' : 'details_btn',
				},
			};

			tmp.min_order = (array[i].min_order) ? array[i].min_order : 20;
			tmp.max_order = (array[i].max_order) ? array[i].max_order : 200;
			tmp.unit = (array[i].unit) ? array[i].unit : "kg";

			results.push(tmp);
		}

		return results;
	},

	'add_to_cart' : function(cart_obj) {
		if (Meteor.userId()) {
			Meteor.users.update({ _id : Meteor.userId() }, { $push : { cart : cart_obj } });
		} else {
			console.log('Not logged in, falling to eoDZdGmqM2BMdQHZN...');
			Meteor.users.update({ _id : 'eoDZdGmqM2BMdQHZN' }, { $push : { cart : cart_obj } });
		}
	},

	'fetch_cart' : function() {
		let tmp_cart = [];
		if (Meteor.userId()) {
			tmp_cart = Meteor.users.find({ _id : Meteor.userId() }).fetch()[0].cart;
		} else {
			console.log('Not logged in, falling to eoDZdGmqM2BMdQHZN...');
			tmp_cart = Meteor.users.find({ _id : 'eoDZdGmqM2BMdQHZN' }).fetch()[0].cart;
		}

		let cart = [];
		for (let i = 0; i < tmp_cart.length; i++) {
			let tmp_sku = Products.find({ _id : tmp_cart[i]._id }).fetch()[0];
			cart.push({
				_id : tmp_sku._id,
				name : tmp_sku.name,
				img : tmp_sku.img,
				price : Math.floor(tmp_sku.price) + (Math.floor((tmp_sku.price - Math.floor(tmp_sku.price)) * 100) / 100),
				vendor : Meteor.users.find({_id : tmp_sku.vendor}).fetch()[0].name,
				cart_quantity : tmp_cart[i].quantity,
				unit : (tmp_sku.unit) ? tmp_sku.unit : "kg",
				cart_total : (Math.floor(tmp_sku.price) + (Math.floor((tmp_sku.price - Math.floor(tmp_sku.price)) * 100) / 100)) * tmp_cart[i].quantity,
			});
		}

		return cart;
	}
});

Accounts.onCreateUser(function(options, user) {
	user.name = options.name;
	user.phones = [ { number : options.phone, verified : false } ];
	user.services.phone = { verificationTokens : [ { otp : Math.floor((Random.fraction() * 1000000)), phone : options.phone, when : new Date() } ] };
	user.role = options.role;
	user.location = {
		city : options.city,
		state : options.state,
	};

	// Default hook's "profile" behaviour.
	if (options.profile) {
		user.profile = options.profile;
	}

	return user;
});
