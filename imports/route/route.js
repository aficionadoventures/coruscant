import { Accounts } from 'meteor/accounts-base';
import { Tracker } from 'meteor/tracker';

Router.route('/', function () {
	this.render('home');
}, {
	name: 'home',
	template : 'home',
});

Router.route('/register', function () {
	this.render('register');
}, {
	name: 'register',
	template : 'register',
});

Router.route('/verify-email/:token', function() {
	let token = this.params.token;
	console.log(token);
	Accounts.verifyEmail(token, function(error) {
		if (error) {
			console.log('Error in verifying email');
		} else {
			console.log('Email verified');
		}
	});
});

Router.route('/login', function () {
	this.render('login');
}, {
	name: 'login',
	template : 'login',
});

let query = '';
let results_route = [];
let results_route_dep = new Tracker.Dependency;
let query_dep = new Tracker.Dependency;
let get_query = function() {
	query_dep.depend();
	return query;
};
let set_query = function(q) {
	query = q;
	query_dep.changed();
};
let get_results_route = function() {
	results_route_dep.depend();
	return results_route;
};
let set_results_route = function(q) {
	results_route = q;
	results_route_dep.changed();
};

let onCreated_called = false;
let search_results_tmpl_instance;
let search_results_tmpl_register = function(tmpl_instance) {
	onCreated_called = true;
	search_results_tmpl_instance = tmpl_instance;
};

Router.route('/search', function() {
	set_query(this.params.query.q);
	let self = this;
	Meteor.call('search_name', get_query(), { returnStubValue: true },
		function(error, results) {
			set_results_route(results);
			if (!error) {
				if (!onCreated_called) {
					Template.search_results.onCreated(function() {
						Template.instance().details_template = new ReactiveVar("");
						Template.instance().details_data = new ReactiveVar({});

						Template.instance().results = new ReactiveVar(get_results_route());
						search_results_tmpl_register(Template.instance());
					});
					self.render('search_results');
				} else {
					search_results_tmpl_instance.results.set(get_results_route());
				}
			}
	});
},{
	name : 'search',

	template : 'search_results',
});
