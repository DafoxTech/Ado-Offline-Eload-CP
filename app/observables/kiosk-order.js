define([
  'knockout',
  'toast',
  'http',
  'app/utils/array.findIndex',
  'app/utils/array.reduce'
], function(ko, toast, http, findIndex, reduce) {
  var o = {
    items: ko.observableArray([]),
    add: function(item) {
      var items = o.items()
      if(items.length >= 6) return;
      var i = findIndex(items, function(i){
        return i.id == item.id
      })
      if (i >= 0) {
        items[i].quantity += 1
      } else {
        items.push({
          id: item.id,
          name: item.name,
          description: item.description,
          price: item.price,
          quantity: 1
        })
      }
      o.items(items)
    },
    count: function () {
      return reduce(o.items(), function(res, i){
        return res + i.quantity
      }, 0)
    },
    reset: function() {
      o.items([])
    }
  };
  return o;
});
