define([
  'knockout'
], function (ko) {
  ko.components.register('bayad-center-page', {
    viewModel: {require: 'app/pages/bayad-center/BayadCenterVM.js'},
    template: {require: 'text!app/pages/bayad-center/bayad-center.html'}
  });
});
