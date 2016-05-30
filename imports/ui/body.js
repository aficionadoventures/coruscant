import './body.html';

import { Template } from 'meteor/templating';
import { Vendors } from '../api/userdata.js';

Template.register.onCreated(function bodyOnCreated() {
    console.log('register created')
});

Template.upload.events({
    'change input' : function(event, template){ 
    const file = event.target.files[0]; //assuming 1 file only
    if (!file) return;

    const reader = new FileReader(); //create a reader according to HTML5 File API

    reader.onload = function(event){          
        const buffer = new Uint8Array(reader.result) // convert to binary
        Meteor.call('saveFile', buffer);
    }

    reader.readAsArrayBuffer(file); //read the file as arraybuffer
}

});
