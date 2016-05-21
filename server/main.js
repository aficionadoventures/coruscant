import { Meteor } from 'meteor/meteor';

import { Vendors } from '../imports/api/userdata.js';
import '../imports/route/route.js';

Meteor.methods({
    'saveFile': function(buffer){
        Files.insert({data:buffer})         
    }   
});

