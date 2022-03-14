const functions = require("firebase-functions");

require('dotenv').config();
const express = require("express");
const db_calls = require("./db_calls.js");

const api = express();
var url = require("url");
const database_manipulation = require("./database_manipulation.js")
const send_sms = require("./send_sms.js");
const req = require("express/lib/request");
// using the PORT in the .env file
// const port = process.env.PORT;

async function searchQuery(urlQuery, data){
  try{
    if(urlQuery.city != undefined && urlQuery.speciality != undefined){
      console.log("city & speciality queries")
      
      data = database_manipulation.findListings("city", urlQuery.city);
      let new_data = await data;

      console.log(new_data[0].speciality)
      data = [];
      
      for(let i = 0; i<new_data.length; i++){
        if(new_data[i].speciality === urlQuery.speciality){
          data.push(new_data[i]);
        }
      }
    }else if(urlQuery.city != undefined){
      console.log(urlQuery.city + " CITY");
      data = database_manipulation.findListings("city", urlQuery.city);
    }else if(urlQuery.speciality != undefined){
      console.log(urlQuery.speciality+" SPECIALITY")
      data =  database_manipulation.findListings("speciality", urlQuery.speciality)      
    }else if(urlQuery.id != undefined){
      console.log(urlQuery.id+" ID")
      data =  database_manipulation.findListings("id", urlQuery.id);
    }
    return data
  }catch(e){
    console.error(e);
  }
}

async function send_comfirmation(doc_id, usr_id){
  let doc_data = await db_calls.queryDoctor(doc_id)
  let user_phonenumber = await db_calls.queryUser(usr_id)
  console.log(doc_data)
  console.log(user_phonenumber)
  send_sms.sendMsg(doc_data.name, doc_data.address, doc_data.google_map, user_phonenumber.phone_number)
}

api.get("/", (req, res) =>{
  res.send("WELCOME TO MEDICA72.COM API")
  console.log("testing route ;)")
});

api.get("/test", (req, res) =>{
  res.end(JSON.stringify({'test':2},null, 2))
  console.log("testing route ;)")
});

api.get("/doctor", (req,res) => {
  let urlQuery = req.query;
  console.log(urlQuery.city, urlQuery.id, urlQuery.speciality)
  if(Object.keys(urlQuery).length != 0){
    searchQuery(urlQuery).then((result) =>{
     // res.json(result);
     res.end(JSON.stringify(result,null, 2))
    });

    
  }else{
    console.log("NO QUERY FOUND! ;(")
  }
});

api.get("/reserve" , (req,res) => {
  let urlQuery = req.query;
  let doc_id = urlQuery.doc_id;
  let usr_id = urlQuery.usr_id;
  let day = urlQuery.day;
  let time = urlQuery.time
  let doc_data 
  send_comfirmation(doc_id, usr_id)
 
  //
})

api.get("/newdoctor", (req, res) => {
  let speciality = req.query.speciality;
  db_calls.querySpeciality(speciality).then((result) => {
    res.json(result)
  })
})


// app.listen(port, () => console.log(`Example app listening on port ${port}!`)); // 


exports.api = functions.https.onRequest(api);




