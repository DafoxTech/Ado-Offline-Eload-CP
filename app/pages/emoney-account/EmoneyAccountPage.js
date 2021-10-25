define([
  'knockout'
], function (ko) {
  ko.components.register('emoney-account-page', {
    viewModel: {require: 'app/pages/emoney-account/EmoneyAccountVM.js'},
    template: {require: 'text!app/pages/emoney-account/emoney-account.html'}
  });
});
