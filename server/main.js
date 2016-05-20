import { Meteor } from 'meteor/meteor';
import { Vendors } from '../imports/api/userdata.js';
import '../imports/route/route.js';



Meteor.startup(function() {
    console.log('Server started up');
});

Meteor.methods( {
    'saveFile': function(buffer) {
        Files.insert({data:buffer})         
    }   
});

