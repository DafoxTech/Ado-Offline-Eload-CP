define([
  'knockout',
  'rootVM',
  'toast',
  'http',
  'sounds',
  'app/observables/eload-order'
], function (ko, rootVM, toast, http, sounds, order) {

  return function () {
    var self = this;
    var provider_id = order.provider_id()

    self.supports_regular = ko.observable(false)
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
          rootVM.navigate('phone-number-page')
        }
      }
    }

    self.selectRegular = function (){
      rootVM.navigate('regular-load-page')
    }

    self.selectPromo = function (promo) {
      order.setProduct(promo)
      http.newEloadOrder(order, function(err, data) {
        if (!err) {
          order.product_price(data.eload_price)
          order.account_credits(data.customer_credits)
          order.wait_payment_seconds(data.max_wait_payment_seconds)
          order.is_reprocess(data.eload_status == 'queued')
          rootVM.navigate('eload-paying-page')
        } else {
          var resp = JSON.parse(err.responseText)
          toast.error(resp.error)
          sounds.error.play()
        }
      })
    }

    self.loadPromos = function (page) {
      if (page) self.page(page)
      var per_page = self.per_page()
      var search = self.search()
      http.getEloadPromos({provider_id: provider_id, page: page, per_page: per_page, search: search}, function(err, resp){
        var promos = resp.promos
        self.promos(promos)
        self.hasMore(resp.has_more_promos)
        if(page == 1 && !promos.length && !search.length) {
          if (rootVM.prev_page() == 'regular-load-page') {
            rootVM.navigate('phone-number-page')
          } else {
            self.selectRegular()
          }
        }
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
      http.donePayment(null, function(err){})
      http.getRegularDenoms(provider_id, function(err, data){
        var hasRegular = data.length > 0
        self.supports_regular(hasRegular)
        if (hasRegular) {
          self.per_page(8)
        }
        self.loadPromos(1)
      })
    };
  };

});
