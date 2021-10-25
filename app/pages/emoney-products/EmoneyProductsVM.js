define([
  'knockout',
  'rootVM',
  'toast',
  'http',
  'app/observables/eload-order'
], function (ko, rootVM, toast, http, order) {

  return function () {
    var self = this;
    self.selectRegular = function (){
      rootVM.navigate('regular-load-page')
    }

    self.selectPromo = function (promo) {
      order.setProduct(promo)
      rootVM.navigate('eload-paying-page')
    }
  };

});
