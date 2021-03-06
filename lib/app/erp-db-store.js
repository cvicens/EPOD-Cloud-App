var $fh = require('fh-mbaas-api');
var _ = require('underscore');

function makeid(n)
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < n; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function create (collection, object, callback) {
  console.log('db-store: create', collection, JSON.stringify(object));
  if (typeof object === 'undefined') {
    console.log('db-store: create ERROR', 'wrong data object cannot be empty and object.id.length > 0');
  }

  if (typeof object.id === 'undefined' || object.id == '') {
    object.id = makeid(9);
  }

  // Create
  var options = {
    "act": "create",
    "type": collection,
    "fields": object
  };

  $fh.db(options, function (err, data) {
    callback (err, data);
  });
}

function read (collection, idValue, callback) {
  $fh.db({
    act: "list",
    type: collection,
    "eq": {
      "id": idValue
    }
  }, function(err, data){
    if (err) {
      callback(err, null);
    } else {
      var items = _.map(data.list, function(itemEntry){
        console.log("itemEntry: " + JSON.stringify(itemEntry));
        return itemEntry.fields;
      });

      callback(null, (items == null || items.size <= 0) ? {} : items[0]);
    }
  });
}

function update (collection, object, callback) {
  console.log('db-store: update', collection, JSON.stringify(object));
  if (!object) {
    callback('No object provided', null);
    return;
  }

  var _id = '-1'
  if (object.id) {
    _id = object.id;
  }

  setTimeout(function () {
    var options = {
       "act": "list",
       "type": collection,
       "eq": {
         "id": _id
       }
     };
     $fh.db(options, function(err, data){
       if (err){
         console.log("db-store: update (list) ERROR ", err);
         callback(err, null);
       } else {
         console.log('db-store: update data.count', data.count);
         if (data.count <= 0) {
           // Create
           create(collection, object, callback);
         } else {
           // Update
           var _item = data.list[0];
           var guid = _item.guid;
           options = {
             "act": "update",
             "type": collection,
             "guid": guid,
             "fields": object
           };
           $fh.db(options, function (_err, _data) {
             callback (_err, _data);
           });
         }
       }
     });
  }, 0);
}

function updateByGuid (collection, fields, guid, callback) {
  //console.log('db-store: update', collection, JSON.stringify(object));
  if (typeof fields === 'undefined' || typeof guid === 'undefined') {
    callback('No object provided or not including GUID', null);
    return;
  }

  setTimeout(function () {
    options = {
      "act": "update",
      "type": collection,
      "guid": guid,
      "fields": fields
    };
    $fh.db(options, function (err, data) {
      callback (err, data);
    });
  }, 0);
}

function remove (collection, object) {
  console.log('db-store: remove', collection, JSON.stringify(object));
}

function list (collection, filter, callback) {
  console.log('db-store: list', collection, JSON.stringify(filter));
  var _filter = {
    act: "list",
    type: collection
  };
  if (filter) {
    if (filter.eq) { _filter.eq = filter.eq; }
    if (filter.ne) { _filter.ne = filter.ne; }
    if (filter.lt) { _filter.lt = filter.lt; }
    if (filter.le) { _filter.le = filter.le; }
    if (filter.gt) { _filter.gt = filter.gt; }
    if (filter.ge) { _filter.ge = filter.ge; }
    if (filter.in) { _filter.in = filter.in; }
    if (filter.like) { _filter.like = filter.like; }
    if (filter.sort) { _filter.sort = filter.sort; }
  }

  $fh.db(_filter, function(err, data){
    if (err) {
      callback(err, null);
    } else {
      var items = _.map(data.list, function(itemEntry){
        //console.log("itemEntry: " + JSON.stringify(itemEntry));
        var object = {
          fields: itemEntry.fields,
          guid: itemEntry.guid
        };

        return object;
      });

      callback(null, items);
    }
  });
}

module.exports.create = create;
module.exports.read = read;
module.exports.update = update;
module.exports.updateByGuid = updateByGuid;
module.exports.remove = remove;
module.exports.list = list;
