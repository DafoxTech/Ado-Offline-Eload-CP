define([
  'knockout',
  'rootVM',
  'toast',
  'http',
  'app/observables/eload-order'
], function (ko, rootVM, toast, http, order) {

  return function () {
    var self = this;
    self.selectProvider = function (provider) {
      order.setProvider(provider)
      rootVM.navigate('emoney-account-page');
    }

    self.selectProvider('GCASH')
  };

});
