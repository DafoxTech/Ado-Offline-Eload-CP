define([
  'knockout',
  'toast',
  'http'
], function(ko, toast, http) {
  var o = {
    phone_number: ko.observable(0),
    provider_name: ko.observable(''),
    provider_short_name: ko.observable(''),
    provider_id: ko.observable(''),
    product_keyword: ko.observable(''),
    setPhoneNumber: function(phone) {
      o.phone_number(phone)
    },
    setProvider: function(provider) {
      o.provider_name(provider.name)
      o.provider_short_name(provider.short_name)
      o.provider_id(provider.id)
    },
    setProduct: function(keyword) {
      o.product_keyword(keyword)
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
    }
  };
  return o;
});
