define([
  'knockout',
  'rootVM',
  'toast',
  'http',
  'sounds',
  'app/observables/bills-payment'
], function (ko, rootVM, toast, http, sounds, bill) {

  return function () {
    var self = this;
    self.bill_amount = ko.observable(bill.bill_amount())
    self.isValid = ko.observable(true)
    function validate(bill_amount){
      var isValid = !isNaN(parseInt(bill_amount)) && parseInt(bill_amount) > 10
      self.isValid(isValid)
      return isValid
    }

    self.bill_amount.subscribe(function (v){
      v = v.replace(/\-|\s|\,/, '')
      v = v.replace(/^00/, '0')
      self.bill_amount(v)
    })

    self.submit = function () {
      if (validate(self.bill_amount())) {
        bill.setBillAmount(self.bill_amount())
        rootVM.navigate('bill-account-name-page')
      } else {
        sounds.error.play()
      }
    }
    self.delBack = function () {
      if (self.bill_amount().length) {
        var num = self.bill_amount()
        self.bill_amount(num.substring(0, num.length-1))
      } else {
        bill.setBillAmount('')
        rootVM.navigate('bill-account-number-page')
      }
    }
  };

});
