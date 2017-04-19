'use strict';

//var ArrayStore = require('fh-wfm-mediator/lib/array-store')
var ArrayStore = require('./custom-array-store')

var workflows = [
  { id: "HJ8QkzOSH", title: 'Static forms', steps: [
    {code: 'risk-assessment', name: 'Risk Assessment', templates: {
      form: '<risk-assessment-form></risk-assessment-form>',
      view: '<risk-assessment value="result.submission"></risk-assessment>'
    }},
    {code: 'vehicle-inspection', name: 'Vehicle Inspection', templates: {
      form: '<vehicle-inspection-form></vehicle-inspection-form>',
      view: '<vehicle-inspection value="result.submission"></vehicle-inspection>'
    }}
  ]},

  { id: "cfsJB9BbF", title: 'Polarity Check', steps: [
    {code: 'risk-assessment', name: 'Risk Assessment', templates: {
      form: '<risk-assessment-form></risk-assessment-form>',
      view: '<risk-assessment value="result.submission"></risk-assessment>'
    }},
    {code: 'polarity-check', name: 'Polarity Check', templates: {
      form: '<polarity-check-form></polarity-check-form>',
      view: '<polarity-check value="result.submission"></polarity-check>'
    }}
  ]},

  { id: "i4Hfpab2R", title: 'EPOD', steps: [
    {code: 'vehicle-assessment', name: 'Vehicle Assessment', templates: {
      form: '<vehicle-assessment-form add-signature="false"></vehicle-assessment-form>',
      view: '<vehicle-assessment value="result.submission"></vehicle-assessment>'
    }},
    {code: 'epod-generic-arrival', name: 'EPOD Arrival', templates: {
      form: '<epod-generic-form action="ARRIVAL"></epod-generic-form>',
      view: '<epod-generic value="result.submission"></<epod-generic>'
    }},
    {code: 'epod-generic-start-discharge', name: 'EPOD Start Discharge', templates: {
      form: '<epod-generic-form action="START DISCHARGE"></epod-generic-form>',
      view: '<epod-generic value="result.submission"></<epod-generic>'
    }},
    {code: 'epod-generic-finish-discharge', name: 'EPOD Finish Discharge', templates: {
      form: '<epod-generic-form action="FINISH DISCHARGE"></epod-generic-form>',
      view: '<epod-generic value="result.submission"></<epod-generic>'
    }},
    {code: 'epod-generic-additions', name: 'EPOD Confirm Additions', templates: {
      form: '<epod-generic-form action="CONFIRM ADDITIONS"></epod-generic-form>',
      view: '<epod-generic value="result.submission"></<epod-generic>'
    }},
    {code: 'epod-generic-summary', name: 'EPOD SUMMARY', templates: {
      form: '<epod-generic-form action="SUMMARY"></epod-generic-form>',
      view: '<epod-generic value="result.submission"></<epod-generic>'
    }}
  ]},

  { id: "B1r71fOBr", title: 'App forms', steps: [
    {code: 'identification', name: 'Identification', formId: '57594ac244db89137a76b991'},
    {code: 'signoff', name: 'Signoff', formId: '5788f0ae53031bbe3225e0a8'}
  ]},

  { id: "SyVXyMuSr", title: 'Mixed forms', steps: [
    {code: 'signoff', name: 'Sign-off Workorder', formId: '57594ac244db89137a76b991'},
    {code: 'risk-assessment', name: 'Risk Assessment', templates: {
      form: '<risk-assessment-form></risk-assessment-form>',
      view: '<risk-assessment value="result.submission"></risk-assessment>'
    }},
    {code: 'vehicle-inspection', name: 'Vehicle Inspection', templates: {
      form: '<vehicle-inspection-form></vehicle-inspection-form>',
      view: '<vehicle-inspection value="result.submission"></vehicle-inspection>'
    }}
  ]},
];

var steps = [

];

module.exports = function(mediator) {
  var arrayStore = new ArrayStore('workflows', workflows);
  arrayStore.listen('cloud:', mediator);
}
