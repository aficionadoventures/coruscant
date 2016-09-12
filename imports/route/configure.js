import { Accounts } from 'meteor/accounts-base';

Router.configure({
	layoutTemplate: 'main'
},{
	name: 'main'
});

Router.configure({
	notFoundTemplate: 'not_found'
});
