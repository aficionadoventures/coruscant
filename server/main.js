import { Meteor } from 'meteor/meteor';
import { Plivo } from 'meteor/pfafman:plivo';
import { Accounts } from 'meteor/accounts-base';
import { Random } from 'meteor/random';

import { Products } from '../imports/api/userdata.js'

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
		results = [];
		var name = '';
		var split_sort_array = query.name.split(' ').sort();
		for (i = 0; i < split_sort_array.length; i++) {
			name = name + '"' + split_sort_array[i].trim() + '" ';
		}
		name = name.trim();

		Products.find({ $text : { $search: name } }).forEach(function(doc) {
			tmp = {
				_id : doc._id,
				category : doc.category,
				brand : doc.brand,
				name : doc.name,
				packaging : doc.packaging,
				img : doc.img,
				price : Math.floor(doc.price) + (Math.floor((doc.price - Math.floor(doc.price)) * 100) / 100)
			};

			Meteor.users.findOne({_id : doc.vendor}).forEach(function(other_doc) {
				tmp.vendor = other_doc.name;
				tmp.origin = other_doc.location.city;
			});
			
			results.push(tmp);
		});

		return results;
	},
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
