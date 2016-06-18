import { Meteor } from 'meteor/meteor';

Meteor.publish('products', function () {
	return Products.find({vendor: this.userId})
});
