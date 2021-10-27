define([
  'knockout',
  'rootVM',
  'toast',
  'http',
  'sounds',
  'app/observables/bills-payment'
], function (ko, rootVM, toast, http, sounds, bills_payment) {

  return function () {
    var self = this;
    self.account_number = ko.observable(bills_payment.account_number())
    self.biller_short_name = ko.observable(bills_payment.biller_short_name())
    self.account_number_label = ko.observable(bills_payment.account_number_label())
    self.isValid = ko.observable(true)

    function validate(account_number){
      var isValid = !isNaN(parseInt(account_number)) && account_number.length >= 5
      self.isValid(isValid)
      return isValid
    }

    self.account_number.subscribe(function (v){
      v = v.replace(/\.|\-|\s|\,/, '')
      self.account_number(v)
    })

    self.submit = function () {
      if (validate(self.account_number())) {
        bills_payment.setAccountNumber(self.account_number())
        rootVM.navigate('bill-amount-page')
      } else {
        sounds.error.play()
      }
    }
    self.delBack = function () {
      if (self.account_number().length) {
        var num = self.account_number()
        self.account_number(num.substring(0, num.length-1))
      } else {
        bills_payment.setAccountNumber('')
        rootVM.navigate('bayad-center-page')
      }
    }
  };

});
