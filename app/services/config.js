define([
  'json!../../config.json',
  'json!../../config.defaults.json'
],
function (config, defaults) {

  function Config () {
    this.favicon = function () {
      return this.findField('page_properties', 'favicon');
    };
    this.pageTitle = function () {
      return this.findField('page_properties', 'page_title');
    };
    this.footerHtml = function () {
      return this.findField('html', 'footer');
    };
    this.styles = function () {
      return this.findField('css', 'css_files');
    };
    this.findField = function (g_id, f_id) {
      if (config[g_id] && config[g_id][f_id]) return config[g_id][f_id];
      if (defaults[g_id] && defaults[g_id][f_id]) return defaults[g_id][f_id];
    };
  }

  return new Config();

});
