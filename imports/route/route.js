import { Accounts } from 'meteor/accounts-base';

Router.route('/', function () {
  this.render('home');
});

Router.route('/register', function () {
  this.render('register');
});

Router.route('/upload', function () {
  this.render('upload');
});

Router.configure({
    layoutTemplate: 'main'
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

