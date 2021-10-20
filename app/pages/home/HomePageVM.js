define([
  'knockout',
  'rootVM',
],
function (ko, rootVM) {
  function HomePageVM() {
    this.koDescendantsComplete = function() {
      rootVM.showingBanners(true);
    };
  }
  return HomePageVM;
});
