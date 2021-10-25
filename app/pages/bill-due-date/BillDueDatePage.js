define([
  'knockout'
], function (ko) {
  ko.components.register('bill-due-date-page', {
    viewModel: {require: 'app/pages/bill-due-date/BillDueDateVM.js'},
    template: {require: 'text!app/pages/bill-due-date/bill-due-date.html'}
  });
});
