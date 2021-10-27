define([
  'knockout',
  'rootVM',
  'toast',
  'http',
  'app/observables/bills-payment'
], function (ko, rootVM, toast, http, bills_payment) {

  return function () {
    var self = this;
    self.page = ko.observable(1)
    self.billers = ko.observableArray([])
    self.hasMore = ko.observable(false)
    bills_payment.reset()
    self.loadBillers = function (page, limit) {
      if (!limit) limit = 9
      if (!page) page = 1
      self.page(page)

      http.getBillers({page: page, limit: limit}, function(err, resp){
        self.billers(resp.data)
        self.hasMore(page * limit < resp.total)
      })
    }

    self.selectBiller = function (biller) {
      bills_payment.setBiller(biller)
      rootVM.navigate('bill-account-number-page');
    }

    self.back = function () {
      if (self.page() > 1) {
        self.loadBillers(self.page() - 1)
      } else {
        rootVM.navigate('home-page')
      }
    }

    self.loadBillers(self.page())
  };

});
