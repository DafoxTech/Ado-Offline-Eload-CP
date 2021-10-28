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
    self.search = ko.observable('')
    self.searching = ko.observable(false)
    self.hasMore = ko.observable(false)
    bills_payment.reset()
    self.loadBillers = function (page, limit) {
      if (!limit) limit = 9
      if (!page) page = 1
      self.page(page)
      var search = self.search()

      http.getBillers({page: page, limit: limit, search: search}, function(err, resp){
        self.billers(resp.data)
        self.hasMore(page * limit < resp.total)
      })
    }

    self.selectBiller = function (biller) {
      bills_payment.setBiller(biller)
      rootVM.navigate('bill-account-number-page');
    }

    self.search.subscribe(function(q) {
      if (!self.searching()) {
        self.loadBillers(1)
      }
    })

    self.searchingMode = function (){
      self.searching(true)
    }

    self.submitSearch = function() {
      self.searching(false)
      self.loadBillers(1)
    }

    self.back = function () {
      if (self.searching()) {
        var q = self.search()
        if (q) {
          self.search(q.substring(0, q.length - 1))
        } else {
          self.searching(false)
          self.loadBillers(1)
        }
      } else {
        if (self.page() > 1) {
          self.loadBillers(self.page() - 1)
        } else {
          rootVM.navigate('home-page')
        }
      }
    }

    self.loadBillers(self.page())
  };

});
