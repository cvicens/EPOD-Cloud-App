'use strict';

var ArrayStore = require('./custom-array-store')

var workorders = [
  /*{ id: "rkX1fdSH", workflowId: 'SyVXyMuSr', assignee: 'rkX1fdSH', type: 'Job Order', title: 'Footpath in disrepair', status: 'New', startTimestamp: '2015-10-22T14:00:00Z', address: '1795 Davie St, Vancouver, BC V6G 2M9', location: [49.287227, -123.141489], summary: 'Please remove damaged kerb and SUPPLY AND FIX 1X DROP KERB CENTRE BN 125 X 150 cart away from site outside number 3.'},
  { id: "rJeXyfdrH", workflowId: 'SyVXyMuSr', assignee: 'rkX1fdSH', type: 'Job Order', title: 'Chimney in disrepair', status: 'New', startTimestamp: '2015-10-22T20:00:00Z', address: '1641 Davie St, Vancouver, BC V6G 1W1', location: [49.285547, -123.138915], summary: 'Please remove damaged kerb and SUPPLY AND FIX 1X DROP KERB CENTRE BN 125 X 150 cart away from site outside number 3.'},
  { id: "ByzQyz_BS", workflowId: 'SyVXyMuSr', assignee: 'rkX1fdSH', type: 'Job Order', title: 'Wall in bad condition', status: 'New', startTimestamp: '2015-10-22T07:00:00Z', address: '1095 W Pender St, Vancouver, BC V6E', location: [49.287339, -123.120203], summary: 'Please remove damaged kerb and SUPPLY AND FIX 1X DROP KERB CENTRE BN 125 X 150 cart away from site outside number 3.'},
  { id: "ByzQyz_BS", workflowId: 'SyVXyMuSr', assignee: 'rkX1fdSH', type: 'Job Order', title: 'House in bad condition', status: 'New', startTimestamp: '2015-10-22T07:00:00Z', address: '1088 Burrard St, Vancouver, BC V6Z 2R9', location: [49.280396, -123.125868], summary: 'Please remove damaged kerb and SUPPLY AND FIX 1X DROP KERB CENTRE BN 125 X 150 cart away from site outside number 3.'},
  { id: "SyVXyMuSr", workflowId: 'B1r71fOBr', assignee: 'rkX1fdSH', type: 'Job Order', title: 'Road in bad condition', status: 'New', startTimestamp: '2015-10-22T07:00:00Z', address: '977 Mainland St #987, Vancouver, BC V6B 1T2', location: [49.277026, -123.118487], summary: 'Please remove damaged kerb and SUPPLY AND FIX 1X DROP KERB CENTRE BN 125 X 150 cart away from site outside number 3.'},
  { id: "B1r71fOBr", workflowId: 'SyVXyMuSr', assignee: 'rkX1fdSH', type: 'Job Order', title: 'Driveway in bad condition', status: 'New', startTimestamp: '2015-10-22T07:00:00Z', address: '157 st, 163 Keefer St, Vancouver, BC V6A 1X4', location: [49.279490, -123.099947], summary: 'Please remove damaged area.'},
  { id: "HJ8QkzOSH", workflowId: 'SyVXyMuSr', assignee: 'rkX1fdSH', type: 'Job Order', title: 'Door in disrepair', status: 'New', startTimestamp: '2015-10-22T07:00:00Z', address: '2795 East Hastings St, Vancouver, BC V5K 1Z8', location: [49.281159, -123.047076], summary: 'Please remove damaged kerb and SUPPLY AND FIX 1X DROP KERB CENTRE BN 125 X 150 cart away from site outside number 3.'},
  { id: "BJwQJfdrH", workflowId: 'HJ8QkzOSH', assignee: 'rkX1fdSH', type: 'Job Order', title: 'Roof in disrepair', status: 'New', startTimestamp: '2015-10-22T07:00:00Z', address: '2930 Virtual Way, Vancouver, BC V5M 0A5', location: [49.259429, -123.044158], summary: 'Please remove damaged kerb and SUPPLY AND FIX 1X DROP KERB CENTRE BN 125 X 150 cart away from site outside number 3.'},
  { id: "HJQTjsUr", workflowId: 'SyVXyMuSr', assignee: 'BJQm1G_BS', type: 'Job Order', title: 'Yard in disrepair', status: 'New', startTimestamp: '2015-10-22T15:00:00Z', address: '1780 E Broadway, Vancouver, BC V5N 1W3', location: [49.261782, -123.068705], summary: 'Please remove damaged kerb and SUPPLY AND FIX 1X DROP KERB CENTRE BN 125 X 150 cart away from site outside number 3.'},
  { id: "Syx76jiUH", workflowId: 'SyVXyMuSr', assignee: 'BJQm1G_BS', type: 'Job Order', title: 'Sprinkler in disrepair', status: 'New', startTimestamp: '2015-10-22T07:00:00Z', address: '311 E Broadway, Vancouver, BC V5T 1W5', location: [49.262902, -123.098917], summary: 'Please remove damaged kerb and SUPPLY AND FIX 1X DROP KERB CENTRE BN 125 X 150 cart away from site outside number 3.'},
  { id: "HJbXpioIS", workflowId: 'SyVXyMuSr', assignee: 'BJQm1G_BS', type: 'Job Order', title: 'House in disrepair', status: 'New', startTimestamp: '2015-10-22T07:00:00Z', address: '2035 Yukon St, Vancouver, BC V5Y 3W3', location: [49.267271, -123.112822], summary: 'Please remove damaged kerb and SUPPLY AND FIX 1X DROP KERB CENTRE BN 125 X 150 cart away from site outside number 3.'},
  { id: "ryMXaos8S", workflowId: 'SyVXyMuSr', assignee: 'SyVXyMuSr', type: 'Job Order', title: 'Tub in disrepair', status: 'New', startTimestamp: '2015-10-22T14:00:00Z', address: '555 W 12th Ave, Vancouver, BC V5Z 3X7', location: [49.260662, -123.116599], summary: 'Please remove damaged kerb and SUPPLY AND FIX 1X DROP KERB CENTRE BN 125 X 150 cart away from site outside number 3.'},
  { id: "SJEXaso8r", workflowId: 'SyVXyMuSr', assignee: 'B1r71fOBr', type: 'Job Order', title: 'Window in disrepair', status: 'New', startTimestamp: '2015-10-22T07:00:00Z', address: '1502 E Hastings St, Vancouver, BC V5L 1S5', location: [49.281159, -123.073855], summary: 'Please remove damaged kerb and SUPPLY AND FIX 1X DROP KERB CENTRE BN 125 X 150 cart away from site outside number 3.'},
  { id: "H1H76ij8r", workflowId: 'HJ8QkzOSH', assignee: 'HJ8QkzOSH', type: 'Job Order', title: 'Carpet in disrepair', status: 'New', startTimestamp: '2015-10-22T20:00:00Z', address: '860 Drake St, Vancouver, BC V6Z 2P2', location: [49.276903, -123.129645], summary: 'Please remove damaged kerb and SUPPLY AND FIX 1X DROP KERB CENTRE BN 125 X 150 cart away from site outside number 3.'},
  { id: "BkuXajsIB", workflowId: 'SyVXyMuSr', assignee: null, type: 'Job Order', title: 'Sink in disrepair', status: 'New', startTimestamp: '2015-10-22T07:00:00Z', address: '3820 Oak St, Vancouver, BC V6H 2M5', location: [49.251362, -123.127070], summary: 'Please remove damaged kerb and SUPPLY AND FIX 1X DROP KERB CENTRE BN 125 X 150 cart away from site outside number 3.'},
*/
  // Daisy
  /*{ id: "nas4JPz0U", workflowId: 'cfsJB9BbF', assignee: 'rJeXyfdrH', type: 'Job Order', title: 'Polarity Check @ NewLevel Inc.', status: 'New', startTimestamp: '2015-10-22T20:00:00Z', address: '860 Drake St, Vancouver, BC V6Z 2P2', location: [49.276903, -123.129645], summary: 'Normal TTR test agreed.'},
  { id: "i7pj3Zd2J", workflowId: 'cfsJB9BbF', assignee: 'rJeXyfdrH', type: 'Job Order', title: 'Polarity Check @ Legendary Stamps Inc.', status: 'New', startTimestamp: '2015-10-22T20:00:00Z', address: '1502 E Hastings St, Vancouver, BC V5L 1S5', location: [49.281159, -123.073855], summary: 'Normal TTR test agreed.'},

  { id: "ySFGpWDvq", workflowId: 'i4Hfpab2R', assignee: 'rJeXyfdrH', type: 'Job Order', title: 'EPOD 1', status: 'New', startTimestamp: '2015-10-22T20:00:00Z', address: '1502 E Hastings St, Vancouver, BC V5L 1S5', location: [49.281159, -123.073855], summary: 'Normal delivery',
    customerName: 'Reynolds Groundwork Services Ltd.', account: '3283448', po: 'P9999', contract:'4567887', callOff:'2144333',
    summary:'"Normal EPOD', originName:'Tolworth RMX Prodn', originPhone:'07111222333', product:'GEN1 20mm CIIIA S1',
    thisLoad:8.0, pourSoFar:8.0, totalOrdered:8.0
  }*/
];

module.exports = function(mediator) {
  // Rebase the workorder dates to today
  var today = new Date();
  var tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  workorders.forEach(function(workorder, index) {
    var date = new Date(workorder.startTimestamp);
    var hours = date.getHours();
    var newDate = index < workorders.length *2 / 3 ? today : tomorrow;
    newDate.setHours(hours);
    workorder.startTimestamp = newDate.getTime();
  })
  var arrayStore = new ArrayStore('workorders', workorders);
  arrayStore.listen('cloud:', mediator);
  return arrayStore;
}
