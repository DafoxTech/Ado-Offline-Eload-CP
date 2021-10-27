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
    self.account_name = ko.observable(bill.account_name());
    self.account_name_label = ko.observable(bill.account_name_label());
    self.isValid = ko.observable(true)

    function validate(account_name){
      var isValid = account_name && account_name.length >= 5 && account_name.split(' ').length >= 2
      self.isValid(isValid)
      return isValid
    }

    self.account_name.subscribe(function (v){
      if(v){
        v = v.replace(/\s{2,}/g,' ')
        self.account_name(v.toLocaleUpperCase())
      }
    })

    self.submit = function () {
      if (validate(self.account_name())) {
        bill.setAccountName(self.account_name().trim())
        rootVM.navigate('bill-due-date-page')
      } else {
        sounds.error.play()
      }
    }
    self.delBack = function () {
      if (self.account_name().length) {
        var num = self.account_name()
        self.account_name(num.substring(0, num.length-1))
      } else {
        bill.setAccountName('')
        rootVM.navigate('bill-account-number-page')
      }
    }
  };

});
