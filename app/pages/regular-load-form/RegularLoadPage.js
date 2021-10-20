define([
  'knockout'
], function (ko) {
  ko.components.register('regular-load-page', {
    viewModel: {require: 'app/pages/regular-load-form/RegularLoadVM.js'},
    template: {require: 'text!app/pages/regular-load-form/regular-load-form.html'}
  });
});
