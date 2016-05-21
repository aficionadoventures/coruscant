import { Meteor } from 'meteor/meteor';

import { Vendors } from '../imports/api/userdata.js';
import '../imports/route/route.js';
import './email_verification.js'

Meteor.startup(function () {
    process.env.MAIL_URL = 'smtp://postmaster%40sandbox284a2130bb2a419ea5381b5240396b90.mailgun.org:216e39f3db3aab3d9801c99ccdef9445@smtp.mailgun.org:587';
});

Meteor.methods({
    'saveFile': function(buffer){
        Files.insert({data:buffer})         
    }   
});



