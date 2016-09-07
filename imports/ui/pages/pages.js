import './dashboard.html';
import './home.html';
import './login.html';
import './page-not-found.html';
import './register.html';
import './search.html';
import './reverseauction.html';
import './productDetail.html'

import './home.css';
import './login.css';
import './dashboard.css';
import './register.css';
import './search.css';
import './reverseauction.css';


Template.search.events({
  'click #viewDetail': function(e) {
    e.preventDefault();

    Modal.show('productDetail');
  }
});
