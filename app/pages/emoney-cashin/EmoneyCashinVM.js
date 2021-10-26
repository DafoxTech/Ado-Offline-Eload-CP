define([
  'knockout',
  'rootVM',
  'toast',
  'http',
  'app/observables/eload-order'
], function (ko, rootVM, toast, http, order) {

  return function () {
    var self = this;
    self.page = ko.observable(1)
    self.providers = ko.observableArray([])
    self.hasMore = ko.observable(false)
    order.reset()
    self.loadProviders = function (page, limit) {
      if (!limit) limit = 9
      if (!page) page = 1
      self.page(page)

      http.getEwalletProviders({page: page, limit: limit}, function(err, resp){
        self.providers(resp.data)
        self.hasMore(page * limit < resp.total)
        if (resp.data.length == 1 && page == 1) {
          if (rootVM.prev_page() == 'emoney-account-page') {
            rootVM.navigate('home-page')
          } else {
            self.selectProvider(resp.data[0])          
          }
        }
      })
    }

    self.selectProvider = function (provider) {
      order.setProvider(provider)
      rootVM.navigate('emoney-account-page');
    }

    self.formatBtnIcon = function (short_name) {
      short_name = short_name.toLowerCase()
      short_name = short_name.replaceAll(' ', '-')
      short_name = short_name.replaceAll('.', '')
      return 'btn-' + short_name
    }

    self.back = function () {
      if (self.page() > 1) {
        self.loadProviders(self.page() - 1)
      } else {
        rootVM.navigate('home-page')
      }
    }

    self.loadProviders(self.page())
  };

});
