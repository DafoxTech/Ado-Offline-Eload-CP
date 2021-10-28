define([
  'knockout',
  'rootVM',
  'toast',
  'http',
  'modal',
  'app/observables/bills-payment',
  'sounds',
  'app/components/progress-bar/ProgressBar',
  'app/components/bill-processing/BillProcessing'
], function (ko, rootVM, toast, http, modal, bill, sounds) {

  return function () {
    var self = this;

    self.biller_short_name = ko.observable(bill.biller_short_name());
    self.account_number = ko.observable(bill.account_number());
    self.account_name = ko.observable(bill.account_name());
    self.phone_number = ko.observable(bill.phone_number());
    self.amount_formatted = ko.observable('P'+bill.bill_amount())
    self.due_date = ko.observable(bill.due_date());
    self.total_amount_formatted = ko.observable('P'+bill.bill_amount())
    self.account_credits_formatted = ko.observable('P0.00')
    self.to_pay_formatted = ko.observable('P'+bill.bill_amount())

    self.maxTimeout = ko.observable(60*5)
    self.sTimeout = ko.observable(self.maxTimeout())

    self.submit = function () {
      modal.show('bill-processing', {account_number: "29103907717", account_name: "Arnel Lenteria"});
    }

    self.back = function () {
      rootVM.navigate('bill-phone-number-page')
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
