import './body.html';
import './pages/pages.js';
import './components/components.js';

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

Template.search.onCreated(function() {
    let template = Template.instance();
    // template.results = [{name : 'dum', category : 'dum', grade : 'duma', price : 'dum'}];
    template.results = new ReactiveVar([]);
    template.search_done = new ReactiveVar(false);
    template.filter_age = new ReactiveVar(false);
    template.min_age = new ReactiveVar(0);
    template.max_age = new ReactiveVar(1);
});

Template.search.helpers({
    vendor_name : function() {
        return Meteor.user().name; 
    },
    currentUser : function() {
        return Meteor.userId();
    },
    search_complete : function() {
        return Template.instance().search_done.get()
    },
    results : function() {
        return Template.instance().results.get();
    },
    to_filter_age : function() {
        return Template.instance().filter_age.get();
    },
    lower_age_limit : function() {
        return Template.instance().min_age.get();
    },
    upper_age_limit : function() {
        return Template.instance().max_age.get();
    },
});

Template.search.events({
    'submit form' : function(event, template) {
        event.preventDefault();

        var name_query = template.find('[name="name_query"]').value;

        Meteor.call('search_name', { name: name_query }, {returnStubValue: true},
            (error, results) => {
                template.search_done.set(true);
                template.results.set(results);
                for (i = 0; i < results.length; i++) {
                    results[i].grade = results[i].params['grade'];
                    if (results[i].params['age']) {
                        template.filter_age.set(true);
                        results[i].age = results[i].params['age'];
                        if (results[i].params['age'] <= template.min_age.get()) {
                            template.min_age.set(results[i].params['age']);
                        }
                        if (results[i].params['age'] >= template.max_age.get()) {
                            template.max_age.set(results[i].params['age']);
                        }
                    }
                }
        });
    },
    // 'onclick #filter_btn' : function(event, template) {
    //     event.preventDefault();
    //     console.log("hello");
    //     console.log(template.find('[name="grade_checkbox_a1"]').value);
    // }
});

Template.login.events({
    'submit .login-input' : function(event, template) {
        event.preventDefault();

        let user = {
            username : $('[name=username]').val(),
        };
        var password = $('[name=password]').val();
        Meteor.loginWithPassword(user, password, (error) => {
            if (error) {
                console.log(error.reason);
            } else {
                Router.go('/dashboard');
            }
        });
    },
});

// Template.dashboard.onCreated(function() {
//     let tmpl = Template.instance();
//     tmpl.prod_lists = new ReactiveVar([]);
//     tmpl.name_vendor = new ReactiveVar("");
    
// });

// Template.dashboard.events({
//     'click #view_my_added' : function(event, template) {
//         event.preventDefault();
//         Meteor.call('list_prods', Meteor.userId(), {returnStubValue: true}, (error, results) => {
//             template.prod_lists.set(results);
//         });
//     },
// });

// Template.dashboard.helpers({
//     vendor_name : function() {
//         return Template.instance().name_vendor.get();
//     },
//     currentUser : function() {
//         Meteor.call('get_vendor_name', Meteor.userId(), {returnStubValue: true}, (error, results) => {
//             template.name_vendor.set(results);
//         });
//         return Meteor.userId();
//     },
//     prods : function() {
//         return Template.instance().prod_lists.get();
//     }
// });

Template.navigation.events({
    'click .logout_control' : function(event) {
        event.preventDefault();
        Meteor.logout();
        Router.go('http://aficionadoventures.com');
    }
});

Template.navigation.helpers({
    currentUser : function() {
        return Meteor.userId();
    },
});

