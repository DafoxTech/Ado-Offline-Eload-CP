define([
  'knockout',
  'rootVM',
  'toast',
  'http',
  'modal',
  'app/observables/kiosk-order',
  'app/components/kiosk-order-processing/KioskOrderProcessing'
], function (ko, rootVM, toast, http, modal, order) {

  return function () {
    var self = this;
    self.submit = function () {
      modal.show('kiosk-order-processing', {});
    }
  };

});
