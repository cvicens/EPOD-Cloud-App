'use strict';

var _ = require('lodash');
var q = require('q');
var shortid = require('shortid');

var db = require('./db-store');

// Carlos V
var ArrayStore = function(datasetId, data) {
  console.log('CVA: ArrayStore(', datasetId, data, ')');

  this.data = data;
  this.topic = {};
  this.subscription = {};
  this.datasetId = datasetId;
}

ArrayStore.prototype.create = function(object, ts) {
  var self = this;
  var deferred = q.defer();
  setTimeout(function() {
    console.log('CVA: ArrayStore.create(', JSON.stringify(object), (self.datasetId ? self.datasetId : 'NO-DATASET-ID'), ')');
    //if (!(object.id && object.id.length == 9)) {
    if (typeof object.id === 'undefined') {
      object.id =  shortid.generate();
    }

    self.data.push(object);
    db.create(self.datasetId, object);
    console.log('Created object:', object);
    deferred.resolve(object);
  }, 0);
  return deferred.promise;
};

ArrayStore.prototype.read = function(id) {
  var self = this;
  var deferred = q.defer();
  setTimeout(function() {
    console.log('CVA: ArrayStore.read(', id, (self.datasetId ? self.datasetId : 'NO-DATASET-ID'), ')');
    console.log('CVA: ArrayStore read data ' + JSON.stringify(self.data));
    var object = _.find(self.data, function(_object) {
      return String(_object.id) === String(id);
    });
    deferred.resolve(object);
  }, 0);
  return deferred.promise;
};

ArrayStore.prototype.update = function(object) {
  var self = this;
  var deferred = q.defer();
  setTimeout(function() {
    console.log('CVA: ArrayStore.update(', JSON.stringify(object), (self.datasetId ? self.datasetId : 'NO-DATASET-ID'), ')');
    var index = _.findIndex(self.data, function(_object) {
      return String(_object.id) === String(object.id);
    });

    self.data[index] = object;
    db.update(self.datasetId, object);

    console.log('FINEST: data ' + self.data);

    deferred.resolve(object);
  }, 0);
  return deferred.promise;
};

ArrayStore.prototype.delete = function(object) {
  var self = this;
  var deferred = q.defer();
  var id = object instanceof Object ? object.id : object;
  setTimeout(function() {
    console.log('CVA: ArrayStore.delete(', JSON.stringify(object), (self.datasetId ? self.datasetId : 'NO-DATASET-ID'), ')');
    var removals = _.remove(self.data, function(_object) {
      return String(_object.id) === String(id);
    });
    var removed = removals.length ? removals[0] : null;
    //db.delete(self.datasetId, object);
    deferred.resolve(removed);
  }, 0);
  return deferred.promise;
};

ArrayStore.prototype.list = function(filter) {
  var self = this;
  var deferred = q.defer();
  setTimeout(function() {
    var filterResults;
    if (filter) {
      filterResults = self.data.filter(function(object) {
        if (typeof filter === 'undefined') {
          return true;
        }
        return String(object[filter.key]) === String(filter.value);
      });
    } else {
      filterResults = self.data;
    };
    deferred.resolve(filterResults);
  }, 0);
  return deferred.promise;
};

ArrayStore.prototype.listUnassigned = function(filter) {
  var self = this;
  var deferred = q.defer();
  setTimeout(function() {
    console.log('filter: ', JSON.stringify(filter));
    var filterResults;
    if (filter) {
      filterResults = self.data.filter(function(object) {
        console.log(String(object['assignee']), '===', 'unassigned', String(object['assignee']) === 'unassigned');
        console.log(String(object[filter.key]), '===', String(filter.value), String(object[filter.key]) === String(filter.value));

        return (String(object['assignee']) === 'unassigned' || String(object['assignee']) == null) &&
               String(object[filter.key]) === String(filter.value);
      });
    } else {
      filterResults = self.data;
    };
    console.log('before resolve', JSON.stringify(filterResults));
    deferred.resolve(filterResults);
  }, 0);
  return deferred.promise;
};

ArrayStore.prototype.listen = function(topicPrefix, mediator) {
  var self = this;
  self.mediator = mediator;

  self.topic.create = "wfm:" + topicPrefix + self.datasetId + ':create';
  console.log('Subscribing to mediator topic:', self.topic.create);
  self.subscription.create = mediator.subscribe(self.topic.create, function(object, ts) {
    self.create(object, ts).then(function(object) {
      mediator.publish('done:' + self.topic.create + ':' + ts, object);
    });
  });

  self.topic.load = "wfm:" + topicPrefix + self.datasetId + ':read';
  console.log('Subscribing to mediator topic:', self.topic.load);
  self.subscription.load = mediator.subscribe(self.topic.load, function(id) {
    self.read(id).then(function(object) {
      mediator.publish('done:' + self.topic.load + ':' + id, object);
    });
  });

  self.topic.save = "wfm:" + topicPrefix + self.datasetId + ':update';
  console.log('Subscribing to mediator topic:', self.topic.save);
  self.subscription.save = mediator.subscribe(self.topic.save, function(object) {
    self.update(object).then(function(object) {
      mediator.publish('done:' + self.topic.save + ':' + object.id, object);
    });
  });

  self.topic.delete = "wfm:" + topicPrefix + self.datasetId + ':delete';
  console.log('Subscribing to mediator topic:', self.topic.delete);
  self.subscription.delete = mediator.subscribe(self.topic.delete, function(object) {
    self.delete(object).then(function(object) {
      mediator.publish('done:' + self.topic.delete + ':' + object.id, object);
    });
  });

  self.topic.list = "wfm:" + topicPrefix + self.datasetId + ':list';
  console.log('Subscribing to mediator topic:', self.topic.list);
  self.subscription.list = mediator.subscribe(self.topic.list, function(queryParams) {
    var filter = queryParams && queryParams.filter || {};
    self.list(filter).then(function(list) {
      mediator.publish('done:' + self.topic.list, list);
    });
  });
}

ArrayStore.prototype.unsubscribe = function() {
  this.mediator.remove(this.topic.list, this.subscription.list.id);
  this.mediator.remove(this.topic.load, this.subscription.load.id);
  this.mediator.remove(this.topic.save, this.subscription.save.id);
  this.mediator.remove(this.topic.create, this.subscription.create.id);
  this.mediator.remove(this.topic.delete, this.subscription.delete.id);
}

module.exports = ArrayStore;
