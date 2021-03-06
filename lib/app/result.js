'use strict';

//var ArrayStore = require('fh-wfm-mediator/lib/array-store')
var ArrayStore = require('./custom-array-store')

var results = [];

module.exports = function(mediator) {
  var arrayStore = new ArrayStore('result', results);
  arrayStore.listen('cloud:', mediator);
  return arrayStore;
}
