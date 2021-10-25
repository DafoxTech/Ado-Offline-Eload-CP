define([
  'knockout'
], function (ko) {
  ko.components.register('order-kiosk-page', {
    viewModel: {require: 'app/pages/order-kiosk/OrderKioskVM.js'},
    template: {require: 'text!app/pages/order-kiosk/order-kiosk.html'}
  });
});
