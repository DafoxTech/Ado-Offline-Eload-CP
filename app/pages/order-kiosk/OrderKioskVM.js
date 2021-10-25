define([
  'knockout',
  'rootVM',
  'toast',
  'http',
  'app/observables/kiosk-order'
], function (ko, rootVM, toast, http, order) {

  return function () {
    var self = this;
    self.addOrder = function (item) {
      order.add(item)
    }

    self.checkout = function () {
      rootVM.navigate("kiosk-checkout-page")
    }
  };

});
