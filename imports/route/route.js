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

