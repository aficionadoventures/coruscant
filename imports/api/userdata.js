Products = new Mongo.Collection('products');

Products.allow({
	insert: function(userId, doc) {
		return !!userId;
	}
});

ProductSchema = new SimpleSchema({
    name: {
    	type: String,
    	label: "Name"
    },

    category: {
    	type: String,
    	label: "category"
    },

    Vendor: {
    	type: String,
    	label: "Vendor",
    	autoValue: function() {
    		return this.userId
    	},
    	autoform: {
    		type: "hidden"
    	}
    },

    createdAt: {
    	type: Date,
    	label: "Created At",
    	autoValue: function() {
    		return new Date()
    	},
    	autoform: {
    		type: "hidden"
    	}
    },

    grade: {
    	type: String,
    	label: "Grade"
    },

    price: {
    	type: Number,
    	label: "Price"
    },

    Size: {
    	type: String,
    	label: "Size"
    },

    Age: {
    	type: Number,
    	label: "Age"
    },

});

Products.attachSchema(ProductSchema);

