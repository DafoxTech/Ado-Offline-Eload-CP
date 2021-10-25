define([
  'knockout',
  'rootVM',
  'toast',
  'http',
  'modal',
  'app/observables/eload-order',
  'sounds',
  'app/components/eload-processing/EloadProcessing',
  'app/components/progress-bar/ProgressBar'
], function (ko, rootVM, toast, http, modal, order, sounds) {

  return function () {
    var self = this;
    self.phone_number = order.phone_number;
    self.product_keyword = order.product_keyword;
    self.product_keyword_formatted = order.product_keyword;
    self.product_description = order.product_description;
    self.provider_name = order.provider_name;
    self.product_price = order.product_price
    self.account_credits = order.account_credits
    self.is_reprocess = order.is_reprocess;
    self.maxTimeout = ko.observable(60*5)
    self.sTimeout = ko.observable(self.maxTimeout())
    var k = self.product_keyword()
    if (parseInt(k) > 0) {
      self.product_keyword_formatted('P'+k)
    }
    var price = parseInt(self.product_price())
    var credits = parseInt(self.account_credits())
    self.to_pay = ko.observable(Math.max(0, price - credits))
    self.price_formatted = ko.observable('P' + price + '.00')
    self.account_credits_formatted = ko.observable('P' + credits + '.00')
    self.to_pay_formatted = ko.observable('P' + self.to_pay() + '.00')

    self.acc_phone_label = function () {
      var pname = self.provider_name().toUpperCase()
      if (pname.includes('CIGNAL')) {
        return 'ACCOUNT#:'
      } else if (pname.includes('MERALCO')) {
        return 'Service#:'
      } else {
        return 'Phone:'
      }
    }

    self.submit = function () {
      modal.show('eload-processing', {phone_number: self.phone_number(), product_keyword: self.product_keyword()});
    }

    self.back = function () {
      rootVM.navigate('eload-products-page')
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
