var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var q = require('q');
var rndstr = require('./random-string');

function route(mediator, workorderStore, resultStore) {
  var router = new express.Router();
  router.use(cors());
  router.use(bodyParser.urlencoded());
  router.use(bodyParser.json());

  // GET REST endpoint - query params may or may not be populated
  router.get('/:workerid', function(req, res) {
    console.log('workorder GET headers : ' + JSON.stringify(req.headers));
    var workerid = req.params.workerid;
    if (typeof workerid === 'undefined' || workerid === '') {
      res.status(400).json([]);
    }

    var filter = {key: "assignee", value: workerid};
    workorderStore.list(filter)
    .then(function (workorders) {
      var deferred = q.defer();

      // Generate a list promise for each workorder to get its result
      // (workorder:result) is a 1:1 relationship
      var resultPromises = [];
      for (var i = 0; i < workorders.length; i++) {
        //console.log('workorders[i]', JSON.stringify(workorders[i]));
        resultPromises.push(resultStore.list({key: "workorderId", value: workorders[i].id}));
      }
      q.all(resultPromises)
      .then(function (results) {
        //console.log('resultPromises ', JSON.stringify(results));
        for (var i = 0; i < results.length; i++) {
          var result = results[i];
          if (result.length > 0) {
            workorders[i].status = result[0].status;
            workorders[i].stepResults = result[0].stepResults;
          } else {
            console.log('No results for workorderId: ', workorders[i].id);
          }
        }

        var result = {};
        result.status = 'SUCCESS';
        result.workerid = workerid;
        result.workorders = workorders;

        deferred.resolve(result);
      })
      .catch(function (err) {
        deferred.reject(err);
      });

      return deferred.promise;
    })
    .then(function (result){
      res.json(result);
    })
    .catch(function (err) {
      var error = {
        "message": err,
        "code": 500
      };
      res.status(500).json(error);
    });
  });

  // GET REST endpoint - query params may or may not be populated
  router.get('/', function(req, res) {
    console.log('workorder GET headers : ' + JSON.stringify(req.headers));

    workorderStore.list()
    .then(function (workorders) {
      var deferred = q.defer();

      // Generate a list promise for each workorder to get its result
      // (workorder:result) is a 1:1 relationship
      var resultPromises = [];
      for (var i = 0; i < workorders.length; i++) {
        //console.log('workorders[i]', JSON.stringify(workorders[i]));
        resultPromises.push(resultStore.list({key: "workorderId", value: workorders[i].id}));
      }
      q.all(resultPromises)
      .then(function (results) {
        //console.log('resultPromises ', JSON.stringify(results));
        for (var i = 0; i < results.length; i++) {
          var result = results[i];
          if (result.length > 0) {
            workorders[i].status = result[0].status;
            workorders[i].stepResults = result[0].stepResults;
          } else {
            console.log('No results for workorderId: ', workorders[i].id);
          }
        }

        var result = {};
        result.status = 'SUCCESS';
        result.workerid = workerid;
        result.workorders = workorders;

        deferred.resolve(result);
      })
      .catch(function (err) {
        deferred.reject(err);
      });

      return deferred.promise;
    })
    .then(function (result){
      res.json(result);
    })
    .catch(function (err) {
      var error = {
        "message": err,
        "code": 500
      };
      res.status(500).json(error);
    });
  });

  router.get('/unassigned/:truckid', function(req, res) {
    console.log('workorder GET headers : ' + JSON.stringify(req.headers));
    var truckid = req.params.truckid;
    if (typeof truckid === 'undefined' || truckid === '') {
      res.status(400).json([]);
    }

    var filter = {key: "truckId", value: truckid};
    workorderStore.listUnassigned(filter)
    .then(function (workorders) {
      var deferred = q.defer();

      console.log('workorders', JSON.stringify(workorders));

      // Generate a list promise for each workorder to get its result
      // (workorder:result) is a 1:1 relationship
      var resultPromises = [];
      for (var i = 0; i < workorders.length; i++) {
        console.log('workorders[i]', JSON.stringify(workorders[i]));
        resultPromises.push(resultStore.list({key: "workorderId", value: workorders[i].id}));
      }
      if (resultPromises.length > 0) {
        q.all(resultPromises)
        .then(function (results) {
          //console.log('resultPromises ', JSON.stringify(results));
          for (var i = 0; i < results.length; i++) {
            var result = results[i];
            if (result.length > 0) {
              workorders[i].status = result[0].status;
              workorders[i].stepResults = result[0].stepResults;
            } else {
              console.log('No results for workorderId: ', workorders[i].id);
            }
          }

          var result = {};
          result.status = 'SUCCESS';
          result.workerid = 'unassigned';
          result.truckid = truckid;
          result.workorders = workorders;

          deferred.resolve(result);
        })
        .catch(function (err) {
          deferred.reject(err);
        });
      } else {
        deferred.resolve([]);
      }

      return deferred.promise;
    })
    .then(function (result){
      res.json(result);
    })
    .catch(function (err) {
      var error = {
        "message": err,
        "code": 500
      };
      res.status(500).json(error);
    });
  });

  // POST REST endpoint - note we use 'body-parser' middleware above to parse the request body in this route.
  // This can also be added in application.js
  // See: https://github.com/senchalabs/connect#middleware for a list of Express 4 middleware
  router.post('/', function(req, res) {
    console.log('workorder POST headers : ' + JSON.stringify(req.headers));
    console.log(new Date(), 'In workorders route POST / req.body=', req.body);

    if (req.body && req.body.workflowId && req.body.type && req.body.title &&
        req.body.status && req.body.startTimestamp && req.body.address && req.body.location && req.body.summary) {
          var object = req.body;
          if (!object.id) {
            object.id = rndstr.randomAsciiString(9);
          }

          // Publish the message to create an object through the mediator
          mediator.publish('wfm:cloud:workorders:create', object);

          res.json({ id: object.id, msg: 'object pushed'});
    } else {
        res.status(400).json({msg: 'bad parameters'});
    }
  });

  return router;
}

module.exports = route;
