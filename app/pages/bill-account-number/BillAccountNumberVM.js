define([
  'knockout',
  'rootVM',
  'toast',
  'http',
  'app/observables/bills-payment'
], function (ko, rootVM, toast, http, bills_payment) {

  return function () {
    var self = this;
    self.account_number = ko.observable('')
    self.submit = function () {
      bills_payment.setAccountNumber(self.account_number())
      rootVM.navigate('bill-account-name-page')
    }
    self.koDescendantsComplete = function () {
      
    };
  };

});
