define([
  'knockout',
  'rootVM',
  'toast',
  'http',
  'sounds',
  'app/observables/eload-order',
  'app/utils/array.reduce',
  'app/utils/array.findIndex'
], function (ko, rootVM, toast, http, sounds, order, reduce, findIndex) {

  return function () {
    var self = this;
    var provider_id = order.provider_id();
    self.provider_name = order.provider_name;
    self.product_keyword = ko.observable('')
    self.regular_denoms = ko.observableArray([])
    self.amounts_formatted = ko.observable('')
    self.submit = function () {
      if(!self.isAvailable()) {
        sounds.error.play()
        return
      }
      var k = self.product_keyword()
      order.setProduct({
        keyword: k,
        description: 'Regular Load P'+k 
      })
      http.newEloadOrder(order, function(err, data) {
        if (!err) {
          order.product_price(data.price)
          order.account_credits(data.account_credits)
          order.is_reprocess(data.is_reprocess)
          rootVM.navigate('eload-paying-page')
        }
      })
    }
    self.delBack = function () {
      var v = self.product_keyword()
      if (v.length) {
        self.product_keyword(v.substring(0, v.length-1))
      } else {
        rootVM.navigate('eload-products-page')
      }
    }

    self.isAvailable = function (){
      var list = self.regular_denoms()
      var v = self.product_keyword()
      return findIndex(list, function(r){ return r == v }) >= 0
    }

    self.product_keyword.subscribe(function (v){
      v = v.replaceAll('.', '')
      v = v.replaceAll(' ', '')
      v = v.replaceAll('-', '')
      v = v.replaceAll(',', '')
      v = v.replace(/^00/, '0')
      self.product_keyword(v)
    })

    self.koDescendantsComplete = function () {
      http.getRegularDenoms(provider_id, function(err, data){
        var list = reduce(data, function(result, item){
          var denoms = item.denominations
          for(var i = 0; i < denoms.length; i++){
            var a = denoms[i]
            var exists = findIndex(result, function(r){ return r == a }) >= 0
            if(!exists) {
              result.push(a)
            }
          }
          return result
        }, [])
        self.regular_denoms(list)
        self.amounts_formatted('Amounts: '+list.join(', '))
      })
    };
  };

});
