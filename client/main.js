import '../imports/route/route.js';
import '../imports/ui/body.js';
import '../imports/ui/register.js';


Meteor.subscribe('products');

Template.Products.helpers({
	products: ()=> {
		return Products.find({});
	}
});