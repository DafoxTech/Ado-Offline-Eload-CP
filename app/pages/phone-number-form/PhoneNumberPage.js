define([
  'knockout'
], function (ko) {
  ko.components.register('phone-number-page', {
    viewModel: {require: 'app/pages/phone-number-form/PhoneNumberVM.js'},
    template: {require: 'text!app/pages/phone-number-form/phone-number-form.html'}
  });
});
