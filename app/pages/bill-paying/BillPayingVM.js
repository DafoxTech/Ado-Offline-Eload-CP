define([
  'knockout',
  'rootVM',
  'toast',
  'http',
  'modal',
  'app/observables/bills-payment',
  'app/components/bill-processing/BillProcessing'
], function (ko, rootVM, toast, http, modal, bill) {

  return function () {
    var self = this;

    self.biller_short_name = ko.observable(bill.biller_short_name());
    self.account_number = ko.observable(bill.account_number());
    self.account_name = ko.observable(bill.account_name());
    self.phone_number = ko.observable(bill.phone_number());
    self.amount_formatted = ko.observable('P'+bill.bill_amount())
    self.due_date = ko.observable(bill.due_date());
    self.total_amount_formatted = ko.observable('P'+bill.bill_amount())
    self.account_credits_formatted = ko.observable('P0.00')
    self.to_pay_formatted = ko.observable('P'+bill.bill_amount())

    self.submit = function () {
      modal.show('bill-processing', {account_number: "29103907717", account_name: "Arnel Lenteria"});
    }
  };

});
