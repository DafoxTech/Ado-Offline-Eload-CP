define([
  'knockout',
  'rootVM',
  'toast',
  'http',
  'app/observables/eload-order'
], function (ko, rootVM, toast, http, order) {

  return function () {
    var self = this;
    self.phone_number = ko.observable('')
    self.submit = function () {
      order.setPhoneNumber(self.phone_number())
      rootVM.navigate('emoney-products-page')
    }
    self.koDescendantsComplete = function () {
      
    };
  };

});
