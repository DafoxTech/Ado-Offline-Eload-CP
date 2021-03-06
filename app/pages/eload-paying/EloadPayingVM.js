define([
  'knockout',
  'rootVM',
  'toast',
  'http',
  'modal',
  'app/observables/eload-order',
  'sounds',
  'socket',
  'app/components/eload-processing/EloadProcessing',
  'app/components/emoney-processing/EmoneyProcessing',
  'app/components/progress-bar/ProgressBar'
], function (ko, rootVM, toast, http, modal, order, sounds, socket) {

  return function () {
    var self = this;
    var fetch_timeout = null;
    self.phone_number = order.phone_number;
    self.product_keyword = order.product_keyword;
    self.product_keyword_formatted = order.product_keyword
    self.product_description = order.product_description;
    self.provider_name = order.provider_name;
    self.product_price = order.product_price
    self.is_reprocess = order.is_reprocess;
    self.account_credits = ko.observable(parseInt(order.account_credits()))
    self.maxTimeout = ko.observable(parseInt(order.wait_payment_seconds()))
    self.sTimeout = ko.observable(self.maxTimeout())
    var k = self.product_keyword()
    if (parseInt(k) > 0) {
      self.product_keyword_formatted('P'+k)
    }
    var price = parseInt(self.product_price())
    var credits = parseInt(self.account_credits())
    var prev_amount = 0

    self.to_pay = ko.computed(function() {
      return Math.max(0, price - self.account_credits())
    })

    self.price_formatted = ko.observable('P' + price + '.00')
    self.account_credits_formatted = ko.computed(function() {
      return 'P' + self.account_credits().toFixed(2)
    })

    self.to_pay_formatted = ko.computed(function() {
      return 'P' + self.to_pay().toFixed(2)
    })

    self.is_payment_ready = ko.computed(function() {
      return self.is_reprocess() || (price > 0 && price <= self.account_credits())
    })

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
      if (self.provider_name().toUpperCase().includes('GCASH')) {
        modal.show('emoney-processing');
      }else{
        modal.show('eload-processing');
      }

      sounds.eload_processing.play()
      self.dispose()
      http.donePayment(null, function(err){})
    }

    self.back = function () {
      http.donePayment(null, function(err){
        if(err) console.log(err)

        if (self.provider_name().toUpperCase() == 'GCASH') {
          rootVM.navigate('emoney-products-page')
        } else {
          rootVM.navigate('eload-products-page')
        }
        sounds.error.play()
      })
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

      self.fetch();

      if (!self.is_payment_ready()) {
        sounds.insertCoin.play();
        sounds.insertCoinBg.play();
      }

    };

    self.fetch = function () {
      http.currentPaymentQue(function (err, data) {
        if (!err) {
          self.onPaymentReceived(data);
        }
        fetch_timeout = setTimeout(function () {
          self.fetch();
        }, 2000);
      });
    };

    self.dispose = function () {
      socket().removeListener('payment:received', self.onPaymentReceived);
      sounds.insertCoin.stop();
      sounds.insertCoinBg.stop();
      if (interval) clearInterval(interval);
      if (fetch_timeout) clearTimeout(fetch_timeout);
      http.donePayment(null, function(){})
    }

    self.onPaymentReceived = function (data) {
      self.account_credits(parseInt(data.customer_credits))
      order.transaction_id(data.transaction_id)
      var amount = data.total_amount
      if (amount > 0 && prev_amount < amount) {
        var amount_inserted = amount - prev_amount
        // toast.success('Payment Received: P' + amount_inserted.toFixed(2));
        sounds.coinInserted.play();
        
        if (self.is_payment_ready()) {
          self.submit()
        }
      }
      prev_amount = amount
    }

    socket().on('payment:received', self.onPaymentReceived);

  };

});
