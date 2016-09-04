import './navigation.html';
import './add-product.html';

// Meteor.subscribe('products');

Template.marketplaceUser.onCreated(function() {
	var self = this;
	self.autorun(function() {
		self.subscribe('products');
	});
});

Template.marketplaceUser.helpers({
    products: ()=> {
        return Products.find({});
    }
});