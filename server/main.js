import { Meteor } from 'meteor/meteor';
import { Plivo } from 'meteor/pfafman:plivo';
import { Vendors } from '../imports/api/userdata.js';

import '../imports/route/route.js';
import '../imports/api/userdata.js';
import './email_verification.js'

Meteor.startup(function () {
    process.env.MAIL_URL = 'smtp://postmaster%40sandbox284a2130bb2a419ea5381b5240396b90.mailgun.org:216e39f3db3aab3d9801c99ccdef9445@smtp.mailgun.org:587';
});

Meteor.methods({
    'saveFile': function(buffer){
        Files.insert({data:buffer})
    },

    'sendOTP' : function(dest, otp_val) {
        plivo = Plivo.RestAPI({
            authId : // please fill this up before running meteor,
            authToken : // please fill this up before running meteor,
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
        });
    },
});

