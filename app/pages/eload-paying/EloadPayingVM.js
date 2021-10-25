define([
  'knockout',
  'rootVM',
  'toast',
  'http',
  'modal',
  'app/observables/eload-order',
  'app/components/eload-processing/EloadProcessing'
], function (ko, rootVM, toast, http, modal, order) {

  return function () {
    var self = this;
    self.phone_number = order.phone_number;
    self.product_keyword = order.product_keyword;
    self.product_keyword_formatted = order.product_keyword;
    self.product_description = order.product_description;
    self.provider_name = order.provider_name;
    self.product_price = order.product_price
    self.account_credits = order.account_credits
    self.is_reprocess = order.is_reprocess;
    var k = self.product_keyword()
    if (parseInt(k) > 0) {
      self.product_keyword_formatted('P'+k)
    }
    var price = parseInt(self.product_price())
    var credits = parseInt(self.account_credits())
    self.to_pay = ko.observable(Math.max(0, price - credits))
    self.price_formatted = ko.observable('P' + price + '.00')
    self.account_credits_formatted = ko.observable('P' + credits + '.00')
    self.to_pay_formatted = ko.observable('P' + self.to_pay() + '.00')

    self.submit = function () {
      modal.show('eload-processing', {phone_number: self.phone_number(), product_keyword: self.product_keyword()});
    }
  };

});
