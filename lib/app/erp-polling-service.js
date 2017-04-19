'use strict'

var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var q = require('q');

var $fh = require('fh-mbaas-api');

var mapper = require('./delivery-ticket-mapper');
var db = require('./erp-db-store');

var ERP_WORKORDERS_COLLECTION_NAME = "e1-workorders-mockup";



function getUserByVehicle (authServiceGuid, vehicle) {
  var deferred = q.defer();

  var path = '/user/' + vehicle;

  /**
   * Finding a list of accounts located in mongo database
   */
  $fh.service({
    "guid" : authServiceGuid, // The 24 character unique id of the service
    "path": path, //the path part of the url excluding the hostname - this will be added automatically
    "method": "GET",   //all other HTTP methods are supported as well. e.g. HEAD, DELETE, OPTIONS
    "timeout": 25000 // timeout value specified in milliseconds. Default: 60000 (60s)
    //"headers" : {
      // Custom headers to add to the request. These will be appended to the default headers.
    //}
  }, function(err, body, response) {
    console.log('statuscode: ', response && response.statusCode);
    if (err) {
      // An error occurred during the call to the service. log some debugging information
      console.log('user/' + vehicle + ' service call failed - err : ', err);
      deferred.reject(err)
    } else {
      console.log('user/' + vehicle + ' got response from service - status body : ', response.statusCode, body);
      deferred.resolve(body)
    }
  });

  return deferred.promise // the promise is returned
}

function route(mediator, authServiceGuid) {
  var intervalController = {
    interval: null,
    setInterval: function (delay) {
      delay = typeof delay !== 'undefined' ? delay : 10000;

      if (this.interval) {
        return;
      }

      this.interval = setInterval(function() {
        // Look for those tickets not already pushed to the workorders synced store
        var filter = {
          "ne": {
            "pushed": true
          }
        };
        console.log('filter', filter);
        db.list(ERP_WORKORDERS_COLLECTION_NAME, filter, function (err, data) {
          if (err) {
            console.error('ERROR while reading tickets @ erp-polling-service interval function', err);
          } else {
            //console.log('data', data);
            for (var i = 0; i < data.length; i++) {
              console.log('data[i]', data[i]);
              var vehicle = data[i].fields.vehicleReg;
              var ticket = data[i].fields;
              var guid = data[i].guid;
              // Find the driver for the vehicle associated to this Order
              getUserByVehicle(authServiceGuid, data[i].fields.vehicleReg)
              .then(function (result) {
                console.log('user found for vehicle', vehicle, 'user', result.user);
                // Create workorder from ticket
                //var workorder = mapTicketToWorkorder(ticket, result.user);
                var workorder = mapper.map(ticket, result.user);

                // Push workorder
                mediator.publish('wfm:cloud:workorders:create', workorder);

                // Flag ticket as pushed
                ticket.pushed = true;
                db.updateByGuid(ERP_WORKORDERS_COLLECTION_NAME, ticket, guid, function (_err, _data) {
                  if (_err) {
                    console.error('ERROR while flagging ticket as pushed @ erp-polling-service interval function', _err);
                  } else {
                    console.log('data after updating', _data);
                  }
                });
              })
              .catch(function (err) {
                console.error('ERROR while looking for user with vehicle ', err);
              });
            }
          }
        });

      }, delay);
    },
    clearInterval: function () {
      clearInterval(this.interval);
      this.interval = null;
    }
  };

  var router = new express.Router();
  router.use(cors());
  router.use(bodyParser());

  router.get('/', function(req, res) {
    var workorderId = req.query.workorderId;
    console.log('workorderId ' + workorderId);
    if (typeof workorderId === 'undefined' || workorderId === '') {
      res.status(404).json([]);
      return;
    }
    /**
     * Finding an workorder by workorderId
     */
    db.read(ERP_WORKORDERS_COLLECTION_NAME, workorderId, function (err, data) {
      if (err) {
        res.status(500).json({result:'ERROR', msg: err})
      } else {
        res.status(200).json(data);
      }
    });
  });

  router.get('/:ticketNumber', function(req, res) {
    var ticketNumber = req.params.ticketNumber;
    console.log('ticketNumber', ticketNumber);
    if (typeof ticketNumber === 'undefined' || ticketNumber === '') {
      res.status(400).json([]);
      return;
    }

    /**
     * Finding an workorder by ticketNumber, ...
     */
    var filter = {
      "like": {
        "ticketNumber": ticketNumber
      }
    };
    console.log('ticketNumber', ticketNumber, 'filter', filter);
    db.list(ERP_WORKORDERS_COLLECTION_NAME, filter, function (err, data) {
      if (err) {
        res.status(500).json({result:'ERROR', msg: err})
      } else {
        res.status(200).json(data);
      }
    });
  });

  intervalController.setInterval(5000);

  return router;
}

module.exports = route;
