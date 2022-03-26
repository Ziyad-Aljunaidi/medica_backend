require('dotenv').config();
let messagebird_api = process.env.MESSAGEBIRD_API
//let messagebird_api = process.env.TEST_MESSAGEBIRD_API
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

//let docMapLocation = "https://goo.gl/maps/4yfW2c4PQHSn1GhUA"
function sendMsg(docName, docAddress, docMapLocation, user_phonenumber){
  var params = {
    'originator': 'Medica',
    'recipients': [
    //'+201113357439'
     //`${user_phonenumber}`
     user_phonenumber
  ],
    'body': `Your appointment for Dr. ${docName} is confirmed, clinic address: ${docAddress}, Google-Map: ${docMapLocation}`
  };
  //console.log(user_phonenumber)

  messagebird.messages.create(params, function (err, response) {
    if (err) {
      return console.log(err);
    }
    console.log(response);
  });
}

function sendMsgDemo(docName, docAddress, docMapLocation, user_name,user_phonenumber, user_time){
  var params = {
    'originator': 'Medica',
    'recipients': [
    //'+201113357439'
     //`${user_phonenumber}`
     "+2"+user_phonenumber
  ],
    'body': `Dear ${user_name}\n Your appointment for Dr. ${docName} is confirmed at ${user_time}, clinic address: ${docAddress}, Google-Map: ${docMapLocation}`
  };
  //console.log(user_phonenumber)

  messagebird.messages.create(params, function (err, response) {
    if (err) {
      return console.log(err);
    }
    console.log(response);
  });
}



//let location = "https://goo.gl/maps/2GrKLVkW93az8twZA"
//let name = "Johnny sins"
//let address = "cairo, maadi"
//sendMsg(name, address, docMapLocation)

module.exports={
  sendMsg,
  sendMsgDemo
}
