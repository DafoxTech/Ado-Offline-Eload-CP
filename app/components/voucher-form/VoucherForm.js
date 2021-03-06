define([
  'knockout',
  'toast',
  'rootVM',
  'http',
  'sessions',
  'app/observables/session'
], function (ko, toast, rootVM, http, sessions, Session) {
  ko.components.register('voucher-form', {
    viewModel: function(code) {
      var self = this;
      if (code) self.value = (typeof code === 'function') ? code : ko.observable(code);
      else self.value = ko.observable('');
      self.activate = function() {
        var code = self.value();
        http.activateVoucher(code, function(err, data) {
          if (err) return http.catchError(err);
          var s = new Session(data);
          sessions.get().push(s);
          toast.success('Voucher activated successfully!');
          self.value('');
          rootVM.navigate('home-page');
        });
      };
    },
    template: {require: 'text!app/components/voucher-form/voucher-form.html'}
  });
});
