define([
  'knockout',
  'rootVM',
  'toast',
  'http',
  'app/observables/kiosk-order'
], function (ko, rootVM, toast, http, order) {

  return function () {
    var self = this;
    self.products = ko.observableArray([])
    self.page = ko.observable(1)
    self.per_page = ko.observable(3)
    self.hasMore = ko.observable(false)
    order.reset()
    self.addOrder = function (item) {
      order.add(item)
      self.shakeCheckout()
    }

    self.hasOrder = function() {
      return self.orders_count() > 0
    }

    self.checkout = function () {
      rootVM.navigate("kiosk-checkout-page")
    }

    self.formatPrice = function (price) {
      if(!price) return 'P0.00'
      return 'P'+price
    }

    self.orders_count = ko.computed(function() {
      return order.count()
    }, self);

    self.loadProducts = function(page) {
      if (page) self.page(page)
      var per_page = self.per_page()
      http.getKioskProducts({page: page, per_page: per_page}, function(err, resp){
        var products = resp.data
        self.products(products)
        self.hasMore(page * per_page < resp.total)
      })
    }

    self.shakeCheckout = function() {
      var element = document.getElementById('checkout')
      element.classList.add("apply-shake");
      var resetAnimation = function(e) {
        element.classList.remove("apply-shake")
        element.removeEventListener("animationend", resetAnimation)
      }
      element.addEventListener("animationend", resetAnimation);
    }

    self.back = function () {
      if (self.page() > 1) {
        self.loadProducts(self.page() - 1)
      } else {
        rootVM.navigate('home-page')
      }
    }

    self.loadProducts(1)
  };

});
