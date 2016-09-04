Products = new Mongo.Collection('products');

// export { Products };

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

    vendor: {
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

    size: {
        type: String,
        label: "Size",
        optional: true
    },

    age: {
        type: Number,
        label: "Age",
        optional: true
    },

    // document: {
    //  type: Array,
    //  label: "Upload Documents",
    //  optional: true
    // },

});

Products.attachSchema(ProductSchema);