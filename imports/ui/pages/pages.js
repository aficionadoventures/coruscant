import './dashboard.html';
import './home.html';
import './login.html';
import './page-not-found.html';
import './register.html';
import './search.html';
import './reverseauction.html';
import './productDetail.html';
import './cart.html';
import './orderTracking.html';

import './home.css';
import './login.css';
import './dashboard.css';
import './register.css';
import './search.css';
import './reverseauction.css';
import './cart.css';
import './orderTracking.css';


Template.search.events({
  'click #viewDetail': function(e) {
    e.preventDefault();

    Modal.show('productDetail');
  }
});

Template.search.events({
  'click #head-cart-button': function(e) {
    e.preventDefault();

    Modal.show('cart');
  }
});

Template.cart.events({
	'click .checkout_button' : function(event, template) {
		event.preventDefault();
		Router.go('/orderTracking');
	}
});
