define([
  'knockout',
  'rootVM',
  'toast',
  'http',
  'app/observables/eload-order'
], function (ko, rootVM, toast, http, order) {

  return function () {
    var self = this;
    self.product_keyword = ko.observable('')
    self.submit = function () {
      order.setProduct(self.product_keyword())
      // rootVM.navigate('eload-products-page')
    }
    self.koDescendantsComplete = function () {
      
    };
  };

});
