define([
  'knockout',
  'rootVM',
  'toast',
  'http',
  'app/observables/bills-payment'
], function (ko, rootVM, toast, http, bills_payment) {

  return function () {
    var self = this;
    self.account_name = ko.observable('')
    self.submit = function () {
      bills_payment.setAccountName(self.account_name())
      rootVM.navigate('bill-due-date-page')
    }
    self.koDescendantsComplete = function () {
      
    };
  };

});
