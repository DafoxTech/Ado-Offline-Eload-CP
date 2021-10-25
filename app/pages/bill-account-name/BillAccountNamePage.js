define([
  'knockout'
], function (ko) {
  ko.components.register('bill-account-name-page', {
    viewModel: {require: 'app/pages/bill-account-name/BillAccountNameVM.js'},
    template: {require: 'text!app/pages/bill-account-name/bill-account-name.html'}
  });
});
