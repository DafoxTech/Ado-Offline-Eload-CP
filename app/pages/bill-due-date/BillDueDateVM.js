define([
  'knockout',
  'rootVM',
  'toast',
  'http',
  'app/observables/bills-payment'
], function (ko, rootVM, toast, http, bills_payment) {

  return function () {
    var self = this;
    self.due_date = ko.observable('')
    self.submit = function () {
      bills_payment.setDueDate(self.due_date())
      rootVM.navigate('bill-phone-number-page')
    }
    self.koDescendantsComplete = function () {
      
    };
  };

});
