import { Tracker } from 'meteor/tracker';

Products = new Mongo.Collection('products');

export { Products };

let Cart_Dep = new Tracker.Dependency;

export { Cart_Dep };
