'use strict';

var mbaasApi = require('fh-mbaas-api')
  , express = require('express')
  , app = express()
  , mbaasExpress = mbaasApi.mbaasExpress()
  , config = require('./config')
  , cors = require('cors')
  , mediator = require('fh-wfm-mediator/lib/mediator')
  , bodyParser = require('body-parser')
  ;

require('fh-wfm-appform/lib/server')(mbaasApi);

var authServiceGuid = process.env.WFM_AUTH_GUID;
var securableEndpoints = [];

app.set('port', config.get('PORT'));
app.set('base url', config.get('IP'));

// Enable CORS for all requests
app.use(cors());

// Note: the order which we add middleware to Express here is important!
app.use('/sys', mbaasExpress.sys(securableEndpoints));
app.use('/mbaas', mbaasExpress.mbaas);

// Note: important that this is added just before your own Routes
app.use(mbaasExpress.fhmiddleware());

// fhlint-begin: custom-routes

// app specific router
var router = express.Router();

app.use('/sys/info/ping', function(req, res) {
  res.send('ok.');
});
app.use('/api', bodyParser.json({limit: '10mb'}));
app.use('/box', bodyParser.json());
app.use('/api', router);
app.post('/cloud/:datasetId', function(req, res, next) {
  res.send('ok');
});

// setup the wfm sync & routes
require('fh-wfm-file/lib/router')(mediator, app);
require('fh-wfm-message/lib/server')(mediator, app, mbaasApi);
require('fh-wfm-result/lib/server')(mediator, app, mbaasApi);
console.log('connecting to service -->', authServiceGuid);
require('fh-wfm-user/lib/router/cloud')(mediator, app, authServiceGuid);
require('fh-wfm-workflow/lib/server')(mediator, app, mbaasApi);
require('fh-wfm-workorder/lib/server')(mediator, app, mbaasApi);

// app modules
require('./app/message')(mediator)

// Carlos V
//require('./app/workorder')(mediator);
//require('./app/result')(mediator);
var workorderStore = require('./app/workorder')(mediator)
var resultStore = require('./app/result')(mediator);

require('./app/workflow')(mediator);
require('./app/group')(mediator);
require('./app/file')(mediator);

// fhlint-end

// Carlos V
app.use('/workorders', require('./app/workorders-service')(mediator, workorderStore, resultStore));
app.use('/erp', require('./app/erp-polling-service')(mediator, authServiceGuid));
//app.use('/erp', require('./app/borrar')(mediator));

// Use this only if running locally!
/*
app.use('/box/srv/1.1/app/init', function (req, res) {
  res.json(
    {
      "init": {
        "trackId": "5d5u4yx4jnmkrvnbgyzxai2q"
      },
      "status": "ok",
      "apptitle": "BNPPRE",
      "domain": "bnp",
      "firstTime": true,
      "hosts": {
        "type": "cloud_nodejs",
        "url": "localhost:8001",
        "environment": "dev"
      }
    }
  );
});*/

// Important that this is last!
app.use(mbaasExpress.errorHandler());

module.exports = exports = app;
