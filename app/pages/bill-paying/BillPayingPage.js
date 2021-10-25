define([
  'knockout'
], function (ko) {
  ko.components.register('bill-paying-page', {
    viewModel: {require: 'app/pages/bill-paying/BillPayingVM.js'},
    template: {require: 'text!app/pages/bill-paying/bill-paying.html'}
  });
});
