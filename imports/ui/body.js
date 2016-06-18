import './body.html';

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Products } from '../api/userdata.js';

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
    },
});

Template.search.onCreated( () => {
  let template = Template.instance();

  template.searchQuery = new ReactiveVar();
  template.searching   = new ReactiveVar( false );

  template.autorun( () => {
    template.subscribe( 'products_search', template.searchQuery.get(), () => {
      setTimeout( () => {
        template.searching.set( false );
      }, 300 );
    });
  });
});

Template.search.onCreated(function() {
    let template = Template.instance();
    // template.results = [{name : 'dum', category : 'dum', grade : 'duma', price : 'dum'}];
    template.results = new ReactiveVar([]);
    template.search_done = new ReactiveVar(false);
    template.autorun(function() {

    }, 300);
});

Template.search.helpers({
    email_address : function() {
        return Meteor.user().emails[0].address; 
    },
    currentUser : function() {
        return Meteor.userId();
    },
    search_complete : function() {
        return Template.instance().search_done.get()
    },
    results : function() {
        return Template.instance().results.get();
    }
});

Template.search.events({
    'submit form' : function(event, template) {
        event.preventDefault();

        var name_query = template.find('[name="name_query"]').value;
        Meteor.call('search_name', name_query, {returnStubValue: true}, (error, results) => {
            template.search_done.set(true);
            template.results.set(results);
        });
    },
});

Template.login.events({
    'submit .login-input' : function(event, template) {
        event.preventDefault();

        var email = $('[name=email]').val();
        var password = $('[name=password]').val();
        Meteor.loginWithPassword(email, password, (error) => {
            if (error) {
                console.log(error.reason);
            } else {
                Router.go('/dashboard');
            }
        });
    },
});

Template.dashboard.helpers({
    email_address : function() {
        return Meteor.user().emails[0].address;
    },
    currentUser : function() {
        return Meteor.userId();
    }
});

Template.navigation.events({
    'click .logout_control' : function(event) {
        event.preventDefault();
        Meteor.logout();
        Router.go('/');
    }
});

Template.navigation.helpers({
    currentUser : function() {
        return Meteor.userId();
    },
});