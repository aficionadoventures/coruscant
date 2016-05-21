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

