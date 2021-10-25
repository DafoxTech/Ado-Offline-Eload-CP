define([
  'knockout',
  'rootVM',
  'toast',
  'http',
  'sounds',
  'app/observables/eload-order',
  'app/utils/array.findIndex',
], function (ko, rootVM, toast, http, sounds, order, findIndex) {

  return function () {
    var acc_number_providers = ['CIGNAL', 'MERALCO']
    var virtual_pin_providers = ['GSAT', 'GAME PINS']

    var self = this;
    self.phone_number = ko.observable(order.phone_number())
    self.provider_name = ko.observable(order.provider_name())
    self.isValid = ko.observable(true)
    function validate(phone_number){
      var isValid;
      if (self.isNonPhone()) {
        isValid = phone_number && phone_number.length > 5
      } else {
        isValid = !isNaN(parseInt(phone_number)) && phone_number.substring(0, 2) == '09' && phone_number.length == 11
      }

      self.isValid(isValid)
      return isValid
    }

    var isNonPhone;
    self.isNonPhone = function () {
      if (isNonPhone != null) return isNonPhone;
      isNonPhone = findIndex(acc_number_providers, function (i) {
        return self.provider_name().toUpperCase().includes(i)
      }) >= 0
      return isNonPhone
    }

    self.acc_phone_label = function () {
      var pname = self.provider_name().toUpperCase()
      if (pname.includes('CIGNAL')) {
        return 'CIGNAL ACCOUNT NUMBER'
      } else if (pname.includes('MERALCO')) {
        return 'MERALCO Service ID Number'
      } else {
        return 'Phone Number'
      }
    }
    self.hint = function () {
      var pname = self.provider_name().toUpperCase()
      if (pname == 'GAME PINS') {
        return 'Ang mobile number na inyong e-input ay makaka-receive ng E-PIN at kailangan lamang na e-follow ang instructions kung paano e-activate.'
      } else if (pname == 'GSAT') {
        return 'Ang mobile number na inyong e-input ay makaka-receive ng E-PIN at kailangan lamang na e-follow ang instructions kung paano e-activate sa inyong GSAT/GPINOY TV box.'
      } else if (pname == 'CIGNAL') {
        return 'Ang CIGNAL/SATLITE load natin ay direct to account loading. Kailangan lamang na e-enter ang account number ng inyong CIGNAL/SATLITE tv box. Makikita sa website ng Cignal ang instructions kung paano kunin ang account number base sa tv box number.'
      } else if (pname.includes('MERALCO')) {
        return 'Please double check your MERALCO service ID number before clicking submit.'
      } else {
        return 'Please double check your mobile number before clicking submit.'
      }
    }

    self.placeholder = function () {
      if (self.isNonPhone()) {
        return 'xxxxxxxxx'
      } else {
        return '09xxxxxxxxx'
      }
    }

    self.phone_number.subscribe(function (v){
      v = v.replace(/\.|\-|\s|\,/, '')
      if (!self.isNonPhone()) {
        v = v.replace(/^00/, '0')
      }
      self.phone_number(v)
    })

    self.submit = function () {
      if (validate(self.phone_number())) {
        order.setPhoneNumber(self.phone_number())
        rootVM.navigate('eload-products-page')
      } else {
        sounds.error.play()
      }
    }
    self.delBack = function () {
      if (self.phone_number().length) {
        var num = self.phone_number()
        self.phone_number(num.substring(0, num.length-1))
      } else {
        order.setPhoneNumber('')
        rootVM.navigate('buy-eload-page')
      }
    }
  };

});
