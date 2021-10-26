define([
  'knockout',
  'rootVM',
  'toast',
  'http',
  'app/observables/eload-order'
], function (ko, rootVM, toast, http, order) {

  return function () {
    var self = this;
    var provider_id = order.provider_id()

    self.promos = ko.observableArray([])
    self.page = ko.observable(1)
    self.search = ko.observable('')
    self.searching = ko.observable(false)
    self.per_page = ko.observable(9)
    self.hasMore = ko.observable(false)

    self.delBack = function () {
      if (self.searching()) {
        var q = self.search()
        if (q) {
          self.search(q.substring(0, q.length - 1))
        } else {
          self.searching(false)
          self.loadPromos(1)
        }
      } else {
        var page = self.page()
        if (page > 1) {
          self.loadPromos(page - 1)
        } else {
          rootVM.navigate('emoney-account-page')
        }
      }
    }

    self.selectPromo = function (promo) {
      order.setProduct(promo)
      http.newEwalletOrder(order, function(err, data) {
        if (!err) {
          order.product_price(data.price)
          order.account_credits(data.account_credits)
          order.is_reprocess(data.is_reprocess)
          rootVM.navigate('eload-paying-page')
        }
      })
    }

    self.loadPromos = function (page) {
      if (page) self.page(page)
      var per_page = self.per_page()
      var search = self.search()
      http.getEwalletPromos({provider_id: provider_id, page: page, per_page: per_page, search: search}, function(err, resp){
        var promos = resp.promos
        self.promos(promos)
        self.hasMore(resp.has_more_promos)
      })
    }

    self.search.subscribe(function(q) {
      if (!self.searching()) {
        self.loadPromos(1)
      }
    })

    self.searchingMode = function (){
      self.searching(true)
    }

    self.submitSearch = function() {
      self.searching(false)
      self.loadPromos(1)
    }

    self.formatBtnIcon = function () {
      var short_name = order.provider_short_name()
      short_name = short_name.toLowerCase()
      short_name = short_name.replaceAll(' ', '-')
      short_name = short_name.replaceAll('.', '')
      return 'btn-' + short_name
    }

    self.koDescendantsComplete = function () {
      self.loadPromos(1)
    };
  };

});
