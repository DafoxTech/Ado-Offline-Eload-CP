define([
  'app/utils/ajax',
  'toast',
  'sounds',
  'app/utils/array.map'
], function (ajax, toast, sounds, map) {

  function Http () {
    function buildParams(opts){
      return map(Object.keys(opts), function (k) {
        return encodeURIComponent(k) + '=' + encodeURIComponent(opts[k]);
      }).join('&');
    }

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
      var callback = cb;
      if (typeof data === 'function') {
        callback = data;
        data = {};
      }
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
      sounds.error.play();
      toast.error(message);
    };
    http.fetchSessions = function (cb) {
      http.get('/client/sessions', cb);
    };
    http.queForPayment = function (opts, cb) {
      var data = {
        coinslot_id: opts.coinslot_id,
        type: opts.type,
        is_voucher: opts.is_voucher,
        provider_id: opts.provider_id,
        account_number: opts.account_number,
        product_keyword: opts.product_keyword
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
      http.post('/vouchers/activate', {code: code}, cb);
    };
    http.getVouchers = function(cb) {
      http.get('/vouchers/list', cb);
    };

    http.getCurrentUser = function(cb) {
      http.get('/user/me', cb);
    };

    // Eload
    http.getEloadClientData = function(acc_number, cb) {
      http.get('/client/eload/customer-data?account_number=' + acc_number, cb);
    };

    http.getEloadProviders = function(opts, cb) {
      http.get('/client/eload/providers?' + buildParams(opts), cb);
    };

    http.getEloadPromos = function(opts, cb) {
      http.get('/client/eload/promos?' + buildParams(opts), cb);
    };

    http.getRegularDenoms = function(provider_id, cb) {
      http.get('/client/eload/regular-denoms?provider_id=' + provider_id, cb);
    };

    http.newEloadOrder = function(order, cb) {
      http.post('/client/eload/que-order', {
        phone_number: order.phone_number,
        product_keyword: order.product_keyword,
        provider_id: order.provider_id
      }, cb)
    }

    http.activateEloadVoucher = function(account_number, code, cb) {
      http.post('/client/eload/activate-voucher', {
        account_number: account_number,
        code: code
      }, cb);
    };

    http.checkEloadProvider = function(id, product_keyword, cb) {
      http.post('/client/eload/check-provider', { id: id, product_keyword: product_keyword }, cb);
    };

    http.getRelatedTxn = function(account_number, product_keyword, cb) {
      http.get('/client/eload/related-txn?account_number=' + account_number + '&product_keyword=' + product_keyword, cb);
    };

    http.customerPurchase = function(opts, cb) {
      http.post('/customer/purchase', opts, cb);
    };

    http.purchaseLoad = function(account_number, provider_id, product_keyword, voucher_id, cb) {
      http.post('/client/eload/purchase', {
        account_number: account_number,
        provider_id: provider_id,
        product_keyword: product_keyword,
        voucher_id: voucher_id
      }, cb);
    };

    http.systemNotifications = function (cb) {
      http.get('/client/system/notifications', cb);
    };

    // /eload


    // Ewallet
    http.getEwalletProviders = function(opts, cb) {
      http.get('/client/ewallet/providers?' + buildParams(opts), cb);
    };

    http.getEwalletPromos = function(opts, cb) {
      http.get('/client/ewallet/promos?' + buildParams(opts), cb);
    };

    http.newEwalletOrder = function(order, cb) {
      http.post('/client/ewallet/que-order', {
        phone_number: order.phone_number,
        product_keyword: order.product_keyword,
        provider_id: order.provider_id
      }, cb)
    }
    // /ewallet

    http.logoutCustomer = function() {
      http.post('/customer/logout');
    };
  }

  return new Http();
});
