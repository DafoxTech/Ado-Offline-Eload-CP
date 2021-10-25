define([
  'knockout'
], function (ko) {
  ko.components.register('emoney-cashin-page', {
    viewModel: {require: 'app/pages/emoney-cashin/EmoneyCashinVM.js'},
    template: {require: 'text!app/pages/emoney-cashin/emoney-cashin.html'}
  });
});
