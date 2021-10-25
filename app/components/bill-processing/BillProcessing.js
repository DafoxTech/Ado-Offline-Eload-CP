define([
  'knockout',
  'rootVM',
  'text!app/components/bill-processing/bill-processing.html',
  'socket',
  'sounds'
], function(ko, rootVM, tpl, socket, sounds) {
  function VM(params) {
    var loader_icon = '<img src="/uploads/img/preloader.gif" style="width: 30px;margin: 20px 21px 31px;"/>';
    var self = this;
    self.account_number = ko.observable(params.account_number);
    self.title = ko.observable('Processing Transaction');
    self.message = ko.observable('Please wait ...' + loader_icon);
    self.allow_retry = ko.observable(false);
    self.status = ko.observable('');

    self.close = function() {
      params.close();
      rootVM.navigate('home-page');
    };

    self.retry = function() {
      params.close();
      rootVM.navigate('bill-paying-page');
    }

    setTimeout(function() {
      if(!self.status() || self.status() === 'queued') {
        self.allow_retry(true);
        sounds.eload_queued.play();
      }
    }, 120000);

    sounds.eload_processing.play();
    self.onBillStatus = function(data) {
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
      self.account_number(data.account_number);
    };

    socket().on('bill:status', self.onBillStatus);

    self.dispose = function () {
      socket().removeListener('bill:status', self.onBillStatus);
    };
  }

  ko.components.register('bill-processing', {
    viewModel: VM,
    template: tpl
  });

});
