define(['app/services/config'], function (config) {
  var redirect_url = config.findField('page_properties', 'redirect_to');
  var timeout;

  function cancel() {
    if(timeout) clearTimeout(timeout);
    timeout = null;
  }

  return {
    redirect: function () {
      timeout = setTimeout(function () {
        if (redirect_url) {

          var prefix = 'http';
          if (redirect_url.substr(0, prefix.length) !== prefix) {
            redirect_url = prefix + '://' + redirect_url;
          }

          location.href = redirect_url;
          timeout = null;
          var body = document.getElementById('body');
          body.innerHTML = '<h3 class="text-center">Please wait. <br/> Redirecting to ' + redirect_url + '</h3>';
        } else {
          window.location.reload();
        }
      }, 3000);
    },
    cancel: cancel
  };
});
