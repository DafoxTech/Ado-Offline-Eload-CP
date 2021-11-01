define([
  'knockout',
  'rootVM',
  'text!app/components/eload-processing/eload-processing.html',
  'app/observables/eload-order',
  'socket',
  'sounds',
  'http'
], function(ko, rootVM, tpl, order, socket, sounds, http) {
  function VM(params) {
    var loader_icon = '<img src="/uploads/img/preloader.gif" style="width: 30px;margin: 20px 21px 31px;"/>';
    var self = this;
    self.phone_number = ko.observable(order.phone_number());
    self.title = ko.observable('Processing Transaction');
    self.message = ko.observable('Please wait ...' + loader_icon);
    self.allow_retry = ko.observable(false);
    self.status = ko.observable('');

    http.purchaseLoad(self.phone_number(), order.provider_id(), order.product_keyword(), function(err, data) {})

    self.close = function() {
      params.close();
      rootVM.navigate('home-page');
    };

    self.retry = function() {
      params.close();
      rootVM.navigate('eload-products-page');
    }

    setTimeout(function() {
      if(!self.status() || self.status() === 'queued') {
        self.allow_retry(true);
        sounds.eload_queued.play();
      }
    }, 120000);

    self.onEloadStatus = function(data) {
      var message = data.message;
      if(data.status === 'failed') {
        sounds.eload_failed.play();
        self.allow_retry(false);
      }else if(data.status === 'succeed') {
        sounds.eload_successful.play();
        self.allow_retry(false);
      }else if(data.status === 'queued') {
        message += loader_icon;
      }
        
      self.status(data.status);
      self.title(data.title);
      self.message(message);
      self.phone_number(data.phone_number);
    };

    socket().on('eload:status', self.onEloadStatus);

    self.dispose = function () {
      socket().removeListener('eload:status', self.onEloadStatus);
    };
  }

  ko.components.register('eload-processing', {
    viewModel: VM,
    template: tpl
  });

});
