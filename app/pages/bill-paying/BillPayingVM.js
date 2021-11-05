define([
  'knockout',
  'rootVM',
  'toast',
  'http',
  'modal',
  'app/observables/bills-payment',
  'sounds',
  'socket',
  'app/components/progress-bar/ProgressBar',
  'app/components/bill-processing/BillProcessing'
], function (ko, rootVM, toast, http, modal, bill, sounds, socket) {

  return function () {
    var self = this;

    var price = parseInt(bill.price())
    self.account_credits = ko.observable(parseInt(bill.account_credits()))
    self.bill_amount = ko.observable(parseFloat(bill.bill_amount()))
    self.amount_formatted = ko.observable('P'+self.bill_amount().toFixed(2))
    self.due_date = ko.observable(bill.due_date());
    self.transaction_fee = ko.observable(parseInt(bill.transaction_fee()));
    self.transaction_fee_formatted = ko.observable('P'+self.transaction_fee().toFixed(2))
    self.biller_short_name = bill.biller_short_name
    self.account_number = bill.account_number
    self.account_name = bill.account_name
    self.phone_number = bill.phone_number
    self.is_reprocess = bill.is_reprocess
    self.account_number_label = bill.account_number_label
    self.account_name_label = bill.account_name_label
    self.amount_label = bill.amount_label

    self.to_pay = ko.computed(function() {
      return Math.max(0, price - self.account_credits())
    })
    self.price_formatted = ko.observable('P' + price.toFixed(2))
    self.account_credits_formatted = ko.computed(function() {
      return 'P' + self.account_credits().toFixed(2)
    })

    self.to_pay_formatted = ko.computed(function() {
      return 'P' + self.to_pay().toFixed(2)
    })
    self.maxTimeout = ko.observable(bill.wait_payment_seconds())
    self.sTimeout = ko.observable(self.maxTimeout())

    self.is_payment_ready = ko.computed(function() {
      return self.is_reprocess() || (price > 0 && price <= self.account_credits())
    })

    self.submit = function () {
      modal.show('bill-processing');
      sounds.eload_processing.play()
      self.dispose()
      http.donePayment(null, function(err){})
    }

    self.back = function () {
      http.donePayment(null, function(err){
        if(err) console.log(err)
        rootVM.navigate('bill-phone-number-page')
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
      self.fetch()

      if (!self.is_payment_ready()) {
        sounds.insertCoin.play();
        sounds.insertCoinBg.play();
      }
    }

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

    self.onPaymentReceived = function (data) {
      self.account_credits(parseInt(data.customer_credits))
      bill.transaction_id(data.transaction_id)
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

    self.dispose = function () {
      sounds.insertCoin.stop();
      sounds.insertCoinBg.stop();
      if (fetch_timeout) clearTimeout(fetch_timeout)
      if (interval) clearInterval(interval)
      http.donePayment(null, function(){})
    }
  };

});
