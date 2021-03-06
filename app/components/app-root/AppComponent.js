define([
  'knockout',
  'rootVM',
  'socket',
  'modal',
  'app/services/config',
  'app/observables/payment',
  'app/components/toast/ToastComponent',
  'app/components/status-nav/StatusNavComponent',
  'app/components/banners/Banners',
  'app/components/sessions-table/SessionsTableComponent',
  'app/components/modal/Modal',
  'app/components/socket-disconnected-alert/SocketDisconnectedAlert',
  'app/components/footer/Footer'
], function (ko, rootVM, socket, modal, config, payment) {

  function AppVM() {
    this.favicon = ko.observable(config.favicon());
    this.pageTitle = ko.observable(config.pageTitle());
    this.styles = ko.observableArray(config.styles());

    this.buyEload = function () {
      this.navigate('buy-eload-page');
    };

    rootVM.page('home-page');

    this.showAlert = false;
    this.socket = socket();
    this.socket.on('connect', function () {
      if (this.showAlert) {
        modal.hide();
        this.showAlert = false;
      }
    });
    this.socket.on('disconnect', function () {
      if (!this.showAlert) {
        modal.show('socket-disconnected-alert');
        this.showAlert = true;
      }
    });
  }

  ko.components.register('app', {
    viewModel: AppVM,
    template: {require: 'text!app/components/app-root/app-root.html'}
  });

});
