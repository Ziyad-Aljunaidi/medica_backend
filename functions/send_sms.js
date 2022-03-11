require('dotenv').config();
let messagebird_api = process.env.MESSAGEBIRD_API
let messagebird = require('messagebird')(messagebird_api);

/*
    var params = {
      'originator': 'TestMessage',
      'recipients': [
        '+201113357439'
    ],
      'body': 'Your Ass Is One Of A Kind <3'
    };

    messagebird.messages.create(params, function (err, response) {
      if (err) {
        return console.log(err);
      }
      console.log(response);
    });
*/

function sendMsg(docName, docAddress, docMapLocation, docAppointment, userPhoneNumber){
  var params = {
    'originator': 'TestMessage',
    'recipients': [
      '+201113357439'
  ],
    'body': `Your appointment for Dr. ${docName} is confirmed, clinic address: ${docAddress}, Google-Map: ${docMapLocation}`
  };

  messagebird.messages.create(params, function (err, response) {
    if (err) {
      return console.log(err);
    }
    console.log(response);
  });
}



// let location = "https://goo.gl/maps/2GrKLVkW93az8twZA"
// let name = "Johnny sins"
// let address = "cairo, maadi"
// 
// sendMsg(name, address, location)

module.exports={
  sendMsg,
}