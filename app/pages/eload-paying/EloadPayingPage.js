define([
  'knockout'
], function (ko) {
  ko.components.register('eload-paying-page', {
    viewModel: {require: 'app/pages/eload-paying/EloadPayingVM.js'},
    template: {require: 'text!app/pages/eload-paying/eload-paying.html'}
  });
});
