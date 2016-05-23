import { Meteor } from 'meteor/meteor';
import { Plivo } from 'meteor/pfafman:plivo';
import { Vendors } from '../imports/api/userdata.js';
import { Accounts } from 'meteor/accounts-base';
import { Random } from 'meteor/random';

import '../imports/route/route.js';
import '../imports/api/userdata.js';
import './email_verification.js'

Meteor.startup(function () {
    console.log('Server starting up ...');
});

Meteor.methods({
    'saveFile': function(buffer){
        Files.insert({data:buffer})
    },

    'sendOTP' : function(dest, otp_val) {
        /*plivo = Plivo.RestAPI({
            authId : <please fill this up before running meteor>,
            authToken :  <please fill this up before running meteor>,
        });

        let params_sms = {
            'src' : '+919472472550',
            'dst' : dest,
            'text' : 'OTP : ' + otp_val,
            'type' : 'sms',
            'url' : 'http://hatimak.me/',
            'method' : 'GET',
        };

        plivo.send_message(params_sms, function(status_sms, response) {
            console.log('Status: ', status_sms);
            console.log('API response: ', response);
        });*/
    },
});

Accounts.onCreateUser(function(options, user) {
    user.phones = [
        { number : options.phone, verified : false}
    ];
    user.services.phone = {
        verificationTokens : [
            { otp : Math.floor((Random.fraction() * 1000000)), phone : options.phone, when : new Date() },
        ],
    };
    // Default hook's "profile" behaviour.
    if (options.profile) {
        user.profile = options.profile;
    }
    return user;
});

