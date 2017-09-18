var $fh = require('fh-mbaas-api');
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');

var db = require('./erp-db-store');

var QUESTIONNAIRE_SERVICE_GUID = process.env.QUESTIONNAIRE_SERVICE_GUID;
var QUESTIONNAIRE_COLLECTION_NAME = process.env.QUESTIONNAIRE_COLLECTION_NAME || "questionnaire";
var MOCKED_UP = process.env.MOCKED_UP || "true";

function _searchQuestionsMockedUp (filter) {
  return new Promise(function(resolve, reject) {
    db.list(QUESTIONNAIRE_COLLECTION_NAME, filter, function (err, data) {
      if (err) {
        reject({result:'ERROR', msg: err});
      } else {
        resolve(data.map(function (element) {
          return element.fields;
        }));
      }
    });
  });
}

function _searchQuestions(filter) {
  return new Promise(function(resolve, reject) {
    var path = '/questionnaire';
    console.log('path: ' + path);

    $fh.service({
      "guid" : QUESTIONNAIRE_SERVICE_GUID, // The 24 character unique id of the service
      "path": path, //the path part of the url excluding the hostname - this will be added automatically
      "method": "POST",   //all other HTTP methods are supported as well. e.g. HEAD, DELETE, OPTIONS
      "timeout": 25000, // timeout value specified in milliseconds. Default: 60000 (60s)
      "params": filter,
      //"headers" : {
        // Custom headers to add to the request. These will be appended to the default headers.
      //}
    }, function(err, body, response) {
      console.log('statuscode: ', response && response.statusCode);
      if (err) {
        // An error occurred during the call to the service. log some debugging information
        console.log(path + ' service call failed - err : ', err);
        reject({result:'ERROR', msg: err});
      } else {
        resolve(body);
      }
    });
  });
}

function searchQuestions(filter) {
  console.log('MOCKED_UP', MOCKED_UP);
  if (MOCKED_UP === 'true') {
    console.log('_searchEmployeesMockedUp');
    return _searchQuestionsMockedUp(filter);
  } else {
    console.log('_searchEmployees');
    return _searchQuestions(filter);
  }
}

function route() {
  var router = new express.Router();
  router.use(cors());
  router.use(bodyParser.json());
  router.use(bodyParser.urlencoded({ extended: true }));

  router.get('/:type', function(req, res) {
    console.log('questionnaire type', req.params);
    var type = req.params.type;
    console.log('type ' + type);
    if (typeof type === 'undefined' || type === '') {
      res.status(404).json([]);
      return;
    }

    var filter = {
      eq: {
        type: type
      },
      sort: {
        order: 1 // Sort by the 'username' field ascending a-z
      }
    };

    searchQuestions(filter).
    then(function (data) {
      res.status(200).json(data);
    })
    .catch(function (err) {
      res.status(500).json({result:'ERROR', msg: err})
    });


  });

  router.post('/', function(req, res) {
    var filter = req.body;
    console.log('filter: ' + filter);
    if (typeof filter === 'undefined') {
      res.status(404).json([]);
      return;
    }

    searchQuestions(filter).
    then(function (data) {
      res.status(200).json(data);
    })
    .catch(function (err) {
      res.status(500).json({result:'ERROR', msg: err})
    });
  });

  return router;
}

module.exports = route;
