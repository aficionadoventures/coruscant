Meteor.publish('products', function () {
	return Products.find({vendor: this.userId})
});