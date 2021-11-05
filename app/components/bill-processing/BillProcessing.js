define([
  'knockout',
  'rootVM',
  'text!app/components/bill-processing/bill-processing.html',
  'socket',
  'sounds',
  'http',
  'toast',
  'app/observables/bills-payment',
], function(ko, rootVM, tpl, socket, sounds, http, toast, bill) {
  function VM(params) {
    var loader_icon = '<img src="/uploads/img/preloader.gif" style="width: 30px;margin: 20px 21px 31px;"/>';
    var self = this;
    self.account_number = bill.account_number
    self.biller_name = bill.biller_name
    self.account_name = bill.account_name
    self.biller_id = bill.biller_id
    self.amount = bill.bill_amount
    self.phone_number = bill.phone_number
    self.due_date = bill.due_date
    self.trace_number = bill.trace_number
    self.transaction_fee = bill.transaction_fee
    self.account_number_label = bill.account_number_label
    self.account_name_label = bill.account_name_label
    self.amount_label = bill.amount_label
    self.amount_formatted = ko.observable('P'+parseFloat(bill.bill_amount()).toFixed(2))
    self.txn_fee_formatted = ko.observable('P'+parseFloat(bill.transaction_fee()).toFixed(2))
    self.price_formatted = ko.observable('P'+parseFloat(bill.price()).toFixed(2))

    self.title = ko.observable('Processing Transaction');
    self.message = ko.observable('Please wait ...' + loader_icon);
    self.allow_retry = ko.observable(false);
    self.status = ko.observable('');
    self.balance = ko.observable(0);

    self.balance_formatted = ko.computed(function() {
      return 'P' + parseFloat(self.balance()).toFixed(2)
    })

    http.processBill({
      account_number: bill.account_number(),
      account_name: bill.account_name(),
      biller_id: bill.biller_id(),
      amount: bill.bill_amount(),
      phone_number: bill.phone_number(),
      due_date: bill.due_date(),
      transaction_id: bill.transaction_id()
    }, function(err, data) {
      if(!err){
        bill.trace_number(data.trace_number)
        self.trace_number(data.trace_number)
      } else {
        var resp = JSON.parse(err.responseText)
        var error = resp.error || 'Something went wrong'
        toast.error(error + '. Please try again later.')
        self.retry()
        sounds.error.play()
      }
    })

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
      self.balance(data.balance);
      self.status(data.status);
      self.title(data.title);
      self.message(message);
      self.trace_number(data.trace_number)
      bill.trace_number(data.trace_number)
    };

    self.koDescendantsComplete = function () {}

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
