define([
  'knockout',
  'rootVM',
  'app/observables/eload-order'
],
function (ko, rootVM, order) {
  function HomePageVM() {
    order.reset()
    this.koDescendantsComplete = function() {
      rootVM.showingBanners(true);
    };
  }
  return HomePageVM;
});
