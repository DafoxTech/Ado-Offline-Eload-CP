define([
  'knockout'
], function (ko) {
  ko.components.register('emoney-products-page', {
    viewModel: {require: 'app/pages/emoney-products/EmoneyProductsVM.js'},
    template: {require: 'text!app/pages/emoney-products/emoney-products.html'}
  });
});
