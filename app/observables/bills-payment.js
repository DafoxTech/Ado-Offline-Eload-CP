define([
  'knockout',
  'toast',
  'http'
], function(ko, toast, http) {
  var o = {
    account_number: ko.observable(0),
    account_name: ko.observable(0),
    phone_number: ko.observable(0),
    biller_name: ko.observable(''),
    biller_short_name: ko.observable(''),
    biller_id: ko.observable(''),
    bill_amount: ko.observable(''),
    due_date: ko.observable(''),
    account_number_label: ko.observable(''),
    account_name_label: ko.observable(''),
    amount_label: ko.observable(''),
    setAccountNumber: function(number) {
      o.account_number(number)
    },
    setPhoneNumber: function(number) {
      o.phone_number(number)
    },
    setAccountName: function(name) {
      o.account_name(name)
    },
    setBillAmount: function(amount) {
      o.bill_amount(amount)
    },
    setDueDate: function(date) {
      o.due_date(date)
    },
    setBiller: function(biller) {
      o.biller_name(biller.name)
      o.biller_short_name(biller.short_name)
      o.biller_id(biller.id)
      o.account_number_label(biller.account_number_label)
      o.account_name_label(biller.account_name_label)
      o.amount_label(biller.amount_label)
    },
    set: function(payment) {
      o.biller_name(payment.biller_name)
      o.biller_short_name(payment.biller_short_name)
      o.biller_id(payment.biller_id)
      o.account_number(payment.number)
      o.account_name(payment.name)
      o.bill_amount(payment.bill_amount)
      o.due_date(payment.due_date)
      o.phone_number(payment.phone_number)
    },
    reset: function() {
      o.account_number('')
      o.account_name('')
      o.biller_name('')
      o.biller_short_name('')
      o.biller_id('')
      o.bill_amount('')
      o.due_date('')
      o.phone_number('')
    }
  };
  return o;
});
