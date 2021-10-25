define([
  'knockout',
  'toast',
  'http',
  'app/utils/array.findIndex'
], function(ko, toast, http, findIndex) {
  var o = {
    items: ko.observableArray([]),
    add: function(item) {
      var i = findIndex(o.items, function(i){
        i.id == item.id
      })
      if (i >= 0) {
        o.items[i].quantity += 1
      } else {
        o.items.push({
          id: item.id,
          quantity: 1
        })
      }
    },
    reset: function() {
      o.items([])
    }
  };
  return o;
});
