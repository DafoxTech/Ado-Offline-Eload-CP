define([
  'app/utils/ajax',
  'toast'
], function (ajax, toast) {

  function Http () {
    var http = this;
    http.get = function (url, cb) {
      try {
        ajax({
          url: url,
          success: function (data) {
            cb(null, data);
          },
          error: cb
        });
      } catch(e) { cb(e); }
    };
    http.post = function (url, data, cb) {
      var callback = typeof data === 'function' ? data : cb; 
      try {
        ajax({
          url: url,
          method: 'POST',
          data: data,
          success: function (data) {
            callback(null, data);
          },
          error: function(e) {
            callback(e);
          }
        });
      } catch(e) {
        callback(e);
      }
    };
    http.catchError = function(http) {
      var e = http.responseText ? JSON.parse(http.responseText) : {};
      var message = e.error || e.message || 'Something went wrong';
      toast.error(message);
    };
    http.fetchSessions = function (cb) {
      http.get('/client/sessions', cb);
    };
    http.startSession = function(s_id, cb) {
      http.post('/client/sessions/' + s_id + '/start', cb);
    };
    http.pauseSession = function (s_id, cb) {
      http.post('/client/sessions/' + s_id + '/pause', cb);
    };
    http.fetchRates = function (cb) {
      http.get('/settings/timer/rates', cb);
    };
    http.fetchCoinslots = function (cb) {
      http.get('/client/coinslots', cb);
    };
    http.queForPayment = function (opts, cb) {
      var data = {
        coinslot_id: opts.coinslot_id,
        type: opts.type,
        is_voucher: opts.is_voucher
      };
      http.post('/client/payments/que', data, cb);
    };
    http.getDevice = function (cb) {
      http.get('/client/device', cb);
    };
    http.currentPaymentQue = function (cb) {
      http.get('/client/payments/current', cb);
    };
    http.timerConfig = function (cb) {
      http.get('/settings/timer/config', cb);
    };
    http.donePayment = function (coinslot_id, cb) {
      http.post('/client/payments/done', {coinslot_id: coinslot_id}, cb);
    };
    http.activateVoucher = function(code, cb) {
      return http.post('/vouchers/activate', {code: code}, cb);
    };
  }
  return new Http();
});
