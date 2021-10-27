define([
  'knockout'
], function (ko) {
  ko.components.register('bill-amount-page', {
    viewModel: {require: 'app/pages/bill-amount/BillAmountVM.js'},
    template: {require: 'text!app/pages/bill-amount/bill-amount.html'}
  });
});
