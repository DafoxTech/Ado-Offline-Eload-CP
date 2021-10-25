define([
  'knockout',
  'rootVM',
  'text!app/components/kiosk-order-processing/kiosk-order-processing.html',
  'socket',
  'sounds'
], function(ko, rootVM, tpl, socket, sounds) {
  function VM(params) {
    var loader_icon = '<img src="/uploads/img/preloader.gif" style="width: 30px;margin: 20px 21px 31px;"/>';
    var self = this;
    self.account_number = ko.observable(params.account_number);
    self.title = ko.observable('Processing Order');
    self.message = ko.observable('Please wait ...' + loader_icon);
    self.allow_retry = ko.observable(false);
    self.status = ko.observable('');

    self.close = function() {
      params.close();
      rootVM.navigate('home-page');
    };

  }

  ko.components.register('kiosk-order-processing', {
    viewModel: VM,
    template: tpl
  });

});
