define([
  'knockout',
  'toast',
  'http'
], function(ko, toast, http) {
  var o = {
    phone_number: ko.observable(''),
    provider_name: ko.observable(''),
    provider_short_name: ko.observable(''),
    provider_id: ko.observable(''),
    product_keyword: ko.observable(''),
    product_description: ko.observable(''),
    product_price: ko.observable(0),
    account_credits: ko.observable(0),
    is_reprocess: ko.observable(false),
    setPhoneNumber: function(phone) {
      o.phone_number(phone)
    },
    setProvider: function(provider) {
      o.provider_name(provider.name)
      o.provider_short_name(provider.short_name)
      o.provider_id(provider.id)
    },
    setProduct: function(prod) {
      if (typeof prod == 'object') {
        o.product_keyword(prod.keyword)
        o.product_description(prod.description)
      } else {
        o.product_keyword(prod)
      }
    },
    set: function(order) {
      o.provider_name(order.provider_name)
      o.provider_short_name(order.provider_short_name)
      o.provider_id(order.provider_id)
    },
    reset: function() {
      o.phone_number('')
      o.provider_name('')
      o.provider_short_name('')
      o.provider_id('')
      o.product_keyword('')
      o.product_description('')
      o.product_price('')
      o.account_credits('')
    }
  };
  return o;
});
