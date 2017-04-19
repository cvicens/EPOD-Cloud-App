// Maps E1 delivery ticket to WFM workorder

function getFormattedTime() {
  var n = new Date ();
  return ('0' + n.getHours()).slice(-2) + ':' + ('0' + (n.getMinutes()+1)).slice(-2);
}

function getFormattedDate() {
  var n = new Date ();
  return ('0' + n.getDate()).slice(-2) + '/' + ('0' + (n.getMonth()+1)).slice(-2) + '/' + n.getFullYear();
}

function map(ticket, user) {
  //console.log('ticket', JSON.stringify(ticket), 'user', user);
  if (typeof ticket !== 'object') {
    return {};
  }

  var workorder = {
    //"id": makeid(9),
    "id": ticket.ticketNumber,
    "works": ticket.works,

    "account": ticket.accountNumber,
    "po": ticket.custPO,
    "contract": ticket.contractNo,
    "callOff": "9999999", //TODO

    "ticketNumber": ticket.ticketNumber,

    "addressDetail": ticket.address1,
    "addressStreet": ticket.address2,
    "addressPostalCode": ticket.address4,
    "addressCity": ticket.address3,
    "address":  (ticket.address2 + ',' +  ticket.address4 + ',' +  ticket.address3),
    "location": [51.3960439,-0.3025582], //TODO

    "completedAction": "START",
    "status": "New",

    "brand": ticket.brand,

    "originName": ticket.plantName,
    "originPhone": "5555555555",//TODO

    "customerName": ticket.customerName,

    "product": ticket.itemDescription,
    "productDescription": ticket.itemDescription2,
    "ceMarking": ticket.ceMarking,

    "vehicle" : ticket.vehicleReg,


    "title": ticket.ticketNumber,


    "workflowId": "i4Hfpab2R",

    "assignee": user.id,
    "driver": user.name,

    "type": "Job Order",
    "subtype" : "EPOD",

    "startTimestamp": ticket.actualLeaveWBDateTime,



    "ticketDate": getFormattedDate(), //TODO
    "ticketTime": getFormattedTime(), //TODO

    "instructions": "HOT WATER Y/N HOT WATER ADDED AT CUSTOMER REQUEST",



    "summary": "EPOD from E1",


    "thisLoad": ticket.loadLineQuantity,
    "pourSoFar": ticket.deliveredQty,
    "totalOrdered": ticket.OSQuantity,
    "volumeUnit": "m3"
  };

  console.log('workorder', workorder);

  return workorder;
}

module.exports.map = map;
