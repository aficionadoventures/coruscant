import { Accounts } from 'meteor/accounts-base';

Router.route('/', function () {
	this.render('home');
	name: 'home'
});

Router.route('/register', function () {
	this.render('register');
	name: 'register'
});

Router.route('/upload', function () {
	this.render('upload');
	name: 'upload'
});

Router.configure({
	layoutTemplate: 'main'
},{
	name: 'main'
});

Router.route('/verify-email/:token', function() {
    let token = this.params.token;
    console.log(token);
    Accounts.verifyEmail(token, (error) => {
        if (error) {
            console.log('Error in verifying email');
        } else {
            console.log('Email verified');
        }
    });
});

