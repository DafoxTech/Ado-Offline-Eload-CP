define([
  'knockout'
], function (ko) {
  ko.components.register('kiosk-checkout-page', {
    viewModel: {require: 'app/pages/kiosk-checkout/KioskCheckoutVM.js'},
    template: {require: 'text!app/pages/kiosk-checkout/kiosk-checkout.html'}
  });
});
