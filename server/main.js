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
        var name = '';
        var split_sort_array = query.name.split(' ').sort();
        for (i = 0; i < split_sort_array.length; i++) {
            name = name + '"' + split_sort_array[i].trim() + '" ';
        }
        name = name.trim();

        console.log(name);
        Products.find({
                $text : {
                    $search: name,
                }
            },
        ).forEach(function(doc) {
            tmp = {
                // example SKU from products collection -
                // { "_id" : "06daf01f6d6d", "category" : "Less iodine",
                // "name" : "Salt", "brand" : "Tata Lite", "packaging" : "Plastic 10 micron",
                // "meta" : "10 10 iodine kg less lite micron namak plastic salt tata" }
                _id : doc._id,
                category : doc.category,
                brand : doc.brand,
                name : doc.name,
                packaging : doc.packaging,
                img : doc.img,
                price : Math.floor(doc.price) + (Math.floor((doc.price - Math.floor(doc.price)) * 100) / 100)
            };
            Meteor.users.find({_id : doc.vendor}).forEach(function(other_doc) {
                tmp.vendor = other_doc.name;
                tmp.origin = other_doc.location.city;
            });
            results.push(tmp);
        });
        console.log(results);
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
    'get_vendor_name' : function(userId) {
        vendor_name = "";
        Meteor.users.find({_id : userId}).forEach(function(doc) {vendor_name = doc.name });
        return vendor_name;
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



