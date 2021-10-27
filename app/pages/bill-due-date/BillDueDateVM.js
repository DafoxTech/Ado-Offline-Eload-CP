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
    self.due_date = ko.observable(bill.due_date())
    self.isValid = ko.observable(true)

    function validate(due_date){
      var isValid = false
      if (due_date) {
        var splits = due_date.split('/')
        if (splits.length == 3) {
          var today = new Date()
          var cyear = today.getFullYear()
          var cmonth = today.getMonth() + 1
          var cday = today.getDate()
          var mm = splits[0].trim()
          var dd = splits[1].trim()
          var yy = splits[2].trim()
          isValid = mm.length >= 1 && dd.length >= 1 && yy.length == 4
          isValid = isValid && parseInt(mm) >= 1 && parseInt(mm) <= 12 && parseInt(mm) >= cmonth
          isValid = isValid && parseInt(dd) >= 1 && parseInt(dd) <= 31 && (parseInt(dd) > cday + 5 || parseInt(mm) > cmonth)
          isValid = isValid && parseInt(yy) >= cyear && parseInt(yy) <= cyear + 1
        }
      }
      self.isValid(isValid)
      return isValid
    }

    var prev = '';
    self.due_date.subscribe(function (v){
      v = v.replace(/\.|\-|\s|\,/, '')
      prev = v
    }, self, 'beforeChange')

    self.due_date.subscribe(function (v){
      var plen = prev.length
      v = v.replace(/\.|\-|\s|\,/, '')
      var len = v.length
      if (plen < len && (v.length == 2 || v.length == 5)){
        v = v + '/'
      }
      self.due_date(v)
    })

    self.submit = function () {
      if (validate(self.due_date())) {
        bill.setDueDate(self.due_date())
        rootVM.navigate('bill-phone-number-page')
      } else {
        sounds.error.play()
      }
    }
    self.delBack = function () {
      if (self.due_date().length) {
        var str = self.due_date()
        self.due_date(str.substring(0, str.length-1))
      } else {
        bill.setDueDate('')
        rootVM.navigate('bill-account-name-page')
      }
    }
  };

});
