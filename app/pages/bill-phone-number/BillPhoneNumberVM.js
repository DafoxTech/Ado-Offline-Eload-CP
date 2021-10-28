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
    self.phone_number = ko.observable(bill.phone_number())
    self.isValid = ko.observable(true)
    function validate(phone_number){
      var isValid = !isNaN(parseInt(phone_number)) && phone_number.substring(0, 2) == '09' && phone_number.length == 11
      self.isValid(isValid)
      return isValid
    }

    self.phone_number.subscribe(function (v){
      v = v.replace(/\.|\-|\s|\,|\*|\+|\-|\)|\(|\$|\#/, '')
      v = v.replace(/^00/, '0')
      self.phone_number(v)
    })

    self.submit = function () {
      if (validate(self.phone_number())) {
        bill.setPhoneNumber(self.phone_number())
        rootVM.navigate('bill-paying-page')
      } else {
        sounds.error.play()
      }
    }
    self.delBack = function () {
      if (self.phone_number().length) {
        var num = self.phone_number()
        self.phone_number(num.substring(0, num.length-1))
      } else {
        bill.setPhoneNumber('')
        rootVM.navigate('bill-due-date-page')
      }
    }
  };

});
