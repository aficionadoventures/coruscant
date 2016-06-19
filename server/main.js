import { Meteor } from 'meteor/meteor';
import { Plivo } from 'meteor/pfafman:plivo';
import { Accounts } from 'meteor/accounts-base';
import { Random } from 'meteor/random';
import { Products } from '../imports/api/userdata.js'

import '../imports/route/route.js';
import '../imports/api/userdata.js';
import './email_verification.js';
import './publish.js';

Meteor.startup(function () {
    console.log('Server starting up ...');
});

Meteor.methods({
    'saveFile': function(buffer){
        Files.insert({data:buffer})
    },

    'sendOTPDest' : function(dest, otp_val) {
        plivo = Plivo.RestAPI({
            authId : process.env.PLIVO_AUTH_ID,
            authToken : process.env.PLIVO_AUTH_TOKEN,
        });

        let params_sms = {
            'src' : process.env.PLIVO_SRC,
            'dst' : dest,
            'text' : 'OTP : ' + otp_val,
            'type' : 'sms',
            'url' : 'http://aficionadoventures.com/',
            'method' : 'GET',
        };

        console.log('dst : ', dest, '; otp : ', otp_val);

        plivo.send_message(params_sms, function(status_sms, response) {
            console.log('Status: ', status_sms);
            console.log('API response: ', response);
        });
    },

    'search_name' : function(query) {
        results = [];
        Products.find({
            // $or: [
                $text: {
                    $search: query.name,

                },
                // { category: name_query },
                // { grade: name_query },
            // ]
        }, {
            sort: query.sort
        }).forEach(function(doc) {
            results.push({
                name : doc.name,
                category : doc.category,
                price : doc.price,
                grade : doc.grade,
                size : doc.size,
                age : doc.age
            });
        });
        return results;
    },
    'list_prods' : function(userId) {
        results = [];
        Products.find({
            vendor : userId,
        }).forEach(function(doc) {
            results.push({
                name : doc.name,
                category : doc.category,
                price : doc.price,
                grade : doc.grade,
                size : doc.size,
                age : doc.age
            });
        });
        return results;
    },
});

Accounts.onCreateUser(function(options, user) {
    user.name = options.name;
    user.phones = [
        { number : options.phone, verified : false}
    ];
    user.services.phone = {
        verificationTokens : [
            { otp : Math.floor((Random.fraction() * 1000000)), phone : options.phone, when : new Date() },
        ],
    };
    user.role = options.role;
    user.location = {
        city : options.city,
        state : options.state,
    };
    console.log('New user : ' + options);
    // Default hook's "profile" behaviour.
    if (options.profile) {
        user.profile = options.profile;
    }
    return user;
});



