define([
  'knockout',
  'rootVM',
  'toast',
  'http',
  'app/observables/bills-payment'
], function (ko, rootVM, toast, http, bills_payment) {

  return function () {
    var self = this;
    self.selectBiller = function (biller) {
      bills_payment.setBiller(biller)
      rootVM.navigate('bill-account-number-page');
    }
  };

});
