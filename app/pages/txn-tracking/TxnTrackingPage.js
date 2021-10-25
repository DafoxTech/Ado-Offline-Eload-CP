define([
  'knockout'
], function (ko) {
  ko.components.register('txn-tracking-page', {
    viewModel: {require: 'app/pages/txn-tracking/TxnTrackingVM.js'},
    template: {require: 'text!app/pages/txn-tracking/txn-tracking.html'}
  });
});
