import { Accounts } from 'meteor/accounts-base';

Router.route('/', function () {
	this.render('home');
}, {
	name: 'home',
});

Router.route('/register', function () {
	this.render('register');
}, {
	name: 'register',
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
});

Router.route('/search', function() {
	let query = this.params.query;
	let self = this;
	Meteor.call('search_name', query.q, { returnStubValue: true },
		function(error, results) {
			if (!error) {
				Template.search_results.onCreated(function() {
					let template = Template.instance();
					template.results = new ReactiveVar(results);
					template.n_results = new ReactiveVar(results.length);
				});
				self.render('search_results');
			}
	});
}, {
	name : 'search',
});
