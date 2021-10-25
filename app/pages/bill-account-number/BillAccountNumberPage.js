define([
  'knockout'
], function (ko) {
  ko.components.register('bill-account-number-page', {
    viewModel: {require: 'app/pages/bill-account-number/BillAccountNumberVM.js'},
    template: {require: 'text!app/pages/bill-account-number/bill-account-number.html'}
  });
});
