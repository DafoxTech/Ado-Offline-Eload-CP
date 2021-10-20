define([
  'knockout'
], function (ko) {
  ko.components.register('eload-products-page', {
    viewModel: {require: 'app/pages/eload-products/EloadProductsVM.js'},
    template: {require: 'text!app/pages/eload-products/eload-products.html'}
  });
});
