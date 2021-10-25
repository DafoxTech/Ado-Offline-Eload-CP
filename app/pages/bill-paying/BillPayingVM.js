define([
  'knockout',
  'rootVM',
  'toast',
  'http',
  'modal',
  'app/observables/bills_payment',
  'app/components/bill-processing/BillProcessing'
], function (ko, rootVM, toast, http, modal, bills_payment) {

  return function () {
    var self = this;
    self.submit = function () {
      modal.show('bill-processing', {account_number: "29103907717", account_name: "Arnel Lenteria"});
    }
  };

});
