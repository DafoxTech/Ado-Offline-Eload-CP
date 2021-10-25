define([
  'knockout'
], function (ko) {
  ko.components.register('bill-phone-number-page', {
    viewModel: {require: 'app/pages/bill-phone-number/BillPhoneNumberVM.js'},
    template: {require: 'text!app/pages/bill-phone-number/bill-phone-number.html'}
  });
});
