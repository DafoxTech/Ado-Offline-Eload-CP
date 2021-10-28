define([
  'knockout',
  'rootVM',
  'toast',
  'http',
  'modal',
  'app/observables/kiosk-order',
  'app/utils/array.reduce',
  'sounds',
  'app/components/progress-bar/ProgressBar',
  'app/components/kiosk-order-processing/KioskOrderProcessing'
], function (ko, rootVM, toast, http, modal, order, reduce, sounds) {

  return function () {
    var self = this;
    self.order_items = ko.observableArray(order.items());
    self.maxTimeout = ko.observable(60*5)
    self.sTimeout = ko.observable(self.maxTimeout())

    self.total_price = ko.computed(function() {
      return reduce(self.order_items(), function(r, i){
        return r + (i.price * i.quantity);
      }, 0)
    }, self);

    self.total_price_formatted = ko.computed(function() {
      return 'P'+self.total_price() 
    }, self)

    self.formatPrice = function(item){
      return 'P'+(item.price * item.quantity)
    }

    self.submit = function () {
      modal.show('kiosk-order-processing', {});
    }

    self.back = function () {
      rootVM.navigate('order-kiosk-page')
      sounds.error.play()
    }

    var interval
    self.koDescendantsComplete = function () {
      interval = setInterval(function () {
        self.sTimeout(self.sTimeout() - 1)
        if (self.sTimeout() <= 0) {
          clearInterval(interval)
          rootVM.navigate('home-page')
        }
      }, 1000)
    }

    self.dispose = function () {
      sounds.insertCoin.stop();
      sounds.insertCoinBg.stop();
      clearInterval(interval)
    }
    sounds.insertCoin.play();
    sounds.insertCoinBg.play();
  };

});
