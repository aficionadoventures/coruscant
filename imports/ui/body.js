import './body.html'

import { Template } from 'meteor/templating';
import { Vendors } from '../api/userdata.js';

Template.body.onCreated(function bodyOnCreated() {
    console.log('Body created')
});

Template.body.events({
    'submit .email-input' : function(event) {
        event.preventDefault();
        const name = event.target.name.value;
        const email = event.target.email.valuel
        console.log({
            name,
            email,
        });
        Vendors.insert({
            name,
            email,
            createdAt: new Date(),
        });
        console.log(Vendors.find());
        event.target.name.value = '';
        event.target.email.value= '';
    },
});
