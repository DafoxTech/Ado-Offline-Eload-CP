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
    self.phone_number = order.phone_number
    self.title = ko.observable('Processing Transaction');
    self.message = ko.observable('Please wait ...' + loader_icon);
    self.allow_retry = ko.observable(false);
    self.status = ko.observable('');
    self.trace_number = ko.observable('')

    http.purchaseLoad({
      phone_number: self.phone_number(),
      provider_id: order.provider_id(),
      product_keyword: order.product_keyword(),
      transaction_id: order.transaction_id()
    }, function(err, data) {
      if(err) console.log(err)
    })

    self.close = function() {
      params.close()
      rootVM.navigate('home-page')
      self.cancelPaymentQue()
    };

    self.retry = function() {
      params.close();
      rootVM.navigate('eload-products-page')
      self.cancelPaymentQue()
    }

    setTimeout(function() {
      if(!self.status() || self.status() === 'queued') {
        self.allow_retry(true);
        sounds.eload_queued.play();
      }
    }, 120000);

    self.onEloadStatus = function(data) {
      var message = data.message
      if(data.status === 'failed') {
        sounds.eload_failed.play()
        self.allow_retry(false)
      }else if(data.status === 'succeed') {
        sounds.eload_successful.play()
        self.allow_retry(false)
      }else if(data.status === 'queued') {
        message += loader_icon
      }
      self.trace_number(data.trace_number)
      self.status(data.status);
      self.title(data.title);
      self.message(message);
      self.phone_number(data.phone_number);
    };

    socket().on('eload:status', self.onEloadStatus);

    self.dispose = function () {
      socket().removeListener('eload:status', self.onEloadStatus);
      self.cancelPaymentQue()
    };

    self.cancelPaymentQue = function() {
      http.donePayment(null, function(err){})
    }
  }

  ko.components.register('eload-processing', {
    viewModel: VM,
    template: tpl
  });

});
