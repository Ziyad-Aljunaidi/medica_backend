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
function formatTime(str, index, stringToAdd) {
  return (
    str.substring(0, index) + stringToAdd + str.substring(index, str.length)
  );
}

function finalTime(time){
  let final_time;
  if(time.toString().length == '3'){
    final_time=formatTime(time.toString(), "1", ":")
  }else if(time.toString().length == "4"){
    final_time = formatTime(time.toString(), "2", ":")
  }else{
    final_time = 0
  }
  return final_time
}

//console.log(finalTime(1130))
//let docMapLocation = "https://goo.gl/maps/4yfW2c4PQHSn1GhUA"
function sendMsg(docName, docAddress, docMapLocation, user_phonenumber){
  var params = {
    'originator': 'Medica',
    'recipients': [

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

function confirmMsg(docName, docAddress, docMapLocation, user_name,user_phonenumber, user_time,user_date){
  var params = {
    'originator': 'Medica',
    'recipients': [
     "+2"+user_phonenumber
  ],
    'body': `Dear ${user_name},\nYour appointment for Dr. ${docName} is confirmed at ${finalTime(user_time)}pm, ${user_date}, clinic address: ${docAddress}, Google-Map: ${docMapLocation}`
  };

  

  messagebird.messages.create(params, function (err, response) {
    if (err) {
      return console.log(err);
    }
    console.log(response);
  });
}

//confirmMsg("Mohsen", "7g/4 el-laselky street, maadi", "NONE", "Ziyad", "01030533078", "530", "06/30/2022")


function cancelMsg(docName, user_name,user_phonenumber, user_time){
  var params = {
    'originator': 'Medica',
    'recipients': [
    //'+201113357439'
     //`${user_phonenumber}`
     "+2"+user_phonenumber
  ],
    'body': `Dear ${user_name},\nYour appointment for Dr. ${docName} at ${finalTime(user_time)}pm is cancelled`
  };

  messagebird.messages.create(params, function (err, response) {
    if (err) {
      return console.log(err);
    }
    console.log(response);
  });
}


module.exports={
  sendMsg,
  confirmMsg,
  cancelMsg
}
