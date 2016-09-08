import { Accounts } from 'meteor/accounts-base';

Router.route('/', function () {
	this.render('home');
	name: 'home'
});

Router.route('/register', function () {
	this.render('register');
}, {
	name: 'register'
});

Router.route('/login', function () {
    this.render('login');
}, {
    name: 'login'
});

Router.route('/search', function () {
    this.render('search');
}, {
    name: 'search'
});

Router.route('/dashboard', function () {
    this.render('dashboard');
}, {
    name: 'dashboard'
});

Router.route('/upload', function () {
	this.render('upload');
}, {
	name: 'upload'
});

Router.configure({
	layoutTemplate: 'main'
},{
	name: 'main'
});

Router.configure({
    notFoundTemplate: 'notFound'
});

Router.route('/reset', function () {
    this.render('resetPass');
}, {
    name: 'reset'
});

Router.route('/forgot', function () {
    this.render('forgotPass');
}, {
    name: 'forgot'
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

Router.route('/verify-phone', function () {
    this.render('phoneVerif');
    }, {
    name: 'phoneVerifRoute'
});

Router.route('/marketplaceUser', function () {
    this.render('marketplaceUser');
    }, {
    name: 'marketplaceUser'
});


Router.route('/productViewUser', function () {
    this.render('productViewUser');
    }, {
    name: 'productViewUser'
});

// FlowRouter.route('/product/:id', {
//     name: 'product-view',
//     action() {
//         Blazelayout.render('Mainlayout', {main: 'productView'});
//     }
// });

Router.route('/reverseauction', function () {
    this.render('reverseAuction');
}, {
    name: 'reverseAuction'
});


